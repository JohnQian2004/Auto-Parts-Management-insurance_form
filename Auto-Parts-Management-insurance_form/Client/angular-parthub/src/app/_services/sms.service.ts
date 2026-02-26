import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmsMessage } from '../models/smsmessage.model';
import { Config } from '../models/config.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class SmsService {

  config: Config = new Config();
  API_URL = this.config.baseUrl + '/sms';

  constructor(private http: HttpClient) { }

  sendSms(smsMessage: SmsMessage): Observable<SmsMessage> {
    return this.http.post<SmsMessage>(this.API_URL + "/send", smsMessage, httpOptions);
  }

  getVehicleSmsMessages(vehicleId: number): Observable<SmsMessage[]> {
    return this.http.get<SmsMessage[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }

  getPhoneSmsMessages(phoneNumber: string): Observable<SmsMessage[]> {
    return this.http.get<SmsMessage[]>(this.API_URL + "/phone/" + phoneNumber, httpOptions);
  }

  getSimulatorStatus(): Observable<any> {
    return this.http.get<any>(this.API_URL + "/simulator/status", httpOptions);
  }
}
