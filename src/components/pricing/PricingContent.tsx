
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { PricingToggle } from "./PricingToggle";
import { PricingCard } from "./card/PricingCard";
import { PricingInteraction } from "./PricingInteraction";
import { PricingFeature } from "./types";

export interface PricingContentProps {
  subscription: any;
  isLoading: boolean;
}

export const PricingContent: React.FC<PricingContentProps> = ({
  subscription,
  isLoading
}) => {
  const isMobile = useIsMobile();
  
  // Mock pricing plans data with correctly typed features
  const plans = [
    {
      title: "Free",
      features: [
        { text: "**Core Features**", category: "header" },
        { text: "Up to 3 properties" },
        { text: "Basic listing details" },
        { text: "Standard support" },
      ] as PricingFeature[],
      showPopular: false,
    },
    {
      title: "Basic",
      features: [
        { text: "**Core Features**", category: "header" },
        { text: "Up to 10 properties" },
        { text: "Enhanced listing details" },
        { text: "Priority support" },
        { text: "**Marketing Tools**", category: "header" },
        { text: "Social media sharing" },
        { text: "Basic analytics dashboard" },
      ] as PricingFeature[],
      showPopular: true,
    },
    {
      title: "Professional",
      features: [
        { text: "**Core Features**", category: "header" },
        { text: "Unlimited properties" },
        { text: "Premium listing details" },
        { text: "24/7 support" },
        { text: "**Marketing Tools**", category: "header" },
        { text: "Advanced analytics dashboard" },
        { text: "SEO-Optimized descriptions", tooltip: "Content optimized to rank higher in search results for property listings" },
        { text: "**Content Creation**", category: "header" },
        { text: "plus: 3 monthly content pieces", primary: true },
      ] as PricingFeature[],
      showPopular: false,
    },
  ];

  return (
    <div className="mt-12 lg:mt-16">
      {/* Pricing cards container */}
      {isMobile ? (
        <PricingInteraction
          starterMonth={49}
          starterAnnual={490}
          proMonth={99}
          proAnnual={990}
          plans={plans.slice(1, 3)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={index === 0 ? 0 : index === 1 ? 49 : 99}
              interval="month"
              description="Great for getting started"
              features={plan.features}
              cta={index === 0 ? "Get Started Free" : "Choose Plan"}
              highlighted={plan.showPopular}
              showPopularTag={plan.showPopular}
              valueProposition={
                index === 0
                  ? "Perfect for exploring"
                  : index === 1
                  ? "Ideal for growing teams"
                  : "Best for established businesses"
              }
              footerText={
                index === 2
                  ? "7-day money-back guarantee"
                  : undefined
              }
              subscription={subscription}
              isLoading={isLoading}
              isCurrentPlan={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
