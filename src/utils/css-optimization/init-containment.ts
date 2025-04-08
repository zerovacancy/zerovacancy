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
 * Initialize CSS containment during application startup
 * This function should be called in your app's entry point
 */
export function setupCSSContainment(): void {
  // Wait for the document to be ready
  if (typeof document === 'undefined') return;
  
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
    .contain-layout { contain: layout; }
    .contain-paint { contain: paint; }
    .contain-size { contain: size; }
    .contain-content { contain: content; }
    .contain-strict { contain: strict; }
    
    /* Combined containment classes */
    .contain-layout-paint { contain: layout paint; }
    .contain-layout-size { contain: layout size; }
    .contain-paint-size { contain: paint size; }
    
    /* Content visibility optimization */
    .content-visibility-auto { content-visibility: auto; }
    
    /* Component-specific containment */
    .card, [class*="card"] { contain: layout paint; }
    .list-item, li { contain: layout; }
    section, article, main { contain: layout; }
    .modal, dialog { contain: paint; }
    .accordion, [class*="accordion"] { contain: layout; }
    header, footer, nav, aside { contain: layout; }
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
 * Applies CSS containment to an element
 */
function applyContainment(
  element: HTMLElement,
  options: ContainmentOptions = defaultOptions
): void {
  const containValue = getContainmentValue(options);
  
  if (containValue !== 'none') {
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
    'main, article, section': { layout: true },
    'header, footer, aside, nav': { layout: true },
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
        if (element instanceof HTMLElement) {
          applyContainment(element, options);
        }
      });
    } catch (error) {
      console.warn(`Error applying containment to selector "${selector}":`, error);
    }
  });
}

// Export a single function for easy use in the application
export default setupCSSContainment;
