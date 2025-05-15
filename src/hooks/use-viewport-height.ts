import { useCallback, useEffect } from 'react';

/**
 * Hook to handle viewport height CSS variable calculation.
 * This is especially useful for mobile browsers where the viewport height
 * changes when the address bar shows/hides.
 * 
 * @returns A cleanup function to remove event listeners
 */
export function useViewportHeight(): void {
  // Calculate and set the viewport height CSS variable
  const setVh = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  
  useEffect(() => {
    // Set initial viewport height
    setVh();
    
    // Add event listeners for viewport height changes
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', setVh, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [setVh]);
}