
import React, { useEffect } from 'react';
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
  
  useEffect(() => {
    if (isMobile) {
      // Add mobile optimization classes to body
      document.body.classList.add('mobile-optimized');
      
      // Fix iOS momentum scrolling and prevent overscroll
      document.documentElement.style.setProperty(
        'overscroll-behavior-y', 'none'
      );
      
      // Add event listeners with the passive option for better scroll performance
      const passiveOption = { passive: true };
      
      const addPassiveListeners = () => {
        document.addEventListener('touchstart', () => {}, passiveOption);
        document.addEventListener('touchmove', () => {}, passiveOption);
        document.addEventListener('wheel', () => {}, passiveOption);
      };
      
      addPassiveListeners();
      
      // Clean up on unmount
      return () => {
        document.body.classList.remove('mobile-optimized');
        document.documentElement.style.removeProperty('overscroll-behavior-y');
        
        document.removeEventListener('touchstart', () => {});
        document.removeEventListener('touchmove', () => {});
        document.removeEventListener('wheel', () => {});
      };
    }
  }, [isMobile]);
  
  return <>{children}</>;
};

export default MobileOptimizer;
