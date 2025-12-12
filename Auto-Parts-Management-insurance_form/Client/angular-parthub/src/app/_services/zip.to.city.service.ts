import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Disclaimer } from '../models/disclaimer.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})

export class ZipToCityService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + "/getZip";

  constructor(private http: HttpClient) { }


  getZipInfo(zipCode: any): Observable<any> {

    return this.http.get<any>(this.API_URL + "/" + zipCode, httpOptions);
  }




}
