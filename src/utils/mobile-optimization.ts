
/**
 * Utility functions for improving mobile performance
 * Disables heavy animations and effects on mobile devices
 */

export const MOBILE_BREAKPOINT = 768;

// Check if the user has requested reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Helper classes to conditionally apply to components
export const mobileOptimizationClasses = {
  // Hide elements completely on mobile
  hideOnMobile: "sm:block hidden",
  // Only show on mobile
  showOnMobile: "sm:hidden block",
  // Disable hover effects on mobile
  noHoverEffectsMobile: "sm:hover:scale-105 sm:hover:shadow-lg sm:transition-all",
  // Simplified shadows for mobile
  simpleShadowMobile: "shadow-sm sm:shadow-md",
  // Static background for mobile, gradient for desktop
  staticBgMobile: "bg-white sm:bg-gradient-to-r",
  // Reduced opacity on mobile
  reducedOpacityMobile: "opacity-50 sm:opacity-100",
};
