import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
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

  constructor(private customerApi:CustomerApi){
    
  }

  displayedColumns = ['guid', 'name', 'prename', 'street', 'streetnumber', 'zipcode', 'city', 'func'];
  dataSource = new ExampleDataSource(this.customerApi);

  delete(id) {
    console.log('delete:' + id);
    this.customerApi.apiCustomerByIdDelete(id).subscribe(response => console.log(response));
  }
}

export class ExampleDataSource extends DataSource<any> {

  constructor(private customerApi:CustomerApi){
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Customer[]> {
    return this.customerApi.apiCustomerGet()
  }

  disconnect() {}
}