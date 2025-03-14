/**
 * Subscription Types
 */

import { PricingPeriod, PricingTier } from './plans';

// User subscription
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  tier: PricingTier;
  period: PricingPeriod;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription status
export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

// Payment history
export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string;
  paymentIntentId?: string;
  receiptUrl?: string;
  createdAt: string;
}

// Payment status
export type PaymentStatus = 
  | 'succeeded'
  | 'processing'
  | 'requires_payment_method'
  | 'requires_action'
  | 'canceled'
  | 'failed';

// Component props
export interface SubscriptionDisplayProps {
  subscription: Subscription;
  className?: string;
}

// Payment history props
export interface PaymentHistoryProps {
  payments: Payment[];
  className?: string;
}