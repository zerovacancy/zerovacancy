
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
