import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmsMessage } from '../models/sms-message.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/api/sms';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class SmsMessageService {

    constructor(private http: HttpClient) { }

    sendSms(smsMessage: SmsMessage): Observable<SmsMessage> {
        return this.http.post<SmsMessage>(API_URL + '/send', smsMessage, httpOptions);
    }

    getVehicleSmsMessages(vehicleId: number): Observable<SmsMessage[]> {
        return this.http.get<SmsMessage[]>(API_URL + '/vehicle/' + vehicleId, httpOptions);
    }
}
