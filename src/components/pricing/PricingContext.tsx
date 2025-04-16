
import * as React from "react";
const { createContext, useContext, useState } = React;
type ReactNode = React.ReactNode;
import { PRICING, SAVINGS } from "./pricingData";

interface PricingContextType {
  isYearly: boolean;
  setIsYearly: (isYearly: boolean) => void;
  currentPrices: {
    starter: number;
    pro: number;
    premium: number;
  };
  getSavings: (planType: 'pro' | 'premium') => number;
  animateChange: boolean;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [isYearly, setIsYearly] = useState(true);
  const [animateChange, setAnimateChange] = useState(false);
  
  // Update prices based on billing period
  const currentPrices = {
    starter: 0,
    pro: isYearly ? PRICING.proAnnual : PRICING.proMonthly,
    premium: isYearly ? PRICING.premiumAnnual : PRICING.premiumMonthly
  };
  
  // Calculate savings for each plan
  const getSavings = (planType: 'pro' | 'premium') => {
    if (!isYearly) return 0;
    
    const monthlyCost = planType === 'pro' ? PRICING.proMonthly : PRICING.premiumMonthly;
    const annualCost = planType === 'pro' ? PRICING.proAnnual : PRICING.premiumAnnual;
    
    return Math.round(12 * (monthlyCost - annualCost));
  };
  
  // Toggle billing period with animation
  const handleSetIsYearly = (value: boolean) => {
    setIsYearly(value);
    setAnimateChange(true);
    setTimeout(() => setAnimateChange(false), 2000);
  };
  
  return (
    <PricingContext.Provider 
      value={{ 
        isYearly, 
        setIsYearly: handleSetIsYearly, 
        currentPrices, 
        getSavings,
        animateChange
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
