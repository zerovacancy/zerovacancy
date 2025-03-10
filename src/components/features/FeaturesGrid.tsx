
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
    return (
      <motion.div
        key={`feature-${feature.title}`}
        layout="position"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ 
          duration: 0.25,
          delay: index * 0.05,
          ease: "easeOut",
          layout: { duration: 0.25, ease: "easeOut" }
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

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative"
      style={{ 
        minHeight: isMobile && !showAllCards ? "430px" : "auto",
        position: "relative"
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
