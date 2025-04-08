/**
 * Mobile Safety Utilities
 * 
 * Utilities for handling mobile-specific UI safety issues including safe areas,
 * fixed elements, and viewport issues.
 */

/**
 * Initializes safe area variables for mobile devices
 * This is critical for devices with notches, punch holes, or rounded corners
 */
export function initSafeAreaVariables(): void {
  if (typeof document === 'undefined') return;
  
  // Create a style element to inject CSS variables
  const style = document.createElement('style');
  
  // Define CSS variables for safe areas with fallback values
  style.textContent = `
    :root {
      --safe-area-inset-top: env(safe-area-inset-top, 0px);
      --safe-area-inset-right: env(safe-area-inset-right, 0px);
      --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      --safe-area-inset-left: env(safe-area-inset-left, 0px);
      
      /* Standard fixed element heights for consistent spacing */
      --bottom-nav-height: 64px; /* 4rem */
      --bottom-nav-height-safe: calc(64px + var(--safe-area-inset-bottom));
      --header-height: 60px;
      --header-height-safe: calc(60px + var(--safe-area-inset-top));
      
      /* Standard padding to ensure content isn't obscured by fixed elements */
      --content-bottom-padding: var(--bottom-nav-height-safe);
    }
    
    /* Apply safe area padding to key fixed elements */
    .fixed-bottom {
      padding-bottom: var(--safe-area-inset-bottom) !important;
    }
    
    .fixed-top {
      padding-top: var(--safe-area-inset-top) !important;
    }
    
    /* Create a spacer for the bottom of pages with fixed navigation */
    .bottom-nav-spacer {
      height: var(--bottom-nav-height-safe);
      min-height: var(--bottom-nav-height-safe);
      width: 100%;
      display: block;
    }
    
    /* Ensure content doesn't get hidden behind fixed elements */
    .has-fixed-bottom {
      padding-bottom: var(--content-bottom-padding) !important;
    }
    
    .has-fixed-top {
      padding-top: var(--header-height-safe) !important;
    }
    
    /* Fix for iOS Safari 100vh issue */
    .full-height {
      height: 100vh; /* Fallback */
      height: -webkit-fill-available;
      height: stretch;
    }
  `;
  
  // Add the style element to the head
  document.head.appendChild(style);
}

/**
 * Applies spacer element at the bottom of the page content
 * to prevent content from being hidden behind fixed navigation
 */
export function addBottomNavSpacer(): void {
  if (typeof document === 'undefined') return;
  
  // Only add if it doesn't already exist
  if (!document.querySelector('.bottom-nav-spacer')) {
    const spacer = document.createElement('div');
    spacer.className = 'bottom-nav-spacer';
    document.body.appendChild(spacer);
  }
}

/**
 * Fixes viewport issues on iOS Safari
 * iOS Safari has an issue with vh units and the address bar
 */
export function fixIOSViewportHeight(): void {
  if (typeof window === 'undefined') return;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  if (isIOS) {
    // Set CSS custom property with the viewport height
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set the initial value
    setVh();
    
    // Update on resize
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', setVh, { passive: true });
  }
}

/**
 * Initialize all mobile safety features
 */
export function initMobileSafety(): void {
  initSafeAreaVariables();
  fixIOSViewportHeight();
}