/**
 * Mobile utilities for optimizing mobile experience
 */

// Breakpoints
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

/**
 * Detect if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Detects iOS devices
 */
export const isIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Check if device is in landscape mode
 */
export const isLandscapeMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: landscape)").matches;
};

/**
 * Optimized mobile viewport settings that maintain accessibility
 */
export const optimizeMobileViewport = (): (() => void) => {
  if (typeof window === "undefined") return () => {};
  
  // Find existing viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return () => {};
  
  // Handle both portrait and landscape orientations with proper scaling
  const viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, height=device-height';
  viewport.setAttribute('content', viewportContent);
  
  // Add orientation change listener to fix scaling issues
  const orientationHandler = () => {
    // This forces a reflow after orientation changes to fix scaling issues
    setTimeout(() => {
      // Force a repaint by toggling a value
      document.body.style.opacity = '0.99';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 20);
    }, 100);
  };
  
  window.addEventListener('orientationchange', orientationHandler, { passive: true });
  
  // Apply specific fixes for iOS
  if (isIOS()) {
    // iOS specific fixes
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    // Update on resize and orientation change
    const resizeHandler = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Return cleanup function
    return () => {
      window.removeEventListener('orientationchange', orientationHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }
  
  // Return cleanup function
  return () => {
    window.removeEventListener('orientationchange', orientationHandler);
  };
};

/**
 * Prevent double-tap zoom on mobile, but exclude buttons and links
 */
export const preventDoubleTapZoom = (): (() => void) => {
  if (typeof window === "undefined") return () => {};
  
  const handler = (e: TouchEvent) => {
    // Don't prevent default on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' || 
      target.tagName === 'A' ||
      target.closest('button') || 
      target.closest('a');
    
    if (isInteractiveElement) return;
    
    const now = Date.now();
    const DOUBLE_TAP_THRESHOLD = 300;
    if (now - ((window as any).lastTap || 0) < DOUBLE_TAP_THRESHOLD) {
      e.preventDefault();
    }
    (window as any).lastTap = now;
  };
  
  document.addEventListener('touchend', handler, { passive: false });
  
  // Return cleanup function
  return () => {
    document.removeEventListener('touchend', handler);
  };
};

/**
 * Apply landscape-specific fixes
 */
export const applyLandscapeOrientationFixes = (): (() => void) => {
  if (typeof window === "undefined") return () => {};
  
  const handleOrientationChange = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    
    if (isLandscape) {
      document.documentElement.classList.add('landscape-mode');
      document.body.classList.add('landscape-mode');
      document.body.style.height = 'auto';
      document.body.style.overflowY = 'auto';
    } else {
      document.documentElement.classList.remove('landscape-mode');
      document.body.classList.remove('landscape-mode');
      document.body.style.height = '';
      document.body.style.overflowY = '';
    }
  };
  
  // Check immediately
  handleOrientationChange();
  
  // Handle orientation changes
  window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
  window.addEventListener('resize', handleOrientationChange, { passive: true });
  
  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', handleOrientationChange);
  };
};

/**
 * Helper classes to conditionally apply to components
 */
export const mobileOptimizationClasses = {
  // Hide elements completely on mobile
  hideOnMobile: "sm:block hidden",
  // Only show on mobile
  showOnMobile: "sm:hidden block",
  // Disable hover effects on mobile
  noHoverEffectsMobile: "sm:hover:scale-105 sm:hover:shadow-lg sm:transition-all",
  // Improved shadows for mobile
  improvedShadowMobile: "shadow-md sm:shadow-lg",
  // Gradient background for mobile (subtle purple tint)
  gradientBgMobile: "bg-gradient-to-br from-white to-purple-50 sm:bg-white",
  // Colored background for mobile, white for desktop
  coloredBgMobile: "bg-purple-50 sm:bg-white",
  // Card background for mobile with subtle gradient
  cardBgMobile: "bg-gradient-to-tr from-white via-white to-purple-50 sm:bg-white",
  // Reduced opacity on mobile
  reducedOpacityMobile: "opacity-70 sm:opacity-100",
  // Border with color for mobile
  coloredBorderMobile: "border border-purple-100 sm:border-gray-200",
  
  // Subtle gradients for different components
  subtleGradientPurple: "bg-gradient-to-br from-white to-purple-50/70 hover:from-white hover:to-purple-50/90",
  subtleGradientBlue: "bg-gradient-to-br from-white to-blue-50/70 hover:from-white hover:to-blue-50/90",
  subtleGradientIndigo: "bg-gradient-to-br from-white to-indigo-50/70 hover:from-white hover:to-indigo-50/90",
  subtleGradientCyan: "bg-gradient-to-br from-white to-cyan-50/70 hover:from-white hover:to-cyan-50/90",
  
  // Brighter gradients for pricing cards
  pricingGradientBasic: "bg-gradient-to-br from-white to-blue-50/80 hover:to-blue-50",
  pricingGradientPro: "bg-gradient-to-br from-white to-purple-50/80 hover:to-purple-50",
  pricingGradientPremium: "bg-gradient-to-br from-white to-emerald-50/80 hover:to-emerald-50",
  
  // Clean border with subtle color
  cleanBorderMobile: "border border-gray-100 sm:border-gray-200",
  
  // Landscape orientation specific classes
  landscapeOrientationFix: "landscape:max-h-screen landscape:overflow-auto",
  landscapeContentFix: "landscape:py-2 landscape:px-2",
  landscapeHeightFix: "landscape:h-auto",
  landscapeFlexFix: "landscape:flex-row",
};