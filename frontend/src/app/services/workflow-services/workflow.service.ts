import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private workflow_url = this.constants.root_url + '/workflow';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private constants: ConstantsService) { }

  addWorkflow(workflow: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/add`, workflow, this.httpOptions);
  }

  updateWorkflow(formData: any, id: any, step: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/update/${id}/${step}`, formData);
  }

  addWorkflowstatus(id: any, status_update: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/status/add/${id}`, status_update, this.httpOptions);
  }

  updateWorkflowstatus(status_update: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/status/update`, status_update, this.httpOptions);
  }

  getAllWorkflows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/`, this.httpOptions);
  }

  getAllLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/locations`, this.httpOptions);
  }

  getWorkflowByCtrlno(ctrlno: any): Observable<any> {
    return this.http.get<any>(`${this.workflow_url}/details/${ctrlno}`, this.httpOptions);
  }

  getPaymentHistory(workflow_id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/payment-history/${workflow_id}`, this.httpOptions);
  }

  updatePayment(payment_details: any, workflow_id: any): Observable<any> {
    return this.http.post(`${this.workflow_url}/update-payment/${workflow_id}`, payment_details, this.httpOptions);
  }

  getSpecificImageById(id: any): Observable<any> {
    return this.http.get<any>(`${this.workflow_url}/details/image/${id}`, this.httpOptions);
  }

  getWorkflowStatus(id: any): Observable<any> {
    return this.http.get<any>(`${this.workflow_url}/status-updates/${id}`, this.httpOptions);
  }

  searchWorkflows(searchKey: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/search/${searchKey}`, this.httpOptions);
  }

  filterWorkflowByDay(date: any, site: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/filter/date/${site}/${date}`, this.httpOptions);
  }

  filterWorkflowByMonth(date: any, site: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/filter/month/${site}/${date}`, this.httpOptions);
  }

  filterWorkflowByRange(start: any, end: any, site: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/filter/range/${site}/${start}/${end}`, this.httpOptions);
  }

  filterWorkflowBySite(site: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/filter/site/${site}`, this.httpOptions);
  }

  getOptions(step: any, selector: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/options/${step}/${selector}`, this.httpOptions);
  }

  deleteFile(id: any, path: string): Observable<any> {
    return this.http.post(`${this.workflow_url}/deleteFile/${id}`, {path: path}, this.httpOptions);
  }
}