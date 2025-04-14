
import * as React from "react";
import { useState } from "react";
import { features } from "./feature-data";
import { FeatureHeader } from "./FeatureHeader";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeatureItem } from "./FeatureItem";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesSectionWithHoverEffects() {
  const isMobile = useIsMobile();
  const [showAllCards, setShowAllCards] = useState(false);

  // Function to toggle showing all cards
  const toggleShowAllCards = () => {
    setShowAllCards(prev => !prev);
  };

  // On mobile, show only first 3 cards
  const visibleFeatures = isMobile && !showAllCards
    ? features.slice(0, 3)
    : features;

  return (
    <section 
      id="features-section" 
      aria-labelledby="features-title"
      className={cn(
        "relative overflow-hidden",
        isMobile ? "py-8" : "py-12"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FeatureHeader 
          title="THE CREATIVE ADVANTAGE"
          description="Professional visual content that drives interest and reduces vacancy periods"
        />

        {/* Features grid */}
        <div className={cn(
          "grid",
          isMobile ? "grid-cols-1 gap-5" : "sm:grid-cols-2 lg:grid-cols-4 gap-6"
        )}>
          {visibleFeatures.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
              isPopular={feature.isPopular}
              isPartiallyVisible={false}
            />
          ))}
        </div>

        {/* View all services button (only on mobile and when cards are collapsed) */}
        {isMobile && (
          <div className="w-full mt-8 flex justify-center">
            <AnimatePresence mode="wait">
              {!showAllCards ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  key="view-all-button"
                >
                  <Button 
                    variant="default"
                    size="lg" 
                    className={cn(
                      "bg-gradient-to-r from-indigo-600 to-brand-purple",
                      "text-white font-medium",
                      "h-12 px-6 rounded-xl flex items-center justify-center" // Larger touch target
                    )}
                    onClick={toggleShowAllCards}
                  >
                    <span className="flex items-center text-base"> {/* Larger text */}
                      View complete arsenal
                      <ArrowRight className="ml-2 h-4 w-4 inline-flex" />
                    </span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  key="show-less-button"
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    className={cn(
                      "border-indigo-300 text-indigo-600 font-medium",
                      "h-12 px-6 rounded-xl flex items-center justify-center" // Larger touch target
                    )}
                    onClick={toggleShowAllCards}
                  >
                    <span className="flex items-center text-base"> {/* Larger text */}
                      Show less
                      <ChevronDown className="ml-2 h-4 w-4 rotate-180 inline-flex" />
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesSectionWithHoverEffects;
