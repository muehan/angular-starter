import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ItemApi, Item } from './../../../api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {

  constructor(private itemApi: ItemApi) {

  }

  displayedColumns = ['number', 'vendorNumber', 'name', 'price'];
  dataSource = new ExampleDataSource(this.itemApi);

  ngOnInit() {
  }
}

export class ExampleDataSource extends DataSource<any> {

  constructor(private itemApi: ItemApi) {
    super();
  }

  connect(): Observable<Item[]> {
    return this.itemApi.apiItemGet().map(response => response.items);
  }

  disconnect() { }
}