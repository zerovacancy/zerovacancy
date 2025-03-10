
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorVariant, colorVariants } from "./PricingCardColors";
import { PricingFeature } from "./types";

interface DesktopPricingCardProps {
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
  isLoading?: boolean;
  savings: number | null;
  billingPeriod: "monthly" | "annually";
}

export const DesktopPricingCard = ({
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
  isLoading = false,
  savings,
  billingPeriod
}: DesktopPricingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-2xl flex flex-col h-full",
        "border bg-white/90 backdrop-blur-sm",
        highlighted ? "border-2 shadow-xl" : "border border-slate-200/70",
        highlighted ? colorStyles.border : "border-slate-200/70",
        "p-6",
        "transition-all duration-300 hover:shadow-lg",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        highlighted && "hover:-translate-y-1",
        highlighted && "bg-gradient-to-b from-white to-slate-50/80",
        highlighted && "transform scale-105 z-10"
      )}
    >
      {/* Popular tag with animated effect */}
      {showPopularTag && (
        <div className="absolute -top-5 inset-x-0 flex justify-center">
          <motion.div 
            className={cn(
              "py-1 px-4 rounded-full text-white text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.15)]",
              "bg-gradient-to-r from-brand-purple-medium to-brand-purple",
              "shadow-glow"
            )}
            animate={{ 
              boxShadow: ['0 0 10px rgba(139, 92, 246, 0.3)', '0 0 20px rgba(139, 92, 246, 0.5)', '0 0 10px rgba(139, 92, 246, 0.3)']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Most Popular
            </span>
          </motion.div>
        </div>
      )}
      
      {/* Header section */}
      <div className="mb-6">
        <h3 className={cn(
          "text-xl font-bold font-jakarta",
          colorStyles.accent
        )}>
          {title}
        </h3>
        <div className="mt-3 flex items-baseline">
          {price > 0 ? (
            <>
              <span className="text-5xl font-bold tracking-tight font-jakarta text-brand-purple-dark">${price}</span>
              <span className="ml-1 text-sm text-slate-500 font-inter">/{interval}</span>
            </>
          ) : (
            <span className="text-5xl font-bold tracking-tight font-jakarta text-brand-purple-dark">Free</span>
          )}
        </div>
        
        {/* Savings badge */}
        {savings && (
          <div className="mt-1 inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-medium">
            Save ${savings}/year
          </div>
        )}
        
        {valueProposition && (
          <p className={cn(
            "mt-3 text-sm font-medium font-inter",
            colorStyles.accent
          )}>
            {valueProposition}
          </p>
        )}
      </div>
      
      {/* Action button */}
      <motion.button
        className={cn(
          "mt-2 w-full px-4 py-4 rounded-xl text-white font-medium font-inter",
          "transition-all duration-300",
          isCurrentPlan ? "bg-green-500 cursor-default" : `bg-gradient-to-r ${colorStyles.highlight}`,
          !isCurrentPlan && "hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:translate-y-0 group"
        )}
        whileHover={{ scale: !isCurrentPlan ? 1.02 : 1 }}
        whileTap={{ scale: !isCurrentPlan ? 0.98 : 1 }}
      >
        {isCurrentPlan ? "Current Plan" : (
          <span className="flex items-center justify-center">
            {cta}
            {!isCurrentPlan && (
              <motion.span
                className="ml-1.5 inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            )}
          </span>
        )}
      </motion.button>
      
      {/* Features section */}
      <div className="mt-8 space-y-5 flex-grow">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h4 className="text-sm font-semibold text-slate-700 font-inter">
            {isExpanded ? "What's included:" : "Top features:"}
          </h4>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 flex items-center focus:outline-none font-inter hover:text-brand-purple transition-colors"
          >
            {isExpanded ? "Less" : "See all"}
            <ChevronDown className={cn(
              "ml-1 h-3 w-3 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(isExpanded ? groupedFeatures : 
            Object.fromEntries(
              Object.entries(groupedFeatures).map(([key, value]) => 
                [key, key === "Core Features" ? value.slice(0, 4) : value]
              )
            )
          ).map(([category, categoryFeatures]) => (
            <div key={category} className="space-y-2">
              {category !== "Core Features" && (
                <h5 className={cn(
                  "text-sm font-semibold mb-2",
                  colorStyles.accent
                )}>
                  {category}
                </h5>
              )}
              
              <div className="space-y-2.5">
                {categoryFeatures.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className="flex items-start group"
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
                        {feature.text}
                      </span>
                      
                      {feature.tooltip && (
                        <div className="group relative ml-1.5 mt-0.5">
                          <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-md bg-slate-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {feature.tooltip}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {!isExpanded && Object.values(groupedFeatures).flat().length > 4 && (
          <p className="text-xs text-slate-500 font-inter">
            +{Object.values(groupedFeatures).flat().length - 4} more features
          </p>
        )}
      </div>
      
      {/* Footer text */}
      {footerText && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-inter">
          {footerText}
        </div>
      )}
      
      {/* Guarantee badge for Premium plan */}
      {title === "Premium" && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center font-inter">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-emerald-600">7-day money-back guarantee</span>
        </div>
      )}
    </motion.div>
  );
};

export default DesktopPricingCard;
