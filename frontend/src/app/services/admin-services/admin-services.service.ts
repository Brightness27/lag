import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

import { Admin } from '../../models/admin';

import { Observable } from 'rxjs';
import { Employees } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {
  private root_url = 'http://localhost:3000';

  private admin_url = this.root_url + '/admin';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) { }


  login(username: Pick<Admin, 'username'>, password: Pick<Admin, 'password'>): Observable<{
    error: boolean; message: string; token: string; adminId: Pick<Admin, 'id'>; department: Pick<Admin, 'department'>
  }> {
    return this.http.post<{
      error: boolean; message: string; token: string; adminId: Pick<Admin, 'id'>; department: Pick<Admin, 'department'>
    }>(`${this.admin_url}/login`, { username, password }, this.httpOptions);
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  getAdminById(adminId: Pick<Admin, 'id'>): Observable<any> {
    return this.http.get<any>(`${this.admin_url}/id/${adminId}`, this.httpOptions);
  }

  getAdminByEmployeeId(employeeId: Pick<Employees, 'id'>): Observable<any> {
    return this.http.get<any>(`${this.admin_url}/employeeid/${employeeId}`, this.httpOptions);
  }

  getTokenDetails() {
    const getToken = localStorage.getItem('token');

    if (getToken) {
      try {
        this.token = jwtDecode(getToken); // Decode the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Token not found in local storage');
    }

    return this.token;
  }

  getAllAdmins(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.admin_url}/status/${status}`, this.httpOptions);
  }

  searchAdmins(searchKey: string, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.admin_url}/search/${searchKey}/${status}`, this.httpOptions);
  }
  
  addAdmin(adminDetails: any): Observable<any> {
    return this.http.post(`${this.admin_url}/add`, adminDetails, this.httpOptions);
  }

  updateAdmin(adminDetails: any, adminId: Pick<Admin, 'id'>): Observable<any> {
    return this.http.post(`${this.admin_url}/update/${adminId}`, adminDetails, this.httpOptions);
  }

  updateAdminPosDep(adminDetails: any, employeeId: Pick<Employees, 'id'>): Observable<any> {
    return this.http.post(`${this.admin_url}/updateposdep/${employeeId}`, adminDetails, this.httpOptions);
  }

  updateAdminStatus(status: string, employeeId: Pick<Employees, 'id'>): Observable<any> {
    return this.http.post(`${this.admin_url}/changeStatus/${employeeId}`, {status: status}, this.httpOptions);
  }

  changePassword(passwords: any, adminId: Pick<Admin, 'id'>): Observable<any> {
    return this.http.post(`${this.admin_url}/change-password/${adminId}`, passwords, this.httpOptions);
  }
}
