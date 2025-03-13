
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobilePricingToggleProps {
  isYearly: boolean;
  setIsYearly: (isYearly: boolean) => void;
  animateChange?: boolean;
}

export const MobilePricingToggle = ({
  isYearly,
  setIsYearly,
  animateChange = false
}: MobilePricingToggleProps) => {
  const [hydrated, setHydrated] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      {/* Toggle container - styled more like desktop */}
      <div className="pricing-toggle-container border border-gray-200 shadow-sm bg-slate-100/90 rounded-full max-w-[280px] mx-auto relative p-1 h-10">
        {/* Monthly option */}
        <button
          onClick={() => setIsYearly(false)}
          className={cn(
            "pricing-toggle-button z-10 rounded-full touch-manipulation",
            "focus:outline-none transition-colors duration-200",
            "text-sm font-medium min-h-8",
            !isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          aria-pressed={!isYearly}
        >
          Monthly
        </button>
        
        {/* Annual option */}
        <button
          onClick={() => setIsYearly(true)}
          className={cn(
            "pricing-toggle-button z-10 rounded-full touch-manipulation",
            "focus:outline-none transition-colors duration-200",
            "text-sm font-medium min-h-8",
            isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          aria-pressed={isYearly}
        >
          Annual
        </button>
        
        {/* Slider with enhanced styling for better touch response */}
        {hydrated && (
          <motion.div
            className={cn(
              "absolute top-1 h-8 w-[calc(50%-2px)] bg-white rounded-full",
              "shadow-md z-0",
              animateChange && isYearly ? "ring-2 ring-brand-purple/30 ring-offset-1" : ""
            )}
            initial={false}
            animate={{
              x: isYearly ? "100%" : "0%"
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </div>
      
      {/* Savings label for annual billing */}
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2"
        >
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Save up to 20% with annual billing
          </span>
        </motion.div>
      )}
    </div>
  );
};
