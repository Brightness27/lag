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

  httpOptionsForImageUploads: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  };

  constructor(private http: HttpClient, private constants: ConstantsService) { }

  addWorkflow(workflow: any): Observable<any> {
    const formData = new FormData();

    for (const key of Object.keys(workflow)) {
      if(key === 'pre_survey' && workflow.pre_survey) {
        const images = workflow.pre_survey;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'documents' && workflow.documents) {
        const images = workflow.documents;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'job_order' && workflow.job_order) {
        const images = workflow.job_order;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'load_side' && workflow.load_side) {
        const images = workflow.load_side;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else {
        formData.append(key, workflow[key]);
      }
        
    }

    return this.http.post(`${this.workflow_url}/add`, formData);
  }

  updateWorkflow(workflow: any): Observable<any> {
    const formData = new FormData();

    for (const key of Object.keys(workflow)) {
      if(key === 'pre_survey' && workflow.pre_survey) {
        const images = workflow.pre_survey;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'documents' && workflow.documents) {
        const images = workflow.documents;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'job_order' && workflow.job_order) {
        const images = workflow.job_order;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else if(key === 'load_side' && workflow.load_side) {
        const images = workflow.load_side;

        for( let img of images) {
          formData.append(key, img);
        }
      }

      else {
        formData.append(key, workflow[key]);
      }
        
    }
    return this.http.post(`${this.workflow_url}/update`, formData);
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

  getSpecificImageById(id: any): Observable<any> {
    return this.http.get<any>(`${this.workflow_url}/details/image/${id}`, this.httpOptions);
  }

  getWorkflowStatus(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/status-updates/${id}`, this.httpOptions);
  }

  searchWorkflows(searchKey: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.workflow_url}/search/${searchKey}`, this.httpOptions);
  }

  deleteFile(id: any, path: string): Observable<any> {
    return this.http.post(`${this.workflow_url}/deleteFile/${id}`, {path: path}, this.httpOptions);
  }
}