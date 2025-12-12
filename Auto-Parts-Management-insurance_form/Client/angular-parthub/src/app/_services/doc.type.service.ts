import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { DocType } from '../models/doc.type.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class DocTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/doctypes';

  constructor(private http: HttpClient) { }


  createDocType(userId: any, DocType: DocType): Observable<DocType> {

    return this.http.post<any>(this.API_URL + "/" + userId, DocType, httpOptions);
  }

  getDocType(docTypeId: any): Observable<DocType> {

    return this.http.get<DocType>(this.API_URL + "/" + docTypeId, httpOptions);
  }

  deleteDocType(docTypeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + docTypeId, httpOptions);
  }

  getAllCompanyDocType(companyId: any): Observable<DocType[]> {

    return this.http.get<DocType[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  updateSeqenceWithId(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<DocType[]> {

    return this.http.post<any>(this.API_URL + "/sequence/id/" + companyId, SequenceCarriers, httpOptions);
  }
}
