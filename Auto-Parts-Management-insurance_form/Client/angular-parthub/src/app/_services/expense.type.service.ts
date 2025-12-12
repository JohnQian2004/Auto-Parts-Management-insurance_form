import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';

import { ExpenseType } from '../models/expense.type.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ExpenseTypeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/expensetypes';

  constructor(private http: HttpClient) { }


  createExpenseType(userId: any, ExpenseType: ExpenseType): Observable<ExpenseType> {

    return this.http.post<any>(this.API_URL + "/" + userId, ExpenseType, httpOptions);
  }

  getExpenseType(expenseTypeId: any): Observable<ExpenseType> {

    return this.http.get<ExpenseType>(this.API_URL + "/" + expenseTypeId, httpOptions);
  }

  deleteExpenseType(expenseTypeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + expenseTypeId, httpOptions);
  }

  getAllCompanyExpenseType(companyId: any): Observable<ExpenseType[]> {

    return this.http.get<ExpenseType[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  updateSeqenceWithId(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<ExpenseType[]> {

    return this.http.post<any>(this.API_URL + "/sequence/id/" + companyId, SequenceCarriers, httpOptions);
  }
}
