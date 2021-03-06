import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { MaterialModule } from '@angular/material';
import { NavigationListComponent } from './navigation-list';
import { NavigationUserComponent } from './navigation-user';
  
@Component({
  selector: 'navigation',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['navigation.component.css'],
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit {

  public localState: any;
  constructor(
    // constructor
  ) {}

  public ngOnInit() {
    console.log('hello `Navigation` component');
    /**
     * static data that is bundled
     * var mockData = require('assets/mock-data/mock-data.json');
     * console.log('mockData', mockData);
     * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
     */
    this.asyncDataWithWebpack();
  }

  private asyncDataWithWebpack() {
    /**
     * you can also async load mock data with 'es6-promise-loader'
     * you would do this if you don't want the mock-data bundled
     * remember that 'es6-promise-loader' is a promise
     */
    setTimeout(() => {

      System.import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }

}
  