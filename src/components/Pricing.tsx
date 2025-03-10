
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import { PricingContent } from "./pricing/PricingContent";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const { subscription, isLoading } = useSubscription();
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background decorative elements - only show on non-mobile devices */}
      {!isMobile && <BackgroundEffects />}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header section */}
        <header className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <PricingHeader 
            title="INVESTMENT TIERS" 
            subtitle="Visual storytelling that transforms vacancies into waiting lists"
          />
        </header>
        
        {/* Pricing cards section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <PricingContent 
            subscription={subscription}
            isLoading={isLoading}
          />
        </div>
        
        {/* FAQ section */}
        <footer className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <PricingFAQ />
        </footer>
      </div>
    </section>
  );
};

export default Pricing;
