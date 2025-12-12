export interface CreateSubscriptionRequest {
  planId: number;
  paymentMethodId?: string;
  billingAddress?: BillingAddress;
  promoCode?: string;
  trialDays?: number;
  metadata?: { [key: string]: string };
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SubscriptionResponse {
  subscription: VendorSubscription;
  clientSecret?: string;
  requiresAction?: boolean;
  paymentIntentStatus?: string;
  error?: string;
}

export interface VendorSubscription {
  id: number;
  vendorId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  paymentIntentId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt?: string;
}