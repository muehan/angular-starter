import { ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSort } from '@angular/material';

import 'rxjs/add/observable/merge';

export class TableData<T extends Iitem> {

    private type: T;
    private dataSource: ItemDataSource<T>;
    private items: BehaviorSubject<T[]> = <BehaviorSubject<T[]>>new BehaviorSubject([]);

    constructor(private itemsArray: T[], private sort?: MdSort){
        this.items.next(itemsArray);
        this.dataSource = new ItemDataSource<T>(this.items, this.sort)
    }

    public getDataSource(){
        return this.dataSource;
    }

    public addItem(item: T){
        this.items.next(this.items.getValue().concat(item));
    }

    public removeItem(id:string){
        this.items.next(this.items.getValue().filter(function (data) { data.guid != id}));
    }
}

interface Iitem {
    guid?: string;
}

class ItemDataSource<T> extends DataSource<any> {

    constructor(
        private items: BehaviorSubject<T[]>,
        private sort: MdSort
    ) { super(); }

    connect(): Observable<T[]> {
        // return this.items.asObservable();
        const displayDataChanges = [
            this.items,
            this.sort.mdSortChange,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            return this.getSortedData();
        });
    }

    disconnect() { }

    getSortedData(): T[] {
        const data = this.items.value.slice();
        if (!this.sort.active || this.sort.direction == '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this.sort.active) {
                // case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
                // case 'vendorNumber': [propertyA, propertyB] = [a.venderNumber, b.venderNumber]; break;
                // case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
                // case 'price': [propertyA, propertyB] = [a.price, b.price]; break;
            }

            let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
        });
    }
}
