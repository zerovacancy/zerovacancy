
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
    <div className="flex flex-col items-center w-full my-4"
      style={{ touchAction: 'auto' }}>
      
      {/* Redesigned toggle using buttons with better touch targets */}
      <div className="flex justify-center items-center gap-2 mb-2 bg-white p-1.5 rounded-full shadow-sm border border-blue-100 max-w-[280px] mx-auto w-full">
        <button
          onClick={() => setIsYearly(false)}
          className={cn(
            "flex-1 px-6 py-3 rounded-full text-sm font-medium transition-all min-h-[44px]",
            !isYearly 
              ? "bg-blue-600 text-white shadow-sm" 
              : "bg-transparent text-gray-500 hover:bg-blue-50"
          )}
          style={{ touchAction: 'manipulation' }}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={cn(
            "flex-1 px-6 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center justify-center",
            isYearly 
              ? "bg-blue-600 text-white shadow-sm" 
              : "bg-transparent text-gray-500 hover:bg-blue-50"
          )}
          style={{ touchAction: 'manipulation' }}
        >
          Annual
          {isYearly && (
            <span className="ml-1.5 text-xs font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          )}
        </button>
      </div>
      
      {/* Larger savings callout for annual billing */}
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="mt-2"
        >
          <span className={cn(
            "inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full",
            "text-green-700 bg-green-50 border border-green-100 shadow-sm",
            animateChange ? "animate-pulse" : ""
          )}>
            <Check className="h-4 w-4 mr-1.5 text-green-600" />
            Save up to $79/year with annual billing
          </span>
        </motion.div>
      )}
    </div>
  );
};
