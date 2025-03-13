
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobilePricingToggleProps {
  isYearly: boolean;
  onChange: (isYearly: boolean) => void;
  animateChange?: boolean;
}

export const MobilePricingToggle: React.FC<MobilePricingToggleProps> = ({
  isYearly,
  onChange,
  animateChange = false
}) => {
  const [hydrated, setHydrated] = useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center">
      {/* Toggle container with enhanced touch targets */}
      <div className="relative w-full flex items-center justify-center">
        <div
          className={cn(
            "relative w-full bg-[#8853FF]/20 rounded-full p-1.5 shadow-sm", 
            "touch-manipulation",
            "overflow-hidden",
            "border border-purple-100/30"
          )}
          role="tablist"
          aria-orientation="horizontal"
        >
          {/* Monthly option */}
          <button 
            role="tab"
            aria-selected={!isYearly}
            onClick={() => onChange(false)}
            className={cn(
              "relative z-10 rounded-full text-sm py-2.5 flex-1 text-center transition-colors duration-200",
              "touch-action-manipulation select-none min-h-[40px]",
              "focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:ring-offset-1",
              !isYearly ? "text-white font-medium" : "text-gray-500"
            )}
          >
            Monthly
          </button>
          
          {/* Annual option */}
          <button
            role="tab"
            aria-selected={isYearly}
            onClick={() => onChange(true)}
            className={cn(
              "relative z-10 rounded-full text-sm py-2.5 flex-1 text-center transition-colors duration-200",
              "touch-action-manipulation select-none min-h-[40px] flex items-center justify-center gap-2",
              "focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:ring-offset-1",
              isYearly ? "text-[#8853FF] font-medium" : "text-gray-500"
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

          {/* Animated background slider with gradient */}
          {hydrated && (
            <motion.div
              aria-hidden="true"
              className={cn(
                "absolute inset-y-1.5 rounded-full",
                "bg-gradient-to-r from-[#8853FF] to-[#6236FF]",
                "will-change-transform pointer-events-none",
                "shadow-sm"
              )}
              initial={false}
              animate={{
                x: isYearly ? "50%" : "0%",
                width: "50%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
