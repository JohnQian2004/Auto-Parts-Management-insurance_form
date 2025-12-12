import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Vendor } from '../models/vendor.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class VendorService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/vendors';

  constructor(private http: HttpClient) { }


  createVendor(userId: any, vendor: Vendor): Observable<Vendor> {

    return this.http.post<any>(this.API_URL + "/" + userId, vendor, httpOptions);
  }

  getVendor(vendorId: any): Observable<Vendor> {

    return this.http.get<Vendor>(this.API_URL + "/" + vendorId, httpOptions);
  }

  deleteVendor(vendorId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + vendorId, httpOptions);
  }

  getAllCompanyVendor(companyId: any): Observable<Vendor[]> {

    return this.http.get<Vendor[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  
  getAllCompanyVendorUuid(companyId: any): Observable<Vendor[]> {

    return this.http.get<Vendor[]>(this.API_URL + "/company/uuid/" + companyId, httpOptions);
  }


}
