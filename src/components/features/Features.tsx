
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
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <FeatureHeader 
          title="Professional Content Creation Services"
          description="Everything you need to showcase your properties with stunning visuals and engaging content that attracts the right buyers."
        />

        {/* Features grid */}
        <div className={cn(
          "grid grid-cols-1 gap-4 sm:gap-6",
          isMobile ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
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
                      "hover:from-indigo-700 hover:to-brand-purple/90 text-white font-medium",
                      "px-6 py-2 h-10 shadow-md rounded-lg"
                    )}
                    onClick={toggleShowAllCards}
                  >
                    View all services
                    <ArrowRight className="ml-2 h-4 w-4" />
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
                      "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70",
                      "text-indigo-600 font-medium px-6 py-2 h-10 rounded-lg"
                    )}
                    onClick={toggleShowAllCards}
                  >
                    Show less
                    <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
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
