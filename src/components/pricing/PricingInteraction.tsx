
import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingPeriodToggle } from "./PricingPeriodToggle";
import { PricingTier } from "./PricingTier";
import { PricingPlanProps } from "./types";

export interface PricingInteractionProps {
  starterMonth: number;
  starterAnnual: number;
  proMonth: number;
  proAnnual: number;
  plans: PricingPlanProps[];
}

export function PricingInteraction({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
  plans
}: PricingInteractionProps) {
  const [period, setPeriod] = useState(0);  // 0: monthly, 1: annual
  const [expandedFeatures, setExpandedFeatures] = useState<{[key: number]: boolean}>({});
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [animatePriceChange, setAnimatePriceChange] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to middle card (Professional)
  const isMobile = useIsMobile();
  
  // Initialize price states based on the initial period
  const [starter, setStarter] = useState(period === 0 ? starterMonth : starterAnnual);
  const [pro, setPro] = useState(period === 0 ? proMonth : proAnnual);
  
  // Enhanced period change with animation
  const handleChangePeriod = useCallback((index: number) => {
    setPeriod(index);
    setAnimatePriceChange(true);
    
    // Set timeout to remove animation class
    setTimeout(() => setAnimatePriceChange(false), 1200);
    
    if (index === 0) {
      setStarter(starterMonth);
      setPro(proMonth);
    } else {
      setStarter(starterAnnual);
      setPro(proAnnual);
    }
  }, [starterMonth, starterAnnual, proMonth, proAnnual]);
  
  const toggleFeatures = useCallback((index: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  // Hide swipe hint after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle card scrolling with snap effect
  const handleCardScroll = (index: number) => {
    setActiveCardIndex(index);
  };

  const planPrices = [0, starter, pro];
  
  // Calculate savings
  const calculateSavings = useCallback((index: number) => {
    if (period === 0 || index === 0) return null;
    
    const monthlyCost = index === 1 ? starterMonth : proMonth;
    const annualCost = index === 1 ? starterAnnual : proAnnual;
    
    return Math.round(12 * (monthlyCost - annualCost));
  }, [period, starterMonth, starterAnnual, proMonth, proAnnual]);

  // Handle checkout process
  const handleGetStarted = (planName: string) => {
    console.log(`Starting checkout process for ${planName} plan`);
    // Add checkout process logic here
  };

  return (
    <div className={cn(
      "border-2 rounded-[22px] p-4 shadow-lg w-full flex flex-col items-center gap-3 bg-white",
      "relative overflow-hidden",
      isMobile ? "max-w-[95%] mx-auto" : "max-w-sm"
    )}>
      {/* Enhanced background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50 pointer-events-none" />
      
      {/* Simple, clear toggle buttons */}
      <div className="w-full mb-3">
        <PricingPeriodToggle 
          period={period}
          handleChangePeriod={handleChangePeriod}
          animatePriceChange={animatePriceChange}
        />
      </div>
      
      {/* Improved swipe instruction with more eye-catching design */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-gray-500 flex items-center gap-1.5 mb-1.5 bg-slate-50/80 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm animate-pulse-subtle font-inter"
          >
            <span>Swipe to compare pricing plans</span>
            <motion.span 
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block"
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Card pagination indicators */}
      <div className="flex justify-center gap-1.5 my-1">
        {plans.map((_, index) => (
          <motion.button
            key={`indicator-${index}`}
            onClick={() => handleCardScroll(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              index === activeCardIndex 
                ? "w-6 h-2 bg-brand-purple" 
                : "w-2 h-2 bg-slate-300"
            )}
            whileTap={{ scale: 0.9 }}
            aria-label={`View ${plans[index].title} plan`}
          />
        ))}
      </div>
      
      {/* Display all pricing tiers in scrollable container with snap effect */}
      <div 
        className="w-full mt-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex w-full">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="min-w-full px-0.5 snap-center"
              style={{ scrollSnapAlign: 'center' }}
            >
              <PricingTier
                key={index}
                plan={plan}
                index={index}
                price={planPrices[index]}
                period={period}
                animatePriceChange={animatePriceChange}
                expandedFeatures={!!expandedFeatures[index]}
                toggleFeatures={() => toggleFeatures(index)}
                handleGetStarted={handleGetStarted}
                calculateSavings={calculateSavings}
                isActive={index === activeCardIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
