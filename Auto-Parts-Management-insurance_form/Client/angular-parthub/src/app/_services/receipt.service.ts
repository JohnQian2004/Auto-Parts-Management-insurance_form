import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt } from '../models/receipt.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ReceiptService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/receipts';

  constructor(private http: HttpClient) { }


  createReceipt(userId: any, receipt: Receipt): Observable<Receipt> {

    return this.http.post<any>(this.API_URL + "/" + userId, receipt, httpOptions);
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Receipt[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getReceipt(receiptId: any): Observable<Receipt> {

    return this.http.get<Receipt>(this.API_URL + "/" + receiptId, httpOptions);
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



  getAllVehicleReceipts(vehicleId: any): Observable<Receipt[]> {

    return this.http.get<Receipt[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }
}
