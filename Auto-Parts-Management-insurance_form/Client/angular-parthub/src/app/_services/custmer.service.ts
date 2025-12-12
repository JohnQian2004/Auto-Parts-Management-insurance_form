import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Customer } from '../models/customer.model';
import { Config } from '../models/config.model';
import { ReportCarrier } from '../models/report.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class CustomerService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/customers';

  constructor(private http: HttpClient) { }


  createCustomer(userId: any, customer: Customer): Observable<Company> {

    return this.http.post<any>(this.API_URL + "/" + userId, customer, httpOptions);
  }

  getCustomer(customerId: any): Observable<Company> {

    return this.http.get<Company>(this.API_URL + "/" + customerId, httpOptions);
  }

  deleteCustomer(customerId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + customerId, httpOptions);
  }

  searchCustomersByPhone(companyId: any, phone: any): Observable<Customer[]> {

    return this.http.get<Customer[]>(this.API_URL + "/search/phone/" + companyId + "/" + phone, httpOptions);
  }

  searchCustomersByLastName(companyId: any, lastName: any): Observable<Customer[]> {

    return this.http.get<Customer[]>(this.API_URL + "/search/lastname/" + companyId + "/" + lastName, httpOptions);
  }

  getAllCustomers(companyId: any): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllCustomersWithPage(companyId: any, data: any): Observable<Customer[]> {
    return this.http.post<Customer[]>(this.API_URL + "/company/page/" + companyId, data);
  }

  getAllCustomersStringWithPage(companyId: any, data: any): Observable<Customer[]> {
    return this.http.post<Customer[]>(this.API_URL + "/company/lastname/page/" + companyId, data);
  }

  getAllCustomerCount(companyId: any): Observable<any> {
    return this.http.get<any>(this.API_URL + "/company/count/" + companyId, httpOptions);
  }

  getCompanyCustomerCountOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/customer/company/" + companyId, data, httpOptions);
  }

  getAllCustomersDate(companyId: any, data: any): Observable<Customer[]> {

    return this.http.post<Customer[]>(this.API_URL + "/date/" + companyId, data, httpOptions);
  }

  getCustomerCountShopOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/customer/shop/" + companyId, data, httpOptions);
  }
}
