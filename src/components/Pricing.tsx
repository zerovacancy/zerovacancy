
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import { CommonFeatures } from "./pricing/CommonFeatures";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { PricingProvider } from "./pricing/PricingContext";
import PricingContainer from "./pricing/PricingContainer";

const Pricing = () => {
  const { subscription, isLoading } = useSubscription();

  return (
    <div className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundEffects />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced header with animation */}
        <PricingHeader 
          title="Simple, Transparent Pricing" 
          subtitle="Choose the perfect plan for your real estate photography needs. No hidden fees."
        />
        
        {/* Pricing container with context */}
        <PricingProvider>
          <PricingContainer 
            subscription={subscription}
            isLoading={isLoading}
          />
        </PricingProvider>
        
        {/* Enhanced notes section */}
        <div className="mt-10 lg:mt-16">
          <CommonFeatures />
        </div>

        {/* FAQ section (condensed for pricing page) */}
        <div className="mt-12 lg:mt-16">
          <PricingFAQ />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
