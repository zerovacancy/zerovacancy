
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { PricingProvider, usePricing } from "./pricing/PricingContext";
import { PricingContainer } from "./pricing/PricingContainer";
import { MobilePricingToggle } from "./pricing/MobilePricingToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { isLandscapeMode } from "@/utils/mobile-optimization";
import * as React from "react";
const { useState, useEffect } = React;
import { pricingPatternPaper, generateBackgroundWithPattern } from "@/utils/background-patterns";

// Wrapper component that uses the pricing context and passes values to PricingHeader
const PricingContent = () => {
  const { isYearly, setIsYearly, animateChange } = usePricing();
  const isMobile = useIsMobile();
  const [isLandscape, setIsLandscape] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  
  // Update landscape state when orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(isLandscapeMode());
    };
    
    // Check initially
    checkOrientation();
    
    // Add listeners for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  // Track sticky header visibility for coordination with PricingContainer
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerOffset = 200; // Approximate offset where sticky header appears
      
      setShowStickyHeader(scrollPosition > headerOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  return (
    <>
      <div className={cn(
        "w-full",
        isMobile && "bg-white border border-blue-200/50 rounded-2xl px-4 pt-5 pb-4 shadow-md mb-3 mt-4",
        // Add distinctive blue gradient background for better differentiation from Features section
        isMobile && "bg-gradient-to-b from-white via-white to-blue-50/30",
        isLandscape && "py-3 mb-2"
      )}>
        {/* Header and toggle integrated directly */}
        <PricingHeader 
          title="PRICING PLANS" 
          subtitle="Select the package that fits your property's marketing needs"
          isYearly={isYearly}
          setIsYearly={setIsYearly}
          animateChange={animateChange}
          showStickyHeader={showStickyHeader}
        />
      </div>
      
      {/* Removed wrapping div around PricingContainer for mobile */}
      <div className={cn(
        "mt-4 sm:mt-10 lg:mt-12 mb-6 sm:mb-8 lg:mb-10",
        !isMobile && "mx-auto rounded-xl shadow-sm max-w-[95%] py-8 px-4", // Only apply container div on desktop
        isLandscape && "landscape-content-fix mt-2 mb-2 py-2" // Apply landscape specific fixes
      )}>
        <PricingContainer showStickyHeader={showStickyHeader} />
      </div>
      
      {/* Small copy text replacing the CommonFeatures component */}
      <div className={cn(
        "text-center text-sm text-slate-500 max-w-2xl mx-auto mt-3 mb-10",
        isMobile && "px-4 mb-8 bg-blue-50/40 py-4 rounded-xl border border-blue-100/50 shadow-sm",
        isLandscape && "mt-1 mb-4 landscape-text-fix" // Reduce margins in landscape mode
      )}>
        <p className={cn(
          "text-xs font-light text-blue-700",
          isLandscape && "mt-[-10px]" // Adjust top margin in landscape
        )}>
          All plans include: High-resolution images, dedicated support, property website, mobile-optimized, digital downloads, no watermarks. Custom plans available for agencies and teams. 
        </p>
      </div>
    </>
  );
};

const Pricing = () => {
  const {
    subscription,
    isLoading
  } = useSubscription();
  
  // Get mobile state
  const isMobile = useIsMobile();
  
  // Track landscape mode
  const [isLandscape, setIsLandscape] = useState(false);
  
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(isLandscapeMode());
    };
    
    // Check initially
    checkOrientation();
    
    // Add listeners for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  return (
    <PricingProvider>
      <div className={cn(
        "relative w-full overflow-visible",
        !isMobile && "bg-[#E5F0FD]", // Updated to match new index.tsx background
        isMobile && "pricing-section", // Add identifier class for mobile
        isLandscape && "landscape-pricing sm:py-4" // Apply landscape specific classes
      )}>
        {/* Mobile-only decorative element to enhance visual distinction */}
        {isMobile && (
          <div className="absolute top-[-10px] left-0 right-0 flex justify-center opacity-70">
            <div className="w-[85%] h-[25px] bg-blue-100/30 rounded-full blur-xl transform translate-y-[-50%]"></div>
          </div>
        )}
        
        <div className={cn(
          "relative z-10 transition-all duration-500",
          isLandscape && "px-2 sm:px-3", // Reduce padding in landscape mode
          isMobile && "pt-2" // Add slight top padding on mobile
        )} style={{ willChange: 'transform, opacity' }}>
          <PricingContent />
        </div>
      </div>
    </PricingProvider>
  );
};

export default Pricing;
