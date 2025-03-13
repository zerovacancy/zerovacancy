
import React, { useState, useEffect } from "react";
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
  // Create a completely custom toggle that doesn't rely on existing CSS classes
  return (
    <div className="w-full flex flex-col items-center">
      {/* Toggle container using direct styles */}
      <div className="relative flex w-full max-w-[280px] rounded-full overflow-hidden p-[3px] shadow-sm border border-gray-200 bg-gray-100">
        {/* Monthly option */}
        <button
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "flex-1 relative z-10 rounded-full py-2 px-4 text-center font-medium transition-colors text-sm",
            "touch-manipulation focus:outline-none",
            period === 0 ? "text-brand-purple-dark font-semibold" : "text-slate-500"
          )}
          aria-pressed={period === 0}
        >
          Monthly
        </button>
        
        {/* Annual option */}
        <button
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "flex-1 relative z-10 rounded-full py-2 px-4 text-center font-medium transition-colors text-sm",
            "touch-manipulation focus:outline-none",
            period === 1 ? "text-brand-purple-dark font-semibold" : "text-slate-500"
          )}
          aria-pressed={period === 1}
        >
          Annual
        </button>
        
        {/* Active slider - with inline styles to ensure it works */}
        <motion.div
          className="absolute shadow-md bg-white rounded-full"
          style={{
            top: 3,
            left: 3,
            height: "calc(100% - 6px)",
            width: "calc(50% - 3px)",
          }}
          initial={false}
          animate={{
            x: period === 1 ? "100%" : "0%"
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
      </div>
      
      {/* Savings badge for annual billing */}
      <AnimatePresence>
        {period === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
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
