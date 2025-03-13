
/**
 * Utility functions for improving mobile performance
 * Disables heavy animations and effects on mobile devices
 */

export const MOBILE_BREAKPOINT = 768;

// Declare the missing properties on the Window interface
declare global {
  interface Window {
    MSStream?: any;
    lastTap?: number;
  }
}

// Check if the user has requested reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Optimized mobile viewport settings that maintain accessibility
export const optimizeMobileViewport = () => {
  if (typeof window === "undefined") return;
  
  // Find existing viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Handle both portrait and landscape orientations with proper scaling
    const viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, height=device-height';
    viewport.setAttribute('content', viewportContent);
    
    // Add orientation change listener to fix scaling issues
    window.addEventListener('orientationchange', () => {
      // This forces a reflow after orientation changes to fix scaling issues
      setTimeout(() => {
        // Force a repaint by toggling a value
        document.body.style.opacity = '0.99';
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 20);
      }, 100);
    }, { passive: true });
    
    // Apply specific fixes for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      // iOS specific fixes
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      
      // Update on resize and orientation change
      window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      }, { passive: true });
    }
  }
  
  // Prevent double-tap zoom on mobile
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    const DOUBLE_TAP_THRESHOLD = 300;
    if (now - (window.lastTap || 0) < DOUBLE_TAP_THRESHOLD) {
      e.preventDefault();
    }
    window.lastTap = now;
  }, { passive: false });
};

// Helper classes to conditionally apply to components
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
  
  // New subtle gradients for different components
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
  
  // New: Landscape orientation specific classes
  landscapeOrientationFix: "landscape:max-h-screen landscape:overflow-auto",
  landscapeContentFix: "landscape:py-2 landscape:px-2",
  landscapeHeightFix: "landscape:h-auto",
  landscapeFlexFix: "landscape:flex-row",
};

// Check if device is in landscape mode
export const isLandscapeMode = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: landscape)").matches;
};

// Apply landscape-specific fixes
export const applyLandscapeOrientationFixes = () => {
  if (typeof window === "undefined") return;
  
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
