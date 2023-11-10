import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Employees } from '../../models/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private root_url = 'http://localhost:3000';

  private employee_url = this.root_url + '/employees';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) { }

  getAllEmployees(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.employee_url}/status/${status}`, this.httpOptions);
  }

  getEmployeeById(id: Pick<Employees, "id">): Observable<Employees> {
    return this.http.get<Employees>(`${this.employee_url}/id/${id}`, this.httpOptions);
  }

  addEmployee(employeeDetails: any): Observable<any> {
    return this.http.post(`${this.employee_url}/add`, employeeDetails, this.httpOptions);
  }

  updateEmployee(employeeDetails: Omit<Employees, "id">, id: Pick<Employees, "id">): Observable<any> {
    return this.http.put(`${this.employee_url}/update/${id}`, employeeDetails, this.httpOptions);
  }

  updateEmployeeStatus(status: string, employeeId: Pick<Employees, 'id'>): Observable<any> {
    return this.http.post(`${this.employee_url}/changeStatus/${employeeId}`, {status: status}, this.httpOptions);
  }

  searchEmployees(searchKey: string, status: string): Observable<Employees[]> {
    return this.http.get<Employees[]>(`${this.employee_url}/search/${searchKey}_${status}`, this.httpOptions);
  }

}
