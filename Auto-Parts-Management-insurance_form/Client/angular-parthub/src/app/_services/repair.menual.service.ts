import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Expense } from '../models/expense.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { GroupBy } from '../models/groupBy.model';
import { RepairMenuResponse } from '../models/repair.menu.response';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class RepairMenualService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/repairmeuals';

  constructor(private http: HttpClient) { }


  getRepairMenuals(requestText: any): Observable<RepairMenuResponse> {

    return this.http.get<RepairMenuResponse>(this.API_URL + "/user?requestText=" + requestText, httpOptions);
  }
   
}
