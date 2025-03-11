
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { BackgroundEffects } from "./pricing/BackgroundEffects";
import { CommonFeatures } from "./pricing/CommonFeatures";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { PricingProvider } from "./pricing/PricingContext";
import { PricingContainer } from "./pricing/PricingContainer";
import { WaitlistCTA } from "./ui/waitlist-cta";

const Pricing = () => {
  const { subscription, isLoading } = useSubscription();

  return (
    <PricingProvider>
      <div className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background decorative elements */}
        <BackgroundEffects />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced header with toggle now integrated */}
          <PricingHeader 
            title="Simple, Transparent Pricing" 
            subtitle="Choose the perfect plan for your real estate photography needs. No hidden fees."
          />
          
          {/* Unified pricing container that handles both mobile and desktop layouts */}
          <div className="mt-8 sm:mt-12">
            <PricingContainer />
          </div>
          
          {/* Enhanced notes section */}
          <div className="mt-10 lg:mt-16">
            <CommonFeatures />
          </div>

          {/* Waitlist CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Not ready to commit?</h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">Join our waitlist to get notified about special offers and early access opportunities.</p>
            <WaitlistCTA source="pricing_page" />
          </div>

          {/* FAQ section */}
          <div className="mt-12 lg:mt-16">
            <PricingFAQ />
          </div>
        </div>
      </div>
    </PricingProvider>
  );
};

export default Pricing;
