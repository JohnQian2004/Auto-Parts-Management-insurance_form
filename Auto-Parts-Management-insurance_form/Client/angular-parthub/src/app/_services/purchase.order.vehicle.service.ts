import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrderVehicle } from '../models/purchase.order.vehicle.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';

 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class PurchaseOrderVehicleService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/purchaseordervehicles';

  constructor(private http: HttpClient) { }


  createPurchaseOrderVehicle(userId: any, purchaseOrderVehicle: PurchaseOrderVehicle): Observable<PurchaseOrderVehicle> {

    return this.http.post<any>(this.API_URL + "/" + userId, purchaseOrderVehicle, httpOptions);
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<PurchaseOrderVehicle[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  updateSeqenceClaim(claimId: any, SequenceCarriers: SequenceCarrier[]): Observable<PurchaseOrderVehicle[]> {

    return this.http.post<any>(this.API_URL + "/sequence/claim/" + claimId, SequenceCarriers, httpOptions);
  }


  getPurchaseOrderVehicle(purchaseOrderVehicleId: any): Observable<PurchaseOrderVehicle> {

    return this.http.get<PurchaseOrderVehicle>(this.API_URL + "/" + purchaseOrderVehicleId, httpOptions);
  }


  deletePurchaseOrderVehicle(purchaseOrderVehicleId: any, userId:any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + purchaseOrderVehicleId + "/" + userId, httpOptions);
  }

  deletePurchaseOrderVehicleWithOption(purchaseOrderVehicleId: any, userId:any, opiton:any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + purchaseOrderVehicleId + "/" + userId + "/" + opiton, httpOptions);
  }

  getAllVehiclePurchaseOrderVehicles(vehicleId: any): Observable<PurchaseOrderVehicle[]> {

    return this.http.get<PurchaseOrderVehicle[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }
}
