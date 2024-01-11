import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  root_url: string = 'http://192.168.68.105:3000';

  constructor() { }

  private tableDataSubject = new BehaviorSubject<any[]>([]);
  tableData$ = this.tableDataSubject.asObservable();

  setTableData(data: any[]): void {
    this.tableDataSubject.next(data);
  }
}
