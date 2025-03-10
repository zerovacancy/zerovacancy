import { useState, useCallback, useRef, useEffect } from "react";
import { features } from "./feature-data";
import { FeatureHeader } from "./FeatureHeader";
import { BackgroundEffects } from "./BackgroundEffects";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeaturesGrid } from "./FeaturesGrid";
import { MobileViewButton } from "./MobileViewButton";

export function FeaturesSectionWithHoverEffects() {
  // Create a ref for the features section
  const sectionRef = useRef<HTMLElement>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const isMobile = useIsMobile();
  
  // Track if we're currently animating to prevent multiple transitions
  const isTransitioning = useRef(false);
  
  // Function to toggle showing all cards with improved handling
  const toggleShowAllCards = useCallback(() => {
    if (isTransitioning.current) return;
    
    // Set transitioning to true to prevent multiple toggles
    isTransitioning.current = true;
    
    // Toggle the state
    setShowAllCards(prev => !prev);
    
    // Ensure we reset the transitioning state after animation completes
    setTimeout(() => {
      isTransitioning.current = false;
    }, 500); // Match this to animation duration
  }, []);
  
  // On mobile, show only first 3 cards (including Video Production)
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 3) 
    : features;
  
  // Effect to fix scroll position after expanding/collapsing
  useEffect(() => {
    if (showAllCards && sectionRef.current && isMobile) {
      // Use timeout to let DOM update first
      const timeoutId = setTimeout(() => {
        // Get the position of the section
        const sectionPos = sectionRef.current?.getBoundingClientRect().top || 0;
        const scrollPos = window.scrollY + sectionPos - 20;
        
        // Smooth scroll to keep the section in view
        window.scrollTo({
          top: scrollPos,
          behavior: 'smooth'
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showAllCards, isMobile]);
  
  return (
    <section 
      className="relative py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-margin-top-8" 
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
        
        {/* View all services button (desktop and mobile) */}
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
