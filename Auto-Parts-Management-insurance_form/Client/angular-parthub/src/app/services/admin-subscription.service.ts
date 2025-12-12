import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { VendorSubscription } from '../models/VendorSubscription';
import { ConfigService } from './config.service';

export interface AdminStats {
  totalPlans: number;
  activePlans: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export interface PlanAnalytics {
  planId: number;
  planName: string;
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: number;
  conversionRate: number;
  churnRate: number;
  averageLifetime: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  prices: StripePrice[];
}

export interface StripePrice {
  id: string;
  productId: string;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: 'month' | 'year';
    intervalCount: number;
  };
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSubscriptionService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get HTTP options for requests (cookies handled automatically with withCredentials)
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
  }

  // Admin Statistics
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/subscription/admin/subscriptions/stats`, this.getHttpOptions());
  }

  // Get all plans (including inactive)
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/admin/subscriptions/plans`, this.getHttpOptions());
  }

  // Get all subscriptions with pagination
  getAllSubscriptions(page: number = 1, limit: number = 10): Observable<{
    subscriptions: VendorSubscription[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = {
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<{
      subscriptions: VendorSubscription[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.baseUrl}/subscription/admin/subscriptions`, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Plan Analytics
  getPlanAnalytics(planId?: number): Observable<PlanAnalytics[]> {
    const url = planId
      ? `${this.baseUrl}/subscription/admin/subscriptions/analytics/plan/${planId}`
      : `${this.baseUrl}/subscription/admin/subscriptions/analytics/plans`;

    return this.http.get<PlanAnalytics[]>(url, this.getHttpOptions());
  }

  // Revenue Analytics
  getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Observable<{
    labels: string[];
    data: number[];
    total: number;
  }> {
    const params = { period };
    return this.http.get<{
      labels: string[];
      data: number[];
      total: number;
    }>(`${this.baseUrl}/subscription/admin/subscriptions/analytics/revenue`, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Subscription Growth Analytics
  getSubscriptionGrowth(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Observable<{
    labels: string[];
    newSubscriptions: number[];
    cancelledSubscriptions: number[];
    netGrowth: number[];
  }> {
    const params = { period };
    return this.http.get<{
      labels: string[];
      newSubscriptions: number[];
      cancelledSubscriptions: number[];
      netGrowth: number[];
    }>(`${this.baseUrl}/subscription/admin/subscriptions/analytics/growth`, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Bulk Operations
  bulkUpdatePlanStatus(planIds: number[], isActive: boolean): Observable<void> {
    const body = { planIds, isActive };
    return this.http.put<void>(`${this.baseUrl}/subscription/admin/subscriptions/plans/bulk-status`, body, {
      ...this.getHttpOptions()
    });
  }

  bulkCancelSubscriptions(subscriptionIds: number[]): Observable<void> {
    const body = { subscriptionIds };
    return this.http.put<void>(`${this.baseUrl}/subscription/admin/subscriptions/bulk-cancel`, body, {
      ...this.getHttpOptions()
    });
  }

  // Stripe Integration
  syncPlanWithStripe(planId: number): Observable<{
    success: boolean;
    stripeProductId?: string;
    stripePriceId?: string;
    message: string;
  }> {
    return this.http.post<{
      success: boolean;
      stripeProductId?: string;
      stripePriceId?: string;
      message: string;
    }>(`${this.baseUrl}/subscription/admin/subscriptions/plans/${planId}/stripe-sync`, {}, {
      ...this.getHttpOptions()
    });
  }

  syncAllPlansWithStripe(): Observable<{
    success: boolean;
    syncedPlans: number;
    failedPlans: number;
    message: string;
  }> {
    return this.http.post<{
      success: boolean;
      syncedPlans: number;
      failedPlans: number;
      message: string;
    }>(`${this.baseUrl}/subscription/admin/subscriptions/plans/stripe-sync-all`, {}, {
      ...this.getHttpOptions()
    });
  }

  updateStripePrice(planId: number, newPrice: number): Observable<{
    success: boolean;
    stripePriceId?: string;
    message: string;
  }> {
    const body = { newPrice };
    return this.http.put<{
      success: boolean;
      stripePriceId?: string;
      message: string;
    }>(`${this.baseUrl}/subscription/admin/subscriptions/plans/${planId}/stripe-price`, body, {
      ...this.getHttpOptions()
    });
  }

  getStripeProducts(): Observable<StripeProduct[]> {
    return this.http.get<StripeProduct[]>(`${this.baseUrl}/subscription/admin/stripe/products`, {
      ...this.getHttpOptions()
    });
  }

  archiveStripeProduct(planId: number): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.put<{
      success: boolean;
      message: string;
    }>(`${this.baseUrl}/subscription/admin/subscriptions/plans/${planId}/stripe-archive`, {}, {
      ...this.getHttpOptions()
    });
  }

  // Export Data
  exportSubscriptionData(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    const params = { format };
    return this.http.get(`${this.baseUrl}/subscription/admin/subscriptions/export`, {
      ...this.getHttpOptions(),
      params: params,
      responseType: 'blob'
    });
  }

  exportPlanAnalytics(planId?: number, format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    const params: any = { format };
    if (planId) {
      params.planId = planId.toString();
    }

    return this.http.get(`${this.baseUrl}/subscription/admin/subscriptions/analytics/export`, {
      ...this.getHttpOptions(),
      params: params,
      responseType: 'blob'
    });
  }

  // Notifications and Alerts
  getSubscriptionAlerts(): Observable<{
    expiringSoon: VendorSubscription[];
    paymentFailed: VendorSubscription[];
    highChurnPlans: PlanAnalytics[];
  }> {
    return this.http.get<{
      expiringSoon: VendorSubscription[];
      paymentFailed: VendorSubscription[];
      highChurnPlans: PlanAnalytics[];
    }>(`${this.baseUrl}/subscription/admin/subscriptions/alerts`, {
      ...this.getHttpOptions()
    });
  }

  testStripeEndpoint(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/test-stripe-endpoint`, this.getHttpOptions());
  }

  testPaymentMethodId(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/test-payment-method-id`, this.getHttpOptions());
  }

  getStripeSubscriptionDetails(stripeSubscriptionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/stripe-subscription/${stripeSubscriptionId}`, this.getHttpOptions());
  }

  getPaymentDetailsBySubscription(subscriptionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/payment-details/subscription/${subscriptionId}`, this.getHttpOptions());
  }
}