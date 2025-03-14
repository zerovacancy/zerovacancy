
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingPeriodToggleProps {
  period: number;
  handleChangePeriod: (index: number) => void;
  animatePriceChange: boolean;
}

export const PricingPeriodToggle: React.FC<PricingPeriodToggleProps> = ({ 
  period, 
  handleChangePeriod, 
  animatePriceChange 
}) => {
  const [hydrated, setHydrated] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="relative w-full z-10 flex flex-col items-center">
      {/* Label text and toggle switch */}
      <div className="mb-2 flex items-center justify-center gap-6 text-sm font-medium">
        <span className={period === 0 ? "text-brand-purple-dark font-semibold" : "text-slate-600"}>
          Monthly
        </span>
        
        {/* The actual toggle switch */}
        <button 
          onClick={() => handleChangePeriod(period === 0 ? 1 : 0)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2",
            period === 1 ? "bg-brand-purple" : "bg-slate-200",
          )}
          type="button"
          role="switch"
          aria-checked={period === 1}
        >
          <span 
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300", // added duration-300 for smoother toggle
              period === 1 ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
        
        <span className={period === 1 ? "text-brand-purple-dark font-semibold" : "text-slate-600"}>
          Annual
        </span>
      </div>
      
      {/* Savings label for annual billing */}
      {period === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Slowed down from default
          exit={{ opacity: 0, y: -5 }}
          className="mt-1"
        >
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full shadow-sm">
            <Check className="h-3 w-3 mr-0.5 text-emerald-600" />
            Save up to 20% with annual billing
          </span>
        </motion.div>
      )}
    </div>
  );
};
