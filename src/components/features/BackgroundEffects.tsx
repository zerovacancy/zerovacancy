
import React from 'react';
import { GradientBlobBackground } from '@/components/ui/gradient-blob-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // On mobile, use simpler effects
  const shouldUseEffects = !isMobile;
  
  if (shouldUseEffects) {
    return (
      <GradientBlobBackground 
        className={cn("overflow-visible", className)}
        blobColors={blobColors}
        blobOpacity={blobOpacity}
        withSpotlight={withSpotlight}
        spotlightClassName={spotlightClassName}
        pattern={pattern}
        baseColor={baseColor}
        animationSpeed={animationSpeed}
        id={id}
      >
        {children}
      </GradientBlobBackground>
    );
  }
  
  // On mobile, just render the children with minimal styling
  return (
    <div id={id} className={cn("relative", baseColor, className)}>
      {children}
    </div>
  );
};

export default BackgroundEffects;
