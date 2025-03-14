
/**
 * Utility functions for optimizing mobile touch interactions
 */

/**
 * Applies mobile viewport optimizations to improve touch responsiveness
 * This addresses the 300ms tap delay and other mobile-specific issues
 */
export const optimizeMobileViewport = () => {
  // Only run on client-side
  if (typeof window === 'undefined') return;
  
  // Add touch-action meta tag if it doesn't exist
  if (!document.querySelector('meta[name="viewport"][content*="touch-action"]')) {
    const existingViewport = document.querySelector('meta[name="viewport"]');
    
    if (existingViewport) {
      let content = existingViewport.getAttribute('content') || '';
      if (!content.includes('touch-action')) {
        content += ', touch-action=manipulation';
        existingViewport.setAttribute('content', content);
      }
    } else {
      // Create new viewport meta if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, touch-action=manipulation';
      document.head.appendChild(meta);
    }
  }
  
  // Apply additional touch optimizations
  document.documentElement.style.touchAction = 'manipulation';
  
  // Add passive event listeners to improve scroll performance
  document.addEventListener('touchstart', () => {}, { passive: true });
};

/**
 * Creates an enhanced touch event handler that handles both mouse and touch events
 * with proper cancellation to prevent ghost clicks
 */
export const createTouchHandler = (handler: () => void) => {
  let touchMoved = false;
  let lastTouchTime = 0;
  
  const touchHandler = {
    onClick: (e: React.MouseEvent) => {
      // Prevent ghost clicks by checking if a touch event happened recently
      const now = Date.now();
      if (now - lastTouchTime < 500) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      handler();
    },
    
    onTouchStart: () => {
      touchMoved = false;
      lastTouchTime = Date.now();
    },
    
    onTouchMove: () => {
      touchMoved = true;
    },
    
    onTouchEnd: (e: React.TouchEvent) => {
      lastTouchTime = Date.now();
      
      if (!touchMoved) {
        // Only trigger on taps, not swipes
        e.preventDefault();
        handler();
      }
    }
  };
  
  return touchHandler;
};
