import { Component, OnInit } from '@angular/core';
import { AnalyticsService, AnalyticsDashboard, RevenueTrends, SubscriptionTrends, PlanPerformance, VendorInsights, ChurnAnalysis, ConversionFunnel } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  
  // Dashboard data
  dashboardData: AnalyticsDashboard | null = null;
  revenueTrends: RevenueTrends | null = null;
  subscriptionTrends: SubscriptionTrends | null = null;
  planPerformance: PlanPerformance | null = null;
  vendorInsights: VendorInsights | null = null;
  churnAnalysis: ChurnAnalysis | null = null;
  conversionFunnel: ConversionFunnel | null = null;

  // Loading states
  isLoading = false;
  isLoadingRevenue = false;
  isLoadingSubscriptions = false;
  isLoadingPlans = false;
  isLoadingVendors = false;
  isLoadingChurn = false;
  isLoadingConversion = false;


  // Time period
  selectedPeriod = '12';
  periods = [
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 12 Months' },
    { value: '24', label: 'Last 24 Months' }
  ];

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    console.log('Loading analytics dashboard...');
    console.log('Auth token:', this.analyticsService['configService'].getAuthToken());
    
    this.analyticsService.getAnalyticsDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        console.log('Dashboard data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.isLoading = false;
      }
    });
  }

  loadRevenueTrends(): void {
    this.isLoadingRevenue = true;
    
    this.analyticsService.getRevenueTrends(parseInt(this.selectedPeriod)).subscribe({
      next: (data) => {
        this.revenueTrends = data;
        this.isLoadingRevenue = false;
      },
      error: (error) => {
        console.error('Error loading revenue trends:', error);
        this.isLoadingRevenue = false;
      }
    });
  }

  loadSubscriptionTrends(): void {
    this.isLoadingSubscriptions = true;
    
    this.analyticsService.getSubscriptionTrends(parseInt(this.selectedPeriod)).subscribe({
      next: (data) => {
        this.subscriptionTrends = data;
        this.isLoadingSubscriptions = false;
      },
      error: (error) => {
        console.error('Error loading subscription trends:', error);
        this.isLoadingSubscriptions = false;
      }
    });
  }

  loadPlanPerformance(): void {
    this.isLoadingPlans = true;
    
    this.analyticsService.getPlanPerformance().subscribe({
      next: (data) => {
        this.planPerformance = data;
        this.isLoadingPlans = false;
      },
      error: (error) => {
        console.error('Error loading plan performance:', error);
        this.isLoadingPlans = false;
      }
    });
  }

  loadVendorInsights(): void {
    this.isLoadingVendors = true;
    
    this.analyticsService.getVendorInsights().subscribe({
      next: (data) => {
        this.vendorInsights = data;
        this.isLoadingVendors = false;
      },
      error: (error) => {
        console.error('Error loading vendor insights:', error);
        this.isLoadingVendors = false;
      }
    });
  }

  loadChurnAnalysis(): void {
    this.isLoadingChurn = true;
    
    this.analyticsService.getChurnAnalysis(parseInt(this.selectedPeriod)).subscribe({
      next: (data) => {
        this.churnAnalysis = data;
        this.isLoadingChurn = false;
      },
      error: (error) => {
        console.error('Error loading churn analysis:', error);
        this.isLoadingChurn = false;
      }
    });
  }

  loadConversionFunnel(): void {
    this.isLoadingConversion = true;
    
    this.analyticsService.getConversionFunnel().subscribe({
      next: (data) => {
        this.conversionFunnel = data;
        this.isLoadingConversion = false;
      },
      error: (error) => {
        console.error('Error loading conversion funnel:', error);
        this.isLoadingConversion = false;
      }
    });
  }


  // ==================== UTILITY METHODS ====================

  formatCurrency(amount: number): string {
    return this.analyticsService.formatCurrency(amount);
  }

  formatPercentage(value: number): string {
    return this.analyticsService.formatPercentage(value);
  }

  formatNumber(value: number): string {
    return this.analyticsService.formatNumber(value);
  }

  getGrowthIndicator(current: number, previous: number) {
    return this.analyticsService.getGrowthIndicator(current, previous);
  }

  getTrendIcon(trend: number): string {
    return this.analyticsService.getTrendIcon(trend);
  }

  getTrendColor(trend: number): string {
    return this.analyticsService.getTrendColor(trend);
  }

  onPeriodChange(): void {
    this.loadRevenueTrends();
    this.loadSubscriptionTrends();
    this.loadChurnAnalysis();
  }

  refreshAll(): void {
    this.loadDashboardData();
    this.loadRevenueTrends();
    this.loadSubscriptionTrends();
    this.loadPlanPerformance();
    this.loadVendorInsights();
    this.loadChurnAnalysis();
    this.loadConversionFunnel();
  }

  testAuth(): void {
    console.log('Testing analytics authentication...');
    this.analyticsService.testAnalyticsAuth().subscribe({
      next: (response) => {
        console.log('Auth test successful:', response);
        alert('Authentication test successful! Check console for details.');
      },
      error: (error) => {
        console.error('Auth test failed:', error);
        alert(`Authentication test failed: ${error.status} - ${error.message}`);
      }
    });
  }

  // ==================== UTILITY METHODS FOR UI ====================

  getSegmentColor(segment: string): string {
    const colors: { [key: string]: string } = {
      'Trial': 'segment-trial',
      'Basic': 'segment-basic',
      'Professional': 'segment-professional',
      'Enterprise': 'segment-enterprise'
    };
    return colors[segment] || 'bg-secondary';
  }

  getFunnelStepColor(index: number): string {
    const colors = ['funnel-step-0', 'funnel-step-1', 'funnel-step-2', 'funnel-step-3'];
    return colors[index] || 'bg-secondary';
  }

  // ==================== CHART UTILITY METHODS ====================

  getRevenueProgress(revenue: number, allRevenues: any[]): number {
    const maxRevenue = Math.max(...allRevenues.map((item: any) => item.revenue));
    return maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  }

  getSubscriptionProgress(count: number, allCounts: any[], type: string): number {
    const maxCount = Math.max(...allCounts.map((item: any) => 
      type === 'new' ? item.newSubscriptions : item.cancelledSubscriptions
    ));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  getPlanProgress(count: number, allPlans: any[]): number {
    const maxCount = Math.max(...allPlans.map((plan: any) => plan.subscriberCount));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  getPlanColor(index: number): string {
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];
    return colors[index % colors.length];
  }

  getChurnBadgeColor(churnRate: number): string {
    if (churnRate <= 0.05) return 'bg-success';
    if (churnRate <= 0.10) return 'bg-warning';
    return 'bg-danger';
  }

  getChurnBarColor(churnRate: number): string {
    if (churnRate <= 0.05) return 'bg-success';
    if (churnRate <= 0.10) return 'bg-warning';
    return 'bg-danger';
  }

  // ==================== TYPE SAFETY HELPERS ====================

  getSegmentKey(segment: any): string {
    return segment.key as string;
  }

  getSegmentValue(segment: any): number {
    return segment.value as number;
  }

  getChurnKey(churn: any): string {
    return churn.key as string;
  }

  getChurnValue(churn: any): number {
    return churn.value as number;
  }

  getFunnelStepKey(step: any): string {
    return step.key as string;
  }

  getFunnelStepValue(step: any): number {
    return step.value as number;
  }

  getVendorDistributionProgress(segment: any, totalVendors: number): number {
    const value = this.getSegmentValue(segment);
    return totalVendors > 0 ? (value / totalVendors) * 100 : 0;
  }

  getFunnelStepProgress(step: any, funnelSteps: any): number {
    const stepValue = this.getFunnelStepValue(step);
    const firstStepValue = this.getFunnelStepValue(funnelSteps[0]);
    return firstStepValue > 0 ? (stepValue / firstStepValue) * 100 : 0;
  }
}
