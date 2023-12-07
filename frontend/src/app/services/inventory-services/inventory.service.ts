import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private root_url = 'http://localhost:3000';

  private inventory_url = this.root_url + '/inventory';

  token: any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.inventory_url}/all-categories`, this.httpOptions);
  }

  getAllInventories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.inventory_url}/all-inventories`, this.httpOptions);
  }

  addInventory(inventoryDetails: any): Observable<any> {
    return this.http.post(`${this.inventory_url}/add`, inventoryDetails, this.httpOptions);
  }

  getItemByCode(itemCode: string): Observable<any> {
    return this.http.get<any>(`${this.inventory_url}/details/${itemCode}`, this.httpOptions);
  }

  searchInventories(searchKey: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.inventory_url}/search/${searchKey}`, this.httpOptions);
  }

  processInventories(processDetails: any, processType: string, itemCode: any): Observable<any> {
    return this.http.post(`${this.inventory_url}/process/${processType}/${itemCode}`, processDetails, this.httpOptions);
  }
}
