/**
 * Emergency header fix for mobile and containment safety
 * This script fixes the header positioning and prevents CSS containment issues
 * by directly manipulating the DOM as soon as the document loads.
 * 
 * Enhanced version to prevent CLS issues related to fixed positioning
 */

(function() {
  // Performance measurement
  const startTime = performance.now();
  
  // Configuration
  const CONFIG = {
    // Header defaults
    HEADER: {
      Z_INDEX: 9999,
      BACKGROUND_COLOR: '#ffffff',
      BORDER_BOTTOM: '1px solid #F9F6EC',
      BOX_SHADOW: '0 1px 3px rgba(0, 0, 0, 0.08)',
      DEFAULT_HEIGHT: 64 // fallback if we can't calculate actual height
    },
    // Maximum number of retries for finding the header
    MAX_HEADER_RETRIES: 10,
    // Delay between retries (ms)
    RETRY_DELAY: 100,
    // Number of periodic checks after load
    PERIODIC_CHECKS: 5,
    // Delay between periodic checks (ms)
    CHECK_INTERVAL: 2000
  };
  
  // Limit retry attempts to avoid infinite loops
  let headerRetryCount = 0;
  
  /**
   * Gets the header element using multiple possible selectors
   * @returns {HTMLElement|null} The header element or null if not found
   */
  function getHeaderElement() {
    return document.querySelector('header') ||
      document.querySelector('header.fixed') ||
      document.querySelector('.header') ||
      document.querySelector('.fixed-top') ||
      document.querySelector('[class*="header"]') ||
      document.querySelector('nav[role="navigation"]') ||
      document.querySelector('#root > div > header');
  }
  
  /**
   * Fixes the header positioning to prevent CLS
   */
  function fixHeader() {
    // Get the header element
    const header = getHeaderElement();
    
    if (!header) {
      headerRetryCount++;
      if (headerRetryCount > CONFIG.MAX_HEADER_RETRIES) {
        console.warn(
          `Header element not found after ${CONFIG.MAX_HEADER_RETRIES} attempts, aborting header fix`
        );
        return;
      }
      
      if (headerRetryCount === CONFIG.MAX_HEADER_RETRIES) {
        console.warn(
          `Header element not found (final attempt ${headerRetryCount}/${CONFIG.MAX_HEADER_RETRIES}), will retry`
        );
      }
      
      setTimeout(fixHeader, CONFIG.RETRY_DELAY);
      return;
    }

    // Force fixed positioning with inline styles (highest specificity)
    console.log('Found header element, applying fixed positioning');
    
    // Check for mobile viewport custom property (--vh)
    const hasCustomVh = getComputedStyle(document.documentElement).getPropertyValue('--vh') !== '';
    
    // Apply styles directly to header with enhanced values for CLS prevention
    const headerStyles = {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      width: '100%',
      zIndex: String(CONFIG.HEADER.Z_INDEX),
      backgroundColor: CONFIG.HEADER.BACKGROUND_COLOR,
      borderBottom: CONFIG.HEADER.BORDER_BOTTOM,
      boxShadow: CONFIG.HEADER.BOX_SHADOW,
      contain: 'none', // Explicitly disable CSS containment
      bottom: 'auto !important', // Critical for CLS prevention
      transform: 'translateZ(0)', // Hardware acceleration
      willChange: 'transform', // Signal to browser about animation
      backfaceVisibility: 'hidden', // Additional rendering hint
      webkitBackfaceVisibility: 'hidden', // Safari support
      transition: 'none !important' // Prevent any unwanted animations
    };
    
    // Apply all the styles
    Object.assign(header.style, headerStyles);
    
    // Mark the header as not to be contained
    header.setAttribute('data-contain-force', 'false');
    header.setAttribute('data-cls-fixed', 'true');
    
    // Calculate actual header height instead of using a fixed value
    const headerHeight = header.getBoundingClientRect().height || CONFIG.HEADER.DEFAULT_HEIGHT;
    
    // Set CSS variable for header height to be reused in CSS
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    
    // Add body padding to prevent content from being hidden under header
    // Directly set the paddingTop property
    document.body.style.paddingTop = `${headerHeight}px`;
    
    // Also add a special class to indicate header is fixed
    document.body.classList.add('has-fixed-header');
    
    // Add viewport-aware class for CLS prevention using vh variables
    document.body.classList.add('viewport-height-optimized');
    
    // Log success with actual measured height
    console.log(`Fixed header position and added ${headerHeight}px body padding`);
    
    // Create comprehensive styles to prevent CLS issues
    const styleEl = document.createElement('style');
    styleEl.id = 'cls-prevention-styles';
    styleEl.textContent = `
      /* Core CLS prevention styles */
      
      /* CSS Variables for CLS prevention */
      :root {
        /* CLS-CRITICAL: Hero section dimensions for stability */
        --hero-mobile-height: 450px;
        --hero-desktop-height: auto;
        --hero-min-mobile-height: 450px;
        --hero-min-desktop-height: 70vh;
        
        /* CLS-CRITICAL: Text container heights */
        --rotating-text-height-mobile: 44px;
        --rotating-text-height-desktop: 64px;
        
        /* CLS-CRITICAL: Image aspect ratios as padding-bottom percentages */
        --aspect-ratio-16-9: 56.25%; /* 9/16 = 0.5625 = 56.25% */
        --aspect-ratio-4-3: 75%;     /* 3/4 = 0.75 = 75% */
        --aspect-ratio-1-1: 100%;    /* 1/1 = 1 = 100% */
        
        /* Mobile viewport height - if not set by viewport-height-fix.js */
        --vh: 1vh;
      }
      
      /* Baseline - Prevent layout shifts for all fixed/sticky elements */
      [style*="position:fixed"], [style*="position: fixed"],
      [style*="position:sticky"], [style*="position: sticky"],
      .fixed, .sticky {
        contain: none !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
      }
      
      /* Prevent dynamic bottom values on fixed headers that cause CLS */
      header[style*="position:fixed"], header[style*="position: fixed"],
      .header[style*="position:fixed"], .header[style*="position: fixed"],
      [data-cls-fixed="true"] {
        bottom: auto !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: var(--header-height, ${headerHeight}px) !important;
        z-index: ${CONFIG.HEADER.Z_INDEX} !important;
        transform: translateZ(0) !important;
        will-change: transform !important;
      }
      
      /* Fixed spacing for body to prevent content jumps */
      body.has-fixed-header {
        padding-top: var(--header-height, ${headerHeight}px) !important;
        overflow-x: hidden !important; /* Prevent horizontal bounces */
      }
      
      /* Ensure fixed bottom nav doesn't cause shifts */
      nav[style*="position:fixed"][style*="bottom"],
      .bottom-nav,
      .navigation-bottom,
      div[style*="position:fixed"][style*="bottom"] {
        top: auto !important; 
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        transform: translateZ(0) !important;
      }
      
      /* Prevent animations on fixed elements that can cause CLS */
      [data-cls-fixed="true"] {
        transition: none !important;
        animation: none !important;
      }
      
      /* Fix hero sections that might have unstable height */
      section#hero, section.hero, section[data-hero-section="true"] {
        min-height: var(--hero-min-desktop-height, auto) !important;
        height: var(--hero-desktop-height, auto) !important;
        content-visibility: auto !important;
        transform: translateZ(0) !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
        will-change: transform !important;
      }
      
      /* Mobile hero optimizations using viewport height fix */
      @media (max-width: 768px) {
        /* Mobile-specific fixes */
        section#hero, section.hero, section[data-hero-section="true"] {
          min-height: var(--hero-min-mobile-height, 450px) !important;
          height: var(--hero-mobile-height, 450px) !important;
          max-height: var(--hero-mobile-height, 450px) !important;
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          will-change: transform !important;
        }
        
        /* Mobile hero title container */
        #hero-title, h1#hero-title, [data-hero-title="true"] {
          min-height: var(--title-container-height, 120px) !important;
          height: auto !important;
        }
        
        /* Mobile rotating text container */
        .text-rotate-container, [data-rotating-text="true"], 
        #hero-title > div, .rotating-text-container {
          height: var(--rotating-text-height-mobile, 44px) !important;
          min-height: var(--rotating-text-height-mobile, 44px) !important;
          max-height: var(--rotating-text-height-mobile, 44px) !important;
        }
      }
      
      /* Fix for all image containers */
      .img-container, [class*="image-container"], .card-image, .hero-image, .thumbnail {
        position: relative !important;
        overflow: hidden !important;
      }
      
      /* Aspect ratio container classes */
      .aspect-16-9, [data-aspect="16-9"] {
        padding-bottom: var(--aspect-ratio-16-9, 56.25%) !important;
      }
      
      .aspect-4-3, [data-aspect="4-3"] {
        padding-bottom: var(--aspect-ratio-4-3, 75%) !important;
      }
      
      .aspect-1-1, [data-aspect="1-1"] {
        padding-bottom: var(--aspect-ratio-1-1, 100%) !important;
      }
    `;
    
    document.head.appendChild(styleEl);
    
    // Prevent CLS from containment-related issues
    fixContainmentIssues();
    
    // Monitor for any changes that might undo our fix
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;
      
      for (const mutation of mutations) {
        if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
          needsFix = true;
        }
      }
      
      if (needsFix) {
        // Re-apply our styles to ensure they aren't overridden
        Object.assign(header.style, headerStyles);
      }
    });
    
    // Start observing the header for attribute changes
    observer.observe(header, { 
      attributes: true,
      attributeFilter: ['style', 'class'] 
    });
    
    // Store observer reference for cleanup
    window.__headerObserver = observer;
  }
  
  /**
   * Fixes any elements with CSS containment that might cause CLS issues
   */
  function fixContainmentIssues() {
    // Find any elements with contain: strict or contain: content and fix them
    const containedElements = document.querySelectorAll(
      '[style*="contain:"], [style*="contain :"], [style*="contain:strict"], [style*="contain:content"]'
    );
    
    let fixedCount = 0;
    
    containedElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        
        if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
          el.style.contain = 'none';
          el.setAttribute('data-contain-fixed', 'disabled');
          fixedCount++;
        }
      }
    });
    
    if (fixedCount > 0) {
      console.log(`Disabled containment on ${fixedCount} fixed/sticky elements`);
    }
  }
  
  /**
   * Detects and fixes fixed elements with bottom values that might cause CLS
   */
  function fixBottomValuesOnFixed() {
    // Get all fixed elements
    const fixedElements = document.querySelectorAll(
      '[style*="position:fixed"], [style*="position: fixed"], .fixed'
    );
    
    let fixedCount = 0;
    
    fixedElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        
        // Check if this is a fixed element with a problematic bottom value
        if (computedStyle.position === 'fixed') {
          // Force hardware acceleration for all fixed elements to reduce CLS
          el.style.transform = 'translateZ(0)';
          el.style.backfaceVisibility = 'hidden';
          el.style.webkitBackfaceVisibility = 'hidden';
          
          // Mark as fixed for our CSS to target
          el.setAttribute('data-cls-fixed', 'true');
          
          // Fix elements with bottom positioning
          if (computedStyle.bottom !== 'auto') {
            // Handle header-like elements
            if (el.tagName.toLowerCase() === 'header' || 
                el.classList.contains('header') || 
                el.classList.contains('fixed-top')) {
              // Headers should always be at the top with auto bottom
              el.style.top = '0';
              el.style.bottom = 'auto';
              fixedCount++;
            }
            // Handle bottom navigation
            else if (computedStyle.bottom === '0px' && 
                    (el.classList.contains('nav') || 
                     el.classList.contains('navigation') ||
                     el.classList.contains('bottom') ||
                     el.tagName.toLowerCase() === 'nav')) {
              // Bottom nav should always have auto top and 0 bottom
              el.style.bottom = '0';
              el.style.top = 'auto';
              el.style.transform = 'translateZ(0)';
              fixedCount++;
            }
            // For other fixed elements with non-auto bottom values
            else if (computedStyle.bottom !== '0px') {
              // These are the most problematic for CLS
              // Force no containment and mark for special handling
              el.style.contain = 'none';
              el.setAttribute('data-cls-problematic', 'true');
              fixedCount++;
            }
          }
        }
      }
    });
    
    if (fixedCount > 0) {
      console.log(`Fixed ${fixedCount} elements with bottom positioning`);
    }
  }
  
  /**
   * Pre-allocate space for image containers to prevent CLS
   */
  function fixImageContainers() {
    // Target common image containers
    const imageContainers = document.querySelectorAll(
      '.img-container, [class*="image-container"], .card-image, .hero-image, .thumbnail'
    );
    
    let fixedCount = 0;
    
    imageContainers.forEach(container => {
      if (container instanceof HTMLElement) {
        // Skip if already has explicit dimensions
        if (container.style.height || container.style.aspectRatio) {
          return;
        }
        
        // Check for child images
        const images = container.querySelectorAll('img');
        if (images.length > 0) {
          // Set container to relative position for absolute child positioning
          container.style.position = 'relative';
          
          // Add aspect ratio if not already set
          if (!container.style.aspectRatio) {
            container.style.aspectRatio = '16/9';
          }
          
          // Set proper contain values for better CLS prevention
          container.style.contain = 'layout size';
          fixedCount++;
          
          // Fix images inside the container
          images.forEach(img => {
            if (img instanceof HTMLImageElement) {
              // Enforce size attributes if missing
              if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                img.setAttribute('width', '100%');
                img.setAttribute('height', 'auto');
              }
              
              // Set object-fit for proper scaling
              img.style.objectFit = 'cover';
            }
          });
        }
      }
    });
    
    if (fixedCount > 0) {
      console.log(`Fixed ${fixedCount} image containers with aspect ratios`);
    }
  }
  
  /**
   * Integrates with viewport-height-fix.js
   * Ensures proper coordination between the two scripts
   */
  function integrateViewportHeightFix() {
    // Check if viewport height fix script has already run
    const hasCustomVh = getComputedStyle(document.documentElement).getPropertyValue('--vh') !== '';
    
    if (!hasCustomVh) {
      // If viewport-height-fix.js hasn't run yet, set a default value
      // that will be overridden if/when that script runs
      console.log('Setting default viewport height variable as fallback');
      
      // Calculate initial vh unit (1% of viewport height)
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Add iOS detection for additional fixes
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        document.documentElement.classList.add('ios-device');
      }
    } else {
      console.log('Viewport height variables already set by viewport-height-fix.js');
    }
    
    // Set additional viewport-related CSS variables for CLS prevention
    document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
  }

  /**
   * Main function to fix CLS issues
   */
  function fixCLSIssues() {
    // Step 1: Integrate with viewport height fix
    integrateViewportHeightFix();
    
    // Step 2: Fix header positioning
    fixHeader();
    
    // Step 3: Fix fixed elements with bottom values
    fixBottomValuesOnFixed();
    
    // Step 4: Fix image containers
    fixImageContainers();
    
    // Log completion time
    const completionTime = performance.now() - startTime;
    console.log(`CLS fixes applied in ${completionTime.toFixed(2)}ms`);
  }
  
  // Run immediately if document already loaded
  if (document.readyState !== 'loading') {
    fixCLSIssues();
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', fixCLSIssues);
  }
  
  // Also run on load as a backup
  window.addEventListener('load', () => {
    fixCLSIssues();
    
    // Set up a periodic check for the first few seconds after load
    let checkCount = 0;
    const interval = setInterval(() => {
      fixBottomValuesOnFixed();
      fixImageContainers(); // Check for newly loaded images
      integrateViewportHeightFix(); // Re-check viewport variables
      
      checkCount++;
      if (checkCount >= CONFIG.PERIODIC_CHECKS) {
        clearInterval(interval);
        console.log('Completed periodic CLS checks');
      }
    }, CONFIG.CHECK_INTERVAL);
    
    // Set up resize listener with debounce to update viewport variables
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Re-check viewport dimensions on resize
        document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
        document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
        
        // Apply specific fixes that need to be recalculated
        fixBottomValuesOnFixed();
        fixImageContainers();
      }, 100);
    }, { passive: true });
    
    // Also handle orientation changes more aggressively
    window.addEventListener('orientationchange', () => {
      // Immediate update
      integrateViewportHeightFix();
      
      // Delayed updates to catch the UI bar hiding/showing
      setTimeout(integrateViewportHeightFix, 200);
      setTimeout(integrateViewportHeightFix, 500);
    });
  });
  
  /**
   * Monitor layout shifts using PerformanceObserver with specialized IIFE structure
   * This helps debug CLS issues in real-time
   */

  // Initialize CLS monitoring with improved structure
  // CRITICAL: cumulativeLayoutShift must be declared before PerformanceObserver
  let cumulativeLayoutShift = 0;
  (function measureCLS() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        cumulativeLayoutShift += entry.value;
        if (window.reportCLS) {
          window.reportCLS({ value: cumulativeLayoutShift });
        }
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
  })();

  // Extended CLS monitoring for debugging
  function monitorLayoutShifts() {
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('PerformanceObserver not supported in this browser, layout shift monitoring disabled');
      return;
    }

    // Flag to enable/disable layout shift monitoring
    const debugMode = window.location.search.includes('debug=cls') || window.location.search.includes('debug=all');

    // Skip if not in debug mode and not explicitly enabled
    if (!debugMode && !window.__enableClsMonitoring) {
      // Still set up the API for use later
      window.__enableClsMonitoring = () => {
        startMonitoring(true);
        return 'Layout shift monitoring enabled';
      };
      return;
    }

    // CRITICAL: Declare layoutShiftEntries before using it in any callbacks
    let layoutShiftEntries = [];

    // Start monitoring layout shifts
    function startMonitoring(showDebug = false) {
      try {
        // Create an observer instance
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // Skip if the shift happened after user input
            if (entry.hadRecentInput) continue;

            // Store entry details
            const entryDetail = {
              value: entry.value,
              timestamp: new Date().toISOString(),
              elements: []
            };

            // Try to get information about affected elements
            try {
              if (entry.sources) {
                for (const source of entry.sources) {
                  if (source.node) {
                    const nodeName = source.node.nodeName || 'unknown';
                    const nodeId = source.node.id ? `#${source.node.id}` : '';
                    const className = source.node.className && typeof source.node.className === 'string' ?
                      `.${source.node.className.split(' ').join('.')}` : '';

                    const nodeIdentifier = `${nodeName}${nodeId}${className}`;
                    entryDetail.elements.push(nodeIdentifier);

                    // In debug mode, highlight problematic elements
                    if (showDebug) {
                      // Get the element that caused the layout shift
                      if (source.node) {
                        // Store original styles
                        const originalOutline = source.node.style.outline;
                        const originalZIndex = source.node.style.zIndex;
                        const originalOpacity = source.node.style.opacity;

                        // Highlight element that caused the layout shift
                        source.node.style.outline = '3px solid red';
                        source.node.style.zIndex = '10000';
                        source.node.style.opacity = '0.8';

                        // Reset after 1 second
                        setTimeout(() => {
                          source.node.style.outline = originalOutline;
                          source.node.style.zIndex = originalZIndex;
                          source.node.style.opacity = originalOpacity || '1';
                        }, 1000);
                      }
                    }
                  }
                }
              }
            } catch (e) {
              // Safely handle any errors in accessing source nodes
              entryDetail.elements.push('Error accessing element details');
            }

            layoutShiftEntries.push(entryDetail);

            // Log to console in debug mode
            if (showDebug) {
              console.warn(`🔴 Layout shift detected: ${entry.value.toFixed(5)}`, {
                cumulativeLayoutShift: cumulativeLayoutShift.toFixed(5),
                elements: entryDetail.elements.length ? entryDetail.elements : 'Unknown elements',
                timestamp: entryDetail.timestamp
              });
            }
          }
        });

        // Start observing layout shift entries
        observer.observe({ type: 'layout-shift', buffered: true });

        // Return the observer for cleanup
        return observer;
      } catch (e) {
        console.warn('Error setting up layout shift monitoring:', e);
        return null;
      }
    }

    // Start monitoring with debug output if in debug mode
    const observer = startMonitoring(debugMode);

    // Create API for accessing CLS data
    window.__clsMonitoring = {
      getTotalCLS: () => cumulativeLayoutShift.toFixed(5),
      getEntries: () => layoutShiftEntries,
      getRecentEntries: (count = 5) => layoutShiftEntries.slice(-count),
      enableDebugHighlights: () => {
        if (observer) {
          observer.disconnect();
        }
        return startMonitoring(true);
      },
      disableDebugHighlights: () => {
        if (observer) {
          observer.disconnect();
        }
        return startMonitoring(false);
      }
    };

    // Add debug UI if needed
    if (debugMode) {
      // Create floating debug panel
      const debugPanel = document.createElement('div');
      debugPanel.id = 'cls-debug-panel';
      debugPanel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 300px;
        max-height: 300px;
        overflow: auto;
      `;

      // Update the debug panel every second
      setInterval(() => {
        // Show CLS value and recent shifts
        let html = `<strong>CLS: ${cumulativeLayoutShift.toFixed(5)}</strong>`;

        // Add recent entries
        const recentEntries = layoutShiftEntries.slice(-5);
        if (recentEntries.length > 0) {
          html += '<hr/><strong>Recent shifts:</strong><ul style="margin: 0; padding-left: 15px;">';
          recentEntries.forEach(entry => {
            const elements = entry.elements.length ? entry.elements.join(', ') : 'Unknown';
            html += `<li>${entry.value.toFixed(5)} - ${elements}</li>`;
          });
          html += '</ul>';
        }

        debugPanel.innerHTML = html;
      }, 1000);

      // Add to document after load
      window.addEventListener('load', () => {
        document.body.appendChild(debugPanel);
      });
    }
  }

  // Initialize extended layout shift monitoring
  monitorLayoutShifts();

  // Export utilities for debugging
  window.__clsFixes = {
    reapply: fixCLSIssues,
    fixHeader: fixHeader,
    fixBottomValues: fixBottomValuesOnFixed,
    fixImageContainers: fixImageContainers,
    updateViewportVars: integrateViewportHeightFix,
    getVars: () => {
      // Return current CLS-critical variables for debugging
      return {
        vh: getComputedStyle(document.documentElement).getPropertyValue('--vh'),
        headerHeight: getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        windowHeight: getComputedStyle(document.documentElement).getPropertyValue('--window-height'),
        heroMobileHeight: getComputedStyle(document.documentElement).getPropertyValue('--hero-mobile-height'),
        rotatingTextHeight: getComputedStyle(document.documentElement).getPropertyValue('--rotating-text-height-mobile')
      };
    },
    // Add the ability to toggle layout shift monitoring
    enableClsMonitoring: () => {
      if (typeof window.__enableClsMonitoring === 'function') {
        return window.__enableClsMonitoring();
      }
      return 'Layout shift monitoring already enabled';
    }
  };
})();