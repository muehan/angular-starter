import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppState } from './app.service';
import { MaterialModule } from '@angular/material';
  
@Component({
  selector: 'navigation-list',
  styleUrls: ['navigation-list.component.css'],
  templateUrl: 'navigation-list.component.html'
})

export class NavigationListComponent implements OnInit {

  private localState: any;
  private currentRoute: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.route.data.subscribe((data: any) => {
        this.localState = data.yourData;
      });

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd ) {
          console.log("current url",event.url);
          this.currentRoute = event.url;
        }
      })

    this.asyncDataWithWebpack();
  }

  public listModuleVisiable(){
    if(this.currentRoute != null) {
      return this.currentRoute.includes('items');
    }
  }

  private asyncDataWithWebpack() {
    setTimeout(() => {

      System.import('../../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }
}
  