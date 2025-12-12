import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubscriptionPayment } from '../models/SubscriptionPayment';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionPaymentService {
  private baseUrl = 'http://localhost:8080/api/subscription/payments';

  constructor(private http: HttpClient, private config: ConfigService) { }

  // Get HTTP options for requests (no manual auth headers needed - cookies handled automatically)
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  getLatestBySubscription(subscriptionId: number): Observable<SubscriptionPayment | null> {
    return this.http
      .get<SubscriptionPayment>(`${this.baseUrl}/latest-by-subscription/${subscriptionId}`, this.getHttpOptions())
      .pipe(catchError(() => of(null)));
  }

  getAllBySubscription(subscriptionId: number): Observable<SubscriptionPayment[]> {
    return this.http
      .get<SubscriptionPayment[]>(`${this.baseUrl}/by-subscription/${subscriptionId}`, this.getHttpOptions())
      .pipe(catchError(() => of([])));
  }
}


