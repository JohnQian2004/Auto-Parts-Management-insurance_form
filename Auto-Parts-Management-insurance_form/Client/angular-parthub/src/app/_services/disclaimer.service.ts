import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Disclaimer } from '../models/disclaimer.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class DisclaimerService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/disclaimers';

  constructor(private http: HttpClient) { }


  createDisclaimer(userId: any, disclaimer: Disclaimer): Observable<Disclaimer> {

    return this.http.post<any>(this.API_URL + "/" + userId, disclaimer, httpOptions);
  }

  getDisclaimer(disclaimerId: any): Observable<Disclaimer> {

    return this.http.get<Disclaimer>(this.API_URL + "/" + disclaimerId, httpOptions);
  }

  deleteDisclaimer(disclaimerId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + disclaimerId, httpOptions);
  }

  getAllCompanyDisclaimer(companyId: any): Observable<Disclaimer[]> {

    return this.http.get<Disclaimer[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
