import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ItemApi, Item, ItemCreateCommand } from './../../../api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {

  constructor(
    private itemApi: ItemApi,
    private ref: ChangeDetectorRef,
  ) {  }

  displayedColumns = ['number', 'vendorNumber', 'name', 'price', 'func'];

  items = <BehaviorSubject<Item[]>>new BehaviorSubject([]);
  dataSource = new ItemDataSource(this.items);
  createModel = new ItemCreateModel();
  private loading: boolean = true;

  ngOnInit() {
    this.itemApi.apiItemGet().map(data => data.items).subscribe(res => {
      this.items.next(res);
      this.loading = false;
      this.ref.detectChanges();
    });
  }

  createItem() {
    this.itemApi.apiItemPost(this.createModel).subscribe(response => {
      this.items.next(this.items.getValue().concat(response.item));
    })
  }
}

export class ItemDataSource extends DataSource<any> {

  constructor(private items: BehaviorSubject<Item[]>) {
    super();
  }

  connect(): Observable<Item[]> {
    return this.items.asObservable();
  }

  disconnect() { }
}

class ItemCreateModel implements ItemCreateCommand {
  name;
  number;
  price;
  venderNumber
}