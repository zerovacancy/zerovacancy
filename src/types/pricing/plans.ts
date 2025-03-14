/**
 * Pricing Plan Types
 */

import { PricingFeature } from './features';

// Basic pricing plan
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PricingFeature[];
  isPopular?: boolean;
  color?: string;
  buttonText?: string;
}

// Pricing period options
export type PricingPeriod = 'monthly' | 'yearly';

// Pricing tier type
export type PricingTier = 'basic' | 'pro' | 'premium';

// Pricing component props
export interface PricingCardProps {
  plan: PricingPlan;
  period: PricingPeriod;
  className?: string;
  onSelect?: (plan: PricingPlan) => void;
  isSelected?: boolean;
}

// Pricing section props
export interface PricingProps {
  plans: PricingPlan[];
  className?: string;
}

// Pricing toggle props
export interface PricingToggleProps {
  period: PricingPeriod;
  onChange: (period: PricingPeriod) => void;
  className?: string;
}