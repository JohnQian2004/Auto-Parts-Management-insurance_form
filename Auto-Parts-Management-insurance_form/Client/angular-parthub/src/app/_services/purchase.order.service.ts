import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PurchaseOrder } from '../models/purchase.order.model';


@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {

  config: Config = new Config();

  baseUrl = this.config.baseUrl + '/purchaseorders';



  baseUrlImage = this.config.baseUrl + '/images';
  baseUrlImageFile = this.config.baseUrl + '/images/file';
  baseUrlVin = this.config.baseUrl + '/getVin';
  baseUrlSearchByYearMakeModelPartName = this.config.baseUrl + '/purchaseorders/search';
  baseUrlSearchByYearMakeModelPartNamePage = this.config.baseUrl + '/purchaseorders/search/page';
  baseUrlSatistics = this.config.baseUrl + '/purchaseorders/satistics';

  constructor(private http: HttpClient) { }


  get(id: any): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {

    return this.http.post(this.baseUrl, data);
  }


  getCompanyPurchaseOrders(companyId: any, status: any): Observable<any> {

    return this.http.get(this.baseUrl + "/company/" + companyId + "/" + status);
  }

  getCompanyPurchaseOrderStatusWithPage(data: any): Observable<any> {

    return this.http.post(this.baseUrl + "/search/status/page", data);
  }


  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findByTitle(title: any): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}?title=${title}`);
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

}
