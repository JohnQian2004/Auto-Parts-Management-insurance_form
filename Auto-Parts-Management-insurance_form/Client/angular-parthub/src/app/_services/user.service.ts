import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Config } from '../models/config.model';
import { PasswordChangeRequest } from '../models/password.change.request.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { GroupBy } from '../models/groupBy.model';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,

};

@Injectable({
  providedIn: 'root',
})

export class UserService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/test/';
  API_URL_USER = this.config.baseUrl + '/user/';


  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(this.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'admin', { responseType: 'text' });
  }

  getUser(username: string): Observable<User> {

    return this.http.get<User>(this.API_URL_USER + username, httpOptions);
  }

  getUserById(userId: any): Observable<User> {

    return this.http.get<User>(this.API_URL_USER + "user/" + userId, httpOptions);
  }

  getUserByUuid(uuid: any): Observable<User> {

    return this.http.get<User>(this.API_URL_USER + "user/uuid/" + uuid, httpOptions);
  }

  updateUser(id: any, user: User): Observable<any> {

    return this.http.put<User>(this.API_URL_USER + id, user);
  }

  updateUserActivate(id: any, user: User): Observable<any> {

    return this.http.put<User>(this.API_URL_USER + 'activate/' + id, user);
  }


  AddNewUser(id: any, user: User): Observable<any> {

    return this.http.post<User>(this.API_URL_USER + id, user);
  }

  passwordChangeRequest(id: any, passwordChangeRequest: PasswordChangeRequest): Observable<any> {

    return this.http.put<any>(this.API_URL_USER + "change/" + id, passwordChangeRequest);
  }

  passwordResetRequest(id: any, passwordChangeRequest: PasswordChangeRequest): Observable<any> {

    return this.http.put<any>(this.API_URL_USER + "reset/" + id, passwordChangeRequest);
  }

  getAllUsers(id: any): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL_USER + "all/" + id);
  }

  getAllCompanyUsers(companyId: any): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL_USER + "company/" + companyId);
  }


  deleteUser(adminId: any, userId: any): Observable<any> {
    return this.http.delete(this.API_URL_USER + "all/" + adminId + "/" + userId);
  }

  getAllUsersStringWithPage(companyId: any, data: any): Observable<User[]> {
    return this.http.post<User[]>(this.API_URL_USER + "user/lastname/page/" + companyId, data);
  }

  searchUsersByLastName(companyId: any, lastName: any): Observable<User[]> {

    return this.http.get<User[]>(this.API_URL_USER + "search/lastname/" + companyId + "/" + lastName, httpOptions);
  }

  getUserCountOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/user/market/" + companyId, data, httpOptions);
  }

  getUserCountShopOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/user/shop/" + companyId, data, httpOptions);
  }


  getUserLastNameOverview(): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + "/overviews/users");
  }

}
