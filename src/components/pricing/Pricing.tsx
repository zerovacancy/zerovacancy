
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "../pricing/PricingHeader";
import { BackgroundEffects } from "../pricing/BackgroundEffects";
import { PricingContent } from "../pricing/PricingContent";
import { CommonFeatures } from "../pricing/CommonFeatures";
import { PricingFAQ } from "../pricing/PricingFAQ";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const { subscription, isLoading } = useSubscription();
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background decorative elements - only on desktop */}
      {!isMobile && <BackgroundEffects />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced header with animation */}
        <PricingHeader 
          title="INVESTMENT TIERS" 
          subtitle="Visual storytelling that transforms vacancies into waiting lists"
        />
        
        {/* Pricing toggle and content */}
        <PricingContent 
          subscription={subscription}
          isLoading={isLoading}
        />
        
        {/* Removed CommonFeatures section as it's not in the new design */}
        
        {/* FAQ section (condensed for pricing page) */}
        <div className="mt-12 lg:mt-16">
          <PricingFAQ />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
