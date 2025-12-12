import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { Feedback } from '../models/feedback.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class FeedbackService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/feedbacks';

  constructor(private http: HttpClient) { }


  createFeedback(userId: any, feedback: Feedback): Observable<Feedback> {

    return this.http.post<any>(this.API_URL + "/" + userId, feedback, httpOptions);
  }

  getAllFeedbacks(data: any): Observable<Feedback[]> {

    return this.http.post<Feedback[]>(this.API_URL + "/search", data, httpOptions);
  }

  getFeedback(feedbackId: any): Observable<Feedback> {

    return this.http.get<Feedback>(this.API_URL + "/" + feedbackId, httpOptions);
  }

  deleteFeedback(feedbackId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + feedbackId, httpOptions);
  }

  getCompanyFeedbacks(companyId: any): Observable<Feedback[]> {

    return this.http.get<Feedback[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getUserFeedbacks(userId: any): Observable<Feedback[]> {

    return this.http.get<Feedback[]>(this.API_URL + "/user/" + userId, httpOptions);
  }

}
