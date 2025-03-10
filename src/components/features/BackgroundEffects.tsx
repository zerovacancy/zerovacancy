
import React, { useRef } from 'react';
import { GradientBlobBackground } from '@/components/ui/gradient-blob-background';
import { cn } from '@/lib/utils';

interface BackgroundEffectsProps {
  className?: string;
  children?: React.ReactNode;
  blobColors?: {
    first?: string;
    second?: string;
    third?: string;
  };
  blobOpacity?: number;
  withSpotlight?: boolean;
  spotlightClassName?: string;
  pattern?: 'dots' | 'grid' | 'none';
  baseColor?: string;
  animationSpeed?: 'slow' | 'medium' | 'fast';
  id?: string;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ 
  className, 
  children,
  blobColors = {
    first: "bg-purple-100",
    second: "bg-indigo-100",
    third: "bg-violet-100"
  },
  blobOpacity = 0.12,
  withSpotlight = true,
  spotlightClassName = "from-purple-500/5 via-violet-500/5 to-blue-500/5",
  pattern = "none",
  baseColor = "bg-white/80",
  animationSpeed = 'slow',
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef} 
      id={id} 
      className={cn(
        "relative w-full overflow-hidden bg-white", 
        "desktop-effects",
        className
      )}
    >
      {/* Content is always rendered without heavy effects on mobile */}
      <div className="relative z-10 w-full mobile-content">
        {children}
      </div>

      {/* Desktop-only background effects */}
      <div className="desktop-only-effects">
        <GradientBlobBackground 
          className="overflow-visible"
          blobColors={blobColors}
          blobOpacity={blobOpacity}
          withSpotlight={withSpotlight}
          spotlightClassName={spotlightClassName}
          pattern={pattern}
          baseColor={baseColor}
          blobSize="large"
          animationSpeed={animationSpeed}
        >
          {/* This is an empty container for desktop effects only */}
        </GradientBlobBackground>
      </div>
    </div>
  );
};

export default BackgroundEffects;
