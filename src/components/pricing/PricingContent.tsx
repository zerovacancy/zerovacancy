
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingCardList } from "./PricingCardList";
import { PricingToggle } from "./PricingToggle";
import { ColorVariant } from "./PricingCardColors";
import { PRICING, SAVINGS, FEATURES, VALUE_PROPOSITIONS, PLAN_DESCRIPTIONS, PLAN_CTAS } from "./pricingData";

interface PricingContentProps {
  subscription: any;
  isLoading: boolean;
}

export const PricingContent = ({ subscription, isLoading }: PricingContentProps) => {
  const [isYearly, setIsYearly] = useState(true);
  const isMobile = useIsMobile();

  // Pricing cards data with enhanced details for better conversion and categorized features
  const pricingCards = [
    {
      title: "Basic (Free)",
      price: 0,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.starter,
      features: [
        "**Access & Discovery**", 
        "Browse & Discover Content Creators – Explore available photographers, videographers, and media professionals.",
        "Limited Access to Creator Profiles – View portfolios to assess style and quality.",
        "Preview Marketplace Features – Get familiar with the platform before upgrading."
      ],
      cta: "Start for Free",
      color: "blue" as ColorVariant,
      valueProposition: VALUE_PROPOSITIONS.starter,
      footerText: "🚀 Upgrade to unlock project requests and premium content!"
    },
    {
      title: "Professional",
      price: isYearly ? PRICING.proAnnual : PRICING.proMonthly,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.pro,
      features: [
        "**Submit Requests for Proposals (RFPs)**", 
        "Connect directly with top-tier creators to get competitive offers.",
        "Browse & Hire Premium Creators – Access vetted professionals for high-quality photography and video.",
        "1 Revision Included Per Project – Ensure content meets your expectations.",
        "**Content Optimization**",
        "Social Media Optimized Content – Get media tailored for Instagram, Facebook, LinkedIn, and more.",
        "SEO-Optimized Content – Improve your property's visibility in search results.",
        "Geo-Targeted Content – Target potential renters/buyers in specific locations for better engagement."
      ],
      cta: "Choose Professional",
      highlighted: true,
      color: "purple" as ColorVariant,
      showPopularTag: true,
      valueProposition: VALUE_PROPOSITIONS.pro,
      footerText: "🚀 Upgrade to Premium for more revisions, deeper insights, and content that works across all marketing channels."
    },
    {
      title: "Premium",
      price: isYearly ? PRICING.premiumAnnual : PRICING.premiumMonthly,
      interval: isYearly ? "mo" : "mo",
      description: PLAN_DESCRIPTIONS.premium,
      features: [
        "**Premium Requests & Access**",
        "Submit Requests for Proposals (RFPs) Instantly – Connect with elite creators faster.",
        "Browse & Hire Premium Creators – Work with top-rated professionals for stunning visuals.",
        "3 Revisions Included Per Project – Get the perfect content without extra costs.",
        "**Advanced Content Optimization**",
        "Social Media Optimized Content – High-performing visuals and videos for social platforms.",
        "SEO-Optimized Content – Rank higher in searches and attract more organic traffic.",
        "Geo-Targeted Content – Precision targeting ensures your content reaches the right audience.",
        "Marketing Channel Optimization – Content fine-tuned for maximum performance on email, listings, ads & more.",
        "**Premium Benefits**",
        "7-Day Money-Back Guarantee – Try risk-free, ensuring total satisfaction.",
        "Performance Insights Dashboard – Track engagement and effectiveness of your marketing assets."
      ],
      cta: "Upgrade to Premium",
      color: "emerald" as ColorVariant,
      valueProposition: VALUE_PROPOSITIONS.premium,
      footerText: PLAN_CTAS.premium
    }
  ];

  return (
    <>
      {/* TEST CHANGE */}
      <div className="bg-red-500 text-white p-4 text-center font-bold mb-4">
        TEST - MOBILE VIEW PRICING UPDATE
      </div>
      
      {/* Pricing Toggle - For both Desktop and Mobile */}
      <div className={cn(
        "flex justify-center",
        isMobile ? "mt-4 mb-6" : "mt-10 mb-12" 
      )}>
        <PricingToggle 
          isYearly={isYearly} 
          setIsYearly={setIsYearly}
        />
      </div>
      
      {/* Pricing Cards with increased vertical spacing */}
      <div className="mt-8 sm:mt-10">
        {/* Use PricingCardList for both mobile and desktop */}
        <PricingCardList 
          cards={pricingCards.map(card => ({
            ...card,
            interval: isYearly ? "mo, billed annually" : "mo"
          }))} 
          subscription={subscription}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
