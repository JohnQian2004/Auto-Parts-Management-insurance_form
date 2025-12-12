import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Warranty } from '../models/warranty.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class WarrantyService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/warranties';

  constructor(private http: HttpClient) { }


  createWarranty(userId: any, warranty: Warranty): Observable<Warranty> {

    return this.http.post<any>(this.API_URL + "/" + userId, warranty, httpOptions);
  }

  getWarranty(warrantyId: any): Observable<Warranty> {

    return this.http.get<Warranty>(this.API_URL + "/" + warrantyId, httpOptions);
  }

  deleteWarranty(warrantyId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + warrantyId, httpOptions);
  }

  getAllCompanyWarranty(companyId: any): Observable<Warranty[]> {

    return this.http.get<Warranty[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
