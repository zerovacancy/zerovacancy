
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full flex flex-col items-center">
      {/* Toggle container with slider */}
      <div className="pricing-toggle-container border border-gray-200 shadow-sm max-w-[280px]">
        {/* Monthly option */}
        <button
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none transition-colors duration-200", 
            "hover:bg-gray-50",
            period === 0 ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          aria-pressed={period === 0}
        >
          Monthly
        </button>
        
        {/* Annual option */}
        <button
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none transition-colors duration-200",
            "hover:bg-gray-50",
            period === 1 ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          aria-pressed={period === 1}
        >
          Annual
        </button>
        
        {/* Active slider */}
        {hydrated && (
          <motion.div
            className={cn(
              "pricing-toggle-slider",
              "shadow-md",
              animatePriceChange && period === 1 ? "ring-2 ring-brand-purple/30 ring-offset-1" : ""
            )}
            initial={false}
            animate={{
              x: period === 1 ? "100%" : "0%"
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </div>
      
      {/* Savings badge for annual billing */}
      <AnimatePresence>
        {period === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3"
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Save up to 20% with annual billing
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
