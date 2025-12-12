import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from '../models/config.model';
import { Setting } from '../models/setting.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root', 
})

export class SettingService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/settings/company';

  constructor(private http: HttpClient) { }

  getSetting(comapnyId: any): Observable<Setting> {
    var companyIdTest = comapnyId * 23331;
    return this.http.get<Setting>(this.API_URL + "/" + companyIdTest, httpOptions);
  }

  getSettingUuid(uuid: any): Observable<Setting> {
   
    return this.http.get<Setting>(this.API_URL + "/uuid/" + uuid, httpOptions);
  }
}
