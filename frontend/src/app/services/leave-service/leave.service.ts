import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ConstantsService } from '../constants/constants.service';


@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private leave_url = this.constants.root_url + '/leave';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient, private constants: ConstantsService) { }

  getAllLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}`, this.httpOptions);
  }

  getAllLeaveTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}/types`, this.httpOptions);
  }

  getSpecificLeavesByEmployee(leave_type: number, employeeId: any, emp_id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}/leave-details/${employeeId}/${emp_id}/${leave_type}`, this.httpOptions);
  }

  addLeave(leaveDetails: any): Observable<any> {
    return this.http.post(`${this.leave_url}/add`, leaveDetails, this.httpOptions);
  }

  searchLeave(searchKey: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}/search/${searchKey}`, this.httpOptions);
  }
}
