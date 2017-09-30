/**
 * Angular 2 decorators and services
 */
import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { MaterialModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';

import { backgroundImage } from './bg8.jpg';

/**
 * App Component
 * Top Level Component
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  constructor(
    public appState: AppState
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }
}