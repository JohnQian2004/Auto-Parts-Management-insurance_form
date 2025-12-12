export interface SubscriptionPlan {
    id?: number;
    name: string;
    description: string;
    price: number;
    durationMonths: number;
    maxTrips?: number;
    features?: string;
    isActive: boolean;
    createdAt?: string;
    stripeProductId?: string;
    stripePriceId?: string;
    stripeSync?: boolean;
    lastSyncDate?: string;
    billingCycle?: string;
    trialDays?: number;
    trialPrice?: number;
    isTrialOnly?: boolean;
    discountPercent?: number;
    subscriberCount?: number;
}

export function getMonthlyRevenue(plan: SubscriptionPlan): number {
    if (plan.durationMonths === 12) {
        return plan.price / 12;
    }
    return plan.price;
}