import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  root_url: string = 'http://192.168.68.107:3000';

  constructor() { }
}
