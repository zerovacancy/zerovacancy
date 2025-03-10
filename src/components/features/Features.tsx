
import { useState, useRef, useEffect } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  
  // Function to toggle showing all cards with scroll position preservation
  const toggleShowAllCards = () => {
    if (isMobile) {
      // Remember scroll position before change
      const scrollPosition = window.scrollY;
      
      setShowAllCards(prev => !prev);
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto" // Use auto instead of smooth to prevent additional animations
        });
      }, 10);
    } else {
      setShowAllCards(prev => !prev);
    }
  };
  
  // Add scroll anchoring to prevent jumps
  useEffect(() => {
    if (isMobile && sectionRef.current) {
      const section = sectionRef.current;
      
      // Set CSS scroll anchoring
      section.style.cssText += "overflow-anchor: auto; scroll-snap-align: start;";
      
      return () => {
        // Clean up styles
        section.style.overflowAnchor = "";
        section.style.scrollSnapAlign = "";
      };
    }
  }, [isMobile]);
  
  // On mobile, show only first 3 cards (including Video Production)
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 3) 
    : features;
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ 
        overscrollBehavior: "contain", // Prevent scroll chaining
        ...(isMobile ? { willChange: "auto" } : {}) // Optimize for mobile
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FeatureHeader 
          title="Professional Content Creation Services"
          description="Everything you need to showcase your properties with stunning visuals and engaging content that attracts the right buyers."
        />
        
        <FeaturesGrid
          features={features}
          visibleFeatures={visibleFeatures}
          isMobile={isMobile}
          showAllCards={showAllCards}
          toggleShowAllCards={toggleShowAllCards}
        />
        
        {/* View all services button (desktop and mobile) - positioned differently on mobile */}
        <AnimatePresence mode="wait">
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
