import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '@angular/material';

console.log('`Items` component loaded asynchronously');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-items',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [],
})

export class ItemsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
