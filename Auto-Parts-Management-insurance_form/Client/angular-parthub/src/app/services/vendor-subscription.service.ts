import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { VendorSubscription } from '../models/VendorSubscription';
import { ConfigService } from './config.service';

export interface VendorStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendorSubscriptionService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiBaseUrl();
  }

  // Get HTTP options for requests (no manual auth headers needed - cookies handled automatically)
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  // Get all active subscription plans (public endpoint)
  getAllActivePlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans`, {
      ...this.getHttpOptions()
    });
  }

  // Get all plans for vendors (includes subscriber counts)
  getVendorSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/vendor/subscriptions/plans`, {
      ...this.getHttpOptions()
    });
  }

  // Get all subscription plans including inactive (public endpoint)
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/all`, {
      ...this.getHttpOptions()
    });
  }

  // Get subscription plan by ID (public endpoint)
  getPlanById(planId: number): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.baseUrl}/subscription/plans/${planId}`, {
      ...this.getHttpOptions()
    });
  }

  // Get vendor's subscriptions (public endpoint)
  getVendorSubscriptions(vendorId: number): Observable<VendorSubscription[]> {
    return this.http.get<VendorSubscription[]>(`${this.baseUrl}/subscription/vendor/${vendorId}`, {
      ...this.getHttpOptions()
    });
  }

  // Get vendor's active subscription (public endpoint)
  getActiveVendorSubscription(vendorId: number): Observable<VendorSubscription | null> {
    return this.http.get<VendorSubscription | null>(`${this.baseUrl}/subscription/vendor/${vendorId}/active`, {
      ...this.getHttpOptions()
    });
  }

  // Get vendor's current active plan (highest priority)
  getCurrentActivePlan(vendorId: number): Observable<VendorSubscription> {
    return this.http.get<VendorSubscription>(`${this.baseUrl}/subscription/vendor/${vendorId}/current`, {
      ...this.getHttpOptions()
    });
  }

  // Get subscriptions by plan (public endpoint)
  getSubscriptionsByPlan(planId: number): Observable<VendorSubscription[]> {
    return this.http.get<VendorSubscription[]>(`${this.baseUrl}/subscription/plan/${planId}`, {
      ...this.getHttpOptions()
    });
  }

  // Search plans by name (public endpoint)
  searchPlansByName(name: string): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/search`, {
      ...this.getHttpOptions(),
      params: { name }
    });
  }

  // Get plans by max price (public endpoint)
  getPlansByMaxPrice(maxPrice: number): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/price/${maxPrice}`, {
      ...this.getHttpOptions()
    });
  }

  // Get popular plans (public endpoint)
  getPopularPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/popular`, {
      ...this.getHttpOptions()
    });
  }

  // Get featured plans (public endpoint)
  getFeaturedPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/featured`, {
      ...this.getHttpOptions()
    });
  }

  // Get plans by duration (public endpoint)
  getPlansByDuration(months: number): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/duration/${months}`, {
      ...this.getHttpOptions()
    });
  }

  // Get plans with trial (public endpoint)
  getPlansWithTrial(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/subscription/plans/trial`, {
      ...this.getHttpOptions()
    });
  }

  // Create vendor subscription (authenticated endpoint)
  createVendorSubscription(vendorId: number, planId: number, startDate: string): Observable<VendorSubscription> {
    const body = {
      vendorId,
      planId,
      startDate
    };
    return this.http.post<VendorSubscription>(`${this.baseUrl}/subscription`, body, {
      ...this.getHttpOptions()
    });
  }

  // Update subscription status (authenticated endpoint)
  updateSubscriptionStatus(subscriptionId: number, status: string): Observable<VendorSubscription> {
    const body = { status };
    return this.http.put<VendorSubscription>(`${this.baseUrl}/subscription/${subscriptionId}`, body, {
      ...this.getHttpOptions()
    });
  }

  // Cancel subscription (authenticated endpoint)
  cancelSubscription(subscriptionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subscription/${subscriptionId}`, {
      ...this.getHttpOptions()
    });
  }

  // Get payment details for a subscription (vendor-facing)
  getPaymentDetailsBySubscription(subscriptionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/payment-details/subscription/${subscriptionId}`, {
      ...this.getHttpOptions()
    });
  }
}
