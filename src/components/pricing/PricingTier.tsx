
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Check, Info } from "lucide-react";
import { motion } from "framer-motion";
import NumberFlow from '@number-flow/react';
import { PricingFeatures } from "./PricingFeatures";
import { PricingPlanProps } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PricingTierProps {
  plan: PricingPlanProps;
  index: number;
  price: number;
  period: number;
  animatePriceChange: boolean;
  expandedFeatures: boolean;
  toggleFeatures: () => void;
  handleGetStarted: (planName: string) => void;
  calculateSavings?: (index: number) => number | null;
  isActive?: boolean;
  isProcessingPayment?: boolean;
}

export const PricingTier: React.FC<PricingTierProps> = ({
  plan,
  index,
  price,
  period,
  animatePriceChange,
  expandedFeatures,
  toggleFeatures,
  handleGetStarted,
  calculateSavings,
  isActive = false,
  isProcessingPayment = false
}) => {
  // Value propositions for each plan
  const VALUE_PROPOSITIONS = {
    0: "Great for trying things out",
    1: "Most popular for real estate agents",
    2: "Perfect for luxury properties"
  };
  
  // Track hover state for interactive effects
  const [isHovering, setIsHovering] = useState(false);

  // Determine the plan's theme color
  const getPlanColor = (idx: number) => {
    if (idx === 0) return "blue";
    if (idx === 1) return "purple";
    return "emerald";
  };

  // Generate color classes based on the plan index
  const planColor = getPlanColor(index);
  
  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.02, y: -2 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full"
      viewport={{ once: true }}
    >
      <motion.div
        className={cn(
          "w-full flex flex-col p-5 rounded-xl",
          "relative overflow-visible",
          "border-2 bg-white shadow-md transition-all duration-300",
          isActive ? "border-brand-purple shadow-lg" : "border-slate-200",
          isActive && "scale-[1.02]",
          isHovering && "pricing-card-active"
        )}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Enhanced Popular tag with animation */}
        {plan.showPopular && (
          <div className="absolute top-0 left-0 right-0 mt-[-12px] flex justify-center z-10">
            <motion.div 
              className="py-1 px-3 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-sm shadow-md"
              animate={{ 
                boxShadow: ['0 2px 8px rgba(139, 92, 246, 0.2)', '0 4px 12px rgba(139, 92, 246, 0.4)', '0 2px 8px rgba(139, 92, 246, 0.2)']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse-subtle" />
              <span className="font-medium font-inter">Popular Choice</span>
            </motion.div>
          </div>
        )}
        
        <motion.div 
          className="flex justify-between items-start mt-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + (index * 0.05) }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-xl flex items-center gap-2 text-gray-950 font-jakarta">
                {plan.title}
              </p>
            </div>
            
            {/* Value proposition text with subtle animation */}
            <motion.p 
              className="text-xs text-slate-600 mb-2 font-inter"
              animate={isHovering ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 1, repeat: isHovering ? Infinity : 0 }}
            >
              {VALUE_PROPOSITIONS[index]}
            </motion.p>
            
            <div className="text-slate-500 text-md font-inter">
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  `text-${planColor}-700 font-bold text-3xl flex items-center font-jakarta`, 
                  animatePriceChange && "animate-pulse-subtle"
                )}>
                  ${" "}
                  <NumberFlow
                    className={`text-${planColor}-700 font-bold text-4xl font-jakarta`} 
                    value={price}
                  />
                </span>
                <span className="text-sm text-gray-500 font-inter">
                  /{period === 0 ? "month" : "month, billed yearly"}
                </span>
              </div>
              
              {/* Annual savings badge with enhanced animation */}
              {period === 1 && index > 0 && (
                <motion.div 
                  className="mt-1 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-xs font-medium"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  Save ${calculateSavings?.(index)} per year
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Features section with grouped categories and tooltips */}
        <PricingFeatures 
          features={plan.features} 
          expandedFeatures={expandedFeatures} 
          toggleFeatures={toggleFeatures}
          planIndex={index}
        />
        
        {/* Enhanced Get Started CTA button with improved tap target and animations */}
        <motion.button 
          onClick={() => handleGetStarted(plan.title)}
          variants={buttonVariants}
          initial="initial"
          whileHover={isProcessingPayment ? {} : "hover"}
          whileTap={isProcessingPayment ? {} : "tap"}
          disabled={isProcessingPayment}
          className={cn(
            "w-full mt-4 rounded-xl font-medium text-sm py-3.5", // Increased height for better tap target
            "touch-manipulation transition-all duration-300",
            isProcessingPayment && "opacity-80 cursor-not-allowed",
            index === 0 
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
              : index === 1 
                ? "bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white shadow-md hover:shadow-lg"
                : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md hover:shadow-lg"
          )}
        >
          <motion.span
            className="flex items-center justify-center gap-1"
            whileHover={{ x: isProcessingPayment ? 0 : 3 }}
            transition={{ duration: 0.2 }}
          >
            {isProcessingPayment ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {index === 0 ? "Get Started Free" : `Choose ${plan.title}`}
                <motion.span 
                  className="inline-block"
                  animate={{ x: isActive ? [0, 3, 0] : 0 }}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                >
                  →
                </motion.span>
              </>
            )}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
