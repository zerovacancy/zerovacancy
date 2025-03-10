
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * MobileOptimizer component that provides global mobile optimizations
 * for better touch and scroll behavior.
 * 
 * Completely rewritten to prevent infinite rendering loops.
 */
export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  // Only detect mobile status once on mount with ref to avoid re-renders
  const isMobileRef = useRef<boolean>();
  const optimizationsAppliedRef = useRef(false);
  
  // Run effect only once on mount
  useEffect(() => {
    // Get the mobile status once and store in ref
    isMobileRef.current = useIsMobile();
    
    // Only apply optimizations if on mobile and not already applied
    if (isMobileRef.current && !optimizationsAppliedRef.current) {
      if (document.body) {
        // Add the mobile-optimized class to the body
        document.body.classList.add('mobile-optimized');
        
        // Set viewport meta tag for proper mobile scaling
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
          viewportMeta = document.createElement('meta');
          viewportMeta.setAttribute('name', 'viewport');
          document.head.appendChild(viewportMeta);
        }
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Mark optimizations as applied using ref, not state
      optimizationsAppliedRef.current = true;
    }
    
    // Clean up function that runs only on unmount
    return () => {
      if (document.body) {
        document.body.classList.remove('mobile-optimized');
      }
    };
  }, []); // Empty deps array ensures this runs only once
  
  // Simply return children without any wrapper to minimize DOM changes
  return <>{children}</>;
};

export default MobileOptimizer;
