/**
 * CSS Containment Init Module
 * 
 * Provides a simplified implementation that doesn't rely on external dependencies
 */

/**
 * Interface for CSS containment options
 */
export interface ContainmentOptions {
  /** Apply layout containment */
  layout?: boolean;
  /** Apply paint containment */
  paint?: boolean;
  /** Apply size containment */
  size?: boolean;
  /** Apply content containment (shorthand for layout, paint, and size) */
  content?: boolean;
  /** Apply strict containment (shorthand for layout, paint, size, and style) */
  strict?: boolean;
}

// Default containment options
const defaultOptions: ContainmentOptions = {
  layout: true,
  paint: true,
  size: false,
  content: false,
  strict: false
};

/**
 * Check for potential fixed elements that could be affected by containment
 * This helps diagnose stacking context issues before they occur
 */
function detectPotentialFixedElements(): void {
  if (typeof document === 'undefined') return;
  
  // Check for fixed headers
  const fixedHeaderElements = document.querySelectorAll('header, [role="banner"], .header, #header, .app-header, .fixed-header, .sticky-header');
  
  let foundFixed = false;
  
  fixedHeaderElements.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      
      if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
        console.debug(`Detected fixed/sticky header: ${element.tagName}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ').join('.') : ''}`);
        foundFixed = true;
        
        // Add data attribute to make sure it's never contained
        element.setAttribute('data-contain-force', 'false');
      }
    }
  });
  
  // Check for elements with high z-index
  const highZIndexElements = Array.from(document.querySelectorAll('*')).filter(el => {
    if (el instanceof HTMLElement) {
      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex, 10);
      return !isNaN(zIndex) && zIndex > 100;
    }
    return false;
  });
  
  if (highZIndexElements.length > 0) {
    console.debug(`Detected ${highZIndexElements.length} elements with high z-index (>100)`);
    
    // Add data attribute to make sure they're never contained
    highZIndexElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.setAttribute('data-contain-force', 'false');
      }
    });
  }
  
  return foundFixed;
}

/**
 * Initialize CSS containment during application startup
 * This function should be called in your app's entry point
 */
function setupCSSContainment(): void {
  // Wait for the document to be ready
  if (typeof document === 'undefined') return;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Run a quick check for fixed elements first
      detectPotentialFixedElements();
      // Then initialize containment
      initContainmentWithTimeout();
    });
  } else {
    // Document already loaded, initialize immediately but after other critical tasks
    setTimeout(() => {
      // Run a quick check for fixed elements first
      detectPotentialFixedElements();
      // Then initialize containment
      initContainmentWithTimeout();
    }, 0);
  }
  
  // Add a MutationObserver to detect any newly added fixed elements
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      // Check if any nodes were added
      const nodesAdded = mutations.some(mutation => mutation.addedNodes.length > 0);
      
      if (nodesAdded) {
        // Delay the check to allow styles to be applied
        setTimeout(() => {
          detectPotentialFixedElements();
        }, 100);
      }
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Store observer reference for cleanup
    (window as any).__containmentObserver = observer;
  }
}

/**
 * Initialize containment with a delay to ensure it doesn't block the main thread
 * during critical rendering operations
 */
function initContainmentWithTimeout(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
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

/**
 * Main initialization function for CSS containment
 */
function initializeContainment() {
  console.log('Initializing CSS containment...');
  
  // Add containment stylesheet
  const styleElement = document.createElement('style');
  styleElement.id = 'containment-styles';
  
  styleElement.textContent = `
    /* CSS Containment Rules */
    
    /* Generic containment classes */
    .contain-layout:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: layout; }
    .contain-paint:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: paint; }
    .contain-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: size; }
    .contain-content:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: content; }
    .contain-strict:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: strict; }
    
    /* Combined containment classes */
    .contain-layout-paint:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: layout paint; }
    .contain-layout-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: layout size; }
    .contain-paint-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { contain: paint size; }
    
    /* Content visibility optimization */
    .content-visibility-auto:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { content-visibility: auto; }
    
    /* Component-specific containment - explicitly exclude fixed/sticky elements */
    .card:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    [class*="card"]:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout paint; 
    }
    
    .list-item:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    li:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    /* Removed section, main, header to avoid stacking context issues */
    article:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    .modal:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    dialog:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: paint; 
    }
    
    .accordion:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    [class*="accordion"]:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    footer:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    aside:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    /* Explicitly disable containment for fixed/sticky elements */
    [style*="position:fixed"], [style*="position: fixed"],
    [style*="position:sticky"], [style*="position: sticky"] {
      contain: none !important;
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Apply containment to elements with data-contain attribute
  const elementsWithContain = document.querySelectorAll('[data-contain]');
  elementsWithContain.forEach((element) => {
    if (element instanceof HTMLElement) {
      const containType = element.getAttribute('data-contain');
      if (containType) {
        applyContainment(element, parseContainment(containType));
      }
    }
  });
  
  // Apply containment to common UI elements
  applyContainmentToCommonPatterns();
  
  console.log('CSS containment initialized');
}

/**
 * Parse containment string into options
 */
function parseContainment(containType: string): ContainmentOptions {
  const options: ContainmentOptions = {};
  
  if (containType === 'content') {
    return { content: true };
  } else if (containType === 'strict') {
    return { strict: true };
  }
  
  const containValues = containType.split(' ');
  options.layout = containValues.includes('layout');
  options.paint = containValues.includes('paint');
  options.size = containValues.includes('size');
  
  return options;
}

/**
 * Generates a CSS containment value from options
 */
function getContainmentValue(options: ContainmentOptions = defaultOptions): string {
  if (options.strict) return 'strict';
  if (options.content) return 'content';
  
  const containValues: string[] = [];
  
  if (options.layout) containValues.push('layout');
  if (options.paint) containValues.push('paint');
  if (options.size) containValues.push('size');
  
  return containValues.length > 0 ? containValues.join(' ') : 'none';
}

/**
 * Checks if an element should have containment applied
 * This prevents layout issues with fixed/sticky positioned elements
 */
function shouldApplyContainment(element: HTMLElement): boolean {
  if (!element) return false;
  
  // Get computed style
  const computedStyle = window.getComputedStyle(element);
  
  // Check for fixed/sticky positioning
  const position = computedStyle.position;
  if (position === 'fixed' || position === 'sticky') {
    console.debug(`Skipping containment for ${element.tagName} with position: ${position}`);
    return false;
  }
  
  // Check for explicit data attribute to force enable/disable containment
  const dataContainForce = element.getAttribute('data-contain-force');
  if (dataContainForce === 'false') return false;
  if (dataContainForce === 'true') return true;
  
  // Check if element has a high z-index (likely in stacking context)
  const zIndex = parseInt(computedStyle.zIndex, 10);
  if (!isNaN(zIndex) && zIndex > 10) {
    console.debug(`Skipping containment for ${element.tagName} with high z-index: ${zIndex}`);
    return false;
  }
  
  // Check if element or its children are part of a stacking context
  if (element.querySelector('[style*="position: fixed"], [style*="position: sticky"]')) {
    console.debug(`Skipping containment for ${element.tagName} with fixed/sticky children`);
    return false;
  }
  
  return true;
}

/**
 * Applies CSS containment to an element
 */
function applyContainment(
  element: HTMLElement,
  options: ContainmentOptions = defaultOptions
): void {
  const containValue = getContainmentValue(options);
  
  if (containValue !== 'none' && shouldApplyContainment(element)) {
    element.style.contain = containValue;
    element.setAttribute('data-contains', containValue);
    
    if (options.paint || options.content || options.strict) {
      if ('contentVisibility' in element.style) {
        element.style.contentVisibility = 'auto';
      }
    }
  }
}

/**
 * Applies containment to common UI patterns
 */
function applyContainmentToCommonPatterns(): void {
  // Map of selectors to containment options
  const selectorMap: Record<string, ContainmentOptions> = {
    '.card, [class*="card"], [data-card]': { layout: true, paint: true },
    'li, .list-item, [role="listitem"]': { layout: true, paint: true },
    
    // Removed main, section, and header from containment - causes stacking context issues
    'article': { layout: true },
    
    // Explicitly exclude fixed/sticky elements
    ':not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) > footer, :not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) > aside': { layout: true },
    
    'dialog, [role="dialog"], .modal, .modal-content': { paint: true },
    '.accordion, .accordion-item, [data-accordion]': { layout: true },
    '.tabs, .tab-panel, [role="tabpanel"]': { layout: true },
    '.grid > *, .flex > *': { layout: true }
  };
  
  // Apply containment for each selector group
  Object.entries(selectorMap).forEach(([selector, options]) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element instanceof HTMLElement && shouldApplyContainment(element)) {
          applyContainment(element, options);
        }
      });
    } catch (error) {
      console.warn(`Error applying containment to selector "${selector}":`, error);
    }
  });
  
  // Log containment status
  console.debug('Containment applied to elements that passed position checks');
}

/**
 * Audits the page for fixed elements with bottom positioning
 * This can help identify potential stacking context issues and z-index problems
 */
function auditFixedElements(): Record<string, any>[] {
  if (typeof document === 'undefined') return [];
  
  const results: Record<string, any>[] = [];
  
  // Get all elements
  const allElements = document.querySelectorAll('*');
  
  // Check each element
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      const style = window.getComputedStyle(el);
      
      // Check if the element has fixed positioning
      if (style.position === 'fixed') {
        // Check if it has a bottom value that is not 'auto'
        if (style.bottom !== 'auto') {
          const selector = el.tagName.toLowerCase() + 
            (el.id ? `#${el.id}` : '') + 
            (el.className ? `.${el.className.split(' ').join('.')}` : '');
          
          results.push({
            element: selector,
            position: style.position,
            bottom: style.bottom,
            top: style.top,
            left: style.left,
            right: style.right,
            zIndex: style.zIndex,
            containment: el.getAttribute('data-contain-force') || 'not set'
          });
          
          // Mark the element to not receive containment
          el.setAttribute('data-contain-force', 'false');
          console.debug(`Fixed element with bottom value detected: ${selector}`);
        }
      }
    }
  });
  
  // Log results
  if (results.length > 0) {
    console.debug('Fixed elements with bottom positioning:', results);
  } else {
    console.debug('No fixed elements with bottom positioning found');
  }
  
  return results;
}

// Call the audit when containment is set up
function setupWithAudit(): void {
  setupCSSContainment();
  
  // Run the audit after a short delay to ensure the page is rendered
  setTimeout(() => {
    auditFixedElements();
  }, 1000);
}

// Create a single interface for all containment-related functions
const cssContainment = {
  setup: setupCSSContainment,
  setupWithAudit,
  auditFixedElements
};

// Export functions individually for direct imports
export { setupCSSContainment, setupWithAudit, auditFixedElements };

// Export the interface as default export
export default cssContainment;
