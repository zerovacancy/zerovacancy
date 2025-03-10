
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

export const FeaturesGrid = ({
  features,
  visibleFeatures,
  isMobile,
  showAllCards,
  toggleShowAllCards
}: FeaturesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative">
      {/* Regular Features */}
      {visibleFeatures.map((feature, index) => (
        <FeatureItem
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={index}
          isPopular={feature.isPopular}
          isPartiallyVisible={false}
          actionText={feature.actionText}
        />
      ))}
      
      {/* Partial card overlay with View More button (mobile only) */}
      {isMobile && !showAllCards && features.length > visibleFeatures.length && (
        <MobilePartialOverlay 
          showAllCards={showAllCards} 
          toggleShowAllCards={toggleShowAllCards} 
        />
      )}
    </div>
  );
};

export default FeaturesGrid;
