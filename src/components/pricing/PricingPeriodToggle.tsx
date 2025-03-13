
import React from "react";
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
  // Unified implementation for mobile that matches PricingHeader style
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center overflow-hidden rounded-full transition-all duration-300 w-full max-w-md mx-auto bg-[#8853FF]/20 p-1">
        <button 
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "touch-manipulation focus:outline-none",
            period === 0 
              ? "bg-[#8853FF] text-white shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Monthly
        </button>
        
        <button 
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2", 
            "touch-manipulation focus:outline-none",
            period === 1 
              ? "bg-white text-[#8853FF] shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Annual
          
          {period === 1 && (
            <span className={cn(
              "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap",
              animatePriceChange ? "animate-pulse" : ""
            )}>
              Save 20%
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
