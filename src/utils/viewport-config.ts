/**
 * Unified Viewport Configuration System
 * 
 * This is the single source of truth for viewport configuration.
 * It prevents conflicts between multiple configurations and ensures
 * a consistent approach to mobile viewport settings.
 */

// Constants for viewport dimensions
export const VIEWPORT_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  LARGE_DESKTOP_BREAKPOINT: 1536,
  MOBILE_HEADER_HEIGHT: 60,
  MOBILE_BOTTOM_NAV_HEIGHT: 64,
  CONTAINER_PADDING: 16
};

// Configure proper viewport meta tag
export function configureViewport() {
  if (typeof window === "undefined") return;
  
  // Find existing viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;
  
  // Proper configuration that balances accessibility and mobile display
  // - width=device-width: Uses device width for responsive design
  // - initial-scale=1.0: Sets initial zoom level
  // - viewport-fit=cover: Ensures content extends to the edges on notched devices
  // - minimum-scale=1.0: Prevents zooming out too much
  // - maximum-scale=5.0: Allows zooming for accessibility but limits extreme zooming
  // - user-scalable=yes: Ensures accessibility by allowing users to zoom
  const viewportContent = 'width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  viewport.setAttribute('content', viewportContent);
}

// Set CSS variables for viewport dimensions
export function setViewportDimensions() {
  if (typeof window === "undefined") return;
  
  // Set CSS variables for viewport dimensions
  const root = document.documentElement;
  
  // Set viewport height variable (vh)
  const vh = window.innerHeight * 0.01;
  root.style.setProperty('--vh', `${vh}px`);
  
  // Set viewport width variable (vw)
  const vw = window.innerWidth * 0.01;
  root.style.setProperty('--vw', `${vw}px`);
  
  // Set safe area insets for notched devices
  root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 0px)');
  root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right, 0px)');
  root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
  root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left, 0px)');
  
  // Set container width based on viewport
  if (window.innerWidth < VIEWPORT_CONSTANTS.MOBILE_BREAKPOINT) {
    root.style.setProperty('--container-width', `calc(100% - ${VIEWPORT_CONSTANTS.CONTAINER_PADDING * 2}px)`);
    root.style.setProperty('--mobile-header-height', `${VIEWPORT_CONSTANTS.MOBILE_HEADER_HEIGHT}px`);
  } else if (window.innerWidth < VIEWPORT_CONSTANTS.TABLET_BREAKPOINT) {
    root.style.setProperty('--container-width', '720px');
  } else if (window.innerWidth < VIEWPORT_CONSTANTS.DESKTOP_BREAKPOINT) {
    root.style.setProperty('--container-width', '960px');
  } else if (window.innerWidth < VIEWPORT_CONSTANTS.LARGE_DESKTOP_BREAKPOINT) {
    root.style.setProperty('--container-width', '1200px');
  } else {
    root.style.setProperty('--container-width', '1400px');
  }
}

// Check if a device is in landscape mode
export function isLandscapeMode() {
  if (typeof window === "undefined") return false;
  
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isNarrowHeight = window.innerHeight < 500;
  
  // Only consider landscape mode for mobile devices or when height is very constrained
  if (window.innerWidth < VIEWPORT_CONSTANTS.TABLET_BREAKPOINT || isNarrowHeight) {
    return isLandscape;
  }
  
  return false;
}

// Initialize all viewport settings
export function initializeViewport() {
  if (typeof window === "undefined") return () => {};
  
  // Configure viewport meta tag
  configureViewport();
  
  // Set initial viewport dimensions
  setViewportDimensions();
  
  // Update viewport dimensions on resize and orientation change
  const updateDimensions = () => {
    setViewportDimensions();
  };
  
  window.addEventListener('resize', updateDimensions, { passive: true });
  window.addEventListener('orientationchange', updateDimensions, { passive: true });
  
  // When in landscape mode, add a class to html element
  const updateOrientation = () => {
    if (isLandscapeMode()) {
      document.documentElement.classList.add('landscape');
    } else {
      document.documentElement.classList.remove('landscape');
    }
  };
  
  updateOrientation();
  window.addEventListener('resize', updateOrientation, { passive: true });
  window.addEventListener('orientationchange', updateOrientation, { passive: true });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', updateDimensions);
    window.removeEventListener('orientationchange', updateDimensions);
    window.removeEventListener('resize', updateOrientation);
    window.removeEventListener('orientationchange', updateOrientation);
  };
}