import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionPlan } from '../../models/SubscriptionPlan';
import { VendorSubscription } from '../../models/VendorSubscription';
import { AdminSubscriptionService } from '../../services/admin-subscription.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-travel-admin-subscription-plan',
  templateUrl: './travel-admin-subscription-plan.component.html',
  styleUrls: ['./travel-admin-subscription-plan.component.css']
})
export class TravelAdminSubscriptionPlanComponent implements OnInit, OnDestroy {
  // Input properties
  private _subscriptionPlans: SubscriptionPlan[] = [];

  @Input()
  set subscriptionPlans(plans: SubscriptionPlan[]) {
    this._subscriptionPlans = plans;
    this.clearCache(); // Clear cache when plans change
  }

  get subscriptionPlans(): SubscriptionPlan[] {
    return this._subscriptionPlans;
  }

  // Display mode: 'admin' for full CRUD, 'vendor' for display only with subscription hook
  @Input() displayMode: 'admin' | 'vendor' = 'admin';

  // Vendor's active subscription (to indicate subscribed plan in UI)
  @Input() activeSubscription: VendorSubscription | null = null;

  // All vendor subscriptions (to check subscription status for all plans)
  @Input() vendorSubscriptions: VendorSubscription[] = [];

  // Output events
  @Output() planUpdated = new EventEmitter<void>();
  @Output() planCreated = new EventEmitter<SubscriptionPlan>();
  @Output() planDeleted = new EventEmitter<number>();
  @Output() planSubscriptionRequested = new EventEmitter<SubscriptionPlan>();
  @Output() planSubscriptionCancelled = new EventEmitter<SubscriptionPlan>();

  // Component state
  isLoading = false;
  isStripeLoaded = false;

  // Cached computed values to prevent ExpressionChangedAfterItHasBeenCheckedError
  private _cachedSubscriberCounts = new Map<number, number>();
  private _cachedTotalSubscribers: number | null = null;
  private _cachedMonthlyRevenue: number | null = null;
  private _cachedActivePlansCount: number | null = null;

  // Role-based helper methods
  get isAdminMode(): boolean {
    return this.displayMode === 'admin';
  }

  get isVendorMode(): boolean {
    return this.displayMode === 'vendor';
  }

  // Search and filters
  planSearchTerm = '';
  planStatusFilter = '';
  planPriceFilter = '';

  // Plan management
  selectedPlan: SubscriptionPlan | null = null;
  showPlanModal = false;
  showPlanWizard = false;
  isEditingPlan = false;

  // Plan form
  planForm: any = {
    name: '',
    description: '',
    price: 0,
    durationMonths: 1,
    maxTrips: 0,
    isActive: true,
    isTrialOnly: false,
    trialDays: 0,
    trialPrice: 0,
    discountPercent: 0,
    features: ''
  };

  currentStep = 1;

  // Stripe integration
  stripe: any = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private adminSubscriptionService: AdminSubscriptionService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.initializeStripe();
    this.loadSubscriptionPlans();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Cache management
  private clearCache(): void {
    this._cachedSubscriberCounts.clear();
    this._cachedTotalSubscribers = null;
    this._cachedMonthlyRevenue = null;
    this._cachedActivePlansCount = null;
  }

  // Stripe initialization
  private async initializeStripe(): Promise<void> {
    try {
      // Mock Stripe initialization - replace with actual implementation
      this.stripe = {}; // Mock stripe object
      this.isStripeLoaded = true;
      console.log('✅ Stripe initialized for subscription plan component');
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
    }
  }

  // Data loading
  loadSubscriptionPlans(): void {
    this.isLoading = true;
    // Mock data loading - replace with actual API call
    setTimeout(() => {
      this.subscriptionPlans = this.subscriptionPlans || [];
      this.isLoading = false;
      console.log('Subscription plans loaded:', this.subscriptionPlans);

      // Populate cache with subscriber counts from plan data
      this.populateSubscriberCountsFromPlans();
    }, 1000);
  }

  private populateSubscriberCountsFromPlans(): void {
    // Extract subscriber counts from plan data and populate cache
    this.subscriptionPlans.forEach(plan => {
      if (plan.id && plan.subscriberCount !== undefined) {
        this._cachedSubscriberCounts.set(plan.id, plan.subscriberCount);
      }
    });
    // Clear cache to trigger UI update
    this.clearCache();
  }

  // Plan CRUD operations
  addNewPlan(): void {
    this.resetPlanForm();
    this.isEditingPlan = false;
    this.showPlanWizard = true;
    this.currentStep = 1;
  }

  editPlan(plan: SubscriptionPlan): void {
    this.selectedPlan = plan;
    this.planForm = {
      name: plan.name,
      description: plan.description,
      price: plan.price,
      durationMonths: plan.durationMonths,
      maxTrips: plan.maxTrips,
      isActive: plan.isActive,
      isTrialOnly: plan.isTrialOnly,
      trialDays: plan.trialDays,
      trialPrice: plan.trialPrice,
      discountPercent: plan.discountPercent,
      features: plan.features
    };
    this.isEditingPlan = true;
    this.showPlanModal = true;
  }

  duplicatePlan(plan: SubscriptionPlan): void {
    this.planForm = {
      name: plan.name + ' (Copy)',
      description: plan.description,
      price: plan.price,
      durationMonths: plan.durationMonths,
      maxTrips: plan.maxTrips,
      isActive: false, // Duplicated plans start as inactive
      isTrialOnly: plan.isTrialOnly,
      trialDays: plan.trialDays,
      trialPrice: plan.trialPrice,
      discountPercent: plan.discountPercent,
      features: plan.features
    };
    this.isEditingPlan = false;
    this.showPlanWizard = true;
    this.currentStep = 1;
  }

  savePlan(): void {
    if (!this.isPlanFormValid()) {
      return;
    }

    this.isLoading = true;
    const planData = { ...this.planForm } as SubscriptionPlan;

    if (this.isEditingPlan && this.selectedPlan && this.selectedPlan.id != null) {
      const sub = this.subscriptionService
        .updateSubscriptionPlan(this.selectedPlan.id, planData)
        .subscribe({
          next: (updated: SubscriptionPlan) => {
            console.log('Plan updated:', updated);
            this.closePlanModal();
            this.closePlanWizard();
            this.planUpdated.emit();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to update plan:', err);
            this.isLoading = false;
          }
        });
      this.subscriptions.push(sub);
    } else {
      // For create, omit id if present
      const { id, ...createPayload } = planData as any;
      const sub = this.subscriptionService
        .createSubscriptionPlan(createPayload as any)
        .subscribe({
          next: (created: SubscriptionPlan) => {
            console.log('Plan created:', created);
            this.closePlanModal();
            this.closePlanWizard();
            this.planCreated.emit(created);
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to create plan:', err);
            this.isLoading = false;
          }
        });
      this.subscriptions.push(sub);
    }
  }

  deletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      this.isLoading = true;
      const sub = this.subscriptionService.deleteSubscriptionPlan(planId).subscribe({
        next: () => {
          console.log('Plan deleted:', planId);
          // Remove from local list immediately
          const index = this.subscriptionPlans.findIndex(p => p.id === planId);
          if (index >= 0) {
            this.subscriptionPlans.splice(index, 1);
          }
          this.planDeleted.emit(planId);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to delete plan:', err);
          const errorMessage = err?.error?.message || err?.message || 'Failed to delete plan';
          alert(`Error: ${errorMessage}`);
          this.isLoading = false;
        }
      });
      this.subscriptions.push(sub);
    }
  }

  // Stripe integration
  syncAllPlansWithStripe(): void {
    if (!this.isStripeLoaded) {
      alert('Stripe is not loaded yet. Please wait and try again.');
      return;
    }

    this.isLoading = true;
    const sub = this.adminSubscriptionService.syncAllPlansWithStripe().subscribe({
      next: (resp) => {
        console.log('All plans synced with Stripe:', resp);
        this.refreshPlansFromServer();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to sync all plans with Stripe:', err);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  syncPlanWithStripe(plan: SubscriptionPlan): void {
    if (!this.isStripeLoaded) {
      alert('Stripe is not loaded yet. Please wait and try again.');
      return;
    }

    this.isLoading = true;
    const sub = this.adminSubscriptionService.syncPlanWithStripe(plan.id!).subscribe({
      next: (resp) => {
        console.log('Plan synced with Stripe:', resp);
        // Update local cached plan
        const partial: Partial<SubscriptionPlan> = {
          id: plan.id,
          stripeSync: true,
          stripeProductId: (resp as any).stripeProductId ?? plan.stripeProductId,
          stripePriceId: (resp as any).stripePriceId ?? (plan as any).stripePriceId
        } as any;
        this.updatePlanInLocalList(partial);
        this.planUpdated.emit();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to sync plan with Stripe:', err);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  updateStripePrice(plan: SubscriptionPlan): void {
    if (!this.isStripeLoaded) {
      alert('Stripe is not loaded yet. Please wait and try again.');
      return;
    }

    const newPrice = Number(plan.price);
    if (!(newPrice > 0)) {
      alert('Please set a valid price before updating Stripe.');
      return;
    }

    this.isLoading = true;
    const sub = this.adminSubscriptionService.updateStripePrice(plan.id!, newPrice).subscribe({
      next: (resp) => {
        console.log('Stripe price updated:', resp);
        // Update local cached plan with new stripePriceId
        const partial: Partial<SubscriptionPlan> = {
          id: plan.id,
          stripePriceId: (resp as any).stripePriceId ?? plan.stripePriceId
        } as any;
        this.updatePlanInLocalList(partial);
        this.planUpdated.emit();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to update Stripe price:', err);
        const message: string | undefined = err?.error?.message || err?.message;
        // Auto-sync then retry if backend says not synced
        if (message && message.toLowerCase().includes('not synced')) {
          const syncSub = this.adminSubscriptionService.syncPlanWithStripe(plan.id!).subscribe({
            next: (syncResp) => {
              const partial: Partial<SubscriptionPlan> = {
                id: plan.id,
                stripeSync: true,
                stripeProductId: (syncResp as any).stripeProductId ?? (plan as any).stripeProductId,
                stripePriceId: (syncResp as any).stripePriceId ?? plan.stripePriceId
              } as any;
              this.updatePlanInLocalList(partial);
              // Retry update once after successful sync
              const retrySub = this.adminSubscriptionService.updateStripePrice(plan.id!, newPrice).subscribe({
                next: (retryResp) => {
                  const retryPartial: Partial<SubscriptionPlan> = {
                    id: plan.id,
                    stripePriceId: (retryResp as any).stripePriceId ?? partial.stripePriceId
                  } as any;
                  this.updatePlanInLocalList(retryPartial);
                  this.planUpdated.emit();
                  this.isLoading = false;
                },
                error: (retryErr) => {
                  console.error('Retry update Stripe price failed:', retryErr);
                  this.isLoading = false;
                }
              });
              this.subscriptions.push(retrySub);
            },
            error: (syncErr) => {
              console.error('Auto-sync before price update failed:', syncErr);
              this.isLoading = false;
            }
          });
          this.subscriptions.push(syncSub);
        } else {
          this.isLoading = false;
        }
      }
    });
    this.subscriptions.push(sub);
  }

  archiveStripeProduct(plan: SubscriptionPlan): void {
    if (!this.isStripeLoaded) {
      alert('Stripe is not loaded yet. Please wait and try again.');
      return;
    }

    if (confirm('Are you sure you want to archive this product from Stripe?')) {
      this.isLoading = true;
      const sub = this.adminSubscriptionService.archiveStripeProduct(plan.id!).subscribe({
        next: (resp) => {
          console.log('Product archived from Stripe:', resp);
          const partial: Partial<SubscriptionPlan> = { id: plan.id, stripeSync: false } as any;
          this.updatePlanInLocalList(partial);
          this.planUpdated.emit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to archive Stripe product:', err);
          this.isLoading = false;
        }
      });
      this.subscriptions.push(sub);
    }
  }

  private refreshPlansFromServer(): void {
    const sub = this.adminSubscriptionService.getAllPlans().subscribe({
      next: (plans) => {
        // Since subscriptionPlans is an @Input, we set the backing field directly
        this._subscriptionPlans = plans;
        this.clearCache();
      },
      error: (err) => {
        console.error('Failed to refresh plans from server:', err);
        // Fallback: notify parent to refresh
        this.planUpdated.emit();
      }
    });
    this.subscriptions.push(sub);
  }

  private updatePlanInLocalList(partial: Partial<SubscriptionPlan> & { id?: number }): void {
    if (!partial.id) return;
    const index = this.subscriptionPlans.findIndex(p => p.id === partial.id);
    if (index >= 0) {
      this.subscriptionPlans[index] = { ...this.subscriptionPlans[index], ...partial } as SubscriptionPlan;
    }
  }

  // Form management
  resetPlanForm(): void {
    this.planForm = {
      name: '',
      description: '',
      price: 0,
      durationMonths: 1,
      maxTrips: 0,
      isActive: true,
      isTrialOnly: false,
      trialDays: 0,
      trialPrice: 0,
      discountPercent: 0,
      features: ''
    };
  }

  isPlanFormValid(): boolean {
    const hasName = typeof this.planForm.name === 'string' && this.planForm.name.trim().length > 0;
    const hasDescription = typeof this.planForm.description === 'string' && this.planForm.description.trim().length > 0;
    const durationValid = Number(this.planForm.durationMonths) >= 1;
    const priceNumber = Number(this.planForm.price);
    const priceValid = this.planForm.isTrialOnly ? true : priceNumber > 0;
    return hasName && hasDescription && durationValid && priceValid;
  }

  // Wizard navigation
  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  closePlanModal(): void {
    this.showPlanModal = false;
    this.selectedPlan = null;
    this.resetPlanForm();
  }

  closePlanWizard(): void {
    this.showPlanWizard = false;
    this.currentStep = 1;
    this.resetPlanForm();
  }

  // Form helpers
  onTrialOnlyChange(): void {
    if (this.planForm.isTrialOnly) {
      this.planForm.price = 0;
      this.planForm.trialPrice = 0;
    }
  }

  onDurationChange(): void {
    // Auto-calculate discount based on duration
    this.calculateAutoDiscount();
  }

  onDiscountChange(): void {
    // Validate discount percentage
    if (this.planForm.discountPercent < 0) {
      this.planForm.discountPercent = 0;
    } else if (this.planForm.discountPercent > 100) {
      this.planForm.discountPercent = 100;
    }
  }

  calculateAutoDiscount(): void {
    if (this.planForm.durationMonths >= 12) {
      this.planForm.discountPercent = 20; // 20% off for annual plans
    } else if (this.planForm.durationMonths >= 6) {
      this.planForm.discountPercent = 10; // 10% off for 6-month plans
    } else {
      this.planForm.discountPercent = 0;
    }
  }

  getDiscountInfo(): string {
    // Deprecated return type kept for backward compatibility with any existing bindings
    const info = this.computeDiscountInfo();
    if (info.hasDiscount) {
      return `Save $${info.savings} (${this.planForm.discountPercent}% off)`;
    }
    return 'No discount applied';
  }

  // New helper to match original: returns rich discount info
  computeDiscountInfo(): { hasDiscount: boolean; monthlyEquivalent: string; savings: string } {
    const priceNumber = Number(this.planForm.price) || 0;
    const duration = Number(this.planForm.durationMonths) || 1;
    const discount = Number(this.planForm.discountPercent) || 0;
    const monthly = duration > 0 ? priceNumber / duration : 0;
    const savings = discount > 0 ? (priceNumber * discount) / 100 : 0;
    return {
      hasDiscount: discount > 0,
      monthlyEquivalent: monthly.toFixed(2),
      savings: savings.toFixed(2)
    };
  }

  onDurationMonthsChange(newValue: number): void {
    this.planForm.durationMonths = Number(newValue) || 1;
    this.onDurationChange();
  }

  onPriceChange(): void {
    // Hook for future validations/side-effects on price change
  }

  onTrialDaysChange(): void {
    if (this.planForm.trialDays < 0) {
      this.planForm.trialDays = 0;
    }
  }

  toggleTrialOnlyMode(): void {
    this.planForm.isTrialOnly = !this.planForm.isTrialOnly;
    this.onTrialOnlyChange();
  }

  // Filtering and search
  get filteredPlans(): SubscriptionPlan[] {
    let filtered = this.subscriptionPlans;

    if (this.planSearchTerm) {
      const searchTerm = this.planSearchTerm.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm) ||
        plan.description.toLowerCase().includes(searchTerm)
      );
    }

    if (this.planStatusFilter) {
      filtered = filtered.filter(plan => {
        if (this.planStatusFilter === 'active') return plan.isActive;
        if (this.planStatusFilter === 'inactive') return !plan.isActive;
        return true;
      });
    }

    if (this.planPriceFilter) {
      filtered = filtered.filter(plan => {
        const price = plan.price;
        switch (this.planPriceFilter) {
          case '0-50': return price >= 0 && price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100+': return price > 100;
          default: return true;
        }
      });
    }

    return filtered;
  }

  clearPlanFilters(): void {
    this.planSearchTerm = '';
    this.planStatusFilter = '';
    this.planPriceFilter = '';
  }

  // Utility methods
  getSubscriberCount(planId: number): number {
    if (this._cachedSubscriberCounts.has(planId)) {
      return this._cachedSubscriberCounts.get(planId)!;
    }

    // Return 0 if not loaded yet (will be populated by loadAllSubscriberCounts)
    return 0;
  }


  getActivePlansCount(): number {
    if (this._cachedActivePlansCount !== null) {
      return this._cachedActivePlansCount;
    }

    const count = this.subscriptionPlans.filter(plan => plan.isActive).length;
    this._cachedActivePlansCount = count;
    return count;
  }

  getTotalSubscribers(): number {
    if (this._cachedTotalSubscribers !== null) {
      return this._cachedTotalSubscribers;
    }

    // Calculate total from cached counts
    const total = Array.from(this._cachedSubscriberCounts.values()).reduce((sum, count) => sum + count, 0);
    this._cachedTotalSubscribers = total;
    return total;
  }

  getMonthlyRevenue(): number {
    if (this._cachedMonthlyRevenue !== null) {
      return this._cachedMonthlyRevenue;
    }

    const revenue = this.subscriptionPlans.reduce((total, plan) => {
      const subscribers = this.getSubscriberCount(plan.id!);
      const monthlyPrice = plan.price / plan.durationMonths;
      return total + (subscribers * monthlyPrice);
    }, 0);

    this._cachedMonthlyRevenue = revenue;
    return revenue;
  }

  getPlanSavings(plan: SubscriptionPlan): number {
    if (plan.discountPercent && plan.discountPercent > 0) {
      return (plan.price * plan.discountPercent) / 100;
    }
    return 0;
  }

  getMonthlyEquivalent(plan: SubscriptionPlan): number {
    return plan.price / plan.durationMonths;
  }

  getStripeSyncStatus(plan: SubscriptionPlan): string {
    const synced = this.isPlanSyncedWithStripe(plan);
    return synced ? 'Synced' : 'Not Synced';
  }

  isPlanSyncedWithStripe(plan: SubscriptionPlan): boolean {
    // Consider plan synced if explicit flag true OR stripe ids exist
    const hasIds = Boolean((plan as any).stripeProductId || (plan as any).stripePriceId);
    return Boolean((plan as any).stripeSync) || hasIds;
  }

  canUpdateStripePrice(plan: SubscriptionPlan): boolean {
    return this.isPlanSyncedWithStripe(plan) && !!(plan as any).stripePriceId;
  }

  getStripeDashboardUrl(plan: SubscriptionPlan): string {
    return `https://dashboard.stripe.com/products/${plan.stripeProductId}`;
  }

  openStripeDashboard(plan: SubscriptionPlan): void {
    window.open(this.getStripeDashboardUrl(plan), '_blank');
  }

  // Vendor subscription methods
  onVendorSubscribe(plan: SubscriptionPlan): void {
    console.log('Vendor subscription requested for plan:', plan);
    this.planSubscriptionRequested.emit(plan);
    // TODO: Implement vendor subscription flow
    // This will be integrated in the next story card
  }

  canVendorSubscribe(plan: SubscriptionPlan): boolean {
    // Vendors can subscribe to active plans (both trial and paid), but not if already subscribed to this plan
    if (!plan.isActive) return false;

    // Check if this is the current active plan
    if (this.activeSubscription && this.activeSubscription.planId === plan.id) {
      return false; // Already the current active plan
    }

    return true; // Can subscribe (not the current active plan)
  }

  getVendorSubscriptionStatus(plan: SubscriptionPlan): string | null {
    const subscription = this.getVendorSubscription(plan);
    return subscription ? subscription.status : null;
  }

  getVendorSubscription(plan: SubscriptionPlan): VendorSubscription | null {
    // If this is the current active plan, return it
    if (this.activeSubscription && this.activeSubscription.planId === plan.id) {
      return this.activeSubscription;
    }

    // Find the most recent subscription for this plan
    // Priority: ACTIVE > CANCELLED > EXPIRED
    const subscriptions = this.vendorSubscriptions.filter(sub => sub.planId === plan.id);

    if (subscriptions.length === 0) {
      return null;
    }

    if (subscriptions.length === 1) {
      return subscriptions[0];
    }

    // Multiple subscriptions - prioritize by status
    const activeSub = subscriptions.find(sub => sub.status === 'ACTIVE');
    if (activeSub) return activeSub;

    const cancelledSub = subscriptions.find(sub => sub.status === 'CANCELLED');
    if (cancelledSub) return cancelledSub;

    const expiredSub = subscriptions.find(sub => sub.status === 'EXPIRED');
    if (expiredSub) return expiredSub;

    // Fallback: return the most recent one (by ID, assuming higher ID = more recent)
    return subscriptions.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
  }

  isCancelling = false;

  cancelVendorSubscription(plan: SubscriptionPlan): void {
    const subscription = this.getVendorSubscription(plan);
    if (!subscription) {
      console.error('No subscription found for plan:', plan.id);
      return;
    }

    if (confirm(`Are you sure you want to cancel your subscription to "${plan.name}"?`)) {
      this.isCancelling = true;

      this.subscriptionService.cancelSubscription(subscription.id!).subscribe({
        next: () => {
          console.log('Subscription cancelled successfully');
          this.isCancelling = false;
          // Emit event to parent to refresh subscriptions
          this.planSubscriptionCancelled.emit(plan);
          alert('Subscription cancelled successfully!');
        },
        error: (err) => {
          console.error('Failed to cancel subscription:', err);
          this.isCancelling = false;
          alert('Failed to cancel subscription: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  // Step helpers
  getStepTitle(step?: number): string {
    const titles = ['Basic Info', 'Pricing & Billing', 'Features & Limits', 'Review'];
    const index = (step ?? this.currentStep) - 1;
    return titles[index] || 'Unknown';
  }

  getStepDescription(step?: number): string {
    const descriptions = [
      'Enter basic plan information',
      'Set pricing, billing cycle, trial and discounts',
      'Configure features and plan status',
      'Review and confirm plan details'
    ];
    const index = (step ?? this.currentStep) - 1;
    return descriptions[index] || '';
  }

  getCancellationReasonDisplay(reason?: string): string {
    if (!reason) return '';

    const reasonMap: { [key: string]: string } = {
      'TRIAL_SUPERSEDED_BY_PAID': 'Trial superseded by paid plan',
      'SUPERSEDED_BY_HIGHER_PRIORITY_PLAN': 'Superseded by higher priority plan',
      'MANUAL_CANCELLATION': 'Manually cancelled',
      'AUTO_CANCELLED': 'Auto-cancelled'
    };

    return reasonMap[reason] || reason;
  }
}
