
import { useState, useCallback, useRef, useEffect, memo } from "react";
import { features } from "./feature-data";
import { FeatureHeader } from "./FeatureHeader";
import { BackgroundEffects } from "./BackgroundEffects";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeaturesGrid } from "./FeaturesGrid";
import { MobileViewButton } from "./MobileViewButton";

// Memoized component to prevent unnecessary re-renders
const FeaturesSectionWithHoverEffects = () => {
  // Create a ref for the features section and each card
  const sectionRef = useRef<HTMLElement>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const isMobile = useIsMobile();
  
  // Function to toggle showing all cards
  const toggleShowAllCards = useCallback(() => {
    setShowAllCards(prev => !prev);
  }, []);
  
  // On mobile, only show first 3 cards initially
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 3)  // Show only first 3 cards on mobile
    : features;
  
  return (
    <section 
      className="relative py-12 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-margin-top-8" 
      id="features"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FeatureHeader 
          title="THE CREATIVE ARSENAL"
          description="Visual weaponry to transform perception and drive desire"
        />
        
        <FeaturesGrid
          features={features}
          visibleFeatures={visibleFeatures}
          isMobile={isMobile}
          showAllCards={showAllCards}
          toggleShowAllCards={toggleShowAllCards}
        />
        
        {/* View all services button */}
        <AnimatePresence mode="wait">
          <MobileViewButton
            showAllCards={showAllCards}
            toggleShowAllCards={toggleShowAllCards}
            isMobile={isMobile}
          />
        </AnimatePresence>
      </div>
    </section>
  );
};

// Export both named and default export for backward compatibility
export { FeaturesSectionWithHoverEffects };
export default memo(FeaturesSectionWithHoverEffects);
