import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';
import { Status } from '../models/status.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class StatusService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/statuss';

  constructor(private http: HttpClient) { }


  createStatus(userId: any, status: Status): Observable<Status> {

    return this.http.post<any>(this.API_URL + "/" + userId, status, httpOptions);
  }

  getStatus(statusId: any): Observable<Status> {

    return this.http.get<Status>(this.API_URL + "/" + statusId, httpOptions);
  }

  deleteStatus(statusId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + statusId, httpOptions);
  }

  getAllCompanyStatus(companyId: any): Observable<Status[]> {
    
    return this.http.get<Status[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllCompanyStatusUuid(companyId: any): Observable<Status[]> {
    
    return this.http.get<Status[]>(this.API_URL + "/company/uuid/" + companyId, httpOptions);
  }

  updateSeqence(uuid: any, SequenceCarriers: SequenceCarrier[]): Observable<Status[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + uuid, SequenceCarriers, httpOptions);
  }

  updateSeqenceWithId(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<Status[]> {

    return this.http.post<any>(this.API_URL + "/sequence/id/" + companyId, SequenceCarriers, httpOptions);
  }
}
