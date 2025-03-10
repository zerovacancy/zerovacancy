
import React, { useRef, useEffect, useState } from 'react';
import { GradientBlobBackground } from '@/components/ui/gradient-blob-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define proper types for pattern and animation speed
export type PatternType = 'dots' | 'grid' | 'none';
export type AnimationSpeedType = 'slow' | 'medium' | 'fast';

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
  pattern?: PatternType;
  baseColor?: string;
  animationSpeed?: AnimationSpeedType;
  id?: string;
  layoutClassName?: string;
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
  id,
  layoutClassName
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  // On mobile, return a simple white background without gradients or effects
  if (isMobile) {
    return (
      <div 
        ref={containerRef}
        id={id}
        className={cn(
          "relative w-full overflow-visible bg-white", 
          "flex-1 flex flex-col",
          className,
          layoutClassName
        )}
      >
        {children}
      </div>
    );
  }

  // Only use Intersection Observer for desktop
  useEffect(() => {
    if (!containerRef.current || isMobile) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          if (Math.abs(entry.boundingClientRect.top) > window.innerHeight * 2) {
            setIsVisible(false);
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' 
      }
    );
    
    observer.observe(containerRef.current);
    
    // Safety timeout to ensure visibility
    const safetyTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef} 
      id={id} 
      className={cn(
        "relative w-full overflow-visible", 
        className
      )}
    >
      {isVisible ? (
        <GradientBlobBackground 
          className={cn("overflow-visible", layoutClassName)}
          blobColors={blobColors}
          blobOpacity={blobOpacity}
          withSpotlight={withSpotlight}
          spotlightClassName={spotlightClassName}
          pattern={pattern}
          baseColor={baseColor}
          blobSize="large"
          animationSpeed={animationSpeed}
        >
          {children}
        </GradientBlobBackground>
      ) : (
        // Fallback to ensure content is visible even if effects are disabled
        <div className={cn("relative w-full overflow-visible", baseColor, layoutClassName)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundEffects;
