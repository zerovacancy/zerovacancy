
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
  blobOpacity = 0.12,
  withSpotlight = true,
  spotlightClassName = "from-purple-500/5 via-violet-500/5 to-blue-500/5",
  pattern = "none",
  baseColor = "bg-white/80",
  animationSpeed = 'slow',
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Default to visible to ensure content is shown
  const [hasError, setHasError] = useState(false);

  // Only render heavy effects when the component is in view
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
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
      <div id={id} className={cn("relative w-full overflow-hidden", baseColor, className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} id={id} className={cn("relative w-full overflow-hidden", className)}>
      {isVisible ? (
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
          {children}
        </GradientBlobBackground>
      ) : (
        // Fallback to ensure content is visible even if effects are disabled
        <div className={cn("relative w-full", baseColor)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundEffects;
