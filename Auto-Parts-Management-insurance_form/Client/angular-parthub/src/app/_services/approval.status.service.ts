import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { ApprovalStatus } from '../models/approval.status.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ApprovalStatusService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/approvalstatuss';

  constructor(private http: HttpClient) { }


  createApprovalStatus(userId: any, approvalStatus: ApprovalStatus): Observable<ApprovalStatus> {

    return this.http.post<any>(this.API_URL + "/" + userId, approvalStatus, httpOptions);
  }

  getApprovalStatus(approvalStatusId: any): Observable<ApprovalStatus> {

    return this.http.get<ApprovalStatus>(this.API_URL + "/" + approvalStatusId, httpOptions);
  }

  deleteApprovalStatus(approvalStatusId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + approvalStatusId, httpOptions);
  }

  getAllCompanyApprovalStatus(companyId: any): Observable<ApprovalStatus[]> {

    return this.http.get<ApprovalStatus[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
