
import { FeatureItem } from "./FeatureItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeaturesGridProps {
  features: Array<{
    title: string;
    description: string;
    icon: string;
    isPopular?: boolean;
  }>;
  visibleFeatures: Array<{
    title: string;
    description: string;
    icon: string;
    isPopular?: boolean;
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
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative"
      // Add CSS overscroll-behavior to prevent scroll jumping
      style={{ overscrollBehavior: "contain" }}
    >
      {/* Regular Features - show all features to prevent jumps */}
      {visibleFeatures.map((feature, index) => (
        <FeatureItem
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={index}
          isPopular={feature.isPopular}
          isPartiallyVisible={false}
        />
      ))}
      
      {/* Mobile Overlay removed to fix scroll jumping */}
    </div>
  );
};

export default FeaturesGrid;
