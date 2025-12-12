export interface SubscriptionFlowStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  order: number;
}

export enum SubscriptionStep {
  PLAN_SELECTION = 'plan_selection',
  PAYMENT_INFO = 'payment_info',
  CONFIRMATION = 'confirmation',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}