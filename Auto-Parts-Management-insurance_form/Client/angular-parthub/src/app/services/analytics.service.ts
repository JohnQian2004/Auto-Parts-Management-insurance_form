import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface AnalyticsDashboard {
  totalSubscriptions: number;
  totalRevenue: number;
  activePlans: number;
  revenueAnalytics: any;
  planAnalytics: any[];
  growthAnalytics: any;
  recentSubscriptions: any[];
}

export interface RevenueTrends {
  monthlyRevenue: any[];
  totalRevenue: number;
  averageMonthlyRevenue: number;
  growthRate: number;
}

export interface SubscriptionTrends {
  monthlySubscriptions: any[];
  totalGrowth: number;
  averageMonthlyGrowth: number;
}

export interface PlanPerformance {
  planPerformance: any[];
  topPerformingPlan: string;
}

export interface VendorInsights {
  totalVendors: number;
  newVendorsThisMonth: number;
  averageSubscriptionValue: number;
  vendorRetentionRate: number;
  topVendorSegment: string;
  vendorDistribution: any;
}

export interface ChurnAnalysis {
  overallChurnRate: number;
  churnedSubscriptions: number;
  retentionRate: number;
  churnByPlan: any;
  churnReasons: any;
}

export interface ConversionFunnel {
  funnelSteps: any;
  trialToPaidConversion: number;
  overallConversion: number;
  conversionByPlan: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:8080/api/subscription';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.configService.getAuthToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // ==================== DASHBOARD ANALYTICS ====================

  getAnalyticsDashboard(): Observable<AnalyticsDashboard> {
    return this.http.get<AnalyticsDashboard>(`${this.baseUrl}/analytics/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  getRevenueTrends(months: number = 12): Observable<RevenueTrends> {
    return this.http.get<RevenueTrends>(`${this.baseUrl}/analytics/revenue/trends?months=${months}`, {
      headers: this.getAuthHeaders()
    });
  }

  getSubscriptionTrends(months: number = 12): Observable<SubscriptionTrends> {
    return this.http.get<SubscriptionTrends>(`${this.baseUrl}/analytics/subscriptions/trends?months=${months}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPlanPerformance(): Observable<PlanPerformance> {
    return this.http.get<PlanPerformance>(`${this.baseUrl}/analytics/plans/performance`, {
      headers: this.getAuthHeaders()
    });
  }

  getVendorInsights(): Observable<VendorInsights> {
    return this.http.get<VendorInsights>(`${this.baseUrl}/analytics/vendors/insights`, {
      headers: this.getAuthHeaders()
    });
  }

  getChurnAnalysis(months: number = 6): Observable<ChurnAnalysis> {
    return this.http.get<ChurnAnalysis>(`${this.baseUrl}/analytics/churn/analysis?months=${months}`, {
      headers: this.getAuthHeaders()
    });
  }

  getConversionFunnel(): Observable<ConversionFunnel> {
    return this.http.get<ConversionFunnel>(`${this.baseUrl}/analytics/conversion/funnel`, {
      headers: this.getAuthHeaders()
    });
  }

  // ==================== TEST METHODS ====================

  testAnalyticsAuth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/test-auth`, {
      headers: this.getAuthHeaders()
    });
  }

  // ==================== UTILITY METHODS ====================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  getGrowthIndicator(current: number, previous: number): { value: number; isPositive: boolean; color: string } {
    const growth = ((current - previous) / previous) * 100;
    return {
      value: growth,
      isPositive: growth >= 0,
      color: growth >= 0 ? 'success' : 'danger'
    };
  }

  getTrendIcon(trend: number): string {
    if (trend > 0) return 'trending-up';
    if (trend < 0) return 'trending-down';
    return 'trending-flat';
  }

  getTrendColor(trend: number): string {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-danger';
    return 'text-muted';
  }
}
