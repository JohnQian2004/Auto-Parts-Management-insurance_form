import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { InTakeWay } from '../models/in.take.way.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class InTakeWayService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/intakeways';

  constructor(private http: HttpClient) { }


  createInTakeWay(userId: any, inTakeWay: InTakeWay): Observable<InTakeWay> {

    return this.http.post<any>(this.API_URL + "/" + userId, inTakeWay, httpOptions);
  }

  getInTakeWay(inTakeWayId: any): Observable<InTakeWay> {

    return this.http.get<InTakeWay>(this.API_URL + "/" + inTakeWayId, httpOptions);
  }

  deleteInTakeWay(inTakeWayId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + inTakeWayId, httpOptions);
  }

  getAllCompanyInTakeWay(companyId: any): Observable<InTakeWay[]> {

    return this.http.get<InTakeWay[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
