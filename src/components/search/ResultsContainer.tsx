
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ResultsHeader } from './ResultsHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStableViewportHeight } from '@/utils/web-vitals';

interface ResultsContainerProps {
  children: ReactNode;
  count: number;
  entityType?: string;
  className?: string;
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({
  children,
  count,
  entityType,
  className
}) => {
  const isMobile = useIsMobile();
  const { isStabilized, windowHeight } = useStableViewportHeight();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Use ResizeObserver to track container dimensions for stability
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize with current dimensions immediately
    const initialWidth = containerRef.current.offsetWidth;
    const initialHeight = containerRef.current.offsetHeight;
    
    if (initialWidth > 0 && initialHeight > 0) {
      setContainerDimensions({ width: initialWidth, height: initialHeight });
      
      // Set CSS variables for stable dimensions
      containerRef.current.style.setProperty('--container-width', `${initialWidth}px`);
      containerRef.current.style.setProperty('--container-height', `${initialHeight}px`);
      containerRef.current.style.setProperty('--vh', `${windowHeight * 0.01}px`);
    }
    
    // Create and configure ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Only update dimensions if significant change to prevent thrashing
        if (Math.abs(containerDimensions.width - width) > 5 || 
            Math.abs(containerDimensions.height - height) > 5) {
          
          setContainerDimensions({ width, height });
          
          // Update CSS variables for child components to reference
          if (containerRef.current) {
            containerRef.current.style.setProperty('--container-width', `${width}px`);
            containerRef.current.style.setProperty('--container-height', `${height}px`);
          }
        }
      }
    });
    
    // Start observing
    resizeObserver.observe(containerRef.current);
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerDimensions.width, containerDimensions.height, windowHeight]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "rounded-xl overflow-hidden shadow-sm border border-purple-100/80",
        "bg-white/90 backdrop-blur-sm",
        !isMobile && "shadow-[0_4px_24px_rgba(138,79,255,0.08)]",
        isStabilized ? "opacity-100" : "opacity-95",
        "transition-opacity duration-300",
        className
      )}
      style={{
        // Hardware acceleration
        transform: 'translateZ(0)',
        // Minimum height based on viewport for stability
        minHeight: isMobile ? `calc(var(--vh, 1vh) * 50)` : 'auto',
        // Only transition opacity to prevent layout shifts
        transitionProperty: 'opacity'
        // Removed: backfaceVisibility, WebkitBackfaceVisibility - unnecessary
        // Removed: contain: 'layout paint style' - restricts grid layout
        // Removed: fixed height setting - allows container to adapt to content
      }}
      data-stabilized={isStabilized ? 'true' : 'false'}
      data-viewport-height={windowHeight}
    >
      <ResultsHeader count={count} entityType={entityType} />

      <div
        className={cn(
          isMobile ? "p-4" : "p-6",
          "results-content-container"
        )}
        style={{
          // Set minimum height to prevent collapse during loading
          minHeight: isMobile ? `calc(var(--vh, 1vh) * 40)` : '300px',
          // Add better spacing on desktop
          paddingBottom: isMobile ? '16px' : '32px'
          // Removed: transform: 'translateZ(0)' - unnecessary at this level and can cause stacking issues
        }}
      >
        {children}
      </div>
    </div>
  );
};
