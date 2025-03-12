
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';

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
  // Choose different subtle gradient based on index
  const gradientClass = [
    mobileOptimizationClasses.subtleGradientPurple,
    mobileOptimizationClasses.subtleGradientBlue,
    mobileOptimizationClasses.subtleGradientIndigo,
    mobileOptimizationClasses.subtleGradientCyan
  ][index % 4];

  return (
    <div className={cn(
      "rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md",
      "border border-gray-100",
      gradientClass,
      "relative overflow-hidden"
    )}>
      <div className="flex items-start gap-4">
        {/* Icon container with gradient background */}
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={gradientStyle}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SmallFeatureCard;
