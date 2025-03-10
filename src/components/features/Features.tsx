
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
  };

  // On mobile, show only first 3 cards (including Video Production)
  const visibleFeatures = isMobile && !showAllCards
    ? features.slice(0, 3)
    : features;

  return (
    <BackgroundEffects
      blobColors={{
        first: "bg-indigo-100",
        second: "bg-blue-100",
        third: "bg-violet-100"
      }}
      blobOpacity={0.12}
      withSpotlight={true}
      spotlightClassName="from-indigo-500/5 via-blue-500/5 to-violet-500/5"
      pattern="none"
      baseColor="bg-white/80"
      animationSpeed="slow"
      className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FeatureHeader 
          title="Professional Content Creation Services"
          description="Everything you need to showcase your properties with stunning visuals and engaging content that attracts the right buyers."
        />

        <div className="flex flex-col">
          <FeaturesGrid
            features={features}
            visibleFeatures={visibleFeatures}
            isMobile={isMobile}
            showAllCards={showAllCards}
            toggleShowAllCards={toggleShowAllCards}
          />

          {/* Only show mobile button when on mobile */}
          <div className="w-full">
            <AnimatePresence>
              {isMobile && (
                <MobileViewButton
                  showAllCards={showAllCards}
                  toggleShowAllCards={toggleShowAllCards}
                  isMobile={isMobile}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BackgroundEffects>
  );
}

// Export both named and default export for backward compatibility
export default FeaturesSectionWithHoverEffects;
