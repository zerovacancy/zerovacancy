
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * MobileOptimizer component that provides global mobile optimizations
 * for better touch and scroll behavior.
 * Simplified to resolve hook-related errors.
 */
export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  // Create a ref to track if we've applied optimizations
  const optimizationState = useRef({
    applied: false,
    cleanupFn: null as (() => void) | null
  });
  
  // Determine if we're on mobile
  const isMobile = useIsMobile();
  
  // Single effect to handle all optimizations
  useEffect(() => {
    // Only apply on mobile
    if (!isMobile) return;
    
    // Skip if already applied
    if (optimizationState.current.applied) return;
    
    // Mark as applied
    optimizationState.current.applied = true;
    
    // Apply mobile optimizations
    document.body.classList.add('mobile-optimized');
    document.documentElement.style.setProperty('overscroll-behavior-y', 'none');
    document.documentElement.style.setProperty('scroll-snap-type', 'none');
    
    // Define cleanup function
    const cleanup = () => {
      // Only clean up if optimizations were applied
      if (optimizationState.current.applied) {
        document.body.classList.remove('mobile-optimized');
        document.documentElement.style.removeProperty('overscroll-behavior-y');
        document.documentElement.style.removeProperty('scroll-snap-type');
        optimizationState.current.applied = false;
      }
    };
    
    // Store cleanup function
    optimizationState.current.cleanupFn = cleanup;
    
    // Return cleanup function
    return cleanup;
  }, [isMobile]);
  
  // Simply render children
  return <>{children}</>;
};

export default MobileOptimizer;