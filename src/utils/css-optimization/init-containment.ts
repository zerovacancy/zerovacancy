import { initializeContainment } from './apply-containment';

/**
 * Initialize CSS containment during application startup
 * This function should be called in your app's entry point
 */
export function setupCSSContainment(): void {
  // Wait for the document to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initContainmentWithTimeout();
    });
  } else {
    // Document already loaded, initialize immediately but after other critical tasks
    setTimeout(() => {
      initContainmentWithTimeout();
    }, 0);
  }
}

/**
 * Initialize containment with a delay to ensure it doesn't block the main thread
 * during critical rendering operations
 */
function initContainmentWithTimeout(): void {
  if (typeof window === 'undefined') return;
  
  // Check if the browser supports CSS containment
  const supportsContainment = CSS && CSS.supports && (
    CSS.supports('contain', 'layout') || 
    CSS.supports('contain', 'paint') ||
    CSS.supports('contain', 'content')
  );
  
  if (!supportsContainment) {
    console.log('CSS containment not supported in this browser. Skipping optimization.');
    return;
  }

  // Use requestIdleCallback when available for better performance
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      initializeContainment();
    }, { timeout: 2000 });
  } else {
    // Fallback to setTimeout for browsers without requestIdleCallback
    setTimeout(() => {
      initializeContainment();
    }, 200); // Delay slightly to allow critical rendering to complete
  }
}

// Export a single function for easy use in the application
export default setupCSSContainment;
