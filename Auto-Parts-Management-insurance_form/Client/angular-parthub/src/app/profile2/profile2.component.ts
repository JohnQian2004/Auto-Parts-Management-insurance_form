import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { countries, Country, getCountryDisplayName } from '../data/countries';
import { Booking } from '../models/Booking';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { VendorSubscription } from '../models/VendorSubscription';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { SubscriptionPaymentService } from '../services/subscription-payment.service';
import { SubscriptionService } from '../services/subscription.service';
import { VendorSubscriptionService } from '../services/vendor-subscription.service';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface ShippingAddress {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface BookingItem {
  id: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  vendorName: string;
}

interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  vendorName: string;
}

@Component({
  selector: 'app-profile2',
  templateUrl: './profile2.component.html',
  styleUrls: ['./profile2.component.css']
})
export class Profile2Component implements OnInit, OnDestroy {
  user: UserProfile | null = null;
  bookings: Booking[] = []; // Using bookings instead of orders
  shippingAddresses: ShippingAddress[] = [];
  vendorSubscriptions: VendorSubscription[] = []; // Vendor subscription history
  countries: Country[] = countries;
  loading = true;
  profileLoading = false;
  bookingsLoading = false; // Loading state for bookings
  passwordLoading = false;
  usernameLoading = false;
  addressesLoading = false;
  subscriptionsLoading = false; // Loading state for vendor subscriptions

  // Payment details properties
  subscriptionPaymentDetails: { [key: number]: any } = {};
  showPaymentDetails: { [key: number]: boolean } = {};
  loadingPaymentDetails: { [key: number]: boolean } = {};

  // My Subscriptions properties (cloned from admin2-vendor)
  subscriptionPlans: SubscriptionPlan[] = [];
  activeSubscription: VendorSubscription | null = null;
  isSubscribing = false;
  showPaymentModalFlag = false;
  selectedPlanForPayment: SubscriptionPlan | null = null;
  paymentError: string | null = null;

  // Forms
  profileForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  usernameForm: FormGroup = new FormGroup({});
  addressForm: FormGroup = new FormGroup({});

  // UI States
  activeTab = 'profile';
  showPasswordForm = false;
  showUsernameForm = false;
  showAddressForm = false;
  editingAddress: ShippingAddress | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private bookingService: BookingService, // Added BookingService
    private authService: AuthService,
    private vendorSubscriptionService: VendorSubscriptionService,
    private subscriptionService: SubscriptionService,
    private subscriptionPaymentService: SubscriptionPaymentService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute // Added ActivatedRoute
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadBookings(); // Load bookings
    this.loadShippingAddresses();

    // Load vendor subscriptions if user is a vendor
    if (this.isVendor()) {
      this.loadVendorSubscriptions();
      // Note: loadSubscriptionPlans will be called after user profile is loaded
    }

    // Check for tab parameter in query params
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'bookings') {
        this.setActiveTab('bookings');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: [''],
      gender: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.usernameForm = this.fb.group({
      newUsername: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      currentPassword: ['', [Validators.required]]
    });

    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      isDefault: [false]
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUserProfile(): void {
    this.profileLoading = true;
    const token = localStorage.getItem('token');

    if (!token) {
      this.loading = false;
      this.profileLoading = false;
      return;
    }

    this.subscriptions.push(
      this.api.getUserProfile().subscribe({
        next: (response) => {
          this.user = response;
          this.populateProfileForm();
          this.profileLoading = false;
          this.loading = false;

          // Load subscription plans after user profile is loaded
          if (this.isVendor()) {
            this.loadSubscriptionPlans();
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          // Handle 404 error gracefully
          if (error.status === 404) {
            // Try to get user info from localStorage as fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              this.user = JSON.parse(storedUser);
              this.populateProfileForm();

              // Load subscription plans after user profile is loaded from localStorage
              if (this.isVendor()) {
                this.loadSubscriptionPlans();
              }
            }
          }
          this.profileLoading = false;
          this.loading = false;
        }
      })
    );
  }

  loadBookings(): void {
    this.bookingsLoading = true;
    const token = localStorage.getItem('token');

    if (!token) {
      this.bookingsLoading = false;
      return;
    }

    // Get the current user ID
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = currentUser.id;

    if (!customerId) {
      this.bookingsLoading = false;
      return;
    }

    this.subscriptions.push(
      this.bookingService.getBookingsByCustomer(customerId).subscribe({
        next: (response) => {
          this.bookings = response || []; // This is now bookings
          this.bookingsLoading = false;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.bookingsLoading = false;
        }
      })
    );
  }

  loadBookingsTab(): void {
    this.loadBookings();
  }

  loadShippingAddresses(): void {
    this.addressesLoading = true;
    const token = localStorage.getItem('token');

    if (!token) {
      this.addressesLoading = false;
      return;
    }

    this.subscriptions.push(
      this.api.getShippingAddresses().subscribe({
        next: (response) => {
          this.shippingAddresses = response || [];
          this.addressesLoading = false;
        },
        error: (error) => {
          console.error('Error loading shipping addresses:', error);
          this.addressesLoading = false;
        }
      })
    );
  }

  private populateProfileForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone || '',
        dateOfBirth: this.user.dateOfBirth || '',
        gender: this.user.gender || ''
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.profileLoading = true;
      const profileData = this.profileForm.value;

      this.subscriptions.push(
        this.api.updateUserProfile(profileData).subscribe({
          next: (response) => {
            this.user = { ...this.user, ...response };
            this.profileLoading = false;
            // You can add a toast notification here
            console.log('Profile updated successfully');
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            // Handle 404 error gracefully
            if (error.status === 404) {
              // Update localStorage as fallback
              if (this.user) {
                const updatedUser = { ...this.user, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                this.user = updatedUser;
                console.log('Profile updated in localStorage');
              }
            }
            this.profileLoading = false;
            // You can add a toast notification here
            console.error('Error updating profile');
          }
        })
      );
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.passwordLoading = true;
      const passwordData = this.passwordForm.value;

      this.subscriptions.push(
        this.api.changePassword(passwordData).subscribe({
          next: () => {
            this.passwordLoading = false;
            this.showPasswordForm = false;
            this.passwordForm.reset();
            // You can add a toast notification here
            console.log('Password changed successfully');
          },
          error: (error) => {
            console.error('Error changing password:', error);
            // Handle 404 error gracefully
            if (error.status === 404) {
              console.log('Password change endpoint not available, simulating success');
              // Simulate success for demo purposes
              this.passwordLoading = false;
              this.showPasswordForm = false;
              this.passwordForm.reset();
              console.log('Password change simulated successfully');
            } else {
              this.passwordLoading = false;
              // You can add a toast notification here
              console.error('Error changing password');
            }
          }
        })
      );
    }
  }

  changeUsername(): void {
    if (this.usernameForm.valid) {
      this.usernameLoading = true;
      const usernameData = this.usernameForm.value;

      this.subscriptions.push(
        this.api.changeUsername(usernameData).subscribe({
          next: (response) => {
            this.user = { ...this.user, ...response };
            this.usernameLoading = false;
            this.showUsernameForm = false;
            this.usernameForm.reset();
            // You can add a toast notification here
            console.log('Username changed successfully');
          },
          error: (error) => {
            console.error('Error changing username:', error);
            // Handle 404 error gracefully
            if (error.status === 404) {
              // Update localStorage as fallback
              if (this.user) {
                const updatedUser = { ...this.user, username: usernameData.newUsername };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                this.user = updatedUser;
                console.log('Username updated in localStorage');
              }
              this.usernameLoading = false;
              this.showUsernameForm = false;
              this.usernameForm.reset();
            } else {
              this.usernameLoading = false;
              // You can add a toast notification here
              console.error('Error changing username');
            }
          }
        })
      );
    }
  }

  addShippingAddress(): void {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;

      this.subscriptions.push(
        this.api.addShippingAddress(addressData).subscribe({
          next: () => {
            this.loadShippingAddresses();
            this.showAddressForm = false;
            this.addressForm.reset();
            console.log('Shipping address added successfully');
          },
          error: (error) => {
            console.error('Error adding shipping address:', error);
            console.error('Failed to add shipping address');
          }
        })
      );
    }
  }

  updateShippingAddress(): void {
    if (this.addressForm.valid && this.editingAddress) {
      const addressData = this.addressForm.value;

      this.subscriptions.push(
        this.api.updateShippingAddress(this.editingAddress.id, addressData).subscribe({
          next: () => {
            this.loadShippingAddresses();
            this.showAddressForm = false;
            this.editingAddress = null;
            this.addressForm.reset();
            console.log('Shipping address updated successfully');
          },
          error: (error) => {
            console.error('Error updating shipping address:', error);
            console.error('Failed to update shipping address');
          }
        })
      );
    }
  }

  deleteShippingAddress(addressId: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.subscriptions.push(
        this.api.deleteShippingAddress(addressId).subscribe({
          next: () => {
            this.loadShippingAddresses();
            console.log('Shipping address deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting shipping address:', error);
            console.error('Failed to delete shipping address');
          }
        })
      );
    }
  }

  editAddress(address: ShippingAddress): void {
    this.editingAddress = address;
    this.addressForm.patchValue({
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    this.showAddressForm = true;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }

  toggleUsernameForm(): void {
    this.showUsernameForm = !this.showUsernameForm;
    if (!this.showUsernameForm) {
      this.usernameForm.reset();
    }
  }

  toggleAddressForm(): void {
    this.showAddressForm = !this.showAddressForm;
    if (!this.showAddressForm) {
      this.editingAddress = null;
      this.addressForm.reset();
    }
  }

  getBookingStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge bg-warning';
      case 'confirmed': return 'badge bg-info';
      case 'paid': return 'badge bg-primary';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getBookingStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'paid': 'Paid',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return statusMap[status.toLowerCase()] || status;
  }

  viewBookingDetails(booking: Booking): void {
    // Navigate to booking details page
    this.router.navigate(['/booking-detail', booking.id]);
  }

  getInitials(): string {
    if (this.user) {
      return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }

  getFullName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
  }

  getCountryDisplayName(countryCode: string): string {
    return getCountryDisplayName(countryCode);
  }

  viewOrderDetails(booking: Booking): void {
    // Navigate to booking details page
    this.router.navigate(['/booking-detail', booking.id]);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // You can add navigation to login page here
    window.location.reload();
  }

  // Vendor-related methods
  isVendor(): boolean {
    return this.authService.getUserRole() === 'VENDOR';
  }

  loadVendorSubscriptions(): void {
    this.subscriptionsLoading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.subscriptionsLoading = false;
      return;
    }

    this.subscriptions.push(
      this.vendorSubscriptionService.getVendorSubscriptions(currentUser.id).subscribe({
        next: (subscriptions) => {
          console.log('Loaded vendor subscriptions:', subscriptions);
          subscriptions.forEach(sub => {
            console.log(`Subscription ${sub.id}: planName=${sub.planName}, planPrice=${sub.planPrice}, plan=${sub.plan}`);
          });
          this.vendorSubscriptions = subscriptions;
          this.subscriptionsLoading = false;
        },
        error: (error) => {
          console.error('Error loading vendor subscriptions:', error);
          this.subscriptionsLoading = false;
        }
      })
    );
  }

  getSubscriptionStatusBadge(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge bg-success';
      case 'CANCELLED':
        return 'badge bg-danger';
      case 'EXPIRED':
        return 'badge bg-warning';
      case 'TRIAL':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getSubscriptionDuration(subscription: VendorSubscription): string {
    if (!subscription.startDate || !subscription.endDate) {
      return 'N/A';
    }

    const start = new Date(subscription.startDate);
    const end = new Date(subscription.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  trackBySubscription(index: number, subscription: VendorSubscription): number {
    return subscription.id || index;
  }

  getActiveSubscriptionsCount(): number {
    return this.vendorSubscriptions.filter(sub => sub.status === 'ACTIVE').length;
  }

  getTrialSubscriptionsCount(): number {
    return this.vendorSubscriptions.filter(sub => sub.status === 'TRIAL' || sub.plan?.isTrialOnly).length;
  }

  getCancelledSubscriptionsCount(): number {
    return this.vendorSubscriptions.filter(sub => sub.status === 'CANCELLED').length;
  }

  // Payment details methods
  loadPaymentDetails(subscription: VendorSubscription): void {
    if (!subscription.id) return;

    this.loadingPaymentDetails[subscription.id] = true;

    // Try dedicated subscription payments API first
    this.subscriptionPaymentService.getLatestBySubscription(subscription.id).subscribe((sp) => {
      if (sp) {
        this.subscriptionPaymentDetails[subscription.id!] = {
          id: sp.id,
          amount: sp.amount,
          currency: sp.currency,
          status: sp.paymentStatus,
          paymentMethodType: sp.paymentMethodType,
          paymentMethodLast4: sp.paymentMethodLast4,
          stripeCustomerId: sp.stripeCustomerId,
          stripePaymentMethodId: sp.stripePaymentMethodId,
          paymentIntentId: sp.paymentIntentId,
          processedAt: sp.processedAt || sp.createdAt,
          createdAt: sp.createdAt,
          metadata: sp.metadata
        };
        this.showPaymentDetails[subscription.id!] = true;
        this.loadingPaymentDetails[subscription.id!] = false;
      } else {
        // Fallback to legacy payment-details endpoint
        this.vendorSubscriptionService.getPaymentDetailsBySubscription(subscription.id!).subscribe({
          next: (details) => {
            this.subscriptionPaymentDetails[subscription.id!] = details;
            this.showPaymentDetails[subscription.id!] = true;
            this.loadingPaymentDetails[subscription.id!] = false;
          },
          error: () => {
            this.loadingPaymentDetails[subscription.id!] = false;
            this.subscriptionPaymentDetails[subscription.id!] = {
              status: subscription.status,
              amount: subscription.planPrice || 0,
              currency: 'USD',
              interval: subscription.planName || 'N/A',
              error: 'Payment details not found'
            };
            this.showPaymentDetails[subscription.id!] = true;
          }
        });
      }
    });
  }

  togglePaymentDetails(subscriptionId: number): void {
    this.showPaymentDetails[subscriptionId] = !this.showPaymentDetails[subscriptionId];
  }

  getPaymentStatusBadge(status: string): string {
    switch (status) {
      case 'PAID':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
        return 'badge bg-danger';
      case 'CANCELLED':
        return 'badge bg-secondary';
      default:
        return 'badge bg-info';
    }
  }

  // ===== MY SUBSCRIPTIONS METHODS (cloned from admin2-vendor) =====

  loadSubscriptionPlans(): void {
    console.log('loadSubscriptionPlans called, user:', this.user);

    if (!this.user?.id) {
      console.error('User not loaded when trying to load subscription plans');
      return;
    }

    this.vendorSubscriptionService.getVendorSubscriptionPlans().subscribe({
      next: (plans: SubscriptionPlan[]) => {
        this.subscriptionPlans = plans;
        console.log('Subscription plans loaded with subscriber counts:', plans);
      },
      error: (error: any) => {
        console.error('Error loading subscription plans:', error);
      }
    });
  }

  onSubscribeToPlan(plan: SubscriptionPlan): void {
    console.log('onSubscribeToPlan called with:', {
      plan: plan,
      user: this.user,
      userId: this.user?.id
    });

    if (!this.user?.id) {
      console.error('User ID not available:', {
        user: this.user,
        userId: this.user?.id
      });
      alert('User ID not available. Please wait for profile to load.');
      return;
    }

    this.isSubscribing = true;

    // Treat as trial when explicitly trial-only, or has trial days with free trial price, or plan price is zero
    const isTrialFlow = Boolean(
      plan.isTrialOnly ||
      ((plan.trialDays || 0) > 0 && (plan.trialPrice === undefined || plan.trialPrice === null || plan.trialPrice === 0)) ||
      (plan.price !== undefined && plan.price !== null && plan.price === 0)
    );

    if (isTrialFlow) {
      // Handle trial-only plans (no Stripe required)
      this.subscriptionService.createVendorSubscription(
        this.user.id,
        plan.id!,
        new Date().toISOString().split('T')[0]
      ).subscribe({
        next: (subscription) => {
          console.log('Trial subscription created:', subscription);
          this.activeSubscription = subscription;
          this.isSubscribing = false;
          alert('Trial subscription started successfully!');
          this.loadVendorSubscriptions(); // Refresh subscriptions
        },
        error: (err) => {
          console.error('Failed to create trial subscription:', err);
          alert('Failed to start trial: ' + (err.error?.message || err.message));
          this.isSubscribing = false;
        }
      });
    } else {
      // Handle paid plans (requires Stripe integration)
      console.log('Calling showPaymentModal with plan:', plan);
      this.showPaymentModal(plan);
    }
  }

  // UI helper methods
  canSubscribeToPlan(plan: SubscriptionPlan): boolean {
    // Can't subscribe if already have active subscription
    if (this.activeSubscription) return false;

    // Can't subscribe if already subscribed to this plan
    if (this.vendorSubscriptions.some(sub => sub.planId === plan.id && sub.status === 'ACTIVE')) {
      return false;
    }

    return true;
  }

  getSubscriptionStatus(): string {
    if (!this.activeSubscription) {
      return 'No active subscription';
    }
    return this.activeSubscription.status === 'ACTIVE' ? 'Active' : 'Inactive';
  }

  getPlanDisplayPrice(plan: SubscriptionPlan): string {
    if (plan.isTrialOnly || (plan.trialDays && plan.trialDays > 0)) {
      return 'Free Trial';
    }
    return plan.price ? `$${plan.price.toFixed(2)}` : 'Free';
  }

  getActiveSubscriptionByVendor(): VendorSubscription | null {
    return this.activeSubscription;
  }

  // Payment modal methods
  showPaymentModal(plan: SubscriptionPlan): void {
    console.log('showPaymentModal called with plan:', plan);
    this.selectedPlanForPayment = plan;
    this.showPaymentModalFlag = true;
    this.paymentError = null;
    console.log('selectedPlanForPayment set to:', this.selectedPlanForPayment);
  }

  hidePaymentModal(): void {
    this.showPaymentModalFlag = false;
    this.selectedPlanForPayment = null;
    this.paymentError = null;
  }

  onPaymentSuccess(paymentData: any): void {
    console.log('Payment successful:', paymentData);
    console.log('selectedPlanForPayment before createPaidSubscription:', this.selectedPlanForPayment);

    // Store the plan before hiding the modal
    const plan = this.selectedPlanForPayment;
    this.hidePaymentModal();

    // Create subscription with the stored plan
    this.createPaidSubscriptionWithPlan(paymentData, plan);
  }

  onPaymentError(error: string): void {
    console.error('Payment error:', error);
    this.paymentError = error;
  }

  onPaymentCancel(): void {
    console.log('Payment cancelled');
    this.hidePaymentModal();
  }

  createPaidSubscription(paymentMethod: any): void {
    console.log('createPaidSubscription called with:', {
      user: this.user,
      userId: this.user?.id,
      selectedPlan: this.selectedPlanForPayment,
      paymentMethod: paymentMethod
    });

    if (!this.user?.id || !this.selectedPlanForPayment) {
      console.error('Missing user ID or selected plan:', {
        user: this.user,
        userId: this.user?.id,
        selectedPlan: this.selectedPlanForPayment
      });
      alert('Missing user ID or selected plan');
      return;
    }

    this.isSubscribing = true;

    this.subscriptionService.createPaidVendorSubscription({
      vendorId: this.user.id,
      planId: this.selectedPlanForPayment.id!,
      paymentMethodId: paymentMethod.id,
      startDate: new Date().toISOString().split('T')[0]
    }).subscribe({
      next: (response) => {
        console.log('Paid subscription created:', response);
        this.activeSubscription = response.vendorSubscription;
        this.isSubscribing = false;
        alert('Paid subscription started successfully!');
        this.loadVendorSubscriptions(); // Refresh subscriptions
      },
      error: (err) => {
        console.error('Failed to create paid subscription:', err);
        alert('Failed to start paid subscription: ' + (err.error?.message || err.message));
        this.isSubscribing = false;
      }
    });
  }

  createPaidSubscriptionWithPlan(paymentData: any, plan: SubscriptionPlan | null): void {
    console.log('createPaidSubscriptionWithPlan called with:', {
      user: this.user,
      userId: this.user?.id,
      plan: plan,
      paymentData: paymentData
    });

    if (!this.user?.id || !plan) {
      console.error('Missing user ID or plan:', {
        user: this.user,
        userId: this.user?.id,
        plan: plan
      });
      alert('Missing user ID or selected plan');
      return;
    }

    // Extract payment method from the payment data object
    const paymentMethod = paymentData.paymentMethod;
    if (!paymentMethod || !paymentMethod.id) {
      console.error('Invalid payment method data:', paymentData);
      alert('Invalid payment method data');
      return;
    }

    this.isSubscribing = true;

    this.subscriptionService.createPaidVendorSubscription({
      vendorId: this.user.id,
      planId: plan.id!,
      paymentMethodId: paymentMethod.id,
      startDate: new Date().toISOString().split('T')[0]
    }).subscribe({
      next: (response) => {
        console.log('Paid subscription created:', response);
        this.activeSubscription = response.vendorSubscription;
        this.isSubscribing = false;
        alert('Paid subscription started successfully!');
        this.loadVendorSubscriptions(); // Refresh subscriptions
      },
      error: (err) => {
        console.error('Failed to create paid subscription:', err);
        alert('Failed to start paid subscription: ' + (err.error?.message || err.message));
        this.isSubscribing = false;
      }
    });
  }

  // Vendor subscription handlers
  onVendorSubscriptionRequested(plan: SubscriptionPlan): void {
    console.log('Vendor subscription requested for plan:', plan);
    this.onSubscribeToPlan(plan);
  }

  onVendorSubscriptionCancelled(plan: SubscriptionPlan): void {
    console.log('Vendor subscription cancelled for plan:', plan);
    this.loadVendorSubscriptions();
  }

  // Additional methods needed for the template
  onPlanCreated(plan: SubscriptionPlan): void {
    console.log('Plan created:', plan);
    this.loadSubscriptionPlans();
  }

  onPlanDeleted(planId: number): void {
    console.log('Plan deleted:', planId);
    this.loadSubscriptionPlans();
  }

} 