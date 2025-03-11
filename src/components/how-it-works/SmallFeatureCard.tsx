
import React from 'react';
import { Step } from './types';
import { LucideIcon } from 'lucide-react';

interface SmallFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradientStyle?: React.CSSProperties;
}

const SmallFeatureCard: React.FC<SmallFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradientStyle
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
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
