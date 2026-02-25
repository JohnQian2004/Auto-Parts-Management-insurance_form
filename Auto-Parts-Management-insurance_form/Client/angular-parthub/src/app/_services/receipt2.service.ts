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

  API_URL = this.config.baseUrl + '/receipts2';

  constructor(private http: HttpClient) { }


  createReceipt(userId: any, receipt: Receipt2): Observable<Receipt2> {

    return this.http.post<any>(this.API_URL + "/" + userId, receipt, httpOptions);
  }

  updateSequence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Receipt2[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getReceipt(receiptId: any): Observable<Receipt2> {

    return this.http.get<Receipt2>(this.API_URL + "/" + receiptId, httpOptions);
  }


  deleteReceipt(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithOption(receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/option/" + receiptId, httpOptions);
  }

  deleteReceiptWithUserId(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + userId + "/" + receiptId, httpOptions);
  }

  deleteReceiptWithOptionWithUserId(userId: any, receiptId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/option/" + userId + "/" + receiptId, httpOptions);
  }



  getAllVehicleReceipts(vehicleId: any): Observable<Receipt2[]> {

    return this.http.get<Receipt2[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }
}