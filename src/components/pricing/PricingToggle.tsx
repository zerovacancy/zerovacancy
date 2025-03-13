
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hydrated, setHydrated] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  // Animate highlight when changing billing period
  useEffect(() => {
    if (hydrated) {
      setAnimateChange(true);
      const timer = setTimeout(() => setAnimateChange(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isYearly, hydrated]);

  // Unified mobile toggle design that matches PricingPeriodToggle
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center overflow-hidden rounded-full transition-all duration-300 w-full max-w-md mx-auto bg-[#8853FF]/20 p-1">
          <button 
            onClick={() => setIsYearly(false)}
            className={cn(
              "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "touch-manipulation focus:outline-none",
              !isYearly 
                ? "bg-[#8853FF] text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Monthly
          </button>
          
          <button 
            onClick={() => setIsYearly(true)}
            className={cn(
              "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2", 
              "touch-manipulation focus:outline-none",
              isYearly 
                ? "bg-white text-[#8853FF] shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Annual
            
            {isYearly && (
              <span className={cn(
                "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap",
                animateChange ? "animate-pulse" : ""
              )}>
                Save 20%
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Desktop version with slider
  return (
    <div className="flex flex-col items-center">
      {/* Toggle container with enhanced styling */}
      <div className={cn(
        "pricing-toggle-container",
        "border border-gray-200 shadow-sm",
        "w-80"
      )}>
        {/* Monthly option with hover effects */}
        <button
          onClick={() => setIsYearly(false)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none transition-colors duration-200", 
            "hover:bg-gray-50",
            isYearly ? "text-slate-600" : "text-brand-purple-dark font-semibold"
          )}
          aria-pressed={!isYearly}
        >
          Monthly
        </button>
        
        {/* Annual option with hover effects */}
        <button
          onClick={() => setIsYearly(true)}
          className={cn(
            "pricing-toggle-button",
            "touch-manipulation focus:outline-none transition-colors duration-200",
            "hover:bg-gray-50",
            isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
          )}
          aria-pressed={isYearly}
        >
          Annual
        </button>
        
        {/* Active slider with enhanced styling */}
        {hydrated && (
          <motion.div
            className={cn(
              "pricing-toggle-slider",
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
          />
        )}
      </div>
      
      {/* Savings label for annual billing */}
      <AnimatePresence>
        {isYearly && (
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
