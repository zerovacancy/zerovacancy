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
  
  // Function to toggle showing all cards
  const toggleShowAllCards = () => {
    setShowAllCards(prev => !prev);
  };
  
  // On mobile, show only first 3 cards (including Video Production)
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 3) 
    : features;
  
  // Improve scrolling by preventing scroll snap or scroll jumps
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    // Ensure this section doesn't cause scroll jumping
    const handleWheel = (e: WheelEvent) => {
      const { deltaY } = e;
      const scrollHeight = section.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Only if the section is taller than the viewport or we're close to section boundaries
      if (scrollHeight > viewportHeight) {
        const rect = section.getBoundingClientRect();
        const isNearTop = rect.top > -100 && rect.top < 100;
        const isNearBottom = rect.bottom > viewportHeight - 100 && rect.bottom < viewportHeight + 100;
        
        if ((isNearTop && deltaY < 0) || (isNearBottom && deltaY > 0)) {
          // We're at the edge of the section and scrolling beyond it
          return;
        }
        
        // Otherwise, we're scrolling within this section
        if (Math.abs(deltaY) > 20) {
          // For larger scroll amounts, let the browser handle it
          return;
        }
      }
    };
    
    section.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      section.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-visible"
      id="features"
    >
      <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.15] bg-gradient-to-b from-violet-50 to-white"></div>

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
        
        {/* View all services button (desktop and mobile) - positioned differently on mobile */}
        <AnimatePresence>
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
