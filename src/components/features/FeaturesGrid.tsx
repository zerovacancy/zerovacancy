import { FeatureItem } from "./FeatureItem";
import { MobilePartialOverlay } from "./MobilePartialOverlay";
import { cn } from "@/lib/utils";

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
    <div className={cn(
      "grid gap-6 relative",
      isMobile 
        ? "grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    )}>
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
      {isMobile && !showAllCards && (
        <MobilePartialOverlay 
          showAllCards={showAllCards} 
          toggleShowAllCards={toggleShowAllCards} 
        />
      )}
    </div>
  );
};

export default FeaturesGrid;
