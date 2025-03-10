
export interface PricingPlanProps {
  title: string;
  price?: number;
  features: PricingFeature[];
  showPopular?: boolean;
  color?: string;
}

export interface PricingFeature {
  text: string;
  primary?: boolean;
  category?: string;
  tooltip?: string;
}

export interface PricingCardProps {
  title: string;
  price: number;
  interval: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  color?: any;
  highlighted?: boolean;
  showPopularTag?: boolean;
  valueProposition?: string;
  footerText?: string;
  isCurrentPlan?: boolean;
  savings?: number | null;
  billingPeriod?: "monthly" | "annually";
}
