
import React, { useRef, useEffect, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  
  // Mobile optimization - reduce effects when not needed
  const shouldUseEffects = !isMobile || isVisible;
  
  // Optimized intersection observer for better performance
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Skip heavy observation on mobile devices
    if (isMobile && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Only observe once for mobile to reduce CPU usage
            observer.disconnect();
          }
        },
        { 
          threshold: 0.01, // Very low threshold for mobile
          rootMargin: '100px' // Smaller margin for better performance
        }
      );
      
      observer.observe(containerRef.current);
      
      return () => {
        observer.disconnect();
      };
    } else {
      // Desktop devices can handle more effects
      setIsVisible(true);
    }
  }, [isMobile]);

  // Apply reduced animation complexity for mobile
  const effectiveAnimationSpeed = isMobile ? 'slow' : animationSpeed;
  const effectiveBlobOpacity = isMobile ? Math.min(blobOpacity, 0.1) : blobOpacity;
  const effectiveWithSpotlight = isMobile ? false : withSpotlight;
  
  return (
    <div 
      ref={containerRef} 
      id={id} 
      className={cn(
        "relative w-full overflow-hidden",
        isMobile ? "reduce-animation" : "",
        className
      )}
    >
      {shouldUseEffects ? (
        <GradientBlobBackground 
          className="overflow-visible"
          blobColors={blobColors}
          blobOpacity={effectiveBlobOpacity}
          withSpotlight={effectiveWithSpotlight}
          spotlightClassName={spotlightClassName}
          pattern={pattern}
          baseColor={baseColor}
          blobSize={isMobile ? "medium" : "large"} // Smaller blobs on mobile
          animationSpeed={effectiveAnimationSpeed}
        >
          {children}
        </GradientBlobBackground>
      ) : (
        // Simplified background for mobile when effects are disabled
        <div className={cn("relative w-full", baseColor)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundEffects;
