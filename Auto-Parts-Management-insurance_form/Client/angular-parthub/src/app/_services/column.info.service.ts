import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Config } from '../models/config.model';
import { ColumnInfo } from '../models/column.info.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ColumnInfoService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/columninfos';

  constructor(private http: HttpClient) { }


  createColumnInfo(userId: any, columnInfo: ColumnInfo): Observable<ColumnInfo> {

    return this.http.post<any>(this.API_URL + "/" + userId, columnInfo, httpOptions);
  }

  getColumnInfo(columnInfoId: any): Observable<ColumnInfo> {

    return this.http.get<ColumnInfo>(this.API_URL + "/" + columnInfoId, httpOptions);
  }

  deleteColumnInfo(columnInfoId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + columnInfoId, httpOptions);
  }

  getAllCompanyColumnInfo(companyId: any): Observable<ColumnInfo[]> {
    
    return this.http.get<ColumnInfo[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  updateSeqence(uuid: any, SequenceCarriers: SequenceCarrier[]): Observable<ColumnInfo[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + uuid, SequenceCarriers, httpOptions);
  }

  updateSeqenceWithId(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<ColumnInfo[]> {

    return this.http.post<any>(this.API_URL + "/sequence/id/" + companyId, SequenceCarriers, httpOptions);
  }
}
