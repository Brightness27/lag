import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private root_url = 'http://localhost:3000';

  private leave_url = this.root_url + '/leave';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) { }

  getAllLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}`, this.httpOptions);
  }

  getSpecificLeavesByEmployee(leave_type: string, employeeId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}/leave-details/${employeeId}_${leave_type}`, this.httpOptions);
  }

  addLeave(leavDetails: any): Observable<any> {
    return this.http.post(`${this.leave_url}/add`, leavDetails, this.httpOptions);
  }

  searchLeave(searchKey: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.leave_url}/search/${searchKey}`, this.httpOptions);
  }
}
