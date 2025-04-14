
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';
import { useIsMobile } from '@/hooks/use-mobile';

interface SmallFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientStyle?: React.CSSProperties;
  index?: number;
}

const SmallFeatureCard: React.FC<SmallFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradientStyle,
  index = 0
}) => {
  const isMobile = useIsMobile();
  
  // Choose different subtle gradient based on index
  const gradientClass = [
    mobileOptimizationClasses.subtleGradientPurple,
    mobileOptimizationClasses.subtleGradientBlue,
    mobileOptimizationClasses.subtleGradientIndigo,
    mobileOptimizationClasses.subtleGradientCyan
  ][index % 4];

  return (
    <div className={cn(
      "rounded-xl shadow-sm transition-all duration-300 hover:shadow-md",
      "border border-gray-100",
      gradientClass,
      "relative overflow-hidden",
      "gpu-accelerated", // Hardware acceleration
      "p-4" // Consistent padding
    )}>
      <div className={cn(
        "flex",
        "gap-3" // Consistent gap
      )}>
        {/* Icon container with gradient background */}
        <div 
          className="flex-shrink-0 rounded-lg flex items-center justify-center w-9 h-9"
          style={gradientStyle}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1 text-base">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>
      </div>
      
      {/* Number indicator */}
      <div className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-100 opacity-30">
        {index + 1}
      </div>
    </div>
  );
};

export default SmallFeatureCard;
