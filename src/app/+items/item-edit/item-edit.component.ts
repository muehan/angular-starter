import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemApi, Item, ItemEditCommand } from './../../../api';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {

  private item: Item = {};
  private loading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private itemApi: ItemApi,
    private ref:ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      let itemId = params['id'];
      this.itemApi.apiItemIdGet(itemId).subscribe(data => {
        this.item = data.items[0];
        this.loading = false;
        this.ref.detectChanges();
      });
    })
  }

  save(){
    var command: ItemEditCommand = {
      guid:  this.item.guid,
      item: this.item,
    }

    this.itemApi.apiItemPut(command).subscribe(response => {
      if(response.item != null){
        this.router.navigate(['/items/list']);
      }
    })
  }
}
