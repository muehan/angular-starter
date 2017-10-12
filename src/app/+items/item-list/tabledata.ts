import { ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSort } from '@angular/material';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

export class DataTable<T extends Iitem> {

    private type: T;
    private dataSource: ItemDataSource<T>;
    private items: BehaviorSubject<T[]> = <BehaviorSubject<T[]>>new BehaviorSubject([]);

    constructor(itemsArray: T[], sort?: MdSort) {
        this.items.next(itemsArray);
        this.dataSource = new ItemDataSource<T>(this.items, sort);
    }

    public getDataSource() {
        return this.dataSource;
    }

    public addItem(item: T) {
        this.items.next(this.items.getValue().concat(item));
    }

    public removeItem(guid: string) {
        this.items.next(this.items.getValue().filter(function (data) { return data.guid !== guid }));
    }
}

interface Iitem {
    guid?: string;
}

class ItemDataSource<T> extends DataSource<any> {

    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(
        private items: BehaviorSubject<T[]>,
        private sort: MdSort
    ) { super(); }

    connect(): Observable<T[]> {
        if (this.sort == null || this.sort == undefined) {
            console.log('sort not found');
            return this.items.asObservable();
        }

        const displayDataChanges = [
            this.items,
            this.sort.mdSortChange,
            this._filterChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            return this.getSortedData().slice().filter((item: T) => {

                console.log('filter change');

                var props = Object.getOwnPropertyNames(item);

                let searchStr = "";
                props.forEach(element => {
                    searchStr = searchStr + item[element]
                });

                searchStr = searchStr.toLowerCase();

                return searchStr.indexOf(this.filter.toLowerCase()) != -1;
            });
        });

    }

    disconnect() { }

    getSortedData(): T[] {
        console.log('get sorted data');
        const data: T[] = this.items.value.slice();
        var props = Object.getOwnPropertyNames(data[0]);
        if (!this.sort.active || this.sort.direction == '') { return data; }

        var sortedData = data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            props.forEach(element => {

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
