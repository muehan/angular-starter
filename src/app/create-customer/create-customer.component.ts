import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerApi, CustomerCreateCommand } from './../../api';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})

export class CreateCustomerComponent implements OnInit {

  private model:CustomerModel = new CustomerModel();

  constructor(
    private customerApi:CustomerApi,
    private router:Router)
  { }

  ngOnInit() {
  }

  save(){
    console.log(this.model);

    this.customerApi.apiCustomerPost(this.model).subscribe(response => {
      console.log(response.customer)
      if(response.customer){
        this.router.navigate(['/tablebasicapi']);
      }
    });
  }
}

class CustomerModel implements CustomerCreateCommand{

}