import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ServiceService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/services';

  constructor(private http: HttpClient) { }


  createService(userId: any, service: Service): Observable<Service> {

    return this.http.post<any>(this.API_URL + "/" + userId, service, httpOptions);
  }

  getService(serviceId: any): Observable<Service> {

    return this.http.get<Service>(this.API_URL + "/" + serviceId, httpOptions);
  }

  deleteService(serviceId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + serviceId, httpOptions);
  }

  deleteVehicleService(vehicleId: any, serviceId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/vehicle/" + vehicleId + "/" + serviceId, httpOptions);
  }

  addVehicleService(vehicleId: any, serviceId: any): Observable<any> {
    return this.http.post<any>(this.API_URL + "/vehicle/" + vehicleId + "/" + serviceId, httpOptions);
  }

  getAllServices(companyId: any): Observable<Service[]> {

    return this.http.get<Service[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
