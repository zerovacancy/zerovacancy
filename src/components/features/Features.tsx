
import { useState } from "react";
import { features } from "./feature-data";
import { FeatureHeader } from "./FeatureHeader";
import { BackgroundEffects } from "./BackgroundEffects";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeaturesGrid } from "./FeaturesGrid";
import { MobileViewButton } from "./MobileViewButton";

export function FeaturesSectionWithHoverEffects() {
  const isMobile = useIsMobile();
  const [showAllCards, setShowAllCards] = useState(false);
  
  // Function to toggle showing all cards
  const toggleShowAllCards = () => {
    setShowAllCards(prev => !prev);
    
    // Prevent scroll jumping when toggling cards
    setTimeout(() => {
      window.scrollTo({
        top: window.scrollY,
        behavior: 'auto'
      });
    }, 10);
  };
  
  // On mobile, show only first 3 cards (including Video Production)
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 3) 
    : features;
  
  return (
    <section 
      className="relative py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      // Add scroll margin to prevent overlap with sticky elements and improve scroll behavior
      style={{ scrollMarginTop: "2rem" }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.15]">
        <div className="w-full h-full bg-gradient-to-b from-purple-50/30 to-white/10"></div>
      </div>

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
        
        {/* View all services button - with improved animation handling */}
        <AnimatePresence mode="wait"> {/* Changed to "wait" mode to prevent layout shifts */}
          {(!isMobile || (isMobile && !showAllCards)) && (
            <MobileViewButton
              showAllCards={showAllCards}
              toggleShowAllCards={toggleShowAllCards}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Export both named and default export for backward compatibility
export default FeaturesSectionWithHoverEffects;
