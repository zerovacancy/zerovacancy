
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
  // Improved shadows for mobile
  improvedShadowMobile: "shadow-sm sm:shadow-md",
  // Subtle gradient backgrounds for feature items
  subtleGradientPurple: "bg-gradient-to-br from-white to-purple-50/30",
  subtleGradientBlue: "bg-gradient-to-tr from-white via-white to-blue-50/20",
  subtleGradientIndigo: "bg-gradient-to-br from-white to-indigo-50/30",
  subtleGradientCyan: "bg-gradient-to-tr from-white via-white to-cyan-50/20",
  // Reduced opacity on mobile
  reducedOpacityMobile: "opacity-90 sm:opacity-100",
  // Clean border for mobile
  cleanBorderMobile: "border border-gray-100/80",
  // Additional mobile optimization classes
  gradientBgMobile: "bg-gradient-to-br from-white to-purple-50/30",
  coloredBgMobile: "bg-white",
  coloredBorderMobile: "border border-purple-100/50",
  cardBgMobile: "bg-white",
};

// Generate dynamic gradient based on base color
export const getSubtleGradient = (baseColor: string, index: number) => {
  const gradients = [
    `bg-gradient-to-br from-white to-${baseColor}-50/30`,
    `bg-gradient-to-tr from-${baseColor}-50/20 via-white to-${baseColor}-50/10`,
    `bg-gradient-to-bl from-white to-${baseColor}-50/20`,
    `bg-gradient-to-tl from-${baseColor}-50/10 via-white to-white`,
  ];
  
  return gradients[index % gradients.length];
};
