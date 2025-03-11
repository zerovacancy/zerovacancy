
  "use client";

  import React from "react";
  import { cn } from "@/lib/utils";
  import { motion } from "framer-motion";
  import { CheckIcon } from "lucide-react";
  import { useIsMobile } from "@/hooks/use-mobile";

  // Fix import paths to point to the correct location
  // If these components are in src/components/pricing/ folder:
  import { PricingCardHeader } from "@/components/pricing/PricingCardHeader";
  import { PricingFeaturesList } from "@/components/pricing/PricingFeaturesList";
  import { PricingActionButton } from "@/components/pricing/PricingActionButton";
  import { PricingType } from "@/components/pricing/types";

  interface PricingCardProps {
    className?: string;
    plan: PricingType;
    features: string[];
    isHighlighted?: boolean;
    showPopularTag?: boolean;
    annualBilling?: boolean;
    highlightedFeatures?: string[];
    includedFeatures?: string[];
    children?: React.ReactNode;
    footer?: React.ReactNode;
  }

  export function Pricing({
    className,
    plan,
    features = [], // Provide a default empty array
    isHighlighted = false,
    showPopularTag = false,
    annualBilling = false,
    highlightedFeatures = [],
    includedFeatures = [],
    children,
    footer,
  }: PricingCardProps) {
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    };

    const isMobile = useIsMobile();

    // Ensure allFeatures only spreads arrays
    const allFeatures = [...(Array.isArray(features) ? features : []), ...(Array.isArray(includedFeatures) ? includedFeatures : [])];

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={cn(
          "rounded-2xl p-6 sm:p-8",
          "border",
          "flex flex-col",
          "transition-all duration-300 ease-in-out", 
          "relative",
          isHighlighted
            ? [
              "bg-white",
              "from-purple-50 to-indigo-50/60",
              "shadow-xl",
              "ring-1 ring-indigo-200",
              "border-indigo-200/60",
              isMobile && "shadow-lg"
            ] 
            : [
              "bg-white/80",
              "border-gray-200/70",
              isMobile ? "backdrop-blur-sm" : "backdrop-blur-md",
              "hover:shadow-lg hover:border-indigo-200/50"
            ],
          className
        )}
      >
        {/* Popular tag with improved positioning */}
        {showPopularTag && (
          <motion.div 
            className="absolute -top-6 sm:-top-7 inset-x-0 flex justify-center z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.2,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
          >
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md">
              Most Popular
            </span>
          </motion.div>
        )}

        <div className="flex-1 flex flex-col">
          <PricingCardHeader
            title={plan.title}
            price={annualBilling ? plan.priceAnnual : plan.priceMonthly}
            description={plan.description}
            isHighlighted={isHighlighted}
          />

          <PricingFeaturesList 
            features={allFeatures}
            highlightedFeatures={highlightedFeatures}
            isHighlighted={isHighlighted}
            className="mt-6 flex-1"
          />

          <div className="mt-6">
            <PricingActionButton 
              cta={plan.cta} 
              isHighlighted={isHighlighted}
            />
          </div>
        </div>

        {footer && (
          <div className={cn(
            "mt-6 pt-6",
            "border-t border-gray-200",
            isHighlighted && "border-indigo-100"
          )}>
            {footer}
          </div>
        )}

        {children}
      </motion.div>
    );
  }

  export default Pricing;
