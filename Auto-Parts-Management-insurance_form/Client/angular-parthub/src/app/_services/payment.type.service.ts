import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { PaymentType } from '../models/payment.type.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PaymentTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/paymenttypes';

  constructor(private http: HttpClient) { }


  createPaymentType(userId: any, paymentType: PaymentType): Observable<PaymentType> {

    return this.http.post<any>(this.API_URL + "/" + userId, paymentType, httpOptions);
  }

  getPaymentType(paymentTypeId: any): Observable<PaymentType> {

    return this.http.get<PaymentType>(this.API_URL + "/" + paymentTypeId, httpOptions);
  }

  deletePaymentType(locationId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + locationId, httpOptions);
  }

  getAllCompanyPaymentType(companyId: any): Observable<PaymentType[]> {

    return this.http.get<PaymentType[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
