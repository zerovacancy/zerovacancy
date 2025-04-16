
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
    <div className="flex flex-col items-center w-full my-2"
      style={{ touchAction: 'auto' }}>
      
      {/* Compact toggle with smaller size */}
      <div className="flex justify-center items-center gap-1 bg-white p-1 rounded-full shadow-sm border border-gray-200 max-w-[200px] mx-auto w-full">
        <button
          onClick={() => setIsYearly(false)}
          className={cn(
            "flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px]",
            !isYearly 
              ? "bg-blue-600 text-white shadow-sm" 
              : "bg-transparent text-gray-500"
          )}
          style={{ touchAction: 'manipulation' }}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={cn(
            "flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px] flex items-center justify-center",
            isYearly 
              ? "bg-blue-600 text-white shadow-sm" 
              : "bg-transparent text-gray-500"
          )}
          style={{ touchAction: 'manipulation' }}
        >
          Annual
          {isYearly && (
            <span className="ml-1 text-[10px] bg-green-100 text-green-800 px-1 py-0.5 rounded-full">
              -20%
            </span>
          )}
        </button>
      </div>
      
      {/* Compact savings callout */}
      {isYearly && (
        <div className="mt-1 text-xs text-green-700">
          Save up to $79/year with annual billing
        </div>
      )}
    </div>
  );
};
