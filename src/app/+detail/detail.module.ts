import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DetailComponent } from './detail.component';

import { routes } from './detail.routes';

console.log('`Detail` bundle loaded asynchronously');

@NgModule({
  declarations: [
    DetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})

export class DetailModule {
  public static routes = routes;
}
