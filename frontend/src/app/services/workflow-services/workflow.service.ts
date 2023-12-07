import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private root_url = 'http://localhost:3000';

  private workflow_url = this.root_url + '/workflow';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) { }

  addWorkflow(workflow: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/add`, workflow, this.httpOptions);
  }

  updateWorkflow(workflow: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/update`, workflow, this.httpOptions);
  }

  addWorkflowstatus(id: any, status_update: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/status/add/${id}`, status_update, this.httpOptions);
  }

  getAllWorkflows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/`, this.httpOptions);
  }

  getWorkflowById(id: any): Observable<any> {
    return this.http.get<any>(`${this.workflow_url}/details/${id}`, this.httpOptions);
  }

  getWorkflowStatus(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/status-updates/${id}`, this.httpOptions);
  }

  searchWorkflows(searchKey: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/search/${searchKey}`, this.httpOptions);
  }
}
