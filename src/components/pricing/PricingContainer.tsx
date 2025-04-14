import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { usePricing } from "./PricingContext";
import PricingHeader from "./PricingHeader";
import { PLAN_DESCRIPTIONS, VALUE_PROPOSITIONS, PLAN_CTAS, FEATURES } from "./pricingData";
import { ChevronDown, Check, X, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { PricingFeature } from "./types";
import { Button } from "../ui/button";
import { mobileOptimizationClasses } from "@/utils/mobile-optimization";
import { ScrollArea } from "../ui/scroll-area";
import { PricingService } from "@/services/PricingService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";

interface PricingContainerProps {
  showStickyHeader?: boolean;
}

export const PricingContainer = ({ showStickyHeader: externalStickyHeader }: PricingContainerProps = {}) => {
  const isMobile = useIsMobile();
  const { isYearly, currentPrices, getSavings, setIsYearly, animateChange } = usePricing();
  const [expandedFeatures, setExpandedFeatures] = useState<{[key: number]: boolean}>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: number]: boolean}>({});
  const [localStickyHeader, setLocalStickyHeader] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use external sticky header state if provided, otherwise use local state
  const showStickyHeader = externalStickyHeader !== undefined ? externalStickyHeader : localStickyHeader;
  
  useEffect(() => {
    if (!isMobile || externalStickyHeader !== undefined) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const headerOffset = containerRef.current.offsetTop + 100; // Adjust based on your layout
      
      setLocalStickyHeader(scrollPosition > headerOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, externalStickyHeader]);
  
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
  
  const { isAuthenticated, user, openAuthDialog } = useAuth();

  // Handle plan selection
  const handlePlanSelect = async (planName: string) => {
    if (isProcessingPayment) return;
    
    try {
      setIsProcessingPayment(true);
      setProcessingPlan(planName);
      
      // Handle free tier differently
      if (planName.toLowerCase() === "basic (free)") {
        toast.success("You've selected the Free tier!");
        setTimeout(() => {
          setIsProcessingPayment(false);
          setProcessingPlan(null);
        }, 1000);
        return;
      }
      
      console.log(`Starting checkout process for ${planName} plan`);
      
      // Check if user is authenticated using our auth context
      if (!isAuthenticated || !user) {
        toast.error("You need to be signed in to purchase a subscription");
        setIsProcessingPayment(false);
        setProcessingPlan(null);
        
        // Open the auth dialog
        openAuthDialog();
        return;
      }
      
      // Call Supabase Edge Function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planName: planName.toLowerCase().includes("professional") ? "pro" : planName.toLowerCase().includes("premium") ? "premium" : "basic",
          userId: user.id,
        }
      });
      
      if (error) {
        console.error("Error creating checkout session:", error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }
      
      const { url } = data;
      
      // Redirect to the checkout URL
      window.location.href = url;
      
      // If the redirect doesn't happen within 5 seconds, reset the state
      setTimeout(() => {
        setIsProcessingPayment(false);
        setProcessingPlan(null);
      }, 5000);
      
    } catch (error) {
      console.error("Error redirecting to Stripe checkout:", error);
      toast.error("Failed to redirect to checkout. Please try again.");
      setIsProcessingPayment(false);
      setProcessingPlan(null);
    }
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
    // For mobile, we'll use a more differentiated color scheme focused on blues/indigos 
    // to clearly separate pricing from features
    if (isMobile) {
      switch (color) {
        case "blue":
          return {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-700",
            accent: "bg-blue-500",
            button: "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20",
            highlight: "bg-blue-50",
            gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
            cardBg: "bg-gradient-to-b from-white to-blue-50/50"
          };
        case "purple":
          return {
            bg: "bg-indigo-50",
            border: "border-indigo-200",
            text: "text-indigo-700",
            accent: "bg-indigo-500",
            button: "bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20",
            highlight: "bg-indigo-50",
            gradient: "bg-gradient-to-br from-indigo-600 to-blue-600",
            cardBg: "bg-gradient-to-b from-white to-indigo-50/70"
          };
        case "emerald":
          return {
            bg: "bg-cyan-50",
            border: "border-cyan-200",
            text: "text-cyan-700",
            accent: "bg-cyan-500",
            button: "bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-500/20",
            highlight: "bg-cyan-50",
            gradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
            cardBg: "bg-gradient-to-b from-white to-cyan-50/50"
          };
        default:
          return {
            bg: "bg-slate-50",
            border: "border-slate-200",
            text: "text-slate-700",
            accent: "bg-slate-500",
            button: "bg-slate-500 hover:bg-slate-600",
            highlight: "bg-slate-50",
            gradient: "",
            cardBg: "bg-gradient-to-b from-white to-slate-50/50"
          };
      }
    } else {
      // Original desktop color scheme
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
    }
  };
  
  return (
    <div className="w-full pb-10 relative" 
      ref={containerRef} 
      style={{ touchAction: 'auto' }}>
      {/* Mobile-only section divider */}
      {isMobile && (
        <div className="relative w-full overflow-hidden mb-6 mt-2">
          <div className="absolute left-0 right-0 top-0 h-[8px] bg-gradient-to-r from-blue-50 via-indigo-100 to-blue-50"></div>
          <div className="px-6 py-2 flex justify-center">
            <div className="w-16 h-1 bg-indigo-200 rounded-full"></div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isMobile && showStickyHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 py-2 px-4 z-30 bg-white/95 border-b border-indigo-100 shadow-sm"
            style={{ touchAction: 'auto' }}
          >
            <PricingHeader 
              title="Pricing" 
              subtitle=""
              isSticky={true}
              isYearly={isYearly}
              setIsYearly={setIsYearly}
              animateChange={animateChange}
              showStickyHeader={showStickyHeader}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isMobile ? (
        <div className="w-full overflow-hidden flex flex-col items-center space-y-10">
          {pricingTiers.map((tier, index) => {
            const colorScheme = getColorScheme(tier.color);
            const isExpanded = !!expandedFeatures[index];
            const isDescriptionExpanded = !!expandedDescriptions[index];
            
            return (
              <motion.div
                key={tier.title}
                className={cn(
                  "rounded-xl overflow-visible transition-all relative group w-[92%] max-w-[340px]",
                  "border border-gray-200",
                  tier.popularPlan && "relative shadow-md",
                  colorScheme.cardBg,
                  // Use simpler shadow for better performance
                  "shadow-sm",
                  // Add stronger visual highlighting for the Professional plan
                  tier.title === "Professional" && "ring-2 ring-purple-400/20 shadow-[0_2px_10px_rgba(139,92,246,0.15)]"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tier.popularPlan && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                    <div className="py-1 px-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-semibold shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      <span>POPULAR</span>
                    </div>
                  </div>
                )}
                <div className={cn(
                  "p-5 flex justify-between items-start gap-3"
                )}>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "text-lg font-bold font-jakarta",
                      colorScheme.text
                    )}>
                      {tier.title}
                    </h3>
                    <div className="mt-2">
                      <p className={cn(
                        "text-xs text-brand-text-secondary font-inter leading-relaxed",
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
                          className={cn(
                            "mt-1.5 text-xs font-medium flex items-center gap-1 focus:outline-none touch-manipulation",
                            colorScheme.text
                          )}
                          style={{ touchAction: 'manipulation' }}
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
                      <div className="mt-1.5 inline-block bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-medium font-space whitespace-nowrap">
                        Save ${tier.savings}/year
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-5 pb-3 pt-2">
                  <Button 
                    className={cn(
                      "w-full py-3 rounded-xl font-medium text-sm transition-all",
                      "px-4",
                      // Better touch target height
                      "h-[48px] min-h-[48px]",
                      colorScheme.button,
                      tier.popularPlan && "ring-1 ring-brand-purple/20",
                      (isProcessingPayment && processingPlan === tier.title) && "opacity-80 cursor-not-allowed"
                    )}
                    disabled={isProcessingPayment}
                    onClick={() => handlePlanSelect(tier.title)}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {(isProcessingPayment && processingPlan === tier.title) ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      tier.cta
                    )}
                  </Button>
                </div>
                
                <div className="px-5 pb-5">
                  <button
                    onClick={() => toggleFeatures(index)}
                    className={cn(
                      "mt-2 flex items-center justify-center w-auto mx-auto px-4 py-1.5",
                      "text-xs font-medium text-brand-text-primary rounded-full",
                      "border border-slate-200 bg-slate-50 hover:bg-slate-100",
                      "transition-colors duration-200",
                      // Better touch target
                      "min-h-[36px]"
                    )}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="font-inter whitespace-nowrap">
                      {isExpanded ? "Hide features" : "Show features"}
                    </span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 ml-1 text-brand-text-light transition-transform",
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
                        className="overflow-hidden touch-action-pan-y"
                        style={{ touchAction: 'pan-y' }}
                      >
                        <div className={cn(
                          "pt-5 pb-2 space-y-5"
                        )}>
                          {Object.entries(tier.features).map(([category, features], catIndex) => (
                            <div key={`${tier.title}-${category}`} className="space-y-3">
                              {category !== "Core Features" && (
                                <h4 className={cn(
                                  "text-xs font-semibold font-jakarta px-3 py-1 rounded-md inline-block",
                                  colorScheme.bg
                                )}>
                                  {category}
                                </h4>
                              )}
                              
                              <div className="space-y-3 ml-1">
                                {features.map((feature, featIndex) => (
                                  <div 
                                    key={`${tier.title}-${category}-${featIndex}`}
                                    className="flex items-start gap-3"
                                  >
                                    <div className={cn(
                                      "flex-shrink-0 rounded-full p-0.5 mt-0.5",
                                      colorScheme.bg
                                    )}>
                                      <Check className={cn(
                                        "h-3.5 w-3.5 flex-shrink-0", 
                                        colorScheme.text
                                      )} />
                                    </div>
                                    <span className="text-xs leading-relaxed text-brand-text-primary font-inter">{feature.text}</span>
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
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full">
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
                    `before:bg-gradient-to-b ${colorScheme.gradient.split(' ')[0]} ${colorScheme.gradient.split(' ')[1]} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`,
                    // Add glowing border for Professional plan
                    tier.title === "Professional" && "ring-4 ring-purple-400/20 ring-offset-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
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
                        tier.popularPlan && "ring-2 ring-brand-purple/30 ring-offset-2",
                        (isProcessingPayment && processingPlan === tier.title) && "opacity-80 cursor-not-allowed"
                      )}
                      disabled={isProcessingPayment}
                      onClick={() => handlePlanSelect(tier.title)}
                    >
                      {(isProcessingPayment && processingPlan === tier.title) ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        tier.cta
                      )}
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
          
          {/* Compare All Plans CTA for Desktop only */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 mb-4"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "mx-auto flex items-center justify-center gap-2",
                      "rounded-full py-3 px-6 shadow-sm",
                      "bg-[#f5f5f7] text-brand-purple text-sm font-medium",
                      "border border-slate-200/80 transition-all duration-200",
                      "hover:bg-slate-100 active:bg-slate-200",
                      "w-auto"
                    )}
                  >
                    <span>Compare all features</span>
                    <ChevronRight className="h-4 w-4 opacity-80" />
                  </button>
                </DialogTrigger>

                <DialogContent className="p-0 w-[90vw] max-w-[800px] rounded-xl border border-slate-200 shadow-xl bg-white overflow-hidden" data-desktop-dialog>
                  <DialogTitle className="sr-only">Feature Comparison</DialogTitle>
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-bold text-brand-purple-dark font-jakarta">Feature Comparison</h3>
                    <DialogClose asChild>
                      <button className="p-2 rounded-full hover:bg-slate-100 focus:outline-none active:bg-slate-200 touch-action-manipulation" style={{ touchAction: 'manipulation' }}>
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </DialogClose>
                  </div>
                  
                  <ScrollArea className="max-h-[70vh] rounded-b-xl">
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
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};