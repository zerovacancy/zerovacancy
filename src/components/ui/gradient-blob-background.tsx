import React from 'react';
import { cn } from '@/lib/utils';
import { OptimizedSpotlight } from './optimized-spotlight';
import { sectionStyles, getSectionGradient, getBackgroundPattern } from '@/utils/performance-optimizations';

interface OptimizedGradientBlobBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  sectionIndex?: number;
  pattern?: 'diagonal' | 'dots' | 'grid' | 'none';
  patternOpacity?: number;
  withSpotlight?: boolean;
  spotlightClassName?: string;
  spotlightSize?: number;
  blobColor?: string;
  blobOpacity?: number;
  baseColor?: string;
}

export const OptimizedGradientBlobBackground: React.FC<OptimizedGradientBlobBackgroundProps> = ({
  className = '',
  children,
  sectionIndex = 0,
  pattern = 'diagonal',
  patternOpacity = 0.06,
  withSpotlight = false,
  spotlightClassName = 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
  spotlightSize = 350,
  blobColor = 'bg-purple-100/40',
  blobOpacity = 0.3,
  baseColor = 'bg-white/80',
}) => {
  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      baseColor,
      sectionStyles(sectionIndex),
      className
    )}>
      {/* Base gradient background */}
      <div className={cn("absolute inset-0", getSectionGradient(sectionIndex))}></div>
      
      {/* Pattern overlay if not 'none' */}
      {pattern !== 'none' && (
        <div className={cn(
          "absolute inset-0",
          getBackgroundPattern(pattern, patternOpacity)
        )}></div>
      )}
      
      {/* Single optimized blob with lighter blur */}
      <div 
        className={cn(
          "absolute -top-10 left-[15%]",
          "w-[600px] h-[600px]",
          blobColor,
          "rounded-full",
          `opacity-${Math.round(blobOpacity * 100)}`
        )}
        style={{
          filter: 'blur(80px)',
          transform: 'translateZ(0)'
        }}
      ></div>
      
      {/* Spotlight effect - only if withSpotlight is true */}
      {withSpotlight && <OptimizedSpotlight className={spotlightClassName} size={spotlightSize} />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// For backwards compatibility with the old gradient blob component
interface GradientBlobBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  dotOpacity?: number;
  pattern?: 'dots' | 'grid' | 'none';
  withSpotlight?: boolean;
  spotlightClassName?: string;
  spotlightSize?: number;
  blobColors?: {
    first?: string;
    second?: string;
    third?: string;
  };
  blobOpacity?: number;
  blobSize?: 'small' | 'medium' | 'large';
  baseColor?: string;
  animationSpeed?: 'slow' | 'medium' | 'fast';
  interactive?: boolean;
}

export const GradientBlobBackground: React.FC<GradientBlobBackgroundProps> = ({
  className = '',
  children,
  dotOpacity = 0.4,
  pattern = 'dots',
  withSpotlight = false,
  spotlightClassName = 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
  spotlightSize = 350,
  blobColors = {
    first: 'bg-purple-100',
    second: 'bg-indigo-100',
    third: 'bg-blue-100'
  },
  blobOpacity = 0.15,
  blobSize = 'medium',
  baseColor = 'bg-white/80',
  animationSpeed = 'medium',
  interactive = false
}) => {
  // Map pattern types from old props to new component
  const patternMap = {
    dots: 'dots' as const,
    grid: 'grid' as const,
    none: 'none' as const
  };
  
  // Use simplified base color from the first blob
  const simplifiedBlobColor = blobColors.first || 'bg-purple-100/40';
  
  return (
    <OptimizedGradientBlobBackground
      className={className}
      pattern={patternMap[pattern]}
      patternOpacity={dotOpacity * 0.2}
      withSpotlight={withSpotlight}
      spotlightClassName={spotlightClassName}
      spotlightSize={spotlightSize}
      blobColor={simplifiedBlobColor}
      blobOpacity={blobOpacity * 2}
      baseColor={baseColor}
    >
      {children}
    </OptimizedGradientBlobBackground>
  );
};