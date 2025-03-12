
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import { PricingProvider } from "./pricing/PricingContext";
import { PricingContainer } from "./pricing/PricingContainer";
import { WaitlistCTA } from "./ui/waitlist-cta";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const {
    subscription,
    isLoading
  } = useSubscription();
  const isMobile = useIsMobile();
  
  return <PricingProvider>
      <div className="relative w-full py-8 sm:py-12 lg:py-20 overflow-hidden">
        {/* Background decorative elements - now showing on both mobile and desktop */}
        <BackgroundEffects />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced header with toggle now integrated */}
          <PricingHeader title="PRICING TIERS" subtitle="Select the package that fits your property's marketing needs" />
          
          {/* Unified pricing container that handles both mobile and desktop layouts */}
          <div className="mt-6 sm:mt-10 lg:mt-12 mb-6 sm:mb-8 lg:mb-10">
            <PricingContainer />
          </div>
          
          {/* Small copy text replacing the CommonFeatures component */}
          <div className="text-center text-sm text-slate-500 max-w-2xl mx-auto mt-4 mb-10">
            <p className="px-[6px] mx-[34px] mt-[-20px] text-xs font-light py-0">
              All plans include: High-resolution images, dedicated support, property website, mobile-optimized, digital downloads, no watermarks. Custom plans available for agencies and teams. 
            </p>
          </div>

          {/* Removed Waitlist CTA section as requested */}
          
          {/* Removed FAQ section as requested */}
        </div>
      </div>
    </PricingProvider>;
};

export default Pricing;
