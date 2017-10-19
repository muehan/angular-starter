import { ViewChild, ElementRef, QueryList } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSort, MdInput } from '@angular/material';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';

export class DataTable<T extends Iitem> {

    private type: T;
    private dataSource: ItemDataSource<T>;
    private items: BehaviorSubject<T[]> = <BehaviorSubject<T[]>>new BehaviorSubject([]);

    constructor(itemsArray: T[], sort?: MdSort, filterlist?: QueryList<ElementRef>) {
        this.items.next(itemsArray);
        this.dataSource = new ItemDataSource<T>(this.items, sort);

        if (filterlist) {
            filterlist.forEach(filterItem => {
                Observable.fromEvent(filterItem.nativeElement, 'keyup')
                    .debounceTime(150)
                    .distinctUntilChanged()
                    .subscribe(() => {
                        var value = filterItem.nativeElement.value;
                        var column = filterItem.nativeElement.placeholder;

                        console.log("keyEvent '" + value + "' from: " + column);

                        // all chars removed, remove filter from columnFilterArray
                        if (value === '') {
                            if(this.dataSource._columnfilter.some(x => x === column)){
                                console.log('remove colum from current filter: ' + column);
                                this.dataSource._columnfilter = this.dataSource._columnfilter.filter(item => item !== column);
                            }
                        } else {
                            if (!this.dataSource._columnfilter.some(x => x === column)) {
                                console.log("new column filter added");
                                this.dataSource._columnfilter = this.dataSource._columnfilter.concat(column);
                            }
                        }

                        this.dataSource.filter = value;
                    })
            });

        }
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

    _columnfilter: string[] = [];
    get columnfilter(): string[] { return this._columnfilter; }
    set columnfilter(filter: string[]) { this._columnfilter = filter; }

    constructor(
        private items: BehaviorSubject<T[]>,
        private sort: MdSort
    ) { super(); }

    connect(): Observable<T[]> {
        if (this.sort == null || this.sort == undefined) {
            return this.items.asObservable();
        }

        const displayDataChanges = [
            this.items,
            this.sort.mdSortChange,
            this._filterChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            return this.getSortedData().slice().filter((item: T) => {
                var props = Object.getOwnPropertyNames(item);

                let searchStr = "";
                props.forEach(element => {

                    if (this._columnfilter.length == 0) {
                        searchStr = searchStr + item[element]
                    } else {
                        if (this._columnfilter.some(x => x == element)) {
                            searchStr = searchStr + item[element]
                        }
                    }
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
