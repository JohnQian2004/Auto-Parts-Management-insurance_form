export interface UsageMetrics {
  vendorId: number;
  subscriptionId: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  tripsCreated: number;
  tripsPublished: number;
  maxTripsAllowed: number;
  apiCallsUsed: number;
  maxApiCallsAllowed: number;
  storageUsedMB: number;
  maxStorageAllowedMB: number;
  lastUpdated: string;
}

export interface UsageSummary {
  tripsUsagePercentage: number;
  apiUsagePercentage: number;
  storageUsagePercentage: number;
  isNearLimit: boolean;
  warningThreshold: number;
}