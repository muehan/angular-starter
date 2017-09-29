import { Routes } from '@angular/router';

import { ItemListComponent } from './item-list';
import { ItemsComponent } from './items.component';

export const routes: Routes = [
  {
    path: '', component: ItemsComponent, children: [
      { path: 'list', component: ItemListComponent },
    ]
  },
  { path: '**', component: ItemsComponent },
];
