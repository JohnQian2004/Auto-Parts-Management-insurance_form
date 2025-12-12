export interface SubscriptionPayment {
  id: number;
  vendorSubscriptionId: number;
  amount: number;
  currency: string;
  paymentStatus: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  paymentIntentId?: string;
  paymentMethodType?: string;
  paymentMethodLast4?: string;
  processedAt?: string;
  createdAt?: string;
  metadata?: any;
}


