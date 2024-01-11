import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

import { Admin } from '../../models/admin';

import { Observable } from 'rxjs';
import { Employees } from 'src/app/models/employee';
import { ConstantsService } from '../constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {
  
  constructor(private http: HttpClient, private constants: ConstantsService) { }

  private admin_url = this.constants.root_url + '/admin';
  private permission_url = this.constants.root_url + '/permissions';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

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

  getAdminPermissions(admin_id: any): Observable<any> {
    return this.http.get<any>(`${this.permission_url}/${admin_id}`, this.httpOptions);
  }

  updatePersmissions(permissions: any, adminId: any): Observable<any> {
    return this.http.post(`${this.permission_url}/update/${adminId}`, permissions, this.httpOptions);
  }

  verifyAdmin(credentials: any): Observable<any> {
    return this.http.post(`${this.admin_url}/verifyAdmin`, credentials, this.httpOptions);
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

  getAllAdmins(status: string, admin_id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.admin_url}/status/${status}/${admin_id}`, this.httpOptions);
  }

  searchAdmins(searchKey: string, status: string, admin_id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.admin_url}/search/${searchKey}/${status}/${admin_id}`, this.httpOptions);
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
