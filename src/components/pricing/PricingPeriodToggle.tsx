
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
  return (
    <div className="w-full flex flex-col items-center">
      {/* Simple toggle buttons with clear active state */}
      <div className="flex space-x-3 items-center">
        <button 
          onClick={() => handleChangePeriod(0)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            "touch-manipulation focus:outline-none shadow-sm",
            period === 0 
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              : "bg-gray-100 text-gray-600"
          )}
        >
          Monthly
        </button>
        
        <button 
          onClick={() => handleChangePeriod(1)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200", 
            "touch-manipulation focus:outline-none shadow-sm",
            period === 1 
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              : "bg-gray-100 text-gray-600"
          )}
        >
          Annual
        </button>
      </div>
      
      {/* Savings badge */}
      <AnimatePresence>
        {period === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2"
          >
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
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
