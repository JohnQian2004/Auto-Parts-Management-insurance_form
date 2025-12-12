import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { VendorSubscription } from '../models/VendorSubscription';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get HTTP options for requests (no manual auth headers needed - cookies handled automatically)
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  // Create subscription plan
  createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'createdAt'>): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(`${this.baseUrl}/subscription/plans`, plan, this.getHttpOptions());
  }

  // Get subscription plan by ID
  getSubscriptionPlanById(id: number): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.baseUrl}/subscription/plans/${id}`, this.getHttpOptions());
  }

  // Get all active plans
  getAllActivePlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans`, this.getHttpOptions());
  }

  // Get all plans for vendors (includes subscriber counts)
  getVendorSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/vendor/subscriptions/plans`, this.getHttpOptions());
  }

  // Get plans by max price
  getPlansByMaxPrice(maxPrice: number): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/price/${maxPrice}`, this.getHttpOptions());
  }

  // Search plans by name
  searchPlansByName(name: string): Observable<SubscriptionPlan[]> {
    const params = { name: name };
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/search`, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Update subscription plan
  updateSubscriptionPlan(id: number, plan: Partial<SubscriptionPlan>): Observable<SubscriptionPlan> {
    return this.http.put<SubscriptionPlan>(`${this.baseUrl}/subscription/plans/${id}`, plan, this.getHttpOptions());
  }

  // Delete subscription plan
  deleteSubscriptionPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subscription/plans/${id}`, this.getHttpOptions());
  }

  // Create vendor subscription
  createVendorSubscription(vendorId: number, planId: number, startDate: string): Observable<VendorSubscription> {
    const params = {
      vendorId: vendorId.toString(),
      planId: planId.toString(),
      startDate: startDate
    };
    return this.http.post<VendorSubscription>(`${this.baseUrl}/subscription`, null, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Create paid vendor subscription with Stripe
  createPaidVendorSubscription(subscriptionData: {
    vendorId: number;
    planId: number;
    paymentMethodId: string;
    startDate: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscription/vendor-paid`, subscriptionData, this.getHttpOptions());
  }

  // Get vendor subscription by ID
  getVendorSubscriptionById(id: number): Observable<VendorSubscription> {
    return this.http.get<VendorSubscription>(`${this.baseUrl}/subscription/${id}`, this.getHttpOptions());
  }

  // Get subscriptions by vendor
  getSubscriptionsByVendor(vendorId: number): Observable<VendorSubscription[]> {
    return this.http.get<VendorSubscription[]>(`${this.baseUrl}/subscription/vendor/${vendorId}`, this.getHttpOptions());
  }

  // Get subscriptions by plan
  getSubscriptionsByPlan(planId: number): Observable<VendorSubscription[]> {
    return this.http.get<VendorSubscription[]>(`${this.baseUrl}/subscription/plan/${planId}`, this.getHttpOptions());
  }

  // Get subscriptions by status
  getSubscriptionsByStatus(status: string): Observable<VendorSubscription[]> {
    return this.http.get<VendorSubscription[]>(`${this.baseUrl}/subscription/status/${status}`, this.getHttpOptions());
  }

  // Get active subscription by vendor
  getActiveSubscriptionByVendor(vendorId: number): Observable<VendorSubscription> {
    return this.http.get<VendorSubscription>(`${this.baseUrl}/subscription/vendor/${vendorId}/active`, this.getHttpOptions());
  }

  // Update subscription status
  updateSubscriptionStatus(id: number, status: string): Observable<VendorSubscription> {
    const params = { status: status };
    return this.http.put<VendorSubscription>(`${this.baseUrl}/subscription/${id}/status`, null, {
      ...this.getHttpOptions(),
      params: params
    });
  }

  // Cancel subscription
  cancelSubscription(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/subscription/${id}/cancel`, null, this.getHttpOptions());
  }


  // Delete vendor subscription
  deleteVendorSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subscription/${id}`, this.getHttpOptions());
  }
}