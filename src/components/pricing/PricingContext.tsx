
import { createContext, useContext, useState, ReactNode } from "react";

interface PricingContextType {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  expandedFeatureIndex: number | null;
  setExpandedFeatureIndex: (index: number | null) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [isYearly, setIsYearly] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to middle card (Professional)
  const [expandedFeatureIndex, setExpandedFeatureIndex] = useState<number | null>(null);

  return (
    <PricingContext.Provider
      value={{
        isYearly,
        setIsYearly,
        activeCardIndex,
        setActiveCardIndex,
        expandedFeatureIndex,
        setExpandedFeatureIndex,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricingContext() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
}
