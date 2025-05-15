/**
 * Enhanced CSS Containment System for CLS Prevention
 * 
 * This module provides an advanced CSS containment implementation that
 * intelligently applies containment properties while preventing CLS issues.
 * It's specifically designed to handle fixed/sticky elements properly and
 * avoid stacking context problems that can cause layout shifts.
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
  /** Enable CLS prevention specific containment */
  clsSafe?: boolean;
}

// Default containment options
const defaultOptions: ContainmentOptions = {
  layout: true,
  paint: true,
  size: false,
  content: false,
  strict: false,
  clsSafe: true // Enable CLS-safe containment by default
};

// CLS-sensitive elements that should never receive size containment
const CLS_SENSITIVE_SELECTORS = [
  // Hero sections are extremely sensitive to containment
  '#hero',
  '.hero',
  '[data-hero-section="true"]',
  '.hero-section',
  
  // These elements should never have size containment
  'header',
  '.header',
  '.fixed-header',
  '.main-header',
  'footer',
  '.footer',
  
  // Navigation elements
  'nav',
  '.nav',
  '.navigation',
  '.bottom-nav',
  
  // Image containers
  '.img-container',
  '[class*="image-container"]',
  '.card-image',
  '.hero-image',
  
  // Dynamic content containers
  '[class*="rotating"]',
  '.rotating-container',
  '.dynamic-content',
  
  // Created media elements
  '.creator-media',
  '.media-container',
  
  // Elements with specific data attributes
  '[data-cls-sensitive="true"]',
  '[data-contain-cls-safe="true"]'
];

/**
 * Checks for potential fixed elements that could be affected by containment
 * This helps diagnose stacking context issues before they occur
 */
function detectPotentialFixedElements(): boolean {
  if (typeof document === 'undefined') return false;
  
  // Check for fixed headers
  const fixedHeaderElements = document.querySelectorAll('header, [role="banner"], .header, #header, .app-header, .fixed-header, .sticky-header, nav, .nav, [role="navigation"]');
  
  let foundFixed = false;
  
  fixedHeaderElements.forEach(element => {
    if (element instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      
      if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
        console.debug(`Detected fixed/sticky header: ${element.tagName}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ').join('.') : ''}`);
        foundFixed = true;
        
        // Add data attributes to ensure it's never contained and marked for CLS protection
        element.setAttribute('data-contain-force', 'false');
        element.setAttribute('data-cls-fixed', 'true');
        
        // Apply hardware acceleration for smoother rendering
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
        if ('webkitBackfaceVisibility' in element.style) {
          // @ts-ignore - TypeScript doesn't know about this property
          element.style.webkitBackfaceVisibility = 'hidden';
        }
        
        // If element has bottom: 0, ensure it also has top: auto to prevent CLS when keyboard shows
        if (computedStyle.bottom === '0px' && computedStyle.top !== 'auto') {
          element.style.top = 'auto';
        }
        
        // If element is a header with fixed position, ensure it has bottom: auto
        if ((element.tagName.toLowerCase() === 'header' || element.classList.contains('header')) && 
            computedStyle.position === 'fixed' && 
            computedStyle.bottom !== 'auto') {
          element.style.bottom = 'auto';
        }
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
  
  // Detect and mark CLS-sensitive elements
  CLS_SENSITIVE_SELECTORS.forEach(selector => {
    try {
      const sensitiveElements = document.querySelectorAll(selector);
      sensitiveElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.setAttribute('data-cls-sensitive', 'true');
          el.setAttribute('data-contain-size', 'false'); // Never apply size containment
        }
      });
    } catch (error) {
      // Silently ignore selector errors
    }
  });
  
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
    window.__containmentObserver = observer;
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
    console.log('CSS containment not supported in this browser. Applying CLS prevention only.');
    // Even without containment support, we can still apply CLS prevention
    applyClSPreventionStyles();
    return;
  }

  // Use requestIdleCallback when available for better performance
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
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
 * Apply CLS prevention styles even if containment isn't supported
 */
function applyClSPreventionStyles(): void {
  const styleElement = document.createElement('style');
  styleElement.id = 'cls-prevention-styles';
  
  styleElement.textContent = `
    /* CLS Prevention Styles */
    
    /* Fixed headers */
    header, .header, [role="banner"], nav[style*="position:fixed"], nav[style*="position: fixed"] {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: auto !important;
      width: 100% !important;
      z-index: 9999 !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Bottom nav stabilization */
    .bottom-nav, nav[style*="bottom:0"], nav[style*="bottom: 0"],
    [class*="bottom-navigation"], [class*="bottomNav"] {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      top: auto !important;
      width: 100% !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Hero section stability - section-specific implementation */
    section#hero, section.hero, section[data-hero-section="true"] {
      height: var(--hero-mobile-height, 450px) !important;
      min-height: var(--hero-mobile-height, 450px) !important;
      max-height: var(--hero-mobile-height, 450px) !important;
      overflow: visible !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
      will-change: transform !important;
      content-visibility: auto !important;
      contain: layout !important;
    }
    
    /* Desktop hero heights are handled separately */
    @media (min-width: 768px) {
      section#hero, section.hero, section[data-hero-section="true"] {
        height: var(--hero-desktop-height, auto) !important;
        min-height: var(--hero-min-desktop-height, auto) !important;
        max-height: var(--hero-max-desktop-height, none) !important;
      }
    }
    
    /* Image containers with consistent aspect ratios */
    .img-container, [class*="image-container"], .card-image, .hero-image {
      position: relative !important;
      height: 0 !important;
      padding-bottom: 75% !important; /* 4:3 aspect ratio */
      overflow: hidden !important;
    }
    
    .img-container img, [class*="image-container"] img, .card-image img, .hero-image img {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
    
    /* Rotating text stability */
    [class*="rotating"], .rotating-container, div[class*="rotating"] {
      height: 44px !important;
      min-height: 44px !important;
      max-height: 44px !important;
      overflow: visible !important;
    }
  `;
  
  document.head.appendChild(styleElement);
}

/**
 * Main initialization function for CSS containment
 */
function initializeContainment() {
  console.log('Initializing CSS containment with CLS prevention...');
  
  // Add containment stylesheet with enhanced CLS prevention
  const styleElement = document.createElement('style');
  styleElement.id = 'containment-styles';
  
  styleElement.textContent = `
    /* CSS Containment Rules with CLS Prevention */
    
    /* Generic containment classes - excluding fixed/sticky elements and CLS-sensitive elements */
    .contain-layout:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      contain: layout; 
    }
    
    .contain-paint:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      contain: paint; 
    }
    
    /* Size containment is the most dangerous for CLS - apply it very selectively */
    .contain-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]):not([data-contain-size="false"]) { 
      contain: size; 
    }
    
    /* Content containment combines layout, paint, and size - very restrictive */
    .contain-content:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]):not([data-contain-size="false"]) { 
      contain: content; 
    }
    
    /* Strict containment is the most restrictive */
    .contain-strict:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]):not([data-contain-size="false"]) { 
      contain: strict; 
    }
    
    /* Combined containment classes */
    .contain-layout-paint:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      contain: layout paint; 
    }
    
    /* Very selective application of layout+size containment */
    .contain-layout-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]):not([data-contain-size="false"]) { 
      contain: layout size; 
    }
    
    /* Very selective application of paint+size containment */
    .contain-paint-size:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]):not([data-contain-size="false"]) { 
      contain: paint size; 
    }
    
    /* Content visibility optimization - exclude sensitive elements */
    .content-visibility-auto:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      content-visibility: auto; 
    }
    
    /* CLS-safe containment for cards and card-like elements */
    .card:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]), 
    [class*="card"]:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      contain: layout paint; 
      transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    
    /* List items generally safe for layout containment */
    .list-item:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    li:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    /* Article containment */
    article:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]):not([data-cls-sensitive="true"]) { 
      contain: layout; 
    }
    
    /* Dialog and modal containment - paint-only is safer */
    .modal:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    dialog:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: paint; 
    }
    
    /* Accordion containment - layout-only is safer */
    .accordion:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    [class*="accordion"]:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    /* Footer and aside containment - layout-only is safer */
    footer:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]), 
    aside:not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) { 
      contain: layout; 
    }
    
    /* Explicitly disable containment for fixed/sticky elements */
    [style*="position:fixed"], [style*="position: fixed"],
    [style*="position:sticky"], [style*="position: sticky"],
    .fixed, .sticky, [data-cls-fixed="true"] {
      contain: none !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Enhanced CLS prevention for fixed headers */
    header[style*="position:fixed"], header[style*="position: fixed"],
    .header[style*="position:fixed"], .header[style*="position: fixed"],
    [role="banner"][style*="position:fixed"], [role="banner"][style*="position: fixed"] {
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: auto !important;
      width: 100% !important;
      z-index: 9999 !important;
    }
    
    /* Stabilize navigation elements */
    nav, .navigation, .nav-container {
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Bottom navigation stabilization */
    .bottom-nav, 
    nav[style*="bottom:0"], nav[style*="bottom: 0"],
    [class*="bottom-navigation"], [class*="bottomNav"] {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      top: auto !important;
      width: 100% !important;
    }
    
    /* Hero section stability - critical for CLS */
    section#hero, section.hero, section[data-hero-section="true"] {
      contain: none !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
      will-change: transform !important;
      height: var(--hero-mobile-height, 450px) !important;
      min-height: var(--hero-mobile-height, 450px) !important;
      max-height: var(--hero-mobile-height, 450px) !important;
    }
    
    /* Desktop-specific hero rules */
    @media (min-width: 768px) {
      section#hero, section.hero, section[data-hero-section="true"] {
        height: var(--hero-desktop-height, auto) !important;
        min-height: var(--hero-min-desktop-height, auto) !important;
        max-height: var(--hero-max-desktop-height, none) !important;
      }
    }
    
    /* CLS-safe image containers */
    .img-container, [class*="image-container"], .card-image, .hero-image {
      contain: none !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Stabilize rotating text containers */
    [class*="rotating"], .rotating-container, div[class*="rotating"] {
      contain: none !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
    }
    
    /* Creator media containers */
    .creator-media, .media-container {
      contain: none !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
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
  
  // Add CLS prevention styles
  applyClSPreventionStyles();
  
  console.log('CSS containment initialized with CLS prevention');
}

/**
 * Parse containment string into options
 */
function parseContainment(containType: string): ContainmentOptions {
  const options: ContainmentOptions = {
    clsSafe: true // Always enable CLS safety
  };
  
  if (containType === 'content') {
    return { content: true, clsSafe: true };
  } else if (containType === 'strict') {
    return { strict: true, clsSafe: true };
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
  
  // Only apply size containment if explicitly requested AND clsSafe is disabled
  // Size containment is the most dangerous for CLS issues
  if (options.size && !options.clsSafe) {
    containValues.push('size');
  }
  
  return containValues.length > 0 ? containValues.join(' ') : 'none';
}

/**
 * Checks if an element should have containment applied
 * This prevents layout issues with fixed/sticky positioned elements
 * and adds enhanced CLS prevention
 */
function shouldApplyContainment(element: HTMLElement): boolean {
  if (!element) return false;
  
  // Get computed style
  const computedStyle = window.getComputedStyle(element);
  
  // Check for fixed/sticky positioning - never apply containment
  const position = computedStyle.position;
  if (position === 'fixed' || position === 'sticky') {
    console.debug(`Skipping containment for ${element.tagName} with position: ${position}`);
    
    // Apply CLS prevention to fixed/sticky elements
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    if ('webkitBackfaceVisibility' in element.style) {
      // @ts-ignore - TypeScript doesn't know about this property
      element.style.webkitBackfaceVisibility = 'hidden';
    }
    
    // Mark as CLS-fixed
    element.setAttribute('data-cls-fixed', 'true');
    
    return false;
  }
  
  // Check for explicit data attribute to force enable/disable containment
  const dataContainForce = element.getAttribute('data-contain-force');
  if (dataContainForce === 'false') return false;
  if (dataContainForce === 'true') return true;
  
  // Check for CLS-sensitive attribute
  if (element.hasAttribute('data-cls-sensitive')) {
    return false;
  }
  
  // Check if element has a high z-index (likely in stacking context)
  const zIndex = parseInt(computedStyle.zIndex, 10);
  if (!isNaN(zIndex) && zIndex > 10) {
    console.debug(`Skipping containment for ${element.tagName} with high z-index: ${zIndex}`);
    return false;
  }
  
  // Check if element or its children are part of a stacking context
  if (element.querySelector('[style*="position: fixed"], [style*="position: sticky"], [data-cls-fixed="true"]')) {
    console.debug(`Skipping containment for ${element.tagName} with fixed/sticky children`);
    return false;
  }
  
  // Check if the element matches any CLS-sensitive selectors
  for (const selector of CLS_SENSITIVE_SELECTORS) {
    try {
      if (element.matches(selector)) {
        console.debug(`Skipping containment for CLS-sensitive element matching: ${selector}`);
        element.setAttribute('data-cls-sensitive', 'true');
        return false;
      }
    } catch (error) {
      // Silently ignore invalid selectors
    }
  }
  
  return true;
}

/**
 * Applies CSS containment to an element with CLS prevention
 */
function applyContainment(
  element: HTMLElement,
  options: ContainmentOptions = defaultOptions
): void {
  // If we should apply CLS-safe containment, modify the options
  if (options.clsSafe) {
    // Never apply size containment in CLS-safe mode
    options.size = false;
    
    // Add hardware acceleration for smoother rendering
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    if ('webkitBackfaceVisibility' in element.style) {
      // @ts-ignore - TypeScript doesn't know about this property
      element.style.webkitBackfaceVisibility = 'hidden';
    }
  }
  
  const containValue = getContainmentValue(options);
  
  if (containValue !== 'none' && shouldApplyContainment(element)) {
    element.style.contain = containValue;
    element.setAttribute('data-contains', containValue);
    
    // Only apply content-visibility to non-CLS-sensitive elements
    if (!element.hasAttribute('data-cls-sensitive') && 
        (options.paint || options.content || options.strict)) {
      if ('contentVisibility' in element.style) {
        element.style.contentVisibility = 'auto';
      }
    }
  } else if (options.clsSafe) {
    // Even if we don't apply containment, still apply CLS prevention
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    if ('webkitBackfaceVisibility' in element.style) {
      // @ts-ignore - TypeScript doesn't know about this property
      element.style.webkitBackfaceVisibility = 'hidden';
    }
  }
}

/**
 * Applies containment to common UI patterns with CLS prevention
 */
function applyContainmentToCommonPatterns(): void {
  // Map of selectors to containment options
  const selectorMap: Record<string, ContainmentOptions> = {
    // Cards are generally safe for layout+paint containment
    '.card, [class*="card"], [data-card]': { layout: true, paint: true, clsSafe: true },
    
    // List items are safe for layout containment
    'li, .list-item, [role="listitem"]': { layout: true, paint: true, clsSafe: true },
    
    // Articles are safe for layout containment
    'article': { layout: true, clsSafe: true },
    
    // Explicitly exclude fixed/sticky elements
    ':not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) > footer, :not([style*="position:fixed"]):not([style*="position: fixed"]):not([style*="position:sticky"]):not([style*="position: sticky"]) > aside': { 
      layout: true, 
      clsSafe: true 
    },
    
    // Modals and dialogs are safe for paint containment
    'dialog, [role="dialog"], .modal, .modal-content': { paint: true, clsSafe: true },
    
    // Accordions are safe for layout containment
    '.accordion, .accordion-item, [data-accordion]': { layout: true, clsSafe: true },
    
    // Tab panels are safe for layout containment
    '.tabs, .tab-panel, [role="tabpanel"]': { layout: true, clsSafe: true },
    
    // Grid and flex children are safe for layout containment
    '.grid > *, .flex > *': { layout: true, clsSafe: true },
    
    // Image containers should have special handling
    '.img-container, [class*="image-container"], .card-image, .hero-image': { 
      layout: false, 
      paint: false, 
      size: false, 
      clsSafe: true 
    }
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
  console.debug('CLS-safe containment applied to elements that passed position checks');
}

/**
 * Audits the page for fixed elements with bottom positioning
 * This can help identify potential stacking context issues and z-index problems
 * And automatically fixes common CLS issues
 */
function auditFixedElements(): Record<string, unknown>[] {
  if (typeof document === 'undefined') return [];
  
  const results: Record<string, unknown>[] = [];
  
  // Track seen selectors to avoid duplicate console messages
  const seenSelectors = new Set<string>();
  
  // Get all elements
  const allElements = document.querySelectorAll('*');
  
  // Check each element
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      const style = window.getComputedStyle(el);
      
      // Check if the element has fixed positioning
      if (style.position === 'fixed') {
        // Apply hardware acceleration for fixed elements
        el.style.transform = 'translateZ(0)';
        el.style.backfaceVisibility = 'hidden';
        if ('webkitBackfaceVisibility' in el.style) {
          // @ts-ignore
          el.style.webkitBackfaceVisibility = 'hidden';
        }
        
        // Mark all fixed elements
        el.setAttribute('data-cls-fixed', 'true');
        
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
          
          // Only log and mark if we haven't seen this selector before
          if (!seenSelectors.has(selector)) {
            // Mark the element to not receive containment
            el.setAttribute('data-contain-force', 'false');
            
            // Auto-fix common CLS issues
            
            // 1. If this is a header-like element, force bottom: auto
            if (el.tagName.toLowerCase() === 'header' || 
                el.classList.contains('header') || 
                el.classList.contains('fixed-top') ||
                el.getAttribute('role') === 'banner') {
              el.style.top = '0';
              el.style.bottom = 'auto';
              console.debug(`Fixed header-like element: ${selector} - forced bottom: auto`);
            }
            
            // 2. If this is a bottom navigation, force top: auto
            else if ((el.tagName.toLowerCase() === 'nav' || 
                     el.classList.contains('nav') || 
                     el.classList.contains('navigation') ||
                     el.classList.contains('bottom')) && 
                     style.bottom === '0px') {
              el.style.bottom = '0';
              el.style.top = 'auto';
              console.debug(`Fixed bottom nav element: ${selector} - forced top: auto`);
            }
            
            // 3. For other fixed elements with non-auto, non-zero bottom, add special handling
            else if (style.bottom !== '0px') {
              console.debug(`Fixed element with non-zero bottom value detected: ${selector}`);
            }
            
            seenSelectors.add(selector);
          }
        }
      }
    }
  });
  
  // Log results once
  if (results.length > 0) {
    console.debug('Fixed elements with bottom positioning:', results);
  } else {
    console.debug('No fixed elements with bottom positioning found');
  }
  
  return results;
}

/**
 * Set up containment and run a CLS audit
 */
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
  auditFixedElements,
  applyClSPreventionStyles
};

// Export functions individually for direct imports
export { setupCSSContainment, setupWithAudit, auditFixedElements, applyClSPreventionStyles };

// Export the interface as default export
export default cssContainment;
