
import React, { useRef, useEffect, useState } from 'react';
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
  id?: string; // Added id prop for easier targeting
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ 
  className, 
  children,
  blobColors = {
    first: "bg-purple-100",
    second: "bg-indigo-100",
    third: "bg-violet-100"
  },
  blobOpacity = 0.25, // Increased from 0.12 to 0.25
  withSpotlight = true,
  spotlightClassName = "from-purple-500/10 via-violet-500/10 to-blue-500/10", // Increased opacity
  pattern = "none",
  baseColor = "bg-white/90", // Increased from bg-white/80 to bg-white/90
  animationSpeed = 'slow',
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Default to visible
  const [hasError, setHasError] = useState(false);

  // Only render heavy effects when the component is in view
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          // More aggressive visibility threshold
          const [entry] = entries;
          setIsVisible(entry.isIntersecting || entry.intersectionRatio > 0);
        },
        { 
          threshold: 0.05, // Lower threshold to trigger earlier
          rootMargin: '300px' // Larger margin to preload
        }
      );
      
      observer.observe(containerRef.current);
      
      // Safety timeout to ensure visibility
      const safetyTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 300); // Reduced from 500ms
      
      return () => {
        observer.disconnect();
        clearTimeout(safetyTimeout);
      };
    } catch (error) {
      console.error("Error in BackgroundEffects observer:", error);
      setHasError(true);
      setIsVisible(true); // Ensure content is visible even with error
      return () => {};
    }
  }, []);

  // If there was an error setting up the observer, use a simple fallback
  if (hasError) {
    return (
      <div id={id} className={cn("relative w-full overflow-hidden z-0", baseColor, className)}>
        {/* Simple gradient fallback background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/40 to-indigo-50/30 -z-10"></div>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} id={id} className={cn("relative w-full overflow-hidden z-0", className)}>
      {isVisible ? (
        <GradientBlobBackground 
          className="overflow-visible z-0"
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
        <div className={cn("relative w-full z-0", baseColor)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundEffects;
