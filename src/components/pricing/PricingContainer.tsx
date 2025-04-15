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
import { MobilePricingToggle } from "./MobilePricingToggle";
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to Pro (middle card)
  
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
            button: "bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/20",
            highlight: "bg-blue-50",
            gradient: "bg-gradient-to-br from-blue-500 to-blue-400",
            cardBg: "bg-gradient-to-b from-white to-blue-50/60"
          };
        case "purple":
          return {
            bg: "bg-blue-100",
            border: "border-blue-300",
            text: "text-blue-800",
            accent: "bg-blue-600",
            button: "bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 shadow-md shadow-blue-500/20",
            highlight: "bg-blue-100",
            gradient: "bg-gradient-to-br from-blue-700 to-blue-500",
            cardBg: "bg-gradient-to-b from-white to-blue-100/70"
          };
        case "emerald":
          return {
            bg: "bg-sky-50",
            border: "border-sky-200",
            text: "text-sky-700",
            accent: "bg-sky-500",
            button: "bg-gradient-to-br from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md shadow-sky-500/20",
            highlight: "bg-sky-50",
            gradient: "bg-gradient-to-br from-sky-600 to-blue-600",
            cardBg: "bg-gradient-to-b from-white to-sky-50/60"
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
  
  // Add function to navigate between carousel cards
  const navigateCarousel = useCallback((direction: 'prev' | 'next') => {
    if (!carouselRef.current) return;
    
    const newIndex = direction === 'next' 
      ? Math.min(activeCardIndex + 1, pricingTiers.length - 1)
      : Math.max(activeCardIndex - 1, 0);
      
    setActiveCardIndex(newIndex);
    
    // Get all cards and scroll to the active one
    const cards = carouselRef.current.querySelectorAll('.pricing-card');
    if (cards[newIndex]) {
      cards[newIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeCardIndex, pricingTiers.length]);
  
  // Add function to directly jump to a specific card
  const jumpToCard = (index: number) => {
    if (!carouselRef.current) return;
    setActiveCardIndex(index);
    
    const cards = carouselRef.current.querySelectorAll('.pricing-card');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };
  
  // Handle scroll events to update active card indicator
  useEffect(() => {
    if (!carouselRef.current || !isMobile) return;
    
    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const containerWidth = carouselRef.current.clientWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      
      // Calculate which card is most visible based on scroll position
      const cardIndex = Math.round(scrollPosition / (containerWidth * 0.85 + 16)); // Account for card width and margin
      if (cardIndex !== activeCardIndex && cardIndex >= 0 && cardIndex < pricingTiers.length) {
        setActiveCardIndex(cardIndex);
      }
    };
    
    const carousel = carouselRef.current;
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeCardIndex, isMobile, pricingTiers.length]);
  
  // Implement proper touch handling for better swipe detection
  useEffect(() => {
    if (!carouselRef.current || !isMobile) return;
    
    let startX = 0;
    let isDragging = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      // Prevent page scrolling when swiping carousel
      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.changedTouches[0].clientX;
      const diff = startX - currentX;
      
      // Determine swipe direction and threshold
      if (Math.abs(diff) > 50) { // 50px threshold for swipe
        if (diff > 0) {
          navigateCarousel('next');
        } else {
          navigateCarousel('prev');
        }
      }
      
      isDragging = false;
    };
    
    const carousel = carouselRef.current;
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchmove', handleTouchMove);
        carousel.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobile, navigateCarousel]);
  
  return (
    <div className="w-full pb-10 relative" 
      ref={containerRef} 
      style={{ touchAction: 'auto' }}>
      {/* Sticky header removed completely to eliminate duplicate toggle */}
      
      {isMobile ? (
        <div className="w-full overflow-hidden flex flex-col items-center">
          
          {/* Replace vertical stack with horizontal carousel */}
          <div className="w-full overflow-hidden relative">
            {/* Navigation buttons */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 z-20 pointer-events-none px-1">
              <button 
                onClick={() => navigateCarousel('prev')}
                disabled={activeCardIndex === 0}
                className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto
                  ${activeCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'}`}
                aria-label="Previous plan"
              >
                <ChevronDown className="h-5 w-5 text-blue-600 rotate-90" />
              </button>
              
              <button 
                onClick={() => navigateCarousel('next')}
                disabled={activeCardIndex === pricingTiers.length - 1}
                className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto
                  ${activeCardIndex === pricingTiers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'}`}
                aria-label="Next plan"
              >
                <ChevronDown className="h-5 w-5 text-blue-600 -rotate-90" />
              </button>
            </div>
            
            {/* Swipeable carousel container - now with proper ref and touch handling */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2 px-2 -mx-2" 
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
                touchAction: 'pan-x'
              }}
              tabIndex={-1}
              role="region"
              aria-label="Pricing plans carousel"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  navigateCarousel('prev');
                } else if (e.key === 'ArrowRight') {
                  navigateCarousel('next');
                }
              }}
            >
              {pricingTiers.map((tier, index) => {
                const colorScheme = getColorScheme(tier.color);
                const isExpanded = !!expandedFeatures[index];
                const isDescriptionExpanded = !!expandedDescriptions[index];
                
                return (
                  <motion.div
                    key={tier.title}
                    className={cn(
                      "rounded-xl overflow-visible transition-all relative group flex-shrink-0 w-[85%] snap-center mx-2 pricing-card",
                      "border border-gray-200",
                      tier.popularPlan && "relative shadow-md",
                      colorScheme.cardBg,
                      // Use simpler shadow for better performance
                      "shadow-sm",
                      // Add stronger visual highlighting for the Professional plan
                      tier.title === "Professional" && "ring-2 ring-blue-400/30 shadow-[0_2px_10px_rgba(139,92,246,0.15)]",
                      // Highlight active card
                      activeCardIndex === index && "ring-2 ring-blue-500/30"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    id={`pricing-card-${index}`}
                    tabIndex={0}
                  >
                  {tier.popularPlan && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                      <div className="py-1 px-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-semibold shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        <span>POPULAR</span>
                      </div>
                    </div>
                  )}
                  <div className="p-5 flex flex-col">
                    {/* Plan title with better hierarchy */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className={cn(
                          "text-xl font-bold font-jakarta",
                          colorScheme.text
                        )}>
                          {tier.title}
                        </h3>
                        
                        {tier.title === "Professional" && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                            Most Popular
                          </span>
                        )}
                      </div>
                      
                      {/* Plan ribbon for premium */}
                      {tier.title === "Premium" && (
                        <span className="inline-block text-xs px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full font-medium">
                          Best Value
                        </span>
                      )}
                    </div>
                    
                    {/* Clearer pricing display */}
                    <div className="mb-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-blue-800 font-space">${tier.price}</span>
                      <span className="ml-1.5 text-gray-500 font-medium">/mo</span>
                      
                      {/* Billing period note */}
                      <span className="ml-2 text-sm text-gray-500">
                        {isYearly ? "billed annually" : "monthly billing"}
                      </span>
                    </div>
                    
                    {/* Show savings more prominently */}
                    {isYearly && tier.savings && (
                      <div className="mb-4 flex items-center px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                        <div className="mr-2 p-1 bg-green-100 rounded-full">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-700">
                          Save ${tier.savings}/year with annual billing
                        </span>
                      </div>
                    )}
                    
                    {/* Simpler description with no expandable behavior */}
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                      {/* Shortened version - no need for expandable behavior */}
                      {tier.valueProposition.length > 120 
                        ? tier.valueProposition.substring(0, 120) + "..."
                        : tier.valueProposition
                      }
                    </p>
                  </div>
                  
                  <div className="px-5 pb-4 pt-2">
                    <Button 
                      className={cn(
                        "w-full py-4 rounded-xl font-medium text-base transition-all",
                        "px-4",
                        // Larger touch target height
                        "h-[56px] min-h-[56px]",
                        colorScheme.button,
                        tier.popularPlan && "ring-2 ring-blue-400/30",
                        (isProcessingPayment && processingPlan === tier.title) && "opacity-80 cursor-not-allowed"
                      )}
                      disabled={isProcessingPayment}
                      onClick={() => handlePlanSelect(tier.title)}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {(isProcessingPayment && processingPlan === tier.title) ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          {tier.title === "Professional" ? (
                            <div className="flex items-center justify-center">
                              <Sparkles className="h-4 w-4 mr-1.5 text-white/80" />
                              <span>{tier.cta}</span>
                            </div>
                          ) : (
                            tier.cta
                          )}
                        </>
                      )}
                    </Button>
                    
                    {/* Add guarantee note under the button */}
                    {tier.title !== "Basic (Free)" && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        {tier.title === "Premium" ? "30-day money-back guarantee" : "7-day free trial"}
                      </p>
                    )}
                  </div>
                  
                  <div className="px-5 pb-5">
                    {/* Key features section - always visible */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-semibold text-gray-700 mb-3">Key Features:</h4>
                      <div className="space-y-2.5">
                        {/* Show only 3-4 key features */}
                        {(() => {
                          // Extract top features across categories
                          const allFeatures = Object.values(tier.features).flat();
                          const topFeatures = allFeatures.slice(0, 4);
                          
                          return topFeatures.map((feature, featIndex) => (
                            <div 
                              key={`${tier.title}-key-${featIndex}`}
                              className="flex items-start gap-2.5"
                            >
                              <div className={cn(
                                "flex-shrink-0 rounded-full p-0.5 mt-0.5",
                                colorScheme.bg
                              )}>
                                <Check className={cn(
                                  "h-4 w-4 flex-shrink-0", 
                                  colorScheme.text
                                )} />
                              </div>
                              <span className="text-sm leading-tight text-gray-700 font-inter">{feature.text}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    
                    {/* See all features expander - better touch target */}
                    <button
                      onClick={() => toggleFeatures(index)}
                      className={cn(
                        "mt-4 flex items-center justify-center w-full mx-auto px-4 py-2.5",
                        "text-sm font-medium text-blue-600 rounded-lg",
                        "border border-blue-100 bg-blue-50 hover:bg-blue-100",
                        "transition-colors duration-200",
                        "min-h-[44px]"
                      )}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <span className="font-inter whitespace-nowrap">
                        {isExpanded ? "Hide all features" : "See all features"}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 ml-1.5 text-blue-500 transition-transform",
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
                          className="overflow-hidden touch-action-pan-y mt-4 pt-4 border-t border-slate-100"
                          style={{ touchAction: 'pan-y' }}
                        >
                          <div className="space-y-6">
                            {Object.entries(tier.features).map(([category, features], catIndex) => (
                              <div key={`${tier.title}-${category}`} className="space-y-3">
                                {category !== "Core Features" && (
                                  <h4 className={cn(
                                    "text-sm font-semibold font-jakarta px-3 py-1 rounded-md inline-block",
                                    colorScheme.bg
                                  )}>
                                    {category}
                                  </h4>
                                )}
                                
                                <div className="space-y-3 ml-1">
                                  {features.map((feature, featIndex) => (
                                    <div 
                                      key={`${tier.title}-${category}-${featIndex}`}
                                      className="flex items-start gap-2.5"
                                    >
                                      <div className={cn(
                                        "flex-shrink-0 rounded-full p-0.5 mt-0.5",
                                        colorScheme.bg
                                      )}>
                                        <Check className={cn(
                                          "h-4 w-4 flex-shrink-0", 
                                          colorScheme.text
                                        )} />
                                      </div>
                                      <span className="text-sm leading-tight text-gray-700 font-inter">{feature.text}</span>
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
            
            {/* Interactive carousel indicators */}
            <div className="flex justify-center mt-4 space-x-3">
              {pricingTiers.map((tier, i) => (
                <button
                  key={tier.title}
                  onClick={() => jumpToCard(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeCardIndex ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View ${tier.title} plan`}
                  aria-pressed={i === activeCardIndex}
                  tabIndex={0}
                />
              ))}
            </div>
            
            {/* Navigation assistance text */}
            <div className="text-center mt-2 mb-4">
              <p className="text-xs text-gray-500">
                <span className="inline-flex items-center">
                  <ChevronDown className="h-3 w-3 rotate-90 mr-1" />
                  <ChevronDown className="h-3 w-3 -rotate-90 mr-1" />
                  Swipe or use arrows to navigate
                </span>
              </p>
            </div>
            
            {/* Add comparison info for mobile */}
            <div className="mt-4 mb-4 mx-auto text-center">
              <button
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg shadow-sm"
              >
                <span>Compare all features</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
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