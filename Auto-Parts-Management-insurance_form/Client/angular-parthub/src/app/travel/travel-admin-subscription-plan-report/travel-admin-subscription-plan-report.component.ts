import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { AdminSubscriptionService } from '../../services/admin-subscription.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SubscriptionService } from '../../services/subscription.service';

interface PlanAnalytics {
  planId: number;
  planName: string;
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: number;
  conversionRate: number;
  churnRate: number;
}

interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  yearlyRevenue: number;
  growthRate: number;
}

interface SubscriptionGrowth {
  netGrowthTotal: number;
  monthlyGrowth: number;
  quarterlyGrowth: number;
  yearlyGrowth: number;
}

interface AdminStats {
  totalPlans: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  churnRate: number;
}

@Component({
  selector: 'app-travel-admin-subscription-plan-report',
  templateUrl: './travel-admin-subscription-plan-report.component.html',
  styleUrls: ['./travel-admin-subscription-plan-report.component.css']
})
export class TravelAdminSubscriptionPlanReportComponent implements OnInit, OnDestroy {
  // Input properties
  @Input() subscriptionPlans: SubscriptionPlan[] = [];

  // Output events
  @Output() planAnalyticsRequested = new EventEmitter<SubscriptionPlan>();

  // Component state
  isLoading = false;
  analyticsLoading = false;

  // Analytics data
  planAnalytics: PlanAnalytics[] = [];
  revenueAnalytics: RevenueAnalytics | null = null;
  subscriptionGrowth: SubscriptionGrowth | null = null;
  adminStats: AdminStats | null = null;

  // Date range
  analyticsDateRange = 'monthly';

  // Chart data (placeholder for future chart integration)
  revenueChartData: any = null;
  growthChartData: any = null;
  planPerformanceChartData: any = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private adminSubscriptionService: AdminSubscriptionService,
    private subscriptionService: SubscriptionService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.loadAllAnalytics();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Data loading methods
  loadAllAnalytics(): void {
    this.loadAdminStats();
    this.loadPlanAnalytics();
    this.loadRevenueAnalytics();
    this.loadSubscriptionGrowth();
  }

  loadAdminStats(): void {
    this.analyticsLoading = true;

    this.analyticsService.getAnalyticsDashboard().subscribe({
      next: (data) => {
        this.adminStats = {
          totalPlans: data.activePlans,
          activeSubscriptions: data.totalSubscriptions,
          monthlyRevenue: data.totalRevenue,
          churnRate: data.growthAnalytics?.churnRate || 0
        };
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Error loading admin stats:', error);
        // Fallback to mock data if backend fails
        this.adminStats = {
          totalPlans: this.subscriptionPlans.length,
          activeSubscriptions: this.getTotalSubscribers(),
          monthlyRevenue: this.getMonthlyRevenue(),
          churnRate: 5.2
        };
        this.analyticsLoading = false;
      }
    });
  }

  loadPlanAnalytics(): void {
    this.analyticsLoading = true;

    this.analyticsService.getPlanPerformance().subscribe({
      next: (data) => {
        this.planAnalytics = data.planPerformance.map(plan => ({
          planId: plan.planId,
          planName: plan.planName,
          totalSubscriptions: plan.subscriberCount,
          activeSubscriptions: plan.subscriberCount,
          revenue: plan.revenue,
          conversionRate: plan.conversionRate,
          churnRate: plan.churnRate
        }));
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Error loading plan analytics:', error);
        // Fallback to mock data if backend fails
        this.planAnalytics = this.subscriptionPlans.map(plan => ({
          planId: plan.id!,
          planName: plan.name,
          totalSubscriptions: this.getSubscriberCount(plan.id!),
          activeSubscriptions: this.getSubscriberCount(plan.id!),
          revenue: this.getPlanRevenue(plan),
          conversionRate: Math.random() * 20 + 5,
          churnRate: Math.random() * 10 + 2
        }));
        this.analyticsLoading = false;
      }
    });
  }

  loadRevenueAnalytics(): void {
    this.analyticsLoading = true;

    this.analyticsService.getRevenueTrends(12).subscribe({
      next: (data) => {
        this.revenueAnalytics = {
          totalRevenue: data.totalRevenue,
          monthlyRevenue: data.averageMonthlyRevenue,
          quarterlyRevenue: data.averageMonthlyRevenue * 3,
          yearlyRevenue: data.averageMonthlyRevenue * 12,
          growthRate: data.growthRate
        };
        this.prepareRevenueChart();
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Error loading revenue analytics:', error);
        // Fallback to mock data if backend fails
        this.revenueAnalytics = {
          totalRevenue: this.getTotalRevenue(),
          monthlyRevenue: this.getMonthlyRevenue(),
          quarterlyRevenue: this.getMonthlyRevenue() * 3,
          yearlyRevenue: this.getMonthlyRevenue() * 12,
          growthRate: 15.5
        };
        this.prepareRevenueChart();
        this.analyticsLoading = false;
      }
    });
  }

  loadSubscriptionGrowth(): void {
    this.analyticsLoading = true;

    this.analyticsService.getSubscriptionTrends(12).subscribe({
      next: (data) => {
        this.subscriptionGrowth = {
          netGrowthTotal: data.totalGrowth,
          monthlyGrowth: data.averageMonthlyGrowth,
          quarterlyGrowth: data.averageMonthlyGrowth * 3,
          yearlyGrowth: data.averageMonthlyGrowth * 12
        };
        this.prepareGrowthChart();
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscription growth:', error);
        // Fallback to mock data if backend fails
        this.subscriptionGrowth = {
          netGrowthTotal: this.getTotalSubscribers(),
          monthlyGrowth: Math.floor(Math.random() * 50) + 10,
          quarterlyGrowth: Math.floor(Math.random() * 150) + 30,
          yearlyGrowth: Math.floor(Math.random() * 500) + 100
        };
        this.prepareGrowthChart();
        this.analyticsLoading = false;
      }
    });
  }

  // Chart preparation methods
  prepareRevenueChart(): void {
    if (this.revenueAnalytics) {
      this.revenueChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [
            this.revenueAnalytics.monthlyRevenue * 0.8,
            this.revenueAnalytics.monthlyRevenue * 0.9,
            this.revenueAnalytics.monthlyRevenue * 1.1,
            this.revenueAnalytics.monthlyRevenue * 1.0,
            this.revenueAnalytics.monthlyRevenue * 1.2,
            this.revenueAnalytics.monthlyRevenue
          ],
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4
        }]
      };
    }
  }

  prepareGrowthChart(): void {
    if (this.subscriptionGrowth) {
      this.growthChartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Subscription Growth',
          data: [
            this.subscriptionGrowth.monthlyGrowth * 3,
            this.subscriptionGrowth.monthlyGrowth * 3.5,
            this.subscriptionGrowth.monthlyGrowth * 4,
            this.subscriptionGrowth.monthlyGrowth * 4.5
          ],
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          tension: 0.4
        }]
      };
    }
  }

  preparePlanPerformanceChart(): void {
    if (this.planAnalytics.length > 0) {
      this.planPerformanceChartData = {
        labels: this.planAnalytics.map(plan => plan.planName),
        datasets: [{
          label: 'Active Subscriptions',
          data: this.planAnalytics.map(plan => plan.activeSubscriptions),
          backgroundColor: [
            '#0d6efd',
            '#198754',
            '#ffc107',
            '#dc3545',
            '#6f42c1',
            '#20c997'
          ]
        }]
      };
    }
  }

  // Event handlers
  onAnalyticsDateRangeChange(): void {
    this.loadAllAnalytics();
  }

  refreshAnalytics(): void {
    this.loadAllAnalytics();
  }

  viewPlanAnalytics(plan: SubscriptionPlan): void {
    this.planAnalyticsRequested.emit(plan);
  }

  // Utility methods
  getSubscriberCount(planId: number): number {
    // Mock data - replace with actual API call
    return Math.floor(Math.random() * 50) + 5;
  }

  getTotalSubscribers(): number {
    return this.subscriptionPlans.reduce((total, plan) => total + this.getSubscriberCount(plan.id!), 0);
  }

  getMonthlyRevenue(): number {
    return this.subscriptionPlans.reduce((total, plan) => {
      const subscribers = this.getSubscriberCount(plan.id!);
      const monthlyPrice = plan.price / plan.durationMonths;
      return total + (subscribers * monthlyPrice);
    }, 0);
  }

  getTotalRevenue(): number {
    return this.getMonthlyRevenue() * 12; // Annual revenue
  }

  getPlanRevenue(plan: SubscriptionPlan): number {
    const subscribers = this.getSubscriberCount(plan.id!);
    const monthlyPrice = plan.price / plan.durationMonths;
    return subscribers * monthlyPrice;
  }

  getSubscriptionPlanById(planId: number): SubscriptionPlan | undefined {
    return this.subscriptionPlans.find(plan => plan.id === planId);
  }

  // Formatting methods
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Chart integration helpers (for future Chart.js integration)
  getChartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Subscription Analytics'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  // Export functionality
  exportAnalytics(): void {
    // Mock export functionality
    const data = {
      adminStats: this.adminStats,
      planAnalytics: this.planAnalytics,
      revenueAnalytics: this.revenueAnalytics,
      subscriptionGrowth: this.subscriptionGrowth,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscription-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportToCSV(): void {
    if (this.planAnalytics.length === 0) return;

    const headers = ['Plan Name', 'Total Subscriptions', 'Active Subscriptions', 'Revenue', 'Conversion Rate', 'Churn Rate'];
    const csvContent = [
      headers.join(','),
      ...this.planAnalytics.map(plan => [
        plan.planName,
        plan.totalSubscriptions,
        plan.activeSubscriptions,
        plan.revenue,
        plan.conversionRate,
        plan.churnRate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscription-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
