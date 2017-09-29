import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { TableBasicComponent } from './table-basic';
import { TableBasicApiComponent } from './table-basic-api';
import { InputComponent } from './inputs';
import { DatepickerComponent } from './datepicker';
import { CreateCustomerComponent } from './create-customer';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',                 component: HomeComponent },
  { path: 'home',             component: HomeComponent },
  { path: 'about',            component: AboutComponent },
  { path: 'input',            component: InputComponent },
  { path: 'datepicker',       component: DatepickerComponent },
  { path: 'tablebasic',       component: TableBasicComponent },
  { path: 'createcustomer',   component: CreateCustomerComponent },
  { path: 'tablebasicapi',    component: TableBasicApiComponent },
  { path: 'items',            loadChildren: './+items#ItemModule' },
  { path: 'detail',           loadChildren: './+detail#DetailModule'},
  { path: 'barrel',           loadChildren: './+barrel#BarrelModule'},
  { path: '**',               component: NoContentComponent },
];
