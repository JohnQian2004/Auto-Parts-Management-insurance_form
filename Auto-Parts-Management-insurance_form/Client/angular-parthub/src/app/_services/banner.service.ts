import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { Banner } from '../models/banner.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class BannerService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/banners';

  constructor(private http: HttpClient) { }


  createUpdateBanner(userId: any, banner: Banner): Observable<Banner> {

    return this.http.post<any>(this.API_URL + "/" + userId, banner, httpOptions);
  }

  getBanner(bannerId: any): Observable<Banner> {

    return this.http.get<Banner>(this.API_URL + "/" + bannerId, httpOptions);
  }

  deleteBanner(bannerId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + bannerId, httpOptions);
  }

  getAllBanners(): Observable<Banner[]> {

    return this.http.get<Banner[]>(this.API_URL + "/system", httpOptions);
  }

  getActiveBanner(): Observable<Banner> {

    return this.http.get<Banner>(this.API_URL + "/system/active", httpOptions);
  }

  setActive(id: any, banner: Banner): Observable<Banner> {
    return this.http.put<any>(this.API_URL + "/" + id, banner, httpOptions);
  }

}
