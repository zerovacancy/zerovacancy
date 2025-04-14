/**
 * Layout Shift Prevention Utility - Core Performance Improvement
 * 
 * This utility focuses on preventing layout shifts (CLS) by ensuring 
 * elements maintain stable positions during page load and interaction.
 */

interface ElementDimension {
  width: number;
  height: number;
}

/**
 * Reserve space for images before they load to prevent layout shifts
 */
export function reserveImageSpace() {
  if (typeof document === 'undefined') return;

  // Store original dimensions for images with width/height attributes
  const storedDimensions = new Map<HTMLImageElement, ElementDimension>();
  
  // Find all images on the page
  const images = Array.from(document.querySelectorAll('img'));
  
  images.forEach(img => {
    // For images with width and height attributes, store their dimensions
    if (img.hasAttribute('width') && img.hasAttribute('height')) {
      storedDimensions.set(img, {
        width: parseInt(img.getAttribute('width') || '0'),
        height: parseInt(img.getAttribute('height') || '0')
      });
      
      // Set aspect ratio using modern CSS to prevent layout shift
      const aspectRatio = (parseInt(img.getAttribute('height') || '0') / 
                          parseInt(img.getAttribute('width') || '1') * 100);
      
      // Create a wrapper with proper aspect ratio if one doesn't exist
      if (!img.parentElement?.classList.contains('img-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.paddingBottom = `${aspectRatio}%`;
        wrapper.style.overflow = 'hidden';
        
        // Position the image absolutely within the wrapper
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Replace the image with the wrapper containing the image
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }
    }
  });
}

/**
 * Prevent layout shifts from dynamic height elements such as 
 * WYSIWYG editors, carousels, and embeds
 */
export function stabilizeDynamicHeightElements() {
  if (typeof document === 'undefined') return;
  
  // Find containers that might have dynamic content
  const dynamicContainers = Array.from(document.querySelectorAll('.carousel, .editor-content, [data-dynamic-height]'));
  
  dynamicContainers.forEach(container => {
    // Get initial height to reserve the space
    const initialHeight = container.getBoundingClientRect().height;
    
    if (initialHeight > 0) {
      // Set a min-height to reserve space
      (container as HTMLElement).style.minHeight = `${initialHeight}px`;
    }
  });
}

/**
 * Stabilize fixed position elements to prevent them from causing layout shifts
 */
export function stabilizeFixedElements() {
  if (typeof document === 'undefined') return;
  
  // Find elements with position fixed, excluding specific elements like scroll-to-top buttons
  const fixedElements = Array.from(document.querySelectorAll('.fixed, [style*="position: fixed"], [style*="position:fixed"]'))
    .filter(el => {
      // Exclude elements that are specifically for navigation or UI elements that shouldn't affect layout
      const isScrollToTopButton = el.classList.contains('scroll-to-top') || 
                               (el as HTMLElement).getAttribute('aria-label') === 'Back to top';
      const isFooterElement = el.closest('footer') !== null;
      
      // Don't add padding for UI elements like scroll-to-top buttons or footer elements
      return !isScrollToTopButton && !isFooterElement;
    });
  
  fixedElements.forEach(element => {
    // Ensure fixed elements don't cause layout shifts by using transform for animations
    (element as HTMLElement).style.willChange = 'transform';
    (element as HTMLElement).style.transform = 'translateZ(0)';
    
    // If element has fixed bottom positioning, ensure it's consistent between mobile and desktop
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.bottom && computedStyle.bottom !== 'auto') {
      // Don't add padding for specific UI elements
      const isUIElement = (element as HTMLElement).getAttribute('aria-label') === 'Back to top' ||
                        element.classList.contains('scroll-to-top') ||
                        element.closest('[role="dialog"]') !== null;
      
      if (!isUIElement) {
        // Reserve space equal to element height to prevent page jumping
        const height = element.getBoundingClientRect().height;
        if (height > 0) {
          document.body.style.paddingBottom = `${height}px`;
        }
      }
    }
  });
}

/**
 * Initialize all layout shift prevention techniques
 */
export function initializeLayoutStabilization() {
  if (typeof window === 'undefined') return;
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      reserveImageSpace();
      stabilizeDynamicHeightElements();
      stabilizeFixedElements();
    });
  } else {
    // DOM already loaded
    reserveImageSpace();
    stabilizeDynamicHeightElements();
    stabilizeFixedElements();
  }
  
  // Update on window resize
  let resizeTimeout: number | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      window.clearTimeout(resizeTimeout);
    }
    
    // Debounce resize event
    resizeTimeout = window.setTimeout(() => {
      stabilizeDynamicHeightElements();
      stabilizeFixedElements();
    }, 150);
  });
}

/**
 * Add this utility to window onload to prevent layout shifts
 */
export function setupLayoutShiftPrevention() {
  if (typeof window === 'undefined') return;
  
  // Initialize on window load
  window.addEventListener('load', () => {
    initializeLayoutStabilization();
  });
  
  // Also initialize when DOM is ready to catch early elements
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLayoutStabilization);
  } else {
    initializeLayoutStabilization();
  }
}