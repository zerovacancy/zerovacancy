/**
 * Rendering System
 * 
 * This utility handles various aspects of the rendering pipeline,
 * focusing on improving performance and fixing layout issues.
 */

// Import named exports directly
import { setupWithAudit, auditFixedElements } from './css-optimization/init-containment';

// Header-related constants
const HEADER_HEIGHTS = {
  MOBILE: 64, // pixels
  DESKTOP: 72, // pixels
};

/**
 * Creates style overrides to ensure the header stays fixed properly
 */
export function applyHeaderFixStyles() {
  if (typeof window === "undefined") return;
  
  // Create a style element for our overrides
  const styleEl = document.createElement('style');
  styleEl.id = 'header-position-fix';
  
  // Add CSS rules to ensure header stays fixed
  styleEl.textContent = `
    /* Override styles for fixed header to prevent bottom value issues */
    header.fixed, 
    header[style*="position: fixed"],
    header[style*="position:fixed"],
    .fixed.top-0.left-0.right-0 {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      bottom: auto !important; /* CRITICAL: Prevent bottom value from affecting layout */
      transform: translateZ(0) !important; /* Promote to GPU */
    }
    
    /* Ensure wrapper divs allow fixed elements to display correctly */
    #root, .page-container, main, [data-hero-section="true"] {
      overflow: visible !important;
      contain: none !important;
    }
    
    /* Add padding to body to account for fixed header space */
    @media (max-width: 768px) {
      main {
        padding-top: ${HEADER_HEIGHTS.MOBILE}px !important;
      }
    }
    
    @media (min-width: 769px) {
      main {
        padding-top: ${HEADER_HEIGHTS.DESKTOP}px !important;
      }
    }
  `;
  
  // Append the style element to the head
  document.head.appendChild(styleEl);
  
  // Return a cleanup function
  return () => {
    if (styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
  };
}

/**
 * Detects and removes elements that have fixed positioning with a bottom value
 * that might interfere with the header position
 */
export function detectFixedElementsWithBottomValues() {
  if (typeof window === "undefined") return;
  
  // Query all fixed elements 
  const fixedElements = document.querySelectorAll('.fixed, [style*="position: fixed"], [style*="position:fixed"]');
  
  fixedElements.forEach(el => {
    const style = getComputedStyle(el);
    
    // If it's not the header and has a bottom value, fix it
    if (!el.matches('header') && 
        style.bottom && 
        style.bottom !== 'auto') {
      
      // Prevent bottom value from affecting the layout
      (el as HTMLElement).style.bottom = 'auto';
      
      // If it's meant to be at the bottom of the viewport,
      // convert to using top instead of bottom
      if (parseInt(style.bottom) === 0) {
        (el as HTMLElement).style.top = 'auto';
        (el as HTMLElement).style.bottom = '0';
      }
    }
  });
}

/**
 * Initialize all rendering system features
 */
export function initRenderingSystem() {
  if (typeof window === "undefined") return;
  
  // Apply header fix styles
  const cleanupHeaderFix = applyHeaderFixStyles();
  
  // Detect and fix elements with bottom values
  detectFixedElementsWithBottomValues();
  
  // Initialize CSS containment with enhanced safety checks
  // This automatically excludes fixed/sticky elements and runs an audit
  setupWithAudit();
  
  // Set up resize listener to ensure header positioning works on resize
  const handleResize = () => {
    detectFixedElementsWithBottomValues();
    
    // Re-run fixed element audit when window resizes
    // This catches any elements that might have changed position mode
    setTimeout(() => {
      auditFixedElements();
    }, 200);
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Set up mutation observer to detect dynamically added fixed elements
  const observer = new MutationObserver((mutations) => {
    let needsCheck = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        needsCheck = true;
      } else if (mutation.type === 'attributes' && 
                 (mutation.attributeName === 'style' || 
                  mutation.attributeName === 'class')) {
        needsCheck = true;
      }
    });
    
    if (needsCheck) {
      detectFixedElementsWithBottomValues();
      
      // Delay audit to ensure DOM is settled
      setTimeout(() => {
        auditFixedElements();
      }, 100);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'position', 'bottom', 'z-index']
  });
  
  // Return cleanup function
  return () => {
    cleanupHeaderFix();
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
    
    // Clean up any containment observer
    if (window && window.__containmentObserver) {
      window.__containmentObserver.disconnect();
      delete window.__containmentObserver;
    }
  };
}

// Export the auditFixedElements function directly for external use
export { auditFixedElements };

export default {
  applyHeaderFixStyles,
  detectFixedElementsWithBottomValues,
  initRenderingSystem,
  auditFixedElements
};