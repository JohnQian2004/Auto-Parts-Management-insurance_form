import { User } from '../services/auth.service';
import { SubscriptionPlan } from './SubscriptionPlan';

export class VendorSubscription {
    id?: number;
    vendorId!: number;
    planId!: number;
    startDate!: string; // YYYY-MM-DD
    endDate!: string; // YYYY-MM-DD
    status: string = 'ACTIVE';
    paymentIntentId?: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    paymentMethodId?: string;
    trialStartDate?: string;
    trialEndDate?: string;
    createdAt?: string;
    updatedAt?: string;
    cancellationReason?: string;
    supersededBySubscriptionId?: number;
    
    // Plan information from DTO
    planName?: string;
    planDescription?: string;
    planPrice?: number;
    
    // Populated objects (when returned from backend with joins)
    vendor?: User;
    plan?: SubscriptionPlan;
}