
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import { PricingProvider } from "./pricing/PricingContext";
import { PricingContainer } from "./pricing/PricingContainer";
import { useIsMobile } from "@/hooks/use-mobile";

// Wrapper component that uses the pricing context and passes values to PricingHeader
const PricingContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Enhanced header with toggle now integrated */}
      <PricingHeader 
        title="PRICING TIERS" 
        subtitle="Select the package that fits your property's marketing needs"
      />
      
      {/* Container for the pricing cards */}
      <div className={cn(
        "mt-3 sm:mt-10 lg:mt-12 mb-4 sm:mb-8 lg:mb-10",
        !isMobile && "mx-auto rounded-xl shadow-sm max-w-[95%] py-8 px-4" // Only apply container div on desktop
      )}>
        <PricingContainer />
      </div>
      
      {/* Small copy text replacing the CommonFeatures component */}
      <div className="text-center text-sm text-slate-500 max-w-2xl mx-auto mt-2 mb-10">
        <p className="px-[6px] mx-[34px] text-xs font-light py-0">
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
  
  return (
    <PricingProvider>
      <div className={cn(
        "relative w-full py-4 sm:py-12 lg:py-20 overflow-hidden"
      )}>
        {/* Background decorative elements - now showing on both mobile and desktop */}
        <BackgroundEffects />
        
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
          <PricingContent />
        </div>
      </div>
    </PricingProvider>
  );
};

export default Pricing;
