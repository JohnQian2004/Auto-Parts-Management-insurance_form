import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Saveditem } from '../models/saveditem.model';
import { AutoPart } from '../models/autopart.model';
import { Config } from '../models/config.model';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class SavedItemService {
  constructor(private http: HttpClient) { }

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/saveditems';

  createSavedItem(savedItem: any): Observable<Saveditem> {

    return this.http.post<any>(this.API_URL, savedItem);
  }

  getSavedItem(userId: any): Observable<AutoPart[]> {

    return this.http.get<AutoPart[]>(this.API_URL + "/" + userId, httpOptions);
  }

  deleteSavedItem(userId: any, autopartId: any): Observable<any> {
    return this.http.delete(this.API_URL + "/" + userId + "/" + autopartId);
  }

}
