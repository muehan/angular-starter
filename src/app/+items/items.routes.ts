import { ItemListComponent } from './item-list';
import { ItemsComponent } from './items.component';
import { ItemEditComponent } from './item-edit';

export const routes = [
  {
    path: '', component: ItemsComponent, children: [
      { path: 'list', component: ItemListComponent },
      { path: 'edit/:id', component: ItemEditComponent },
    ]
  },
  { path: '**', component: ItemsComponent },
];
