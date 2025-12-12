import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { ServiceType } from '../models/service.type.model';
 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ServiceTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/servicetypes';

  constructor(private http: HttpClient) { }


  createUpdateServiceType(userId: any, serviceType: ServiceType): Observable<ServiceType> {

    return this.http.post<any>(this.API_URL + "/" + userId, serviceType, httpOptions);
  }

  getServiceType(serviceTypeId: any): Observable<ServiceType> {

    return this.http.get<ServiceType>(this.API_URL + "/" + serviceTypeId, httpOptions);
  }

  deleteServiceType(serviceTypeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + serviceTypeId, httpOptions);
  }

  getAllServiceType(): Observable<ServiceType[]> {

    return this.http.get<ServiceType[]>(this.API_URL + "/company/" + 0, httpOptions);
  }


}
