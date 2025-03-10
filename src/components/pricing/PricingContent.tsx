
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingInteraction } from "./PricingInteraction";
import { PricingCardList } from "./PricingCardList";
import { PricingToggle } from "./PricingToggle";
import { ColorVariant } from "./PricingCardColors";
import { PRICING, FEATURES, VALUE_PROPOSITIONS, PLAN_DESCRIPTIONS, PLAN_CTAS } from "./pricingData";

interface PricingContentProps {
  subscription: any;
  isLoading: boolean;
}

export const PricingContent = ({ subscription, isLoading }: PricingContentProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const isMobile = useIsMobile();

  // Plans data for the interaction component
  const pricingPlans = [
    {
      title: "THE FOUNDATION",
      price: PRICING.starterMonthly,
      features: FEATURES.foundation
    },
    {
      title: "THE NARRATIVE",
      price: PRICING.proMonthly,
      showPopular: true,
      features: FEATURES.narrative
    },
    {
      title: "THE MASTERPIECE",
      price: PRICING.premiumMonthly,
      features: FEATURES.masterpiece
    }
  ];

  // Pricing cards data with enhanced details for better conversion and categorized features
  const pricingCards = [
    {
      title: "THE FOUNDATION",
      price: PRICING.starterMonthly,
      interval: "",
      description: PLAN_DESCRIPTIONS.foundation,
      features: [
        "Essential visual narrative", 
        "Curated property moments",
        "Core spatial storytelling",
        "Foundational amenity presence",
        "48-hour creative delivery"
      ],
      cta: PLAN_CTAS.foundation,
      color: "blue" as ColorVariant,
      valueProposition: VALUE_PROPOSITIONS.foundation,
      footerText: ""
    },
    {
      title: "THE NARRATIVE",
      price: PRICING.proMonthly,
      interval: "",
      description: PLAN_DESCRIPTIONS.narrative,
      features: [
        "Expanded visual storytelling", 
        "Cinematic property sequence",
        "Elevated aerial perspective",
        "Environmental context",
        "Lifestyle integration",
        "24-hour creative delivery"
      ],
      cta: PLAN_CTAS.narrative,
      highlighted: true,
      color: "purple" as ColorVariant,
      showPopularTag: true,
      valueProposition: VALUE_PROPOSITIONS.narrative,
      footerText: ""
    },
    {
      title: "THE MASTERPIECE",
      price: PRICING.premiumMonthly,
      interval: "",
      description: PLAN_DESCRIPTIONS.masterpiece,
      features: [
        "Comprehensive visual identity",
        "Feature-length property film",
        "Signature aerial sequences",
        "Neighborhood integration",
        "Staged lifestyle vignettes",
        "Same-day priority creation",
        "Full commercial sovereignty"
      ],
      cta: PLAN_CTAS.masterpiece,
      color: "emerald" as ColorVariant,
      valueProposition: VALUE_PROPOSITIONS.masterpiece,
      footerText: ""
    }
  ];

  return (
    <>
      {/* Removed pricing toggle since we don't need yearly/monthly toggle */}
      
      {/* Pricing Cards with increased vertical spacing */}
      <div className="mt-8 sm:mt-10">
        {isMobile ? (
          <div className="flex justify-center">
            <PricingInteraction 
              starterMonth={PRICING.starterMonthly}
              starterAnnual={PRICING.starterAnnual}
              proMonth={PRICING.proMonthly}
              proAnnual={PRICING.proAnnual}
              plans={pricingPlans}
            />
          </div>
        ) : (
          <PricingCardList 
            cards={pricingCards} 
            subscription={subscription}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Add Creative Satisfaction section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">CREATIVE SATISFACTION</h2>
        <p className="max-w-3xl mx-auto text-slate-600">
          We believe in the power of collaborative vision. If you're not captivated by the final creation, 
          we'll refine until you are. If we cannot align our visions, your investment returns to you in full.
        </p>
      </div>
    </>
  );
};
