import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from '../models/config.model';
import { KeyLocation } from '../models/key.location.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class KeyLocationService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/keylocations';

  constructor(private http: HttpClient) { }


  createLocation(userId: any, location: KeyLocation): Observable<KeyLocation> {

    return this.http.post<any>(this.API_URL + "/" + userId, location, httpOptions);
  }

  getLocation(locationId: any): Observable<KeyLocation> {

    return this.http.get<KeyLocation>(this.API_URL + "/" + locationId, httpOptions);
  }

  deleteLocation(locationId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + locationId, httpOptions);
  }

  getAllCompanyLocation(companyId: any): Observable<KeyLocation[]> {

    return this.http.get<KeyLocation[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
