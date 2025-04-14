
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
    <div className="flex flex-col items-center"
      style={{ touchAction: 'auto' }}>
      {/* Label text with improved spacing */}
      <div className="mb-2 flex items-center justify-center gap-6 text-sm font-medium">
        <span className={!isYearly ? "text-blue-700 font-semibold" : "text-slate-600"}>
          Monthly
        </span>
        
        {/* The original toggle switch with improved touch target */}
        <button 
          onClick={() => setIsYearly(!isYearly)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2",
            isYearly ? "bg-blue-600" : "bg-slate-200",
            "border border-slate-300 shadow-sm",
          )}
          type="button"
          role="switch"
          aria-checked={isYearly}
          style={{ touchAction: 'manipulation' }}
        >
          <span 
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform",
              isYearly ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
        
        <span className={isYearly ? "text-blue-700 font-semibold" : "text-slate-600"}>
          Annual
        </span>
      </div>
      
      {/* Savings label for annual billing with better styling */}
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-1"
        >
          <span className={cn(
            "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full",
            "text-blue-700 bg-blue-50 shadow-sm",
            animateChange ? "animate-pulse" : ""
          )}>
            <Check className="h-3.5 w-3.5 mr-1 text-blue-600" />
            Save up to 20% with annual billing
          </span>
        </motion.div>
      )}
    </div>
  );
};
