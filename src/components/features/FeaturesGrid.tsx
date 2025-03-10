
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
  // Only add mobile-specific styles if isMobile is definitely true
  const mobileStyles = isMobile === true ? {
    contain: 'layout size' as const,
    willChange: 'height' as const,
    minHeight: '500px',
    transform: 'translateZ(0)'
  } : {};

  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 relative z-10 ${isMobile === true ? 'mb-20' : ''}`}
      style={mobileStyles}
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
