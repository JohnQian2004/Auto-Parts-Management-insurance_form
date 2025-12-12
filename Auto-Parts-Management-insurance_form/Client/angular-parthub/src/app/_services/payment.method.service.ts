import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { PaymentMethod } from '../models/payment.method.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PaymentMethodService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/paymentmethods';

  constructor(private http: HttpClient) { }


  createPaymentmethod(userId: any, paymentmethod: PaymentMethod): Observable<PaymentMethod> {

    return this.http.post<any>(this.API_URL + "/" + userId, paymentmethod, httpOptions);
  }

  getPaymentmethod(paymentmethodId: any): Observable<PaymentMethod> {

    return this.http.get<PaymentMethod>(this.API_URL + "/" + paymentmethodId, httpOptions);
  }

  deletePaymentmethod(locationId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + locationId, httpOptions);
  }

  getAllCompanyPaymentmethod(companyId: any): Observable<PaymentMethod[]> {

    return this.http.get<PaymentMethod[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
