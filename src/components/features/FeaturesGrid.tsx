
import { memo } from "react";
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
  features,
  visibleFeatures,
  isMobile,
  showAllCards,
  toggleShowAllCards
}: FeaturesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative">
      <AnimatePresence>
        {visibleFeatures.map((feature, index) => (
          <motion.div
            key={`feature-${feature.title}`}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut",
              layout: { 
                duration: 0.3,
                ease: "easeOut"
              }
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
        ))}
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
