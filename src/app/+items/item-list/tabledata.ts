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

    constructor(private itemsArray: T[], private sort?: MdSort) {
        this.items.next(itemsArray);
        this.dataSource = new ItemDataSource<T>(this.items, this.sort)
    }

    public getDataSource() {
        return this.dataSource;
    }

    public addItem(item: T) {
        this.items.next(this.items.getValue().concat(item));
    }

    public removeItem(id: string) {
        this.items.next(this.items.getValue().filter(function (data) { data.guid != id }));
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
        const data: T[] = this.items.value.slice();
        var props = Object.getOwnPropertyNames(data[0]);
        if (!this.sort.active || this.sort.direction == '') { return data; }

        var sortedData = data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';
            
            props.forEach(element => {
                console.log(element);
                console.log(this.sort.active);
                if (element == this.sort.active) {
                    propertyA = a[element];
                    propertyB = b[element];
                }
            });

            let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
        });

        return sortedData;
    }
}
