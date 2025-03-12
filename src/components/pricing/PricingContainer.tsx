
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { usePricing } from "./PricingContext";
import PricingHeader from "./PricingHeader";
import { PLAN_DESCRIPTIONS, VALUE_PROPOSITIONS, PLAN_CTAS, FEATURES } from "./pricingData";
import { ChevronDown, Check, X } from "lucide-react";
import { PricingFeature } from "./types";
import { Button } from "../ui/button";
import { mobileOptimizationClasses } from "@/utils/mobile-optimization";

export const PricingContainer = () => {
  const isMobile = useIsMobile();
  const { isYearly, currentPrices, getSavings } = usePricing();
  const [expandedFeatures, setExpandedFeatures] = useState<{[key: number]: boolean}>({});
  const [expandedComparisonTable, setExpandedComparisonTable] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle scrolling for sticky header
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const headerOffset = containerRef.current.offsetTop + 100; // Adjust based on your layout
      
      setShowStickyHeader(scrollPosition > headerOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  // Toggle expanded features for a specific plan
  const toggleFeatures = (index: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Helper to group features by category
  const groupFeaturesByCategory = (features: PricingFeature[]) => {
    const result: {[key: string]: PricingFeature[]} = {};
    let currentCategory = "Core Features";
    
    features.forEach(feature => {
      // Check if the feature text indicates a category
      if (typeof feature.text === 'string' && feature.text.startsWith("**") && feature.text.endsWith("**")) {
        currentCategory = feature.text.slice(2, -2);
        if (!result[currentCategory]) {
          result[currentCategory] = [];
        }
      } else {
        if (!result[currentCategory]) {
          result[currentCategory] = [];
        }
        result[currentCategory].push(feature);
      }
    });
    
    return result;
  };

  // Define pricing tiers with all necessary data
  const pricingTiers = [
    {
      title: "Basic",
      price: currentPrices.starter,
      description: PLAN_DESCRIPTIONS.starter,
      valueProposition: VALUE_PROPOSITIONS.starter,
      features: groupFeaturesByCategory(FEATURES.free),
      cta: "Start for Free",
      color: "blue",
      popularPlan: false,
      footerText: PLAN_CTAS.starter
    },
    {
      title: "Professional",
      price: currentPrices.pro,
      description: PLAN_DESCRIPTIONS.pro,
      valueProposition: VALUE_PROPOSITIONS.pro,
      features: groupFeaturesByCategory(FEATURES.starter),
      cta: "Choose Professional",
      color: "purple",
      popularPlan: true,
      savings: getSavings('pro'),
      footerText: PLAN_CTAS.pro
    },
    {
      title: "Premium",
      price: currentPrices.premium,
      description: PLAN_DESCRIPTIONS.premium,
      valueProposition: VALUE_PROPOSITIONS.premium,
      features: groupFeaturesByCategory(FEATURES.pro),
      cta: "Upgrade to Premium",
      color: "emerald",
      popularPlan: false,
      savings: getSavings('premium'),
      footerText: PLAN_CTAS.premium
    }
  ];
  
  // Get color scheme based on plan type
  const getColorScheme = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          accent: "bg-blue-500",
          button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-600",
          highlight: "bg-blue-50",
          gradient: mobileOptimizationClasses.pricingGradientBasic,
          cardBg: "bg-gradient-to-b from-blue-50/50 to-white" // Added consistent card background
        };
      case "purple":
        return {
          bg: "bg-brand-purple/10",
          border: "border-brand-purple/30",
          text: "text-brand-purple-dark",
          accent: "bg-brand-purple",
          button: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700",
          highlight: "bg-purple-50",
          gradient: mobileOptimizationClasses.pricingGradientPro,
          cardBg: "bg-gradient-to-b from-purple-50/50 to-white" // Added consistent card background
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          accent: "bg-emerald-500",
          button: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
          highlight: "bg-emerald-50",
          gradient: mobileOptimizationClasses.pricingGradientPremium,
          cardBg: "bg-gradient-to-b from-emerald-50/50 to-white" // Added consistent card background
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          accent: "bg-gray-500",
          button: "bg-gray-500 hover:bg-gray-600",
          highlight: "bg-gray-50",
          gradient: "",
          cardBg: "bg-gradient-to-b from-gray-50/50 to-white" // Added consistent card background
        };
    }
  };
  
  return (
    <div className="w-full pb-10" ref={containerRef}>
      {/* Sticky header for mobile */}
      <AnimatePresence>
        {isMobile && showStickyHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 py-2 px-4 z-30"
          >
            <PricingHeader 
              title="Pricing" 
              subtitle=""
              isSticky={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile vertical stack layout */}
      {isMobile ? (
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 px-4">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            const isExpanded = !!expandedFeatures[index];
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl overflow-hidden border transition-all mt-4 relative group",
                  tier.popularPlan ? "border-brand-purple shadow-lg" : "border-slate-200",
                  tier.popularPlan && "relative",
                  colorScheme.cardBg, // Using consistent background for the whole card
                  mobileOptimizationClasses.cleanBorderMobile,
                  "shadow-sm hover:shadow-md",
                  isMobile && "mobile-optimize",
                  "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl",
                  `before:bg-gradient-to-b ${colorScheme.gradient.split(' ')[0]} ${colorScheme.gradient.split(' ')[1]} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Plan header */}
                <div className={cn(
                  "p-4 flex justify-between items-start"
                )}>
                  <div>
                    <h3 className={cn(
                      "text-lg font-bold font-jakarta",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <p className="text-xs text-brand-text-secondary font-inter mt-1">{tier.valueProposition}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-brand-purple-dark font-space">${tier.price}</span>
                      <span className="text-sm text-brand-text-light font-space">/{isYearly ? "mo, billed yearly" : "mo"}</span>
                    </div>
                    
                    {/* Annual savings badge */}
                    {isYearly && tier.savings && (
                      <div className="mt-1 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-medium font-space">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Main CTA */}
                <div className="px-4 pb-2 pt-3">
                  <Button 
                    className={cn(
                      "w-full py-3 rounded-lg font-medium text-sm transition-all h-10",
                      colorScheme.button
                    )}
                  >
                    {tier.cta}
                  </Button>
                </div>
                
                {/* Accordion-style feature sections - improved button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleFeatures(index)}
                    className={cn(
                      "mt-3 flex items-center justify-center w-auto mx-auto px-4 py-1.5",
                      "text-xs font-medium text-brand-text-primary rounded-full",
                      "border border-slate-200 bg-slate-50 hover:bg-slate-100",
                      "transition-colors duration-200"
                    )}
                  >
                    <span className="font-inter">
                      {isExpanded ? "Hide features" : "Show features"}
                    </span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 ml-1.5 text-brand-text-light transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                  
                  {/* Expandable features */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-1 space-y-4">
                          {Object.entries(tier.features).map(([category, features], catIndex) => (
                            <div key={`${tier.title}-${category}`} className="space-y-2">
                              {category !== "Core Features" && (
                                <h4 className={cn(
                                  "text-xs font-medium font-jakarta px-2 py-1 rounded inline-block",
                                  colorScheme.bg
                                )}>
                                  {category}
                                </h4>
                              )}
                              
                              <div className="space-y-2">
                                {features.map((feature, featIndex) => (
                                  <div 
                                    key={`${tier.title}-${category}-${featIndex}`}
                                    className="flex items-start gap-2"
                                  >
                                    <Check className={cn(
                                      "h-4 w-4 mt-0.5 flex-shrink-0", 
                                      colorScheme.text
                                    )} />
                                    <span className="text-sm text-brand-text-primary font-inter">{feature.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
          
          {/* Compact feature comparison table for mobile - removed border-t and changed button styling */}
          <div className="mt-4 pt-2">
            <button
              onClick={() => setExpandedComparisonTable(!expandedComparisonTable)}
              className={cn(
                "w-full mx-auto flex items-center justify-between py-3 px-5 text-sm font-medium text-white font-inter",
                "rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-dark",
                "shadow-sm border border-brand-purple/10 hover:shadow-md",
                "transition-all duration-200 relative group",
                "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl", 
                "before:bg-gradient-to-b from-purple-400 to-indigo-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
              )}
            >
              <span className="flex-1 text-center">
                Compare all features
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-white transition-transform",
                expandedComparisonTable && "rotate-180"
              )} />
            </button>
            
            <AnimatePresence>
              {expandedComparisonTable && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    "py-4 px-2 mt-2 rounded-xl shadow-sm relative group",
                    "border border-slate-200",
                    mobileOptimizationClasses.cleanBorderMobile,
                    mobileOptimizationClasses.subtleGradientIndigo,
                    "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl", 
                    "before:bg-gradient-to-b from-indigo-500 to-purple-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
                  )}>
                    <div className="flex border-b border-slate-200 pb-2 mb-3">
                      <div className="w-1/2 text-sm font-medium text-brand-text-primary font-inter">Feature</div>
                      <div className="w-1/6 text-center text-xs font-medium text-blue-600 font-space">Basic</div>
                      <div className="w-1/6 text-center text-xs font-medium text-brand-purple font-space">Pro</div>
                      <div className="w-1/6 text-center text-xs font-medium text-emerald-600 font-space">Premium</div>
                    </div>
                    
                    {/* Sample comparison items */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-brand-text-secondary font-inter">Browse Creators</div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-blue-500" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-brand-text-secondary font-inter">Submit RFPs</div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-brand-text-secondary font-inter">Revisions Included</div>
                        <div className="w-1/6 text-center text-xs font-space">0</div>
                        <div className="w-1/6 text-center text-xs font-space">1</div>
                        <div className="w-1/6 text-center text-xs font-space">3</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-brand-text-secondary font-inter">SEO Optimization</div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-brand-text-secondary font-inter">Marketing Dashboard</div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        // Desktop card grid layout
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl border overflow-hidden transition-all mt-6 relative group",
                  tier.popularPlan 
                    ? `border-brand-purple shadow-xl ${colorScheme.border} scale-105 z-10` 
                    : "border-slate-200",
                  tier.popularPlan && "relative",
                  colorScheme.cardBg, // Using consistent background for the whole card
                  "shadow-sm hover:shadow-md",
                  mobileOptimizationClasses.cleanBorderMobile,
                  isMobile && "mobile-optimize",
                  "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl",
                  `before:bg-gradient-to-b ${colorScheme.gradient.split(' ')[0]} ${colorScheme.gradient.split(' ')[1]} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className={cn(
                      "text-xl font-bold font-jakarta",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <p className="text-sm text-brand-text-secondary font-inter mt-1">{tier.valueProposition}</p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-brand-purple-dark font-space">${tier.price}</span>
                      <span className="ml-2 text-sm text-brand-text-light font-space">/{isYearly ? "mo, billed yearly" : "mo"}</span>
                    </div>
                    
                    {isYearly && tier.savings && (
                      <div className="mt-2 inline-block bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium font-space">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    className={cn(
                      "w-full py-3 px-5 rounded-lg text-white font-medium transition-all h-11",
                      colorScheme.button
                    )}
                  >
                    {tier.cta}
                  </Button>
                  
                  {/* Features */}
                  <div className="mt-8 border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-semibold text-brand-text-primary font-jakarta mb-4">What's included:</h4>
                    
                    <div className="space-y-5">
                      {Object.entries(tier.features).map(([category, features], catIndex) => (
                        <div key={`${tier.title}-${category}`} className="space-y-2">
                          {category !== "Core Features" && (
                            <h5 className={cn(
                              "text-sm font-medium font-jakarta",
                              colorScheme.text
                            )}>
                              {category}
                            </h5>
                          )}
                          
                          <div className="space-y-2">
                            {features.map((feature, featIndex) => (
                              <div 
                                key={`${tier.title}-${category}-${featIndex}`}
                                className="flex items-start gap-2"
                              >
                                <span className={cn(
                                  "p-0.5 rounded-full mt-0.5",
                                  colorScheme.bg
                                )}>
                                  <Check className={cn(
                                    "h-3.5 w-3.5", 
                                    colorScheme.text
                                  )} />
                                </span>
                                <span className="text-sm text-brand-text-primary font-inter">{feature.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer note */}
                  {tier.footerText && (
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-brand-text-light font-space">
                      {tier.footerText}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
