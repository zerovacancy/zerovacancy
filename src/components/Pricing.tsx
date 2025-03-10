
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import PricingHeader from "./pricing/PricingHeader";
import { PricingContent } from "./pricing/PricingContent";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const { subscription, isLoading } = useSubscription();
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden bg-white">
      {/* Background decorative elements - only show on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-right purple blob */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-100/60 to-violet-100/50 rounded-full blur-3xl" />
          
          {/* Middle-left blue blob */}
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-100/50 to-indigo-100/40 rounded-full blur-3xl" />
          
          {/* Bottom-right emerald blob */}
          <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-gradient-to-tl from-emerald-100/40 to-teal-100/30 rounded-full blur-3xl" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[size:20px_20px]"></div>
        </div>
      )}

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
        
        {/* FAQ section (condensed for pricing page) */}
        <div className="mt-12 lg:mt-16">
          <PricingFAQ />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
