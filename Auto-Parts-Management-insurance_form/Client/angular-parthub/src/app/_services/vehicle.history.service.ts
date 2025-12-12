import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { VehicleHistory } from '../models/vehicle.history.model';
import { GroupBy } from '../models/groupBy.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class VehicleHistoryService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/histories';

  API_URL__HISOTRY_OVERVIEW = this.config.baseUrl + '/overviews/history';
  API_URL__USER_HISOTRY_OVERVIEW = this.config.baseUrl + '/overviews/user';
  constructor(private http: HttpClient) { }


  getVehicleHistory(vehicleId: any): Observable<VehicleHistory[]> {
    return this.http.get<VehicleHistory[]>(this.API_URL + "/" + vehicleId, httpOptions);
  }

  getChangeOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.API_URL__HISOTRY_OVERVIEW + "/" + companyId, httpOptions);
  }

  getUserChangeOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.API_URL__USER_HISOTRY_OVERVIEW + "/" + companyId, httpOptions);
  }
}
