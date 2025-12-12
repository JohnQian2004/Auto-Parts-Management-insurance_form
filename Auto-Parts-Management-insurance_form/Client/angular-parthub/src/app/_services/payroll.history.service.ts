import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { PayrollHistory } from '../models/payroll.history.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PayrollHistoryService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/payrollhistories';

  constructor(private http: HttpClient) { }


  createPayrollHistory(userId: any, paymentType: PayrollHistory): Observable<PayrollHistory> {

    return this.http.post<any>(this.API_URL + "/" + userId, paymentType, httpOptions);
  }

  getPayrollHistory(payrollHistoryId: any): Observable<PayrollHistory> {

    return this.http.get<PayrollHistory>(this.API_URL + "/" + payrollHistoryId, httpOptions);
  }

  searchPayrollHistory(jobId: any, companyId: any): Observable<PayrollHistory> {

    return this.http.get<PayrollHistory>(this.API_URL + "/search/" + jobId + "/" + companyId, httpOptions);
  }

  deletePayrollHistory(payrollHistoryId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + payrollHistoryId, httpOptions);
  }

  getAllCompanyPayrollHistoies(companyId: any, year: any, weekNumber: any): Observable<PayrollHistory[]> {

    return this.http.get<PayrollHistory[]>(this.API_URL + "/company/" + companyId + "/" + year + "/" + weekNumber, httpOptions);
  }

  getAllCompanyPayrollHistoiesForEmployee(uuidEmployee: any, year: any, weekNumber: any): Observable<PayrollHistory[]> {

    return this.http.get<PayrollHistory[]>(this.API_URL + "/employee/" + uuidEmployee + "/" + year + "/" + weekNumber, httpOptions);
  }


}
