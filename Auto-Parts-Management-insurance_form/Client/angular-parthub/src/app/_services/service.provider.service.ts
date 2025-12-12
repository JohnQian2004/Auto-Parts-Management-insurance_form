import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { ServiceProvider } from '../models/service.provider.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ServiceProviderService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/serviceproviders';

  constructor(private http: HttpClient) { }


  createUpdateServiceProvider(userId: any, serviceProvider: ServiceProvider): Observable<ServiceProvider> {

    return this.http.post<any>(this.API_URL + "/" + userId, serviceProvider, httpOptions);
  }

  getServiceProvider(serviceProviderId: any): Observable<ServiceProvider> {

    return this.http.get<ServiceProvider>(this.API_URL + "/" + serviceProviderId, httpOptions);
  }

  deleteServiceProvider(serviceProviderId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + serviceProviderId, httpOptions);
  }

  getAllServiceProvider(companyId: any): Observable<ServiceProvider[]> {

    return this.http.get<ServiceProvider[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllServiceProviderUser(userId: any): Observable<ServiceProvider[]> {

    return this.http.get<ServiceProvider[]>(this.API_URL + "/user/" + userId, httpOptions);
  }


  getServiceProdiersWithPage(searchCarrier: any): Observable<ServiceProvider[]> {

    return this.http.post<any>(this.API_URL + "/search/page", searchCarrier, httpOptions);
  }

}
