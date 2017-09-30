import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule, MdButtonModule } from '@angular/material';

import { ItemsComponent } from './items.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemApi } from './../../api';

import { routes } from './items.routes';

console.log('`items` bundle loaded asynchronously');

@NgModule({
  declarations: [
    ItemsComponent,
    ItemListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdButtonModule,
  ],
  exports: [
    MaterialModule,
  ],
  providers: [
    ItemApi,
  ]
})

export class ItemsModule {
  public static routes = routes;
 }
