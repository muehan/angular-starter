import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ViewEncapsulation, Renderer2, ComponentFactoryResolver } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSort, MdInput } from '@angular/material';
import { DataTable } from './';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { ItemApi, Item, ItemCreateCommand } from './../../../api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ItemListComponent implements OnInit {

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterlist') filterlist: ElementRef;

  constructor(
    private itemApi: ItemApi,
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    private componentFacotry: ComponentFactoryResolver,
  ) { }

  private displayedColumns: string[] = ['number', 'venderNumber', 'name', 'price', 'func'];
  private createModel: ItemCreateModel = new ItemCreateModel();
  private loading: boolean = true;

  private dataTable: DataTable<Item> = new DataTable<Item>([]);

  ngOnInit() {
    this.itemApi.apiItemGet().map(data => data.items).subscribe(res => {
      this.loading = false;
      this.dataTable = new DataTable<Item>(res, this.sort, this.filterlist);
      this.ref.detectChanges();
    });

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if(!this.dataTable.getDataSource()) { return }
      this.dataTable.getDataSource().filter = this.filter.nativeElement.value;
    });
  }

  createItem() {
    this.itemApi.apiItemPost(this.createModel).subscribe(response => {
      this.createModel = new ItemCreateModel();
    })
  }
}

class ItemCreateModel implements ItemCreateCommand {
  name;
  number;
  price;
  venderNumber
}