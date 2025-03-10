
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingCardFeature } from "./PricingCardFeature";
import { ColorVariant } from "../PricingCardColors";
import { PricingFeature } from "../types";

interface PricingCardFeatureListProps {
  features: PricingFeature[];
  color?: ColorVariant;
}

export const PricingCardFeatureList = ({
  features,
  color = "blue"
}: PricingCardFeatureListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-8 space-y-5 flex-grow">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 className="text-sm font-semibold text-slate-700 font-inter">
          {isExpanded ? "What's included:" : "Top features:"}
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 flex items-center focus:outline-none font-inter hover:text-brand-purple transition-colors touch-manipulation"
        >
          {isExpanded ? "Less" : "See all"}
          <ChevronDown className={cn(
            "ml-1 h-3 w-3 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>
      </div>
      
      <div className="space-y-4">
        {(isExpanded ? features : features.slice(0, 4)).map((feature, index) => {
          // Check if this feature has a category heading (starts with **)
          const isHeading = feature.text.startsWith("**") && feature.text.endsWith("**");
          
          return (
            <PricingCardFeature 
              key={index}
              feature={feature.text}
              isHeading={isHeading}
              color={color}
              tooltip={feature.tooltip}
              isPrimary={feature.primary}
            />
          );
        })}
      </div>
      
      {!isExpanded && features.length > 4 && (
        <p className="text-xs text-slate-500 font-inter">
          +{features.length - 4} more features
        </p>
      )}
    </div>
  );
};
