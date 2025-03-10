
import { memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureItem } from "./FeatureItem";
import { MobilePartialOverlay } from "./MobilePartialOverlay";

interface FeaturesGridProps {
  features: Array<{
    title: string;
    description: string;
    icon: string;
    isPopular?: boolean;
    actionText?: string;
  }>;
  visibleFeatures: Array<{
    title: string;
    description: string;
    icon: string;
    isPopular?: boolean;
    actionText?: string;
  }>;
  isMobile: boolean;
  showAllCards: boolean;
  toggleShowAllCards: () => void;
}

export const FeaturesGrid = memo(({
  visibleFeatures,
  isMobile,
  showAllCards,
  toggleShowAllCards
}: FeaturesGridProps) => {
  // Memoize the card renderer for better performance
  const renderFeatureCard = useCallback((feature: any, index: number) => {
    // Calculate a stable animation delay with reduced values for mobile
    const delay = isMobile ? Math.min(index * 0.03, 0.1) : Math.min(index * 0.05, 0.3);
    
    // Optimized motion component for mobile
    return (
      <motion.div
        key={`feature-${feature.title}`}
        layout="position"
        initial={{ opacity: 0, scale: 0.98 }} // Reduced scale change for better performance
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ 
          duration: isMobile ? 0.2 : 0.25, // Faster animations on mobile
          delay: isMobile ? delay / 2 : delay, // Reduced delay on mobile
          ease: "easeOut",
          layout: { 
            duration: isMobile ? 0.15 : 0.25, // Faster layout transitions on mobile
            ease: "easeOut"
          }
        }}
        style={{ 
          willChange: "transform, opacity", 
          transform: "translateZ(0)", // Force GPU rendering
          backfaceVisibility: "hidden", // Prevent flickering
          WebkitFontSmoothing: "antialiased", // Better text rendering
          height: "auto", // Consistent height for improved layout stability
          contentVisibility: "auto", // Optimize rendering on mobile
        }}
      >
        <FeatureItem
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={index}
          isPopular={feature.isPopular}
          isPartiallyVisible={false}
          actionText={feature.actionText}
        />
      </motion.div>
    );
  }, [isMobile]);

  // Optimized grid layout for better mobile performance
  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative`}
      style={{ 
        minHeight: isMobile ? (showAllCards ? "auto" : "430px") : "auto",
        willChange: showAllCards ? "auto" : "transform",
        transform: "translateZ(0)", // Force GPU rendering
        backfaceVisibility: "hidden", // Prevent flickering
        WebkitFontSmoothing: "antialiased", // Better text rendering
        contentVisibility: "auto", // Optimize rendering
        containIntrinsicSize: "auto 450px", // Help browser with content estimation
      }}
    >
      <AnimatePresence mode="sync">
        {visibleFeatures.map(renderFeatureCard)}
      </AnimatePresence>
      
      {/* Partial card overlay with View More button (mobile only) */}
      <AnimatePresence>
        {isMobile && !showAllCards && (
          <MobilePartialOverlay 
            showAllCards={showAllCards} 
            toggleShowAllCards={toggleShowAllCards} 
          />
        )}
      </AnimatePresence>
    </div>
  );
});

FeaturesGrid.displayName = "FeaturesGrid";

export default FeaturesGrid;
