import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Service } from '../models/service.model';
import { Job } from '../models/job.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { Vehicle } from '../models/vehicle.model';
import { GroupBy } from '../models/groupBy.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { JobCarrier } from '../models/job.carrier.model';
import { Employee } from '../models/employee.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class JobService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/jobs';
  API_URL_OVERVIEW = this.config.baseUrl + '/overviews';

  constructor(private http: HttpClient) { }


  uploadImageWithFileWithUserId(data: any, jobId: String, userId: any): Observable<any> {

    return this.http.post(this.config.baseUrl + "/jobimages/images/file/" + jobId + "/" + userId, data);
  }

  uploadImageWithFileWithUuidEmployee(data: any, jobId: String, uuidEmployee: any): Observable<any> {

    return this.http.post(this.config.baseUrl + "/jobimages/images/file/employee/" + jobId + "/" + uuidEmployee, data);
  }
  setImageForSearch(imageId: any, jobId: String): Observable<any> {

    return this.http.put(this.config.baseUrl + "/jobimages/images/" + jobId + "/" + imageId, null);
  }

  
  deleteImageWihtUserId(imageId: any, jobId: String, userId: any): Observable<any> {

    return this.http.delete(this.config.baseUrl + "/jobimages/images" + "/" + jobId + "/" + imageId + "/" + userId);
  }

  deleteImageWihtUuidEmployee(imageId: any, jobId: String, uuidEmployee: any): Observable<any> {

    return this.http.delete(this.config.baseUrl + "/jobimages/images/employee" + "/" + jobId + "/" + imageId + "/" + uuidEmployee);
  }

  
  createJob(userId: any, job: Job): Observable<Job> {

    return this.http.post<any>(this.API_URL + "/" + userId, job, httpOptions);
  }

  createJobUuidEmployee(uuidEmployee: any, job: Job): Observable<Job> {

    return this.http.put<any>(this.API_URL + "/employee/uuid/" + uuidEmployee, job, httpOptions);
  }

  createJobUuid(job: Job): Observable<Job> {

    return this.http.post<any>(this.API_URL + "/uuid", job, httpOptions);
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Job[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  updateSeqenceClaim(claimId: any, SequenceCarriers: SequenceCarrier[]): Observable<Job[]> {

    return this.http.post<any>(this.API_URL + "/sequence/claim/" + claimId, SequenceCarriers, httpOptions);
  }

  getJob(jobId: any): Observable<Job> {

    return this.http.get<Job>(this.API_URL + "/" + jobId, httpOptions);
  }

 

  updateJobStatus(jobId: any): Observable<Job> {

    return this.http.put<Job>(this.API_URL + "/" + jobId, httpOptions);
  }

  updateJobStatusWithUuidEmployee(uuidEmployee: any, jobId: any): Observable<Job> {

    return this.http.put<Job>(this.API_URL + "/employee/" + uuidEmployee + "/" + jobId, httpOptions);
  }


  deleteJob(jobId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + jobId, httpOptions);
  }

  deleteJobWithUserId(jobId: any, userId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + jobId + "/" + userId, httpOptions);
  }

  deleteJobWithUserIdWithOpitn(jobId: any, userId: any, option: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + jobId + "/" + userId + "/" + option, httpOptions);
  }
  getAllVehicleJobs(vehicleId: any): Observable<Service[]> {

    return this.http.get<Service[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }

  getAllVehicleJobs2(vehicleId: any): Observable<Job[]> {

    return this.http.get<Job[]>(this.API_URL + "/vehicle2/" + vehicleId, httpOptions);
  }

  getAllVehicleJobs2Uuid(uuid: any): Observable<Job[]> {

    return this.http.get<Job[]>(this.API_URL + "/vehicle2/uuid/" + uuid, httpOptions);
  }

  findAllCurrentEmplyeeJobsWithUuid(uuid: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/employee/uuid/" + uuid, httpOptions);
  }


  getAllJobsForUser(userId: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/user/" + userId, httpOptions);
  }

  getAllJobsForUserBetweenDate(userId: any, data: any): Observable<Vehicle[]> {

    return this.http.post<Vehicle[]>(this.API_URL + "/user/" + userId, data, httpOptions);
  }

  getAllCompanyOverviewBetweenDate(companyId: any, data: any): Observable<GroupBy[]> {

    return this.http.post<GroupBy[]>(this.API_URL_OVERVIEW + "/user/" + companyId, data, httpOptions);
  }

  getJobsForUserUsers(userId: any, data: any): Observable<JobCarrier[]> {

    return this.http.post<JobCarrier[]>(this.API_URL + "/user2/user/" + userId, data, httpOptions);
  }

  findAllCurrentEmplyeeJobs(companyId: any): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllCompanyOverviewBetweenDateMonth(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.API_URL_OVERVIEW + "/user/month/" + companyId, data, httpOptions);
  }
}
