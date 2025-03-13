import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { usePricing } from "./PricingContext";
import PricingHeader from "./PricingHeader";
import { PLAN_DESCRIPTIONS, VALUE_PROPOSITIONS, PLAN_CTAS, FEATURES } from "./pricingData";
import { ChevronDown, Check, X, ChevronRight, Sparkles } from "lucide-react";
import { PricingFeature } from "./types";
import { Button } from "../ui/button";
import { mobileOptimizationClasses } from "@/utils/mobile-optimization";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";

export const PricingContainer = () => {
  const isMobile = useIsMobile();
  const { isYearly, currentPrices, getSavings, setIsYearly, animateChange } = usePricing();
  const [expandedFeatures, setExpandedFeatures] = useState<{[key: number]: boolean}>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: number]: boolean}>({});
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  
  const toggleFeatures = (index: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleDescription = (index: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const groupFeaturesByCategory = (features: PricingFeature[]) => {
    const result: {[key: string]: PricingFeature[]} = {};
    let currentCategory = "Core Features";
    
    features.forEach(feature => {
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

  const pricingTiers = [
    {
      title: "Basic (Free)",
      price: 0,
      description: PLAN_DESCRIPTIONS.starter,
      valueProposition: VALUE_PROPOSITIONS.starter,
      features: groupFeaturesByCategory(FEATURES.free),
      cta: "Start for Free",
      color: "blue",
      popularPlan: false,
      footerText: "🚀 Upgrade to unlock project requests and premium content!"
    },
    {
      title: "Professional",
      price: currentPrices.pro,
      description: PLAN_DESCRIPTIONS.pro,
      valueProposition: VALUE_PROPOSITIONS.pro,
      features: groupFeaturesByCategory(FEATURES.pro),
      cta: "Choose Professional",
      color: "purple",
      popularPlan: true,
      savings: getSavings('pro'),
      footerText: "🚀 Upgrade to Premium for more revisions, deeper insights, and content that works across all marketing channels."
    },
    {
      title: "Premium",
      price: currentPrices.premium,
      description: PLAN_DESCRIPTIONS.premium,
      valueProposition: VALUE_PROPOSITIONS.premium,
      features: groupFeaturesByCategory(FEATURES.premium),
      cta: "Upgrade to Premium",
      color: "emerald",
      popularPlan: false,
      savings: getSavings('premium'),
      footerText: PLAN_CTAS.premium
    }
  ];
  
  const getColorScheme = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          accent: "bg-blue-500",
          button: "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-blue-500/20",
          highlight: "bg-blue-50",
          gradient: mobileOptimizationClasses.pricingGradientBasic,
          cardBg: "bg-gradient-to-b from-blue-50/50 to-white"
        };
      case "purple":
        return {
          bg: "bg-brand-purple/10",
          border: "border-brand-purple/30",
          text: "text-brand-purple-dark",
          accent: "bg-brand-purple",
          button: "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-purple-500/20",
          highlight: "bg-purple-50",
          gradient: mobileOptimizationClasses.pricingGradientPro,
          cardBg: "bg-gradient-to-b from-purple-50/50 to-white"
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          accent: "bg-emerald-500",
          button: "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-blue-500/20",
          highlight: "bg-emerald-50",
          gradient: mobileOptimizationClasses.pricingGradientPremium,
          cardBg: "bg-gradient-to-b from-emerald-50/50 to-white"
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
          cardBg: "bg-gradient-to-b from-gray-50/50 to-white"
        };
    }
  };
  
  return (
    <div className="w-full pb-10" ref={containerRef}>
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
              isYearly={isYearly}
              setIsYearly={setIsYearly}
              animateChange={animateChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isMobile ? (
        <div className="px-4 pt-2">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            const isExpanded = !!expandedFeatures[index];
            const isDescriptionExpanded = !!expandedDescriptions[index];
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl overflow-visible transition-all mt-10 relative group mx-auto max-w-[280px] w-full",
                  tier.popularPlan ? (isMobile ? "shadow-lg" : "border-brand-purple shadow-lg") : (isMobile ? "" : "border-slate-200"),
                  tier.popularPlan && "relative",
                  colorScheme.cardBg,
                  "shadow-sm hover:shadow-md",
                  isMobile && "mobile-optimize",
                  "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl",
                  `before:bg-gradient-to-b ${colorScheme.gradient.split(' ')[0]} ${colorScheme.gradient.split(' ')[1]} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tier.popularPlan && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center z-20">
                    <div className="py-1 px-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-semibold shadow-md">
                      <Sparkles className="h-3 w-3" />
                      <span>POPULAR</span>
                    </div>
                  </div>
                )}
                <div className={cn(
                  "p-4 flex justify-between items-start gap-2"
                )}>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "text-lg font-bold font-jakarta truncate",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <div className="mt-1">
                      <p className={cn(
                        "text-xs text-brand-text-secondary font-inter leading-relaxed relative",
                        isMobile && "pl-0.5",
                        !isDescriptionExpanded && "line-clamp-3"
                      )}>
                        {tier.valueProposition}
                        {!isDescriptionExpanded && tier.valueProposition.length > 120 && (
                          <span className="inline-block text-brand-purple-medium"> ...</span>
                        )}
                      </p>
                      {tier.valueProposition.length > 120 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(index);
                          }}
                          className="mt-1 text-[10px] font-medium text-brand-purple flex items-center gap-1 focus:outline-none"
                        >
                          {isDescriptionExpanded ? "Read less" : "Read more"}
                          <ChevronDown 
                            className={cn(
                              "h-3 w-3 transition-transform", 
                              isDescriptionExpanded && "rotate-180"
                            )} 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-brand-purple-dark font-space">${tier.price}</span>
                        <span className="text-xs text-brand-text-light font-space">/mo</span>
                      </div>
                      <div className="text-xs text-brand-text-light font-space leading-tight">
                        {isYearly && "billed annually"}
                      </div>
                    </div>
                    
                    {isYearly && tier.savings && (
                      <div className="mt-1.5 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-medium font-space whitespace-nowrap">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-4 pb-2 pt-3">
                  <Button 
                    className={cn(
                      "w-full py-2 rounded-xl font-medium text-sm transition-all h-auto min-h-10",
                      "px-4",
                      colorScheme.button,
                      tier.popularPlan && "ring-2 ring-brand-purple/30 ring-offset-1"
                    )}
                  >
                    {tier.cta}
                  </Button>
                </div>
                
                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleFeatures(index)}
                    className={cn(
                      "mt-3 flex items-center justify-center w-auto mx-auto px-3 py-1",
                      "text-[10px] font-medium text-brand-text-primary rounded-full",
                      "border border-slate-200 bg-slate-50 hover:bg-slate-100",
                      "transition-colors duration-200"
                    )}
                  >
                    <span className="font-inter whitespace-nowrap">
                      {isExpanded ? "Hide features" : "Show features"}
                    </span>
                    <ChevronDown className={cn(
                      "h-3 w-3 ml-1 text-brand-text-light transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={cn(
                          "pt-4 pb-2 space-y-4",
                          isMobile && "px-0.5"
                        )}>
                          {Object.entries(tier.features).map(([category, features], catIndex) => (
                            <div key={`${tier.title}-${category}`} className="space-y-2">
                              {category !== "Core Features" && (
                                <h4 className={cn(
                                  "text-xs font-medium font-jakarta px-2 py-1 rounded inline-block",
                                  isMobile && "ml-0.5",
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
                                      isMobile ? "h-3.5 w-3.5 mt-0.5 ml-0.5 flex-shrink-0" : "h-4 w-4 mt-0.5 flex-shrink-0", 
                                      colorScheme.text
                                    )} />
                                    <span className="text-xs leading-snug text-brand-text-primary font-inter">{feature.text}</span>
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
          
          <div className="mt-6 pt-2 relative flex flex-col items-center">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between py-2.5 px-4 text-sm font-medium text-white font-inter",
                    "rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-dark",
                    "shadow-sm border border-brand-purple/10 hover:shadow-md",
                    "transition-all duration-200 relative",
                    "max-w-[240px] w-full"
                  )}
                >
                  <span className="flex-1 text-center">
                    Compare all features
                  </span>
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
              </DialogTrigger>

              <DialogContent className="p-0 w-[92vw] max-w-[400px] rounded-xl border-slate-200 shadow-xl top-[15%] translate-y-0">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-bold text-brand-purple-dark font-jakarta">Feature Comparison</h3>
                  <DialogClose className="p-1 rounded-full hover:bg-slate-100 focus:outline-none">
                    <X className="h-5 w-5 text-gray-500" />
                  </DialogClose>
                </div>
                
                <ScrollArea className="h-[60vh] rounded-b-xl">
                  <div className="px-4 pb-6">
                    <div className="grid grid-cols-4 border-b border-slate-200 py-3 sticky top-0 bg-white z-10">
                      <div className="col-span-1 text-sm font-bold text-gray-800 font-jakarta">Feature</div>
                      <div className="col-span-1 text-center text-xs font-bold text-blue-700 font-space">Basic</div>
                      <div className="col-span-1 text-center text-xs font-bold text-purple-700 font-space">Pro</div>
                      <div className="col-span-1 text-center text-xs font-bold text-emerald-700 font-space">Premium</div>
                    </div>
                    
                    <div className="pt-4 pb-2">
                      <h4 className="text-xs font-bold text-brand-purple-dark bg-brand-purple/5 px-3 py-1.5 rounded-lg inline-block mb-3">
                        Core Features
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Browse & Discover Content Creators</div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-blue-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Access to Creator Profiles</div>
                          <div className="col-span-1 text-center text-[9px] font-semibold text-gray-600">Limited</div>
                          <div className="col-span-1 text-center text-[9px] font-semibold text-purple-600">Full</div>
                          <div className="col-span-1 text-center text-[9px] font-semibold text-emerald-600">Full</div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Preview Marketplace Features</div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-blue-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Submit Request for Proposals</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center text-[9px] font-semibold text-emerald-600">Instantly</div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Browse & Hire Premium Creators</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Revisions Included Per Project</div>
                          <div className="col-span-1 text-center text-xs font-semibold text-gray-700 font-space">0</div>
                          <div className="col-span-1 text-center text-xs font-semibold text-purple-700 font-space">1</div>
                          <div className="col-span-1 text-center text-xs font-semibold text-emerald-700 font-space">3</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 pb-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                        Content Optimization
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Social Media Optimized Content</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">SEO-Optimized Content</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Geo-Targeted Content</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-purple-600" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 pb-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                        Premium Features
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Marketing Channel Optimization</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">7-Day Money-Back Guarantee</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                        <div className="grid grid-cols-4 items-center hover:bg-slate-50 rounded py-2 transition-colors">
                          <div className="col-span-1 text-xs font-medium text-gray-700 font-inter">Performance Insights Dashboard</div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></div>
                          <div className="col-span-1 text-center"><Check className="h-4 w-4 mx-auto text-emerald-600" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl border overflow-visible transition-all mt-12 relative group",
                  tier.popularPlan 
                    ? `border-brand-purple shadow-xl ${colorScheme.border} scale-105 z-10` 
                    : "border-slate-200",
                  tier.popularPlan && "relative",
                  colorScheme.cardBg,
                  "shadow-sm hover:shadow-md",
                  isMobile && "mobile-optimize",
                  "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl",
                  `before:bg-gradient-to-b ${colorScheme.gradient.split(' ')[0]} ${colorScheme.gradient.split(' ')[1]} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tier.popularPlan && (
                  <div className="absolute -top-6 inset-x-0 flex justify-center z-20">
                    <div className="py-1.5 px-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-sm font-semibold shadow-md">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>MOST POPULAR</span>
                    </div>
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className={cn(
                      "text-xl font-bold font-jakarta",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <p className="text-sm text-brand-text-secondary font-inter mt-1">{tier.valueProposition}</p>
                  </div>
                  
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
                  
                  <Button 
                    className={cn(
                      "w-full py-3 px-5 rounded-lg text-white font-medium transition-all h-11",
                      colorScheme.button,
                      tier.popularPlan && "ring-2 ring-brand-purple/30 ring-offset-2"
                    )}
                  >
                    {tier.cta}
                  </Button>
                  
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
