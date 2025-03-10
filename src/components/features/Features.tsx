
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
  
  // Performance optimizations
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioning = useRef(false);
  const expandAllCards = useRef(false);
  
  // Function to toggle showing all cards with improved handling
  const toggleShowAllCards = useCallback(() => {
    if (isTransitioning.current) return;
    
    // Set transitioning to true to prevent multiple toggles
    isTransitioning.current = true;
    
    // Store current scroll position
    if (isMobile) {
      setScrollPosition(window.scrollY);
      setIsScrollLocked(true);
    }
    
    // Toggle the state
    setShowAllCards(prev => {
      expandAllCards.current = !prev;
      return !prev;
    });
    
    // Clean up any existing timeouts to prevent leaks
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Ensure we reset the transitioning state after animation completes
    animationTimeoutRef.current = setTimeout(() => {
      isTransitioning.current = false;
      setIsScrollLocked(false);
    }, 400); // Reduced animation time for better mobile performance
  }, [isMobile]);
  
  // On mobile, always show all 4 cards including "Cinematic Identity"
  const visibleFeatures = isMobile && !showAllCards 
    ? features.slice(0, 4)  // Show all 4 cards on mobile
    : features;
  
  // Optimized scroll position maintenance
  useEffect(() => {
    // Only run this effect when the transition is complete and on mobile
    if (!isTransitioning.current && !isScrollLocked && isMobile && sectionRef.current) {
      if (showAllCards) {
        // Simplified scroll position maintenance for better performance
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto' // Use 'auto' for performance
        });
      }
    }
    
    // Clean up on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [showAllCards, isMobile, isScrollLocked, scrollPosition]);
  
  return (
    <section 
      className="relative py-12 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-margin-top-8" 
      id="features"
      ref={sectionRef}
      style={{ 
        willChange: isTransitioning.current ? 'transform' : 'auto', 
        contain: isMobile ? 'layout' : 'none', // Better containment on mobile
        contentVisibility: isMobile ? 'auto' : 'visible', // Optimize rendering on mobile
        position: 'relative', // Ensure positioning context
        backfaceVisibility: 'hidden', // Improve performance
        WebkitFontSmoothing: 'antialiased', // Optimize text rendering
      }}
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
        
        {/* View all services button with improved positioning and rendering */}
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
