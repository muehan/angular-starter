import { ItemListComponent } from './item-list';
import { ItemsComponent } from './items.component';

export const routes = [
  {
    path: '', component: ItemsComponent, children: [
      { path: 'list', component: ItemListComponent },
    ]
  },
  { path: '**', component: ItemsComponent },
];
