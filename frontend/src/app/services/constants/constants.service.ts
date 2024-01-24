import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  root_url: string = 'http://192.168.68.127:3000';

  constructor() { }

  private tableDataSubject = new BehaviorSubject<any[]>([]);
  tableData$ = this.tableDataSubject.asObservable();

  private filterDataSubject = new BehaviorSubject<any>({});
  filterData$ = this.filterDataSubject.asObservable();

  setTableData(data: any[]): void {
    this.tableDataSubject.next(data);
  }

  setFilterData(data: any): void {
    this.filterDataSubject.next(data);
  }

}
