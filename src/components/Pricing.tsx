
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import PricingCardList from "./pricing/PricingCardList";
import { PricingContext } from "./pricing/PricingContext";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { PricingFeatures } from "./pricing/PricingFeatures";
import { pricingData } from "./pricing/pricingData";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import PricingContainer from "./pricing/PricingContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Pricing = () => {
  const isMobile = useIsMobile();
  const { subscription, isLoading } = useSubscription();
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // We'll convert this to a function we can use in our templates
  const toggleFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };
  
  return (
    <section 
      id="pricing" 
      className={cn(
        "relative w-full py-16 md:py-20 overflow-hidden",
        "bg-gradient-to-b from-slate-50 to-white"
      )}
    >
      {/* Subtle animated background effects */}
      <BackgroundEffects />
      
      {/* Create context for pricing components */}
      <PricingContext.Provider value={{
        isLoading,
        subscription,
        toggleFeatures,
        showAllFeatures
      }}>
        {/* Main content container */}
        <div className="container px-4 md:px-6 relative z-10">
          {/* Section header with title and description */}
          <div className="mb-8 md:mb-10 text-center">
            <h2 className="font-bold tracking-tight text-3xl md:text-4xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
              Choose the plan that's right for you and start connecting with creators today.
            </p>
          </div>
          
          {/* Pricing cards container */}
          <PricingContainer />
        </div>
      
      {/* Small copy text replacing the CommonFeatures component */}
      <div className="text-center mt-6 mb-12 px-4">
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          All plans include unlimited creator searches, message templates, 
          and basic analytics. Upgrade anytime as your needs grow.
        </p>
      </div>

      {/* Hide the features section by default */}
      {showAllFeatures && (
        <div className="container px-4 md:px-6 mt-12 relative z-10">
          <PricingFeatures features={pricingData.commonFeatures} />
        </div>
      )}
      
      {/* Add FAQ section */}
      <div className="container px-4 md:px-6 mt-16 md:mt-20 relative z-10">
        <PricingFAQ />
      </div>
      </PricingContext.Provider>
    </section>
  );
};

export default Pricing;
