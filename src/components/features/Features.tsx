import { useState, useEffect } from "react";
import { features } from "./feature-data";
import { FeatureHeader } from "./FeatureHeader";
import { BackgroundEffects } from "./BackgroundEffects";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeaturesGrid } from "./FeaturesGrid";
import { MobileViewButton } from "./MobileViewButton";

export function FeaturesSectionWithHoverEffects() {
  const isMobile = useIsMobile();
  // Always show all cards by default
  const [showAllCards, setShowAllCards] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on component mount to ensure hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to toggle showing all cards (no longer needed but kept for interface compatibility)
  const toggleShowAllCards = () => {
    setShowAllCards(true); // Always keep it true
  };

  // Always show all features
  const visibleFeatures = features;

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

          {/* MobileViewButton is kept but will always return null */}
          {mounted && (
            <div className="w-full">
              <AnimatePresence>
                <MobileViewButton
                  showAllCards={showAllCards}
                  toggleShowAllCards={toggleShowAllCards}
                  isMobile={isMobile}
                />
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </BackgroundEffects>
  );
}

// Export both named and default export for backward compatibility
export default FeaturesSectionWithHoverEffects;
