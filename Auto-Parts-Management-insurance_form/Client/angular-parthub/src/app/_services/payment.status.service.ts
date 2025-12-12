import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PaymentStatusService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/paymentstatuss';

  constructor(private http: HttpClient) { }


  createPaymentStatus(userId: any, paymentStatus: PaymentStatus): Observable<PaymentStatus> {

    return this.http.post<any>(this.API_URL + "/" + userId, paymentStatus, httpOptions);
  }

  getPaymentStatus(paymentStatusId: any): Observable<PaymentStatus> {

    return this.http.get<PaymentStatus>(this.API_URL + "/" + paymentStatusId, httpOptions);
  }

  deletePaymentStatus(paymentStatusId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + paymentStatusId, httpOptions);
  }

  getAllCompanyPaymentStatus(companyId: any): Observable<PaymentStatus[]> {

    return this.http.get<PaymentStatus[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
