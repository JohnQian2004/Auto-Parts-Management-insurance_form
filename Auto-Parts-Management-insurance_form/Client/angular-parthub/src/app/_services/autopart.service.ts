import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutoPart } from '../models/autopart.model';
import { Config } from '../models/config.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { Fitment } from '../models/fitment.model';
import { GroupBy } from '../models/groupBy.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class AutopartService {

  config: Config = new Config();

  baseUrl = this.config.baseUrl + '/autoparts';



  baseUrlImage = this.config.baseUrl + '/images';
  baseUrlImageFile = this.config.baseUrl + '/images/file';
  baseUrlVin = this.config.baseUrl + '/getVin';
  baseUrlSearchByYearMakeModelPartName = this.config.baseUrl + '/autoparts/search';
  baseUrlSearchByYearMakeModelPartNamePage = this.config.baseUrl + '/autoparts/search/page';
  baseUrlSatistics = this.config.baseUrl + '/autoparts/satistics';
  baseUrlSatisticsUser = this.config.baseUrl + '/autoparts/satistics/user';
  constructor(private http: HttpClient) { }

  getAll(): Observable<AutoPart[]> {
    return this.http.get<AutoPart[]>(this.baseUrl);
  }

  getAllFromCompany(data: any): Observable<AutoPart[]> {
    return this.http.post<AutoPart[]>(this.baseUrl + "/company", data);
  }

  getAllFromUser2(data: any): Observable<AutoPart[]> {
    return this.http.post<AutoPart[]>(this.baseUrl + "/user", data);
  }

  getAllFromUserWithStatus(userId: any, status: any, archived: boolean): Observable<AutoPart[]> {

    let params = new HttpParams()
      .set('userId', userId)
      .set('status', status)
      .set('archived', archived);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<AutoPart[]>(this.baseUrl, { params: params });
  }

  getAllFromUser(userId: any): Observable<AutoPart[]> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<AutoPart[]>(this.baseUrl, { params: params });
  }

  getAllFromUserSatistics(userId: any): Observable<any> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<AutoPart[]>(this.baseUrlSatistics, { params: params });
  }

  getAllFromUserSatistics2(userId: any): Observable<any> {

    let params = new HttpParams()
      .set('userId', userId)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      HttpParams: params
    };

    return this.http.get<AutoPart[]>(this.baseUrlSatisticsUser, { params: params });
  }

  get(id: any): Observable<AutoPart> {
    return this.http.get<AutoPart>(`${this.baseUrl}/${id}`);
  }

  getByUuid(uuid: any): Observable<AutoPart> {
    return this.http.get<AutoPart>(`${this.baseUrl}/uuid/${uuid}`);
  }

  getVin(id: any): Observable<AutoPart> {
    return this.http.get<AutoPart>(`${this.baseUrlVin}/${id}`);
  }

  create(data: any): Observable<any> {

    return this.http.post(this.baseUrl, data);
  }

  createWithEmployeeUuid(uuidEmployee: any, data: any): Observable<any> {

    return this.http.post(this.baseUrl + "/employee/uuid/" + uuidEmployee, data);
  }

  getCompanyAutopart(companyId: any, status: any): Observable<any> {

    return this.http.get(this.baseUrl + "/company/" + companyId + "/" + status);
  }

  getAutopartForVehicle(vehicleId: any): Observable<any> {

    return this.http.get(this.baseUrl + "/vehicle/" + vehicleId);
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

  uploadImageWithFileWithUserId(data: any, autopartId: String, userId: any): Observable<any> {

    return this.http.post(this.baseUrlImageFile + "/" + autopartId + "/" + userId, data);
  }

  uploadImageWithFileWithUuidEmployee(data: any, autopartId: String, uuidEmployee: any): Observable<any> {

    return this.http.post(this.baseUrlImageFile + "/external/employee/" + autopartId + "/" + uuidEmployee, data);
  }


  deleteImage(imageId: any, autopartId: String): Observable<any> {

    return this.http.delete(this.baseUrlImage + "/" + autopartId + "/" + imageId);
  }

  deleteImageWihtUserId(imageId: any, autopartId: String, userId: any): Observable<any> {

    return this.http.delete(this.baseUrlImage + "/" + autopartId + "/" + imageId + "/" + userId);
  }

  deleteImageWihUuidEmployee(imageId: any, autopartId: String, userId: any): Observable<any> {

    return this.http.delete(this.baseUrlImage + "/employee/" + autopartId + "/" + imageId + "/" + userId);
  }



  setImageForSearch(imageId: any, autopartId: String): Observable<any> {

    return this.http.put(this.baseUrlImage + "/" + autopartId + "/" + imageId, null);
  }


  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  updateAutopartWithUuidEmployee(uuidEmployee: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/${uuidEmployee}`, data);
  }


  deleteWithOptionUserId(id: any, userId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/option/${id}/${userId}`);
  }

  deleteWithUserId(id: any, userId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/${userId}`);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  findByTitle(title: any): Observable<AutoPart[]> {
    return this.http.get<AutoPart[]>(`${this.baseUrl}?title=${title}`);
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

  getShopAutopartCountOverview(data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/shop/autopart/", data);
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


  setAutopartViewCount(autopartId: any): Observable<any> {
    return this.http.get(this.baseUrl + "/view/" + autopartId);
  }

  getTitleOverview(): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + "/overviews/autopart");
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<AutoPart[]> {

    return this.http.post<any>(this.baseUrl + "/sequence/" + vehicleId, SequenceCarriers);
  }

  updateSeqencePurchaseOrder(purchaseOrderId: any, SequenceCarriers: SequenceCarrier[]): Observable<AutoPart[]> {

    return this.http.post<any>(this.baseUrl + "/sequence/purchaseorder/" + purchaseOrderId, SequenceCarriers);
  }

  getMarketUserTop100Overview(): Observable<User[]> {

    return this.http.get<User[]>(this.config.baseUrl + "/overviews/user/top100");
  }


}
