import { useState } from "react";
  import { features } from "./feature-data";
  import { FeatureHeader } from "./FeatureHeader";
  import { AnimatePresence, motion } from "framer-motion";
  import { useIsMobile } from "@/hooks/use-mobile";
  import { FeatureItem } from "./FeatureItem";
  import { Button } from "@/components/ui/button";
  import { ArrowRight, ChevronDown } from "lucide-react";

  export function FeaturesSectionWithHoverEffects() {
    const isMobile = useIsMobile();
    const [showAllCards, setShowAllCards] = useState(false);

    // Function to toggle showing all cards
    const toggleShowAllCards = () => {
      setShowAllCards(prev => !prev);
    };

    // On mobile, show only first 3 cards (including Video Production)
    const visibleFeatures = isMobile && !showAllCards
      ? features.slice(0, 3)
      : features;

    return (
      <section className="relative py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <FeatureHeader 
            title="Professional Content Creation Services"
            description="Everything you need to showcase your properties with stunning visuals and engaging 
  content that attracts the right buyers."
          />

          {/* Features grid without the overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
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

          {/* Completely separate container for the button */}
          {isMobile && (
            <div className="w-full mt-8 flex justify-center">
              <AnimatePresence>
                {!showAllCards ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    key="view-all-button"
                  >
                    <Button 
                      variant="default"
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
  hover:to-purple-700 text-white font-medium px-6 shadow-md"
                      onClick={toggleShowAllCards}
                    >
                      View all services
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    key="show-less-button"
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 
  text-indigo-600 font-medium px-6"
                      onClick={toggleShowAllCards}
                    >
                      Show less
                      <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
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

  // Export both named and default export for backward compatibility
  export default FeaturesSectionWithHoverEffects;
