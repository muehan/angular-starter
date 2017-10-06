import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSort } from '@angular/material';

import 'rxjs/add/observable/merge';

import { ItemApi, Item, ItemCreateCommand } from './../../../api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {

  @ViewChild(MdSort) sort: MdSort;

  constructor(
    private itemApi: ItemApi,
    private ref: ChangeDetectorRef,
  ) { }

  private displayedColumns: string[] = ['number', 'vendorNumber', 'name', 'price', 'func'];
  private items: BehaviorSubject<Item[]> = <BehaviorSubject<Item[]>>new BehaviorSubject([]);
  private dataSource: ItemDataSource;
  private createModel: ItemCreateModel = new ItemCreateModel();
  private loading: boolean = true;

  ngOnInit() {
    this.itemApi.apiItemGet().map(data => data.items).subscribe(res => {
      this.items.next(res);
      this.loading = false;
      this.ref.detectChanges();
      this.dataSource = new ItemDataSource(this.items, this.sort);
    });
  }

  createItem() {
    this.itemApi.apiItemPost(this.createModel).subscribe(response => {
      this.items.next(this.items.getValue().concat(response.item));
      this.createModel = new ItemCreateModel();
    })
  }
}

export class ItemDataSource extends DataSource<any> {

  constructor(
    private items: BehaviorSubject<Item[]>,
    private sort: MdSort
  ) { super(); }

  connect(): Observable<Item[]> {
    // return this.items.asObservable();
    const displayDataChanges = [
      this.items,
      this.sort.mdSortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() { }

  getSortedData(): Item[] {
    const data = this.items.value.slice();
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
        case 'vendorNumber': [propertyA, propertyB] = [a.venderNumber, b.venderNumber]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'price': [propertyA, propertyB] = [a.price, b.price]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
    });
  }
}

class ItemCreateModel implements ItemCreateCommand {
  name;
  number;
  price;
  venderNumber
}