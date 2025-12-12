import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';
import { Location } from '../models/location.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class LocationService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/locations';

  constructor(private http: HttpClient) { }


  createLocation(userId: any, location: Location): Observable<Location> {

    return this.http.post<any>(this.API_URL + "/" + userId, location, httpOptions);
  }

  getLocation(locationId: any): Observable<Location> {

    return this.http.get<Location>(this.API_URL + "/" + locationId, httpOptions);
  }

  deleteLocation(locationId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + locationId, httpOptions);
  }

  getAllCompanyLocation(companyId: any): Observable<Location[]> {

    return this.http.get<Location[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
