
import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Mobile Toggle Slider implementation with improved visibility and touch targets
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center translate-z-0 py-2">
        <div className="w-full max-w-[280px] bg-slate-100 rounded-full p-1 relative h-12 shadow-md touch-manipulation">
          {/* Background Slider that moves */}
          <div 
            className={cn(
              "absolute top-1 rounded-full h-10 bg-gradient-to-r from-[#8853FF] to-[#6E40F2] transition-all duration-300 shadow-sm",
              period === 0 ? "left-1 w-[calc(50%-2px)]" : "left-[calc(50%+1px)] w-[calc(50%-2px)]"
            )}
            aria-hidden="true"
          />
          
          {/* Monthly Button */}
          <button 
            onClick={() => handleChangePeriod(0)}
            className={cn(
              "absolute left-0 top-0 w-1/2 h-full flex items-center justify-center",
              "rounded-full text-sm font-medium z-10 transition-colors duration-300",
              "touch-manipulation active:opacity-90 -webkit-tap-highlight-color-transparent",
              period === 0 ? "text-white" : "text-gray-500"
            )}
            aria-pressed={period === 0}
            aria-label="Select monthly billing"
          >
            Monthly
          </button>
          
          {/* Annual Button */}
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <button 
              onClick={() => handleChangePeriod(1)}
              className={cn(
                "w-full h-full flex items-center justify-center gap-2",
                "rounded-full text-sm font-medium z-10 transition-colors duration-300",
                "touch-manipulation active:opacity-90 -webkit-tap-highlight-color-transparent",
                period === 1 ? "text-white" : "text-gray-500"
              )}
              aria-pressed={period === 1}
              aria-label="Select annual billing"
            >
              <span>Annual</span>
              
              {/* Show savings badge for annual */}
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
      </div>
    );
  }
  
  // Implementation for desktop
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center overflow-hidden rounded-full transition-all duration-300 w-full max-w-md mx-auto bg-[#8853FF]/20 p-1.5 shadow-sm">
        <button 
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
            "touch-manipulation focus:outline-none",
            period === 0 
              ? "bg-[#8853FF] text-white shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
          aria-pressed={period === 0}
          aria-label="Select monthly billing"
        >
          Monthly
        </button>
        
        <button 
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2", 
            "touch-manipulation focus:outline-none",
            period === 1 
              ? "bg-white text-[#8853FF] shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
          aria-pressed={period === 1}
          aria-label="Select annual billing"
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
