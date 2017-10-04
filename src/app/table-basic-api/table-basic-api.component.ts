import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CustomerApi } from './../../api';
import { Customer } from './../../api';
import 'rxjs/add/observable/of';

/**
 * @title Basic table
 */
@Component({
  selector: 'table-basic-api',
  styleUrls: ['table-basic-api.component.css'],
  templateUrl: 'table-basic-api.component.html',
})

export class TableBasicApiComponent {

  constructor(private customerApi: CustomerApi) { }

  customers = <BehaviorSubject<Customer[]>>new BehaviorSubject([]);
  customerStore = { customers: [] };

  displayedColumns = ['guid', 'name', 'prename', 'street', 'streetnumber', 'zipcode', 'city', 'func'];
  dataSource = new ExampleDataSource(this.customers);

  ngOnInit() {
    this.customerApi.apiCustomerGet().subscribe(
      response => {
        this.customerStore.customers = response;
        this.customers.next(Object.assign({}, this.customerStore).customers);
      });
  }

  delete(id) {
    console.log('delete:' + id);
    this.customerApi.apiCustomerByIdDelete(id).subscribe(response => {
      this.customers.next(this.customers.getValue().filter(function (item) {
        return item.guid != id;
      }));
    });
  }
}

export class ExampleDataSource extends DataSource<any> {

  constructor(private customers: BehaviorSubject<Customer[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Customer[]> {
    return this.customers.asObservable();
  }

  disconnect() { }
}