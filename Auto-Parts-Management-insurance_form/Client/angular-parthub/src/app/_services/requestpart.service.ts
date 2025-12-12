import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestPart } from '../models/requestpart.model';
import { Config } from '../models/config.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { Fitment } from '../models/fitment.model';
import { GroupBy } from '../models/groupBy.model';


@Injectable({
  providedIn: 'root',
})
export class RequestpartService {

  config: Config = new Config();

  baseUrl = this.config.baseUrl + '/requestparts';



  baseUrlImage = this.config.baseUrl + '/images';
  baseUrlImageFile = this.config.baseUrl + '/images/file';
  baseUrlVin = this.config.baseUrl + '/getVin';
  baseUrlSearchByYearMakeModelPartName = this.config.baseUrl + '/requestparts/search';
  baseUrlSearchByYearMakeModelPartNamePage = this.config.baseUrl + '/requestparts/search/page';
  baseUrlSatistics = this.config.baseUrl + '/requestparts/satistics';
  baseUrlSatisticsUser = this.config.baseUrl + '/requestparts/satistics/user';
  constructor(private http: HttpClient) { }

  getAll(): Observable<RequestPart[]> {
    return this.http.get<RequestPart[]>(this.baseUrl);
  }

  getAllFromCompany(data: any): Observable<RequestPart[]> {
    return this.http.post<RequestPart[]>(this.baseUrl + "/company", data);
  }

  getAllFromUser2(data: any): Observable<RequestPart[]> {
    return this.http.post<RequestPart[]>(this.baseUrl + "/user", data);
  }

  getAllFromUserWithStatus(userId: any, status: any, archived: boolean): Observable<RequestPart[]> {

    let params = new HttpParams()
      .set('userId', userId)
      .set('status', status)
      .set('archived', archived);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<RequestPart[]>(this.baseUrl, { params: params });
  }

  getAllFromUser(userId: any): Observable<RequestPart[]> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<RequestPart[]>(this.baseUrl, { params: params });
  }

  getAllFromUserSatistics(userId: any): Observable<any> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<RequestPart[]>(this.baseUrlSatistics, { params: params });
  }

  getAllFromUserSatistics2(userId: any): Observable<any> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<RequestPart[]>(this.baseUrlSatisticsUser, { params: params });
  }

  get(id: any): Observable<RequestPart> {
    return this.http.get<RequestPart>(`${this.baseUrl}/${id}`);
  }

  getByUuid(id: any): Observable<RequestPart> {
    return this.http.get<RequestPart>(`${this.baseUrl}/uuid/${id}`);
  }

  getVin(id: any): Observable<RequestPart> {
    return this.http.get<RequestPart>(`${this.baseUrlVin}/${id}`);
  }

  create(data: any): Observable<any> {

    return this.http.post(this.baseUrl, data);
  }

  getCompanyAutopart(companyId: any, status: any): Observable<any> {

    return this.http.get(this.baseUrl + "/company/" + companyId + "/" + status);
  }

  getCompanyAutopartStatusWithPage(data: any): Observable<any> {

    return this.http.post(this.baseUrl + "/search/status/page", data);
  }


  uploadImage(data: any, autopartId: String): Observable<any> {

    return this.http.post(this.baseUrlImage + "/" + autopartId, data);
  }

  uploadImageWithFile(data: any, autopartId: String): Observable<any> {

    return this.http.post(this.baseUrlImageFile + "/" + autopartId, data);
  }



  deleteImage(imageId: any, autopartId: String): Observable<any> {

    return this.http.delete(this.baseUrlImage + "/" + autopartId + "/" + imageId);
  }

  setImageForSearch(imageId: any, autopartId: String): Observable<any> {

    return this.http.put(this.baseUrlImage + "/" + autopartId + "/" + imageId, null);
  }


  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }


  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  findByTitle(title: any): Observable<RequestPart[]> {
    return this.http.get<RequestPart[]>(`${this.baseUrl}?title=${title}`);
  }

  searchByYearMakeModelPartName(data: any): Observable<any> {
    return this.http.post(`${this.baseUrlSearchByYearMakeModelPartName}`, data);
  }

  searchByYearMakeModelPartNameWithPage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrlSearchByYearMakeModelPartNamePage}`, data);
  }

  searchPartWithYearMakeModel(data: any): Observable<any> {
    return this.http.post(`${this.baseUrlSearchByYearMakeModelPartName}`, data);
  }

  searchPartNumberWithPage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrlSearchByYearMakeModelPartNamePage}`, data);
  }

  searchAllWithPage(data: any): Observable<any> {
    return this.http.post(this.baseUrl + "/search/page/all", data);
  }

  searchAllWithPageUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + "/search/page/all/user", data);
  }

  getAutopartCountOverview(data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/market/autopart/", data);
  }

  getImageCountOverview(data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/market/image/", data);
  }

  getFitmentFromAi(data: any): Observable<Fitment[]> {

    return this.http.post<Fitment[]>(this.config.baseUrl + "/fitments/ai", data);

  }

  getFitmentFromCohereAi(data: any): Observable<Fitment[]> {

    return this.http.post<Fitment[]>(this.config.baseUrl + "/fitments/ai/cohere", data);

  }


  setRequestpartViewCount(autopartId: any): Observable<any> {
    return this.http.get(this.baseUrl + "/view/" + autopartId);
  }

  getTitleOverview(): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + "/overviews/autopart");
  }
}
