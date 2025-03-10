
  import { useState } from "react";
  import { features } from "./feature-data";
  import { FeatureHeader } from "./FeatureHeader";
  import { AnimatePresence } from "framer-motion";
  import { useIsMobile } from "@/hooks/use-mobile";
  import { Button } from "@/components/ui/button";
  import { ArrowRight } from "lucide-react";

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
            description="Everything you need to showcase your properties with stunning visuals and engaging content that attracts the right buyers."
          />

          {/* Static Features grid with no overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {visibleFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl mb-3 text-indigo-600">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Completely separate button with no animation or overlay */}
          {isMobile && !showAllCards && (
            <div className="w-full flex justify-center mt-10">
              <Button 
                variant="default"
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-md"
                onClick={toggleShowAllCards}
              >
                View all services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Export both named and default export for backward compatibility
  export default FeaturesSectionWithHoverEffects;