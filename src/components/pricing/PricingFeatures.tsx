
import React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Info } from "lucide-react";
import { PricingFeature } from "./types";
import { motion } from "framer-motion";

interface PricingFeaturesProps {
  features: PricingFeature[];
  expandedFeatures: boolean;
  toggleFeatures: () => void;
  planIndex: number;
}

export const PricingFeatures: React.FC<PricingFeaturesProps> = ({
  features,
  expandedFeatures,
  toggleFeatures,
  planIndex,
}) => {
  // Group features by category
  const groupedFeatures = React.useMemo(() => {
    const grouped: { [key: string]: PricingFeature[] } = {};
    const defaultGroup = "Core Features";
    
    features.forEach(feature => {
      // Check if feature text has a category in brackets like [Category]
      const categoryMatch = feature.text.match(/^\[([^\]]+)\]/);
      const category = categoryMatch ? categoryMatch[1] : defaultGroup;
      const cleanText = categoryMatch ? feature.text.replace(/^\[[^\]]+\]\s*/, '') : feature.text;
      
      // Create modified feature with clean text
      const modifiedFeature = {
        ...feature,
        text: cleanText
      };
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(modifiedFeature);
    });
    
    return grouped;
  }, [features]);
  
  // Get color styles based on plan index
  const getColorStyles = (index: number) => {
    if (index === 0) {
      return {
        bg: "bg-blue-50/70",
        text: "text-blue-600",
        accent: "bg-blue-100"
      };
    } else if (index === 1) {
      return {
        bg: "bg-brand-purple/10",
        text: "text-brand-purple",
        accent: "bg-brand-purple/20"
      };
    } else {
      return {
        bg: "bg-emerald-50/70",
        text: "text-emerald-600", 
        accent: "bg-emerald-100"
      };
    }
  };
  
  const colorStyles = getColorStyles(planIndex);
  
  // Feature explanations for tooltips
  const featureExplanations: { [key: string]: string } = {
    "SEO-Optimized": "Content optimized to rank higher in search results for property listings",
    "Geo-Targeted": "Content targeted to specific geographic regions relevant to your properties",
    "RFPs": "Request for Proposals - Get competitive offers from creators",
    "Revisions": "Number of content revision rounds included in your plan"
  };
  
  // Get tooltip text if available
  const getTooltip = (text: string): string | null => {
    for (const key in featureExplanations) {
      if (text.includes(key)) {
        return featureExplanations[key];
      }
    }
    return null;
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-slate-700 font-inter">
          {expandedFeatures ? "What's included:" : "Top features:"}
        </h4>
        <button
          onClick={toggleFeatures}
          className="text-xs text-slate-500 flex items-center focus:outline-none font-inter hover:text-brand-purple transition-colors touch-manipulation"
        >
          {expandedFeatures ? "Less" : "See all"}
          <ChevronDown
            className={cn(
              "ml-1 h-3 w-3 transition-transform",
              expandedFeatures && "rotate-180"
            )}
          />
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(expandedFeatures ? groupedFeatures : 
          // If not expanded, just show first group or first few features
          Object.entries(groupedFeatures).slice(0, 1).reduce((acc, [key, value]) => {
            acc[key] = value.slice(0, 4);
            return acc;
          }, {} as { [key: string]: PricingFeature[] })
        ).map(([category, categoryFeatures], categoryIndex) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-3"
          >
            {/* Only show category header if it's not the default "Core Features" or we have multiple categories */}
            {(category !== "Core Features" || Object.keys(groupedFeatures).length > 1) && (
              <div className={cn(
                "text-xs font-medium mb-2 px-2 py-1 rounded-md inline-block",
                colorStyles.accent
              )}>
                {category}
              </div>
            )}
            
            <div className="space-y-2.5">
              {categoryFeatures.map((feature, featureIndex) => {
                const tooltip = getTooltip(feature.text);
                
                return (
                  <motion.div
                    key={featureIndex}
                    className={cn(
                      "flex items-start group transition-all",
                      feature.primary && "font-medium"
                    )}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className={cn(
                        "mr-2 rounded-full p-0.5 flex-shrink-0 mt-0.5",
                        colorStyles.bg
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check
                        className={cn(
                          "h-3.5 w-3.5",
                          colorStyles.text
                        )}
                      />
                    </motion.span>
                    
                    <span className="text-sm text-slate-700 font-inter flex items-start gap-1">
                      {feature.text.replace("plus:", "")}
                      
                      {/* Tooltip icon for features that need explanation */}
                      {tooltip && (
                        <div className="group relative inline-flex">
                          <Info className={cn(
                            "h-3.5 w-3.5 text-slate-400 cursor-help ml-1 mt-0.5",
                            `hover:${colorStyles.text}`
                          )} />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-md bg-slate-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {tooltip}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                          </div>
                        </div>
                      )}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {!expandedFeatures && features.length > 4 && (
        <p className="text-xs text-slate-500 font-inter mt-2 italic">
          +{features.length - 4} more features
        </p>
      )}
    </div>
  );
};
