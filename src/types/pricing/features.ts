/**
 * Pricing Feature Types
 */

// Basic feature definition
export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  highlight?: boolean;
  isNew?: boolean;
  value?: string; // For quantifiable features (e.g., "10GB")
}

// Feature comparison types
export interface FeatureComparison {
  featureId: string;
  tierValues: {
    basic?: string | boolean;
    pro?: string | boolean;
    premium?: string | boolean;
  };
}

// Component props
export interface PricingFeaturesProps {
  features: PricingFeature[];
  className?: string;
}

// Feature list props
export interface PricingFeaturesListProps {
  features: PricingFeature[];
  className?: string;
  showDescriptions?: boolean;
}

// Single feature item props
export interface PricingFeatureItemProps {
  feature: PricingFeature;
  className?: string;
}