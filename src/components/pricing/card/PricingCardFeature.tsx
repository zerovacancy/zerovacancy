
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorVariant, colorVariants } from "../PricingCardColors";

interface PricingCardFeatureProps {
  feature: string;
  isHeading: boolean;
  color?: ColorVariant;
  tooltip?: string;
  isPrimary?: boolean;
}

export const PricingCardFeature = ({
  feature,
  isHeading,
  color = "blue",
  tooltip,
  isPrimary = false
}: PricingCardFeatureProps) => {
  const colorStyles = colorVariants[color];
  const featureText = isHeading ? feature.slice(2, -2) : feature;
  const hasPlusPrefix = feature.includes("plus:");
  
  if (isHeading) {
    return (
      <div className="pt-2 first:pt-0">
        <h5 className={cn(
          "text-sm font-semibold mb-2",
          colorStyles.accent
        )}>
          {featureText}
        </h5>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex items-start group",
        (isPrimary || hasPlusPrefix) && "font-medium"
      )}
    >
      <span className={cn(
        "mr-2.5 rounded-full p-0.5 flex-shrink-0 mt-0.5 transition-colors",
        colorStyles.bg,
        "group-hover:bg-opacity-100"
      )}>
        <Check className={cn(
          "h-3.5 w-3.5",
          colorStyles.accent
        )} />
      </span>
      
      <div className="flex items-start flex-1">
        <span className="text-sm text-slate-700 font-inter">
          {featureText.replace("plus:", "")}
        </span>
        
        {/* Add tooltip if provided */}
        {tooltip && (
          <div className="group relative ml-1.5 mt-0.5">
            <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-md bg-slate-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
