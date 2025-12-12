import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Insurancer } from '../models/insurancer.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class InsurancerService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/insurancers';

  constructor(private http: HttpClient) { }


  createInsurancer(userId: any, insurancer: Insurancer): Observable<Insurancer> {

    return this.http.post<any>(this.API_URL + "/" + userId, insurancer, httpOptions);
  }

  getInsurancer(insurancerId: any): Observable<Insurancer> {

    return this.http.get<Insurancer>(this.API_URL + "/" + insurancerId, httpOptions);
  }

  deleteInsurancer(insurancerId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + insurancerId, httpOptions);
  }

  getAllCompanyInsurancer(companyId: any): Observable<Insurancer[]> {

    return this.http.get<Insurancer[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  // New methods for insurance system
  getInsurancerByToken(token: string): Observable<Insurancer> {
    return this.http.get<Insurancer>(this.API_URL + "/token/" + token, httpOptions);
  }

  getInsurancerByName(name: string): Observable<Insurancer> {
    return this.http.get<Insurancer>(this.API_URL + "/name/" + name, httpOptions);
  }

  updateInsurancerToken(insurancerId: any, token: string): Observable<Insurancer> {
    const updateData = { token: token };
    return this.http.put<Insurancer>(this.API_URL + "/" + insurancerId + "/token", updateData, httpOptions);
  }

  // Additional methods for insurance management
  updateInsurancer(insurancerId: any, updateData: any): Observable<Insurancer> {
    return this.http.put<Insurancer>(this.API_URL + "/" + insurancerId, updateData, httpOptions);
  }

  generateUniqueToken(): Observable<string> {
    return this.http.post<string>(this.API_URL + "/generate-token", {}, httpOptions);
  }

  searchInsurancers(searchTerm: string, companyId: any): Observable<Insurancer[]> {
    return this.http.get<Insurancer[]>(this.API_URL + "/search?term=" + searchTerm + "&companyId=" + companyId, httpOptions);
  }

}
