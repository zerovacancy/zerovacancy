
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * MobileOptimizer component that provides global mobile optimizations
 * for better touch and scroll behavior.
 * Complete rewrite to prevent infinite rendering loops.
 */
export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  // Use state initialization instead of refs for tracking optimization state
  const [optimizationsApplied, setOptimizationsApplied] = useState(false);
  // Ref only for tracking if component is mounted
  const isMounted = useRef(true);
  
  // Get mobile status only once during initial render
  const isMobile = useIsMobile();
  
  // Apply optimizations on mount only if mobile
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Only apply optimizations if on mobile and not already applied
    if (isMobile && !optimizationsApplied) {
      // Apply basic optimizations without touching style properties directly
      if (document.body) {
        document.body.classList.add('mobile-optimized');
      }
      
      // Mark as applied using state
      if (isMounted.current) {
        setOptimizationsApplied(true);
      }
    }
    
    // Clean up function
    return () => {
      // Mark component as unmounted to prevent state updates
      isMounted.current = false;
      
      // Clean up optimizations
      if (document.body) {
        document.body.classList.remove('mobile-optimized');
      }
    };
  }, [isMobile, optimizationsApplied]);
  
  // Simply return children without any wrapper to minimize DOM changes
  return <>{children}</>;
};

export default MobileOptimizer;
