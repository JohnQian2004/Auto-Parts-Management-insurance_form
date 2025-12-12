import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Expense } from '../models/expense.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { GroupBy } from '../models/groupBy.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ExpenseService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/expenses';

  constructor(private http: HttpClient) { }


  createExpense(userId: any, expense: Expense): Observable<Expense> {

    return this.http.post<any>(this.API_URL + "/" + userId, expense, httpOptions);
  }

  getExpense(expenseId: any): Observable<Expense> {

    return this.http.get<Expense>(this.API_URL + "/" + expenseId, httpOptions);
  }

  deleteExpense(expenseId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + expenseId, httpOptions);
  }

  getAllCompanyExpense(companyId: any): Observable<Expense[]> {

    return this.http.get<Expense[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllCompanyExpenseWithPage(data: any): Observable<any> {
    return this.http.post(this.API_URL + "/company/withpage", data);
  }

  searchExpenseWithPage(data: any): Observable<any> {
    return this.http.post(this.API_URL + "/search/withpage", data);
  }

  deleteImageWihtUserId(imageId: any, paymentId: String, userId: any): Observable<any> {

    return this.http.delete(this.config.baseUrl + "/expenseimages/images" + "/" + paymentId + "/" + imageId + "/" + userId);
  }

  uploadImageWithFileWithUserId(data: any, paymentId: String, userId: any): Observable<any> {

    return this.http.post(this.config.baseUrl + "/expenseimages/images/file/" + paymentId + "/" + userId, data);
  }

  getExpenseWeeklyOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/expense/" + companyId, data, httpOptions);
  }

  getExpenseTypeReport(companyId: any, data: any): Observable<GroupBy[]> {

    return this.http.post<GroupBy[]>(this.config.baseUrl + "/overviews/expense/expensetype/" + companyId, data, httpOptions);
  }

  getVendorReport(companyId: any, data: any): Observable<GroupBy[]> {

    return this.http.post<GroupBy[]>(this.config.baseUrl + "/overviews/expense/vendor/" + companyId, data, httpOptions);
  }

  getPaymentMethodReport(companyId: any, data: any): Observable<GroupBy[]> {

    return this.http.post<GroupBy[]>(this.config.baseUrl + "/overviews/expense/paymentmethod/" + companyId, data, httpOptions);
  }
}
