import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CounterInvoice } from '../models/counter.invoice.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { CounterInvoiceItem } from '../models/counter.invoice.item.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class CounterInvoiceService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/counterinvoices';

  constructor(private http: HttpClient) { }


  createCounterInvoice(userId: any, CounterInvoice: CounterInvoice): Observable<CounterInvoice> {

    return this.http.post<any>(this.API_URL + "/" + userId, CounterInvoice, httpOptions);
  }

  createCounterInvoiceItem(userId: any, CounterInvoice: CounterInvoiceItem): Observable<CounterInvoiceItem> {

    return this.http.post<any>(this.API_URL + "/counterinvoiceitem/" + userId, CounterInvoice, httpOptions);
  }

  updateSeqence(counterInvoiceId: any, SequenceCarriers: SequenceCarrier[]): Observable<CounterInvoiceItem[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + counterInvoiceId, SequenceCarriers, httpOptions);
  }

  getCounterInvoice(counterInvoiceId: any): Observable<CounterInvoice> {

    return this.http.get<CounterInvoice>(this.API_URL + "/" + counterInvoiceId, httpOptions);
  }

  getCounterInvoiceItem(counterInvoiceId: any): Observable<CounterInvoiceItem[]> {

    return this.http.get<CounterInvoiceItem[]>(this.API_URL + "/counterinvoiceitem/" + counterInvoiceId, httpOptions);
  }

  deleteCounterInvoice(CounterInvoiceId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + CounterInvoiceId, httpOptions);
  }

  searchCounterInvoice(companyId: any, invoiceNumber: any): Observable<CounterInvoice[]> {

    return this.http.get<CounterInvoice[]>(this.API_URL + "/search/" + companyId + "/" + invoiceNumber, httpOptions);
  }

  deleteCounterInvoiceItem(CounterInvoiceItemId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/counterinvoiceitem/" + CounterInvoiceItemId, httpOptions);
  }


  searchCounterInvoiceWithPage(companyId: any, data: any): Observable<CounterInvoice[]> {

    return this.http.post<CounterInvoice[]>(this.API_URL + "/search/" + companyId, data, httpOptions);
  }


  getAllCustomerCounterInvoices(customerId: any): Observable<CounterInvoice[]> {

    return this.http.get<CounterInvoice[]>(this.API_URL + "/customer/" + customerId, httpOptions);
  }
}
