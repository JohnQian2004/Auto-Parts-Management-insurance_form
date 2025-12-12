import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Config } from '../models/config.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { GroupBy } from '../models/groupBy.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class CompanyService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/companies';

  constructor(private http: HttpClient) { }


  createCompany(userId: any, company: Company): Observable<Company> {

    return this.http.post<any>(this.API_URL + "/" + userId, company, httpOptions);
  }

  getCompany(companyId: any): Observable<Company> {

    return this.http.get<Company>(this.API_URL + "/" + companyId, httpOptions);
  }

  resentRegistrationLink(companyId: any): Observable<Company> {

    return this.http.put<Company>(this.API_URL + "/" + companyId, httpOptions);
  }

  deleteCompany(companyId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + companyId, httpOptions);
  }

  getAllCompany(): Observable<Company[]> {

    return this.http.get<Company[]>(this.API_URL, httpOptions);
  }

  getCompanyId(uuid: any): Observable<any> {

    return this.http.get<Company>(this.API_URL + "/uuid/" + uuid, httpOptions);
  }

  getSystemOverview(): Observable<any> {

    return this.http.get<Company>(this.config.baseUrl + "/overviews/system", httpOptions);
  }

  getSystemShopOverview(): Observable<any> {

    return this.http.get<Company>(this.config.baseUrl + "/overviews/system/shop", httpOptions);
  }

  getShopCountShopOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/shop/shop/" + companyId, data, httpOptions);
  }

  getNameOverview(): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + "/overviews/shops");
  }

  getCompaniesWithPage(data: any): Observable<any> {
    return this.http.post(this.config.baseUrl + "/companies/withpage", data);
  }

  searchCompaniesWithPage(data: any): Observable<any> {
    return this.http.post(this.config.baseUrl + "/companies/search/withpage", data);
  }

}
