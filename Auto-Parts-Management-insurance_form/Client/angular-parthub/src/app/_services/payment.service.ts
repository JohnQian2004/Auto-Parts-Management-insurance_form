import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Payment } from '../models/payment.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { ReportCarrier } from '../models/report.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PaymentService {



  config: Config = new Config();

  API_URL = this.config.baseUrl + '/payments';

  constructor(private http: HttpClient) { }

  uploadImageWithFileWithUserId(data: any, paymentId: String, userId: any): Observable<any> {

    return this.http.post(this.config.baseUrl + "/paymentimages/images/file/" + paymentId + "/" + userId, data);
  }

  uploadImageWithFileWithUuidEmployee(data: any, paymentId: String, uuidEmployee: any): Observable<any> {

    return this.http.post(this.config.baseUrl + "/paymentimages/images/file/employee/" + paymentId + "/" + uuidEmployee, data);
  }
  setImageForSearch(imageId: any, paymentId: String): Observable<any> {

    return this.http.put(this.config.baseUrl + "/paymentimages/images/" + paymentId + "/" + imageId, null);
  }


  deleteImageWihtUserId(imageId: any, paymentId: String, userId: any): Observable<any> {

    return this.http.delete(this.config.baseUrl + "/paymentimages/images" + "/" + paymentId + "/" + imageId + "/" + userId);
  }

  deleteImageWihtUuidEmployee(imageId: any, paymentId: String, uuidEmployee: any): Observable<any> {

    return this.http.delete(this.config.baseUrl + "/paymentimages/images/employee" + "/" + paymentId + "/" + imageId + "/" + uuidEmployee);
  }


  createPayment(userId: any, Payment: Payment): Observable<Payment> {

    return this.http.post<any>(this.API_URL + "/" + userId, Payment, httpOptions);
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Payment[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getPayment(PaymentId: any): Observable<Payment> {

    return this.http.get<Payment>(this.API_URL + "/" + PaymentId, httpOptions);
  }


  updatePaymentStatus(PaymentId: any): Observable<Payment> {

    return this.http.put<Payment>(this.API_URL + "/" + PaymentId, httpOptions);
  }


  deletePayment(PaymentId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + PaymentId, httpOptions);
  }

  getAllVehiclePayments(vehicleId: any): Observable<Payment[]> {

    return this.http.get<Payment[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }

  getWeeklyPayment(companyId: any, data: any): Observable<any> {
    return this.http.post(this.config.baseUrl + "/payments/week/" + companyId, data);
  }

  getVehiclePaymentOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/payment/" + companyId, data, httpOptions);
  }
}
