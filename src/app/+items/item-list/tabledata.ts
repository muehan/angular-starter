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
                            if (this.dataSource.filters.some(x => x.column === column)) {
                                console.log('remove colum from current filter: ' + column);
                                this.dataSource.filters = this.dataSource.filters.filter(x => x.column !== column);
                            }
                        } else {
                            if (!this.dataSource.filters.some(x => x.column === column)) {
                                // console.log("new column filter added");
                                this.dataSource.filters = this.dataSource.filters.concat({column: column, value: value});
                            } else {
                                // console.log("add new value to existing filter: " + column + " - " + value);
                                var existingFilter = this.dataSource.filters.find(x => x.column === column);

                                this.dataSource.filters = this.dataSource.filters.filter(x => x.column !== column);
                                this.dataSource.filters = this.dataSource.filters.concat({column: column, value: value});

                                var existingFilter = this.dataSource.filters.find(x => x.column === column);
                            }
                        }
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

interface ISearchFilter {
    column: string;
    value: string;
}

class ItemDataSource<T> extends DataSource<any> {

    private _filters: BehaviorSubject<ISearchFilter[]> = <BehaviorSubject<ISearchFilter[]>>new BehaviorSubject([]);
    get filters(): ISearchFilter[] { return this._filters.value }
    set filters(filter: ISearchFilter[]) { this._filters.next(filter); }

    // _filterChange = new BehaviorSubject('');
    // get filter(): string { return this._filterChange.value; }
    // set filter(filter: string) { this._filterChange.next(filter); }

    // _columnfilter: string[] = [];
    // get columnfilter(): string[] { return this._columnfilter; }
    // set columnfilter(filter: string[]) { this._columnfilter = filter; }

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
            this._filters
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            return this.getSortedData().slice().filter((item: T) => {
                
                var show = true;

                this.filters.forEach(filterElement => {
                    console.log(item[filterElement.column].toString().toLowerCase());
                    console.log(filterElement.value.toLowerCase());

                    if(item[filterElement.column].toString().toLowerCase().indexOf(filterElement.value.toLowerCase()) == -1){
                        show = false;
                    }   
                })
                console.log(show);
                return show;
            });

            // var props = Object.getOwnPropertyNames(item);
            
            // let searchStr = "";
            // props.forEach(element => {
            //     searchStr = searchStr + item[element]
            // });

            // searchStr = searchStr.toLowerCase();

            // return searchStr.indexOf(this.filter.toLowerCase()) != -1;
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
