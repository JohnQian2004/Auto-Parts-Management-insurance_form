import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt2 } from '../models/receipt2.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class Receipt2Service {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/receipts';
  API_URL2 = this.config.baseUrl + '/receipts2';

  constructor(private http: HttpClient) { }


  createReceipt(userId: any, receipt: Receipt2): Observable<Receipt2> {

    return this.http.post<any>(this.API_URL + "/" + userId, receipt, httpOptions);
  }

  createReceipt2(userId: any, receipt: Receipt2): Observable<Receipt2> {

    return this.http.post<any>(this.API_URL2 + "/" + userId, receipt, httpOptions);
  }

  updateSequence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Receipt2[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  updateSequence2(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Receipt2[]> {

    return this.http.post<any>(this.API_URL2 + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getReceipt(receiptId: any): Observable<Receipt2> {

    return this.http.get<Receipt2>(this.API_URL + "/" + receiptId, httpOptions);
  }


  deleteReceipt(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + receiptId, httpOptions);
  }

  deleteReceipt2(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL2 + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithOption(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/option/" + receiptId, httpOptions);
  }

  deleteReceiptWithOption2(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL2 + "/option/" + receiptId, httpOptions);
  }

  deleteReceiptWithUserId(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + userId + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithUserId2(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL2 + "/" + userId + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithOptionWithUserId(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/option/" + userId + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithOptionWithUserId2(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL2 + "/option/" + userId + "/" + receiptId, httpOptions);
  }



  getAllVehicleReceipts(vehicleId: any): Observable<Receipt2[]> {

    return this.http.get<Receipt2[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }

  getAllVehicleReceipts2(vehicleId: any): Observable<Receipt2[]> {

    return this.http.get<Receipt2[]>(this.API_URL2 + "/vehicle/" + vehicleId, httpOptions);
  }
}