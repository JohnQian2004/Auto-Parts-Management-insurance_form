import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { ItemType } from '../models/item.type.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ItemTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/itemtypes';

  constructor(private http: HttpClient) { }


  createItemType(userId: any, ItemType: ItemType): Observable<ItemType> {

    return this.http.post<any>(this.API_URL + "/" + userId, ItemType, httpOptions);
  }

  getItemType(itemTypeId: any): Observable<ItemType> {

    return this.http.get<ItemType>(this.API_URL + "/" + itemTypeId, httpOptions);
  }

  deleteItemType(itemTypeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + itemTypeId, httpOptions);
  }

  getAllCompanyItemType(companyId: any): Observable<ItemType[]> {

    return this.http.get<ItemType[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
