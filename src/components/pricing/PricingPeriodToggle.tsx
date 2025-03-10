
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  return (
    <div className="relative w-full z-10">
      {/* Toggle container with just two options */}
      <div className="pricing-toggle-container" role="tablist" aria-label="Billing period options">
        {/* Monthly option */}
        <button
          className={cn(
            "pricing-toggle-button",
            period === 0 ? "text-brand-purple-dark" : "text-slate-600",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:z-20"
          )}
          onClick={() => handleChangePeriod(0)}
          role="tab"
          aria-selected={period === 0}
          aria-label="Monthly billing"
          id="monthly-tab"
        >
          Monthly
        </button>
        
        {/* Annual option */}
        <button
          className={cn(
            "pricing-toggle-button",
            period === 1 ? "text-brand-purple-dark" : "text-slate-600",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:z-20"
          )}
          onClick={() => handleChangePeriod(1)}
          role="tab"
          aria-selected={period === 1}
          aria-label="Annual billing"
          id="annual-tab"
        >
          Annual
        </button>
        
        {/* Slider background */}
        <motion.div
          className={cn(
            "pricing-toggle-slider",
            period === 0 ? "monthly" : "annual"
          )}
          initial={false}
          animate={{
            x: `${period * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
