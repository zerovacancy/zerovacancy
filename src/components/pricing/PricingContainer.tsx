
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { usePricing } from "./PricingContext";
import PricingHeader from "./PricingHeader";
import { PLAN_DESCRIPTIONS, VALUE_PROPOSITIONS, PLAN_CTAS, FEATURES } from "./pricingData";
import { ChevronDown, Check, Info, Sparkles, X } from "lucide-react";

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
  
  // Modified helper to group features by category, handling object features
  const groupFeaturesByCategory = (features: Array<{text: string; primary: boolean}>) => {
    const result: {[key: string]: Array<{text: string; primary: boolean}>} = {};
    let currentCategory = "Core Features";
    
    features.forEach(feature => {
      // Check if the feature text indicates a category
      if (feature.text.startsWith("**") && feature.text.endsWith("**")) {
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
      price: currentPrices.basic,
      description: PLAN_DESCRIPTIONS.basic,
      valueProposition: VALUE_PROPOSITIONS.basic,
      features: groupFeaturesByCategory(FEATURES.free),
      cta: "Start for Free",
      color: "blue",
      popularPlan: false,
      footerText: PLAN_CTAS.basic
    },
    {
      title: "Professional",
      price: currentPrices.professional,
      description: PLAN_DESCRIPTIONS.professional,
      valueProposition: VALUE_PROPOSITIONS.professional,
      features: groupFeaturesByCategory(FEATURES.starter),
      cta: "Choose Professional",
      color: "purple",
      popularPlan: true,
      savings: getSavings('professional'),
      footerText: PLAN_CTAS.professional
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
          button: "bg-blue-500 hover:bg-blue-600",
          highlight: "bg-blue-50"
        };
      case "purple":
        return {
          bg: "bg-brand-purple/10",
          border: "border-brand-purple/30",
          text: "text-brand-purple-dark",
          accent: "bg-brand-purple",
          button: "bg-gradient-to-r from-brand-purple-medium to-brand-purple hover:from-brand-purple hover:to-brand-purple-dark",
          highlight: "bg-purple-50"
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          accent: "bg-emerald-500",
          button: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
          highlight: "bg-emerald-50"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          accent: "bg-gray-500",
          button: "bg-gray-500 hover:bg-gray-600",
          highlight: "bg-gray-50"
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
        <div className="flex flex-col gap-6 px-4">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            const isExpanded = !!expandedFeatures[index];
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl overflow-hidden border-2 transition-all",
                  tier.popularPlan ? "border-brand-purple shadow-lg" : "border-slate-200",
                  tier.popularPlan && "relative"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Popular tag */}
                {tier.popularPlan && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                    <div className="px-4 py-1 bg-brand-purple text-white rounded-full text-sm font-medium shadow-md flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Plan header */}
                <div className={cn(
                  "p-4 flex justify-between items-start",
                  tier.popularPlan ? "bg-gradient-to-br from-purple-50 to-indigo-50" : "bg-white"
                )}>
                  <div>
                    <h3 className={cn(
                      "text-lg font-bold",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{tier.valueProposition}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">${tier.price}</span>
                      <span className="text-sm text-slate-500">/{isYearly ? "mo, billed yearly" : "mo"}</span>
                    </div>
                    
                    {/* Annual savings badge */}
                    {isYearly && tier.savings && (
                      <div className="mt-1 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-medium">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Main CTA */}
                <div className="px-4 pb-2 pt-3">
                  <button 
                    className={cn(
                      "w-full py-3 rounded-lg text-white font-medium text-sm transition-all",
                      colorScheme.button
                    )}
                  >
                    {tier.cta}
                  </button>
                </div>
                
                {/* Accordion-style feature sections */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleFeatures(index)}
                    className={cn(
                      "mt-3 flex items-center justify-between w-full py-2 text-sm font-medium text-slate-700 border-t border-slate-100",
                    )}
                  >
                    <span>
                      {isExpanded ? "What's included" : "Show features"}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-slate-400 transition-transform",
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
                                  "text-xs font-medium px-2 py-1 rounded inline-block",
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
                                    <span className="text-sm text-slate-700">{feature.text}</span>
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
          
          {/* Compact feature comparison table for mobile */}
          <div className="mt-4 pt-2 border-t border-slate-200">
            <button
              onClick={() => setExpandedComparisonTable(!expandedComparisonTable)}
              className="w-full flex items-center justify-between py-3 text-sm font-medium text-slate-700"
            >
              <span className="flex items-center">
                <span className="p-1 mr-2 bg-indigo-50 rounded">
                  <Info className="h-4 w-4 text-indigo-500" />
                </span>
                Compare all features
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-slate-400 transition-transform",
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
                  <div className="py-4 px-2 bg-slate-50 rounded-lg">
                    <div className="flex border-b border-slate-200 pb-2 mb-3">
                      <div className="w-1/2 text-sm font-medium text-slate-700">Feature</div>
                      <div className="w-1/6 text-center text-xs font-medium text-blue-600">Basic</div>
                      <div className="w-1/6 text-center text-xs font-medium text-brand-purple">Pro</div>
                      <div className="w-1/6 text-center text-xs font-medium text-emerald-600">Premium</div>
                    </div>
                    
                    {/* Sample comparison items - These would be dynamically generated from feature data */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-slate-600">Browse Creators</div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-blue-500" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-slate-600">Submit RFPs</div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-slate-600">Revisions Included</div>
                        <div className="w-1/6 text-center text-xs">0</div>
                        <div className="w-1/6 text-center text-xs">1</div>
                        <div className="w-1/6 text-center text-xs">3</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-slate-600">SEO Optimization</div>
                        <div className="w-1/6 text-center"><X className="h-4 w-4 mx-auto text-slate-300" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-brand-purple" /></div>
                        <div className="w-1/6 text-center"><Check className="h-4 w-4 mx-auto text-emerald-500" /></div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/2 text-xs text-slate-600">Marketing Dashboard</div>
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
        // Desktop card grid layout - simplified from existing implementation
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-2xl border-2 overflow-hidden transition-all",
                  tier.popularPlan 
                    ? `border-brand-purple shadow-xl ${colorScheme.border} scale-105 z-10` 
                    : "border-slate-200",
                  tier.popularPlan && "relative"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Popular tag */}
                {tier.popularPlan && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                    <div className="px-4 py-1 bg-brand-purple text-white rounded-full text-sm font-medium shadow-md flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className={cn(
                      "text-xl font-bold",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{tier.valueProposition}</p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-slate-900">${tier.price}</span>
                      <span className="ml-2 text-sm text-slate-500">/{isYearly ? "mo, billed yearly" : "mo"}</span>
                    </div>
                    
                    {isYearly && tier.savings && (
                      <div className="mt-2 inline-block bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <button 
                    className={cn(
                      "w-full py-3.5 rounded-xl text-white font-medium transition-all",
                      colorScheme.button
                    )}
                  >
                    {tier.cta}
                  </button>
                  
                  {/* Features */}
                  <div className="mt-8 border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-4">What's included:</h4>
                    
                    <div className="space-y-5">
                      {Object.entries(tier.features).map(([category, features], catIndex) => (
                        <div key={`${tier.title}-${category}`} className="space-y-2">
                          {category !== "Core Features" && (
                            <h5 className={cn(
                              "text-sm font-medium",
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
                                <span className="text-sm text-slate-700">{feature.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer note */}
                  {tier.footerText && (
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
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
