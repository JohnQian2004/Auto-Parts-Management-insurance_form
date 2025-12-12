import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { JobRequestType } from '../models/job.request.type.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class JobRequestTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/jobrequesttypes';

  constructor(private http: HttpClient) { }


  createJobRequestType(userId: any, jobRequestType: JobRequestType): Observable<JobRequestType> {

    return this.http.post<any>(this.API_URL + "/" + userId, jobRequestType, httpOptions);
  }

  getJobRequestType(jobRequstTypeId: any): Observable<JobRequestType> {

    return this.http.get<JobRequestType>(this.API_URL + "/" + jobRequstTypeId, httpOptions);
  }

  deleteJobRequestType(jobRequstTypeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + jobRequstTypeId, httpOptions);
  }

  getAllCompanyJobRequestType(companyId: any): Observable<JobRequestType[]> {

    return this.http.get<JobRequestType[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
