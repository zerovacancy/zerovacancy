
import React, { useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * MobileOptimizer component that provides global mobile optimizations
 * by adding necessary body classes and event listeners for better
 * touch and scroll behavior.
 */
export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const hasAppliedOptimizations = useRef(false);
  
  // Create a stable empty handler with useCallback
  const emptyHandler = useCallback(() => {}, []);
  
  useEffect(() => {
    // Only run this effect when on mobile
    if (!isMobile) return;
    
    if (!hasAppliedOptimizations.current) {
      console.log("Applying mobile optimizations");
      // Prevent multiple applications of optimizations
      hasAppliedOptimizations.current = true;
      
      // Add mobile optimization classes to body
      document.body.classList.add('mobile-optimized');
      
      // Fix iOS momentum scrolling and prevent overscroll
      document.documentElement.style.setProperty(
        'overscroll-behavior-y', 'none'
      );
      
      // Disable any scroll snap behavior
      document.documentElement.style.setProperty('scroll-snap-type', 'none');
      
      // Simplified optimization approach with passive listeners
      const passiveOption = { passive: true };
      
      // Add passive listeners with the stable callback
      document.addEventListener('touchstart', emptyHandler, passiveOption);
      document.addEventListener('touchmove', emptyHandler, passiveOption);
      document.addEventListener('wheel', emptyHandler, passiveOption);
    }
    
    // Clean up on unmount or when isMobile changes
    return () => {
      console.log("Cleaning up mobile optimizations");
      if (hasAppliedOptimizations.current) {
        document.body.classList.remove('mobile-optimized');
        document.documentElement.style.removeProperty('overscroll-behavior-y');
        document.documentElement.style.removeProperty('scroll-snap-type');
        
        // Remove listeners using the same stable callback
        document.removeEventListener('touchstart', emptyHandler);
        document.removeEventListener('touchmove', emptyHandler);
        document.removeEventListener('wheel', emptyHandler);
        
        hasAppliedOptimizations.current = false;
      }
    };
  }, [isMobile, emptyHandler]); // Include emptyHandler in dependencies
  
  return <>{children}</>;
};

export default MobileOptimizer;