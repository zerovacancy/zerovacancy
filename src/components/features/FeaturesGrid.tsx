
import { FeatureItem } from "./FeatureItem";

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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative z-10"
      style={{ 
        contain: isMobile ? 'layout size' : 'none',
        willChange: isMobile ? 'height' : 'auto',
        minHeight: isMobile ? '450px' : 'auto',
        transform: 'translateZ(0)'
      }}
    >
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
    </div>
  );
};

export default FeaturesGrid;
