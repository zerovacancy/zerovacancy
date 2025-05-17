import { useEffect, useCallback, useState } from 'react';
import { isMobileDevice } from '@/utils/mobile-optimization';
import { reduceAnimationComplexity } from '@/utils/mobile-optimization';
import { initializeViewport } from '@/utils/viewport-config';
import { initMobileSafety } from '@/utils/mobile-safety';
import { initMobileImageOptimization } from '@/utils/mobile-image-optimizer';

/**
 * Hook that handles all mobile-specific optimizations.
 * This includes viewport setup, animation complexity reduction,
 * mobile safety features, and touch event handling.
 * 
 * @returns An object containing the isMobile state
 */
export function useMobileOptimizations() {
  // Track if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialize mobile detection - memoize the resize handler
  const handleResize = useCallback(() => {
    setIsMobile(isMobileDevice());
  }, []);
  
  // Create passive event handler for touch events
  const passiveEventHandler = useCallback(() => {}, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial mobile state
      setIsMobile(isMobileDevice());
      
      // Add resize listener to update mobile state
      window.addEventListener('resize', handleResize, { passive: true });
      
      // Initialize mobile optimizations
      initializeViewport();
      initMobileSafety();
      reduceAnimationComplexity();
      initMobileImageOptimization();
      
      // Apply mobile-specific CSS classes
      if (isMobile) {
        document.body.classList.add('optimize-animations-mobile');
        
        // Add passive touch events for mobile
        const passiveOption = { passive: true };
        document.addEventListener('touchstart', passiveEventHandler, passiveOption);
        document.addEventListener('touchmove', passiveEventHandler, passiveOption);
      } else {
        document.body.classList.remove('color-white-bg-mobile');
        document.body.classList.remove('optimize-animations-mobile');
      }
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        
        // Only remove events that were added for mobile
        if (isMobile) {
          document.removeEventListener('touchstart', passiveEventHandler);
          document.removeEventListener('touchmove', passiveEventHandler);
        }
        
        // Remove CSS classes
        document.body.classList.remove('color-white-bg-mobile');
        document.body.classList.remove('optimize-animations-mobile');
      };
    }
  }, [handleResize, isMobile, passiveEventHandler]);
  
  return { isMobile };
}