
/**
 * Utility functions for optimizing mobile touch interactions
 */

/**
 * Classes for consistent mobile optimization
 */
export const mobileOptimizationClasses = {
  gradientBgMobile: "bg-gradient-to-b from-white to-purple-50/30",
  improvedShadowMobile: "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
  coloredBorderMobile: "border border-purple-100/40",
  cardBgMobile: "bg-white/90 backdrop-blur-sm",
  coloredBgMobile: "bg-gradient-to-b from-white via-purple-50/10 to-white"
};

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
 * Check if the device is in landscape mode
 */
export const isLandscapeMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check orientation
  if (window.matchMedia) {
    return window.matchMedia("(orientation: landscape)").matches;
  }
  
  // Fallback to width/height comparison
  return window.innerWidth > window.innerHeight;
};

/**
 * Apply specific fixes for landscape orientation on mobile
 */
export const applyLandscapeOrientationFixes = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  // Create and add a style element for landscape mode optimizations
  const style = document.createElement('style');
  style.textContent = `
    @media (orientation: landscape) and (max-height: 500px) {
      .landscape-container {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .landscape-content-fix {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
        margin-top: 0.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      .landscape-text-fix {
        font-size: 0.75rem !important;
      }
      .landscape-pricing {
        padding-top: 0.5rem !important;
        padding-bottom: 1rem !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Return cleanup function
  return () => {
    document.head.removeChild(style);
  };
};

/**
 * Debounces a function to prevent multiple rapid executions
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
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

/**
 * Creates a pure touch handler without any event conflicting logic
 * Specifically designed for CTA buttons on mobile
 */
export const createOptimizedTouchHandler = (handler: () => void) => {
  return {
    onClick: (e: React.MouseEvent) => {
      if (e.detail > 0) { // Real user click, not synthetic event
        console.log('Optimized touch handler: click event');
        handler();
      }
    },
    
    onTouchEnd: (e: React.TouchEvent) => {
      // The most reliable event on mobile
      e.preventDefault();
      e.stopPropagation();
      console.log('Optimized touch handler: touchend event');
      handler();
    }
  };
};
