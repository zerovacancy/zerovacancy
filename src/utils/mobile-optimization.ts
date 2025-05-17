
/**
 * Utility functions for improving mobile performance
 * Disables heavy animations and effects on mobile devices
 */

export const MOBILE_BREAKPOINT = 768;

// Safe mobile device detection function that works in all contexts
export const isMobileDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || window.innerWidth < MOBILE_BREAKPOINT;
};

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

// Check if the user prefers dark mode
export const prefersDarkMode = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Optimized mobile viewport settings that maintain accessibility
export const optimizeMobileViewport = () => {
  if (typeof window === "undefined") return;
  
  // Find existing viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Enhanced viewport setting that maintains accessibility while optimizing mobile display
    // - width=device-width: Uses device width for responsive design
    // - initial-scale=1.0: Sets initial zoom level
    // - viewport-fit=cover: Ensures content extends to the edges on notched devices
    // - minimum-scale=1.0: Prevents zooming out too much
    // - maximum-scale=5.0: Allows zooming for accessibility but limits extreme zooming
    // - user-scalable=yes: Always allow scaling for accessibility
    const viewportContent = 'width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes';
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
      
      // Comprehensive safe area insets for notched devices
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      
      // Apply padding to key UI containers to respect safe areas
      const safeAreaStyle = document.createElement('style');
      safeAreaStyle.innerHTML = `
        header, footer, .fixed-bottom {
          padding-top: var(--safe-area-inset-top);
          padding-right: var(--safe-area-inset-right);
          padding-bottom: var(--safe-area-inset-bottom);
          padding-left: var(--safe-area-inset-left);
        }
        
        body {
          padding-bottom: calc(var(--safe-area-inset-bottom) + 0.5rem);
          /* Ensure no top padding is added */
          padding-top: 0 !important;
        }
      `;
      document.head.appendChild(safeAreaStyle);
      
      // Optimized hardware acceleration for mobile
      const style = document.createElement('style');
      style.innerHTML = `
        /* Optimize GPU-accelerated elements for better performance 
         * For mobile, we're more selective about what gets GPU acceleration
         * to avoid overwhelming the GPU
         */
        .gpu-accelerated, 
        .transform-gpu {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-perspective: 1000;
          perspective: 1000;
          /* Only set will-change for truly changing elements to avoid memory issues */
          will-change: transform;
        }
        
        /* For animations, we're using a simplified approach on mobile */
        .animated, 
        .animate-fade-in, 
        .animate-fade-in-up,
        .animate-slide-in {
          /* No 3D transforms for general animations on mobile - better performance */
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          /* Only use will-change for opacity - much lighter than transform */
          will-change: opacity;
        }
        
        /* Disable heavy blur effects on mobile */
        .blur-xl, .blur-2xl, .blur-3xl {
          filter: blur(6px) !important;
        }
        
        /* Reduce shadow complexity on mobile */
        .shadow-xl, .shadow-2xl {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Enhanced mobile device detection with browser and version detection
  const userAgent = navigator.userAgent;
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isOldAndroid = /Android/.test(userAgent) && parseFloat(userAgent.slice(userAgent.indexOf("Android")+8)) < 8;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  if (isMobileDevice) {
    // Apply touch optimizations only to real mobile devices
    
    // Fix for 300ms tap delay on some older mobile browsers
    // No longer needed for most modern mobile browsers, but kept for backward compatibility
    const style = document.createElement('style');
    style.innerHTML = `
      html {
        touch-action: manipulation;
      }
      
      a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"]) {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
    
    // More comprehensive tap optimizations for old Android devices
    if (isOldAndroid) {
      // Add FastClick-like functionality for old Android browsers
      document.addEventListener('touchstart', function() {}, { passive: true });
    }
    
    // We're removing the double-tap prevention as it could interfere with scrolling
    // Instead, we'll use the built-in Safari/Chrome mechanisms for handling double-taps
    
    // Add momentum scrolling on iOS
    if (isIOS) {
      const scrollStyle = document.createElement('style');
      scrollStyle.innerHTML = `
        .scroll-container {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }
      `;
      document.head.appendChild(scrollStyle);
      
      // Add class to scrollable containers
      document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto').forEach(el => {
        el.classList.add('scroll-container');
      });
    }
  }
};

// Mobile-specific spacing utilities
export const mobileSpacingUtils = {
  // More compact section spacing for mobile
  sectionSpacing: "py-4", // Reduced from py-8
  
  // Compact content spacing for mobile
  contentSpacing: "space-y-4", // For stacked content inside sections
  
  // Reduced vertical margins between elements
  elementSpacing: "my-3",
  
  // Helper class to apply to section transitions on mobile
  compactTransition: "h-10 max-h-10 overflow-hidden",
  
  // Zero-gap container to eliminate unwanted space
  zeroGap: "m-0 p-0 border-0 outline-0",
};

// Helper classes to conditionally apply to components
/**
 * Reduces the complexity of animations and visual effects based on device capability
 * This is critical for mobile performance improvements
 */
export function reduceAnimationComplexity() {
  if (typeof document === 'undefined') return;
  
  // Get device capability using our own function instead of importing it
  let deviceCapability: 'high' | 'medium' | 'low' = 'medium';
  
  // Simple device capability detection without relying on external function
  if (typeof navigator !== 'undefined') {
    const memory = (navigator as any).deviceMemory || 4; // Default to 4GB
    const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
    
    // Low-end device detection
    if (memory <= 2 || cores <= 2) {
      deviceCapability = 'low';
    } else if (memory >= 8 && cores >= 6) {
      deviceCapability = 'high';
    }
  }
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Always respect user preference for reduced motion
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
    document.documentElement.classList.add('reduce-effects');
  }
  
  // For low and medium capability devices, reduce animation complexity
  if (deviceCapability === 'low' || isMobileDevice()) {
    document.documentElement.classList.add('reduce-effects');
    
    // Add a style element with more aggressive optimizations
    const style = document.createElement('style');
    style.innerHTML = `
      /* Remove all backdrop blur effects - extremely expensive on mobile */
      .backdrop-blur, 
      .backdrop-blur-sm, 
      .backdrop-blur-md, 
      .backdrop-blur-lg, 
      .backdrop-blur-xl, 
      .backdrop-blur-2xl,
      .backdrop-blur-3xl {
        backdrop-filter: none !important;
      }
      
      /* Disable gradient animations - very expensive */
      .animate-gradient,
      .moving-gradient,
      [class*="animate-gradient"],
      [class*="moving-gradient"] {
        animation: none !important;
        background: linear-gradient(to right, #8a63ff, #6c4cd6) !important;
      }
      
      /* Reduce animation durations */
      .animate-spin,
      .animate-pulse,
      .animate-bounce,
      [class*="animate-"] {
        animation-duration: 1s !important;
      }
      
      /* Disable parallax effects */
      .parallax,
      [class*="parallax-"],
      [data-parallax] {
        transform: none !important;
        transition: opacity 0.3s ease !important;
      }
      
      /* Simplify transitions */
      .transition-all {
        transition-property: opacity !important;
        transition-duration: 0.3s !important;
      }
      
      /* Disable hover effects */
      .hover:shadow-lg,
      .hover:scale-105,
      .hover:rotate-1,
      .group-hover:scale-105,
      .group-hover:shadow-lg {
        transform: none !important;
        box-shadow: none !important;
      }
      
      /* Remove any expensive background effects */
      .bg-mesh-gradient,
      .bg-noise,
      .bg-glass,
      [class*="bg-mesh"],
      [class*="bg-glass"],
      [class*="bg-blur"] {
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // For medium capability devices, use moderate optimizations
  if (deviceCapability === 'medium') {
    document.documentElement.classList.add('optimize-effects');
  }
}

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
  
  // Enhanced landscape orientation specific classes
  landscapeOrientationFix: "landscape:max-h-screen landscape:overflow-auto",
  landscapeContentFix: "landscape:py-2 landscape:px-2",
  landscapeHeightFix: "landscape:h-auto",
  landscapeFlexFix: "landscape:flex-row",
  compactLandscape: "compact-landscape:gap-1 compact-landscape:p-2",
  
  // Safe area inset classes
  safeTop: "pt-[var(--safe-area-inset-top)]",
  safeRight: "pr-[var(--safe-area-inset-right)]",
  safeBottom: "pb-[var(--safe-area-inset-bottom)]",
  safeLeft: "pl-[var(--safe-area-inset-left)]",
  safeInset: "pt-[var(--safe-area-inset-top)] pr-[var(--safe-area-inset-right)] pb-[var(--safe-area-inset-bottom)] pl-[var(--safe-area-inset-left)]",
  
  // Touch optimization classes
  touchOptimized: "touch-manipulation",
  noUserSelect: "select-none",
  
  // Mobile-focused visual and interaction improvements
  tapTargetLarge: "min-h-[44px] min-w-[44px]", // Recommended minimum tap target size
  tapTargetExtraLarge: "min-h-[48px] min-w-[48px]", // Extra large for primary actions
  
  // New standardized typography system for mobile
  headingLarge: "text-2xl font-bold leading-snug tracking-tight", // Section headings
  headingMedium: "text-xl font-bold leading-snug tracking-tight", // Sub-section headings
  headingSmall: "text-lg font-medium leading-normal", // Subheadings
  bodyText: "text-base leading-relaxed", // Body text (min 16px)
  bodyTextSmall: "text-sm leading-relaxed", // Small text (min 14px)
  
  // Text container max-width for readability (65-70 characters)
  textContainer: "max-w-[65ch]",
  textContainerNarrow: "max-w-[45ch]",
  
  // Input element optimization
  inputEnhanced: "text-[16px] h-[48px] px-4", // Prevent zoom on focus in iOS
  
  // New classes for form elements on mobile
  mobileFriendlyInput: "text-[16px] h-[44px] px-4 py-2 rounded-xl",
  mobileFriendlyButton: "h-[48px] min-w-[44px] px-5 rounded-xl",
  
  // Standardized spacing system
  sectionPaddingMain: "py-8", // Reduced from py-10 for better mobile layout
  sectionPaddingSecondary: "py-6", // Reduced from py-8
  contentPadding: "px-4 sm:px-6", // Consistent content padding
  sectionWrapper: "w-full max-w-none overflow-hidden", // Full-width section wrapper
  spacingHeadingToContent: "mb-4", // Reduced spacing between heading and content for mobile
  spacingBetweenBlocks: "mb-3", // Reduced spacing between content blocks
  spacingBeforeCTA: "mt-4", // Reduced spacing before call-to-actions
  spacingInteractive: "gap-3", // Reduced spacing between interactive elements
  
  // Section transition classes - specifically for section transitions
  sectionTransition: "h-[40px] min-h-[40px] max-h-[40px] m-0 p-0 overflow-hidden",
  sectionTransitionDesktop: "h-[60px] min-h-[60px] max-h-[60px] m-0 p-0 overflow-hidden",
  
  // Carousel optimization classes
  carouselContainer: "touch-action-pan-y overscroll-behavior-x-contain relative z-10",
  carouselNavButton: "min-w-[60px] min-h-[60px] touch-manipulation z-50",
  
  // Add the mobile spacing utilities
  ...mobileSpacingUtils,
};

// Enhanced landscape mode detection that also considers device type
export const isLandscapeMode = () => {
  if (typeof window === "undefined") return false;
  
  // Get window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Check for landscape orientation
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  
  // Define height threshold for tablets vs phones
  // If the device is in landscape but has a very short height, it's likely a phone
  // and should use landscape optimizations
  const isPhoneLandscape = isLandscape && height < 500;
  
  // Check if the device is very narrow in any orientation - likely a phone
  const isNarrowDevice = Math.min(width, height) < 450;
  
  // For phones or other narrow devices, use landscape mode when appropriate
  if (isNarrowDevice || isPhoneLandscape) {
    return isLandscape;
  }
  
  // For larger devices (tablets/desktops), only return true for very extreme aspect ratios
  return isLandscape && (width / height) > 1.8;
};

// Apply landscape-specific fixes
export const applyLandscapeOrientationFixes = () => {
  if (typeof window === "undefined") return;
  
  const handleOrientationChange = () => {
    const isLandscape = isLandscapeMode();
    
    // Prevent content jump by locking dimensions briefly during transition
    document.body.style.minHeight = `${window.innerHeight}px`;
    
    // Apply landscape specific classes and styles
    if (isLandscape) {
      document.documentElement.classList.add('landscape-mode');
      document.body.classList.add('landscape-mode');
      
      // Apply specific landscape optimizations for small screens
      if (window.innerHeight < 500) {
        document.body.classList.add('compact-landscape');
        document.documentElement.style.setProperty('--compact-spacing', '0.5rem');
      } else {
        document.body.classList.remove('compact-landscape');
        document.documentElement.style.removeProperty('--compact-spacing');
      }
      
      // Allow scrolling in landscape mode
      document.body.style.height = 'auto';
      document.body.style.overflowY = 'auto';
      
      // Disable transitions during orientation change to prevent animation glitches
      const tempStyle = document.createElement('style');
      tempStyle.id = 'temp-transition-disable';
      tempStyle.innerHTML = '* { transition: none !important; }';
      document.head.appendChild(tempStyle);
      
      // Re-enable transitions after the orientation change is complete
      setTimeout(() => {
        const disableStyle = document.getElementById('temp-transition-disable');
        if (disableStyle) {
          disableStyle.remove();
        }
      }, 100);
    } else {
      document.documentElement.classList.remove('landscape-mode');
      document.body.classList.remove('landscape-mode');
      document.body.classList.remove('compact-landscape');
      document.body.style.height = '';
      document.body.style.overflowY = '';
      document.documentElement.style.removeProperty('--compact-spacing');
    }
    
    // Reset the min-height after orientation change completes
    setTimeout(() => {
      document.body.style.minHeight = '';
    }, 250);
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
