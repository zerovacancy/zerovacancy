
import React, { useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Handle component mounting animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col items-center" aria-live="polite" role="region" aria-label="Pricing period selection">
      {/* Toggle container with slider - styled to match screenshot */}
      <div 
        className="h-10 bg-gray-100 rounded-full flex items-center p-1 relative shadow-sm border border-gray-200 max-w-xs mx-auto"
        aria-roledescription="Toggle between monthly and annual pricing"
      >
        {/* Monthly option */}
        <button
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "h-8 flex-1 z-10 rounded-full flex items-center justify-center",
            "text-sm transition-colors duration-200 font-medium",
            period === 0 ? "text-gray-800" : "text-gray-500"
          )}
          aria-pressed={period === 0}
          aria-label="Monthly billing"
        >
          Monthly
        </button>
        
        {/* Annual option */}
        <button
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "h-8 flex-1 z-10 rounded-full flex items-center justify-center",
            "text-sm transition-colors duration-200 font-medium",
            period === 1 ? "text-gray-800" : "text-gray-500",
            "relative"
          )}
          aria-pressed={period === 1}
          aria-label="Annual billing"
        >
          Annual
          
          {period === 1 && (
            <span className={cn(
              "absolute -top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap",
              animatePriceChange ? "animate-pulse" : ""
            )}>
              Save 20%
            </span>
          )}
        </button>
        
        {/* Active slider with improved animation */}
        {hydrated && (
          <motion.div
            className="absolute top-1 h-8 rounded-full bg-white shadow-sm"
            style={{ width: 'calc(50% - 4px)' }}
            initial={false}
            animate={{
              x: period === 1 ? 'calc(100% + 2px)' : '1px',
              scale: animatePriceChange ? 1.03 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Remove the separate savings badge since it's now part of the toggle */}
    </div>
  );
};
