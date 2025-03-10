
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingContext } from "./PricingContext";
import { MobilePricingCard } from "./MobilePricingCard";
import { PRICING, FEATURES, VALUE_PROPOSITIONS, PLAN_DESCRIPTIONS, PLAN_CTAS } from "./pricingData";
import { DesktopPricingCard } from "./DesktopPricingCard";
import { PriceToggle } from "./PriceToggle";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PricingContainerProps {
  subscription: any;
  isLoading: boolean;
}

export const PricingContainer = ({ subscription, isLoading }: PricingContainerProps) => {
  const { isYearly } = usePricingContext();
  const isMobile = useIsMobile();
  const [showSticky, setShowSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Observer for sticky header
  useEffect(() => {
    if (!isMobile || !headerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Pricing cards data with enhanced details
  const pricingCards = [
    {
      title: "Basic",
      price: 0,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.basic,
      features: FEATURES.free,
      cta: "Start for Free",
      color: "blue" as const,
      valueProposition: VALUE_PROPOSITIONS.basic,
      footerText: PLAN_CTAS.basic
    },
    {
      title: "Professional",
      price: isYearly ? PRICING.starterAnnual : PRICING.starterMonthly,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.professional,
      features: FEATURES.starter,
      cta: "Choose Professional",
      highlighted: true,
      color: "purple" as const,
      showPopularTag: true,
      valueProposition: VALUE_PROPOSITIONS.professional,
      footerText: PLAN_CTAS.professional
    },
    {
      title: "Premium",
      price: isYearly ? PRICING.proAnnual : PRICING.proMonthly,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.premium,
      features: FEATURES.pro,
      cta: "Upgrade to Premium",
      color: "emerald" as const,
      valueProposition: VALUE_PROPOSITIONS.premium,
      footerText: PLAN_CTAS.premium
    }
  ];

  const calculateSavings = (index: number) => {
    if (!isYearly || index === 0) return null;
    
    const monthlyCost = index === 1 ? PRICING.starterMonthly : PRICING.proMonthly;
    const annualCost = index === 1 ? PRICING.starterAnnual : PRICING.proAnnual;
    
    return Math.round(12 * (monthlyCost - annualCost));
  };

  return (
    <div className="w-full mt-8 relative">
      {/* Reference for intersection observer */}
      <div ref={headerRef} className="h-1 w-full -mt-1" />
      
      {/* Sticky header for mobile */}
      <AnimatePresence>
        {showSticky && isMobile && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm py-3 px-4"
          >
            <div className="flex justify-between items-center max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-brand-purple">Choose Your Plan</h3>
              <PriceToggle variant="compact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop toggle */}
      {!isMobile && (
        <div className="flex justify-center my-8">
          <PriceToggle />
        </div>
      )}
      
      {/* Mobile toggle */}
      {isMobile && (
        <div className="flex justify-center mb-6">
          <PriceToggle />
        </div>
      )}
      
      {/* Pricing cards */}
      <div className={cn(
        isMobile 
          ? "flex flex-col space-y-6"
          : "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      )}>
        {pricingCards.map((card, index) => (
          isMobile ? (
            <MobilePricingCard
              key={card.title}
              {...card}
              isCurrentPlan={subscription?.plan === card.title}
              index={index}
              savings={calculateSavings(index)}
            />
          ) : (
            <DesktopPricingCard
              key={card.title}
              {...card}
              isCurrentPlan={subscription?.plan === card.title}
              isLoading={isLoading}
              savings={calculateSavings(index)}
              billingPeriod={isYearly ? "annually" : "monthly"}
            />
          )
        ))}
      </div>
      
      {/* Mobile feature comparison toggle */}
      {isMobile && (
        <FeatureComparisonToggle />
      )}
    </div>
  );
};

// Feature comparison toggle for mobile
const FeatureComparisonToggle = () => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="mt-8 mb-4">
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {showComparison ? (
          <>
            <span>Hide plan comparison</span>
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            <span>Compare all plans</span>
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
      
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <FeatureComparisonTable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Feature comparison table component
const FeatureComparisonTable = () => {
  const { isYearly } = usePricingContext();
  
  // Common features across plans
  const comparisonFeatures = [
    { name: "Content Creation", basic: "❌", pro: "✅", premium: "✅" },
    { name: "Revisions Included", basic: "0", pro: "1", premium: "3" },
    { name: "Social Media Optimization", basic: "❌", pro: "✅", premium: "✅" },
    { name: "SEO-Optimized Content", basic: "❌", pro: "✅", premium: "✅" },
    { name: "Geo-Targeted Content", basic: "❌", pro: "✅", premium: "✅" },
    { name: "Marketing Channel Optimization", basic: "❌", pro: "❌", premium: "✅" },
    { name: "Performance Dashboard", basic: "❌", pro: "❌", premium: "✅" }
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 bg-gray-50">
        <div className="p-3 font-medium border-b border-gray-200">Feature</div>
        <div className="p-3 font-medium text-center border-b border-gray-200 text-blue-600">Basic</div>
        <div className="p-3 font-medium text-center border-b border-gray-200 bg-brand-purple/5 text-brand-purple">Professional</div>
        <div className="p-3 font-medium text-center border-b border-gray-200 text-emerald-600">Premium</div>
      </div>
      
      <div className="grid grid-cols-4">
        <div className="p-3 font-medium border-b border-gray-100">Price</div>
        <div className="p-3 text-center border-b border-gray-100">Free</div>
        <div className="p-3 text-center border-b border-gray-100 bg-brand-purple/5">
          ${isYearly ? PRICING.starterAnnual : PRICING.starterMonthly}/{isYearly ? "mo" : "mo"}
        </div>
        <div className="p-3 text-center border-b border-gray-100">
          ${isYearly ? PRICING.proAnnual : PRICING.proMonthly}/{isYearly ? "mo" : "mo"}
        </div>
        
        {comparisonFeatures.map((feature, i) => (
          <>
            <div className="p-3 font-medium border-b border-gray-100" key={`name-${i}`}>{feature.name}</div>
            <div className="p-3 text-center border-b border-gray-100" key={`basic-${i}`}>{feature.basic}</div>
            <div className="p-3 text-center border-b border-gray-100 bg-brand-purple/5" key={`pro-${i}`}>{feature.pro}</div>
            <div className="p-3 text-center border-b border-gray-100" key={`premium-${i}`}>{feature.premium}</div>
          </>
        ))}
      </div>
    </div>
  );
};

export default PricingContainer;
