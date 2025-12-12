import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';
import { Status } from '../models/status.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { EmailInfo } from '../models/email.info.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class EmailInfoService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/emailinfos';

  constructor(private http: HttpClient) { }


  createAndUpdateStatus(userId: any, emailInfo: EmailInfo): Observable<EmailInfo> {

    return this.http.post<any>(this.API_URL + "/" + userId, emailInfo, httpOptions);
  }


  getAllEmailInfo(companyId: any): Observable<EmailInfo[]> {

    return this.http.get<EmailInfo[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

}
