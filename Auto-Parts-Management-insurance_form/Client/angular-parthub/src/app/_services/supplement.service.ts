import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';
import { Supplement } from '../models/supplement.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class SepplementService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/supplements';

  constructor(private http: HttpClient) { }


  createSupplement(vehicleId: any, supplement: Supplement): Observable<Supplement> {

    return this.http.post<any>(this.API_URL + "/" + vehicleId, supplement, httpOptions);
  }

  getSupplement(supplementId: any): Observable<Supplement> {

    return this.http.get<Supplement>(this.API_URL + "/" + supplementId, httpOptions);
  }

  deleteSupplement(supplementId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + supplementId, httpOptions);
  }

  getAllVehicleSupplements(vehicleId: any): Observable<Supplement[]> {

    return this.http.get<Supplement[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }

  updateSeqence(uuid: any, SequenceCarriers: SequenceCarrier[]): Observable<Supplement[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + uuid, SequenceCarriers, httpOptions);
  }

  updateSeqenceWithId(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Supplement[]> {

    return this.http.post<any>(this.API_URL + "/sequence/id/" + vehicleId, SequenceCarriers, httpOptions);
  }
}
