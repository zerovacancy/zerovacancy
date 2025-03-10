
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorVariant, colorVariants } from "./PricingCardColors";
import { usePricingContext } from "./PricingContext";
import { PricingFeature } from "./types";

interface MobilePricingCardProps {
  title: string;
  price: number;
  interval: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  color?: ColorVariant;
  highlighted?: boolean;
  showPopularTag?: boolean;
  valueProposition?: string;
  footerText?: string;
  isCurrentPlan?: boolean;
  index: number;
  savings: number | null;
}

export const MobilePricingCard = ({
  title,
  price,
  interval,
  description,
  features,
  cta,
  color = "blue",
  highlighted = false,
  showPopularTag = false,
  valueProposition,
  footerText,
  isCurrentPlan = false,
  index,
  savings
}: MobilePricingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(index === 1); // Expand the recommended plan by default
  const { activeCardIndex, setActiveCardIndex } = usePricingContext();
  const colorStyles = colorVariants[color];
  
  // Group features by category
  const groupedFeatures = features.reduce((groups, feature) => {
    const category = feature.category || "Core Features";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, PricingFeature[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "rounded-xl shadow-md overflow-hidden",
        "border-2",
        highlighted ? colorStyles.border : "border-slate-200/70",
        "transition-all duration-300"
      )}
    >
      {/* Card Header */}
      <div 
        className={cn(
          "p-4",
          highlighted ? "bg-gradient-to-r from-brand-purple/5 to-brand-purple/10" : "bg-white"
        )}
      >
        <div className="flex justify-between items-start">
          {/* Plan details */}
          <div>
            {/* Title with popular tag */}
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "text-xl font-bold",
                colorStyles.accent
              )}>
                {title}
              </h3>
              
              {showPopularTag && (
                <div className="bg-brand-purple text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </div>
              )}
            </div>
            
            {/* Price display */}
            <div className="mt-2">
              <div className="flex items-baseline">
                {price > 0 ? (
                  <>
                    <span className="text-3xl font-bold tracking-tight text-gray-900">${price}</span>
                    <span className="ml-1 text-sm text-gray-500">/{interval}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold tracking-tight text-gray-900">Free</span>
                )}
              </div>
              
              {/* Savings badge */}
              {savings && (
                <div className="mt-1 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-medium">
                  Save ${savings}/year
                </div>
              )}
            </div>
            
            {/* Value proposition */}
            {valueProposition && (
              <p className="mt-2 text-sm text-gray-500">
                {valueProposition}
              </p>
            )}
          </div>
          
          {/* Toggle expand/collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "rounded-full p-2",
              "transition-colors",
              highlighted ? "bg-brand-purple/10 text-brand-purple" : "bg-gray-100 text-gray-500"
            )}
          >
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
        </div>
        
        {/* CTA button */}
        <button
          className={cn(
            "mt-4 w-full py-3 rounded-lg font-medium",
            "transition-all duration-200",
            isCurrentPlan 
              ? "bg-green-500 text-white cursor-default" 
              : `bg-gradient-to-r ${colorStyles.highlight} text-white`
          )}
        >
          {isCurrentPlan ? "Current Plan" : cta}
        </button>
      </div>
      
      {/* Expandable features section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-4 border-t border-gray-100">
              {/* Features list by category */}
              <div className="space-y-4">
                {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                  <div key={category} className="space-y-2">
                    {category !== "Core Features" && (
                      <h4 className={cn(
                        "text-sm font-semibold px-2 py-0.5 rounded inline-block",
                        colorStyles.bg,
                        colorStyles.accent
                      )}>
                        {category}
                      </h4>
                    )}
                    
                    <div className="space-y-2.5">
                      {categoryFeatures.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-start"
                        >
                          <span className={cn(
                            "mr-2 rounded-full p-0.5 mt-0.5",
                            colorStyles.bg
                          )}>
                            <Check className={cn(
                              "h-3.5 w-3.5",
                              colorStyles.accent
                            )} />
                          </span>
                          
                          <span className="text-sm text-gray-700 flex items-start">
                            {feature.text}
                            
                            {feature.tooltip && (
                              <span className="group relative inline-block ml-1">
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                  {feature.tooltip}
                                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
                                </span>
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer text */}
              {footerText && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  {footerText}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobilePricingCard;
