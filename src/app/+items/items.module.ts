import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemListComponent } from './item-list/item-list.component';

import { routes } from './items.routes';

@NgModule({
  declarations: [
    ItemsComponent,
    ItemListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  
})

export class ItemsModule { }
