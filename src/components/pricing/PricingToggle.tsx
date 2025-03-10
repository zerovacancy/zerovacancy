
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PricingToggleProps {
  isYearly: boolean;
  setIsYearly: (isYearly: boolean) => void;
}

export const PricingToggle = ({
  isYearly,
  setIsYearly
}: PricingToggleProps) => {
  const isMobile = useIsMobile();
  const [animateChange, setAnimateChange] = useState(false);
  
  // Animate highlight when changing billing period
  useEffect(() => {
    setAnimateChange(true);
    const timer = setTimeout(() => setAnimateChange(false), 2000);
    return () => clearTimeout(timer);
  }, [isYearly]);

  return (
    <div className="flex flex-col items-center">
      {/* Toggle container with enhanced styling */}
      <div 
        className={cn(
          "pricing-toggle-container",
          "border border-gray-200 shadow-sm",
          isMobile ? "max-w-xs" : "w-80"
        )}
        role="tablist"
        aria-label="Billing period options"
      >
        {/* Monthly option with hover effects */}
        <button
          onClick={() => setIsYearly(false)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:z-20 transition-colors duration-200", 
            "hover:bg-gray-50",
            isYearly ? "text-slate-600" : "text-brand-purple-dark font-semibold"
          )}
          role="tab"
          aria-selected={!isYearly}
          aria-controls="monthly-content"
          id="monthly-tab"
        >
          Monthly
        </button>
        
        {/* Annual option with hover effects */}
        <button
          onClick={() => setIsYearly(true)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:z-20 transition-colors duration-200",
            "hover:bg-gray-50",
            isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          role="tab"
          aria-selected={isYearly}
          aria-controls="annual-content"
          id="annual-tab"
        >
          Annual
        </button>
        
        {/* Active slider with enhanced styling */}
        <motion.div
          className={cn(
            "pricing-toggle-slider",
            isYearly ? "annual" : "monthly",
            "shadow-md",
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
          aria-hidden="true"
        />
      </div>
      
      {/* Savings label for annual billing */}
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-3"
          id="annual-content"
          role="tabpanel"
          aria-labelledby="annual-tab"
        >
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Save up to 20% with annual billing
          </span>
        </motion.div>
      )}
    </div>
  );
};
