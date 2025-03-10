
import React, { useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    if (isMobile && !hasAppliedOptimizations.current) {
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
      
      // Simplified optimization approach - avoid DOM manipulation that could cause rendering issues
      const passiveOption = { passive: true };
      
      // Define a reusable empty handler function
      const emptyHandler = () => {};
      
      // Add passive listeners with the same handler reference
      document.addEventListener('touchstart', emptyHandler, passiveOption);
      document.addEventListener('touchmove', emptyHandler, passiveOption);
      document.addEventListener('wheel', emptyHandler, passiveOption);
      
      // Clean up on unmount
      return () => {
        document.body.classList.remove('mobile-optimized');
        document.documentElement.style.removeProperty('overscroll-behavior-y');
        document.documentElement.style.removeProperty('scroll-snap-type');
        
        // Use the same handler reference for removal
        document.removeEventListener('touchstart', emptyHandler);
        document.removeEventListener('touchmove', emptyHandler);
        document.removeEventListener('wheel', emptyHandler);
        
        hasAppliedOptimizations.current = false;
      };
    }
  }, [isMobile]);
  
  return <>{children}</>;
};

export default MobileOptimizer;
