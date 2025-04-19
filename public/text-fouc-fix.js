/**
 * Emergency header fix for mobile and containment safety
 * This script fixes the header positioning and prevents CSS containment issues
 * by directly manipulating the DOM as soon as the document loads.
 */

 (function() {
  // Limit retry attempts to avoid infinite loops
  let headerRetryCount = 0;
  const MAX_HEADER_RETRIES = 50;
  // Function to fix the header
  function fixHeader() {
    // Get the header element - try various selectors
    const header =
      document.querySelector('header') ||
      document.querySelector('header.fixed') ||
      document.querySelector('.header') ||
      document.querySelector('.fixed-top') ||
      document.querySelector('[class*="header"]') ||
      document.querySelector('nav[role="navigation"]') ||
      document.querySelector('#root > div > header');
    
    if (!header) {
      headerRetryCount++;
      if (headerRetryCount > MAX_HEADER_RETRIES) {
        console.warn(
          `Header element not found after ${MAX_HEADER_RETRIES} attempts, aborting header fix`
        );
        return;
      }
      console.warn(
        `Header element not found (attempt ${headerRetryCount}/${MAX_HEADER_RETRIES}), will retry`
      );
      setTimeout(fixHeader, 100);
      return;
    }

    // Force fixed positioning with inline styles (highest specificity)
    console.log('Found header element, applying fixed positioning');
    
    // Apply styles directly to header
    const headerStyles = {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      width: '100%',
      zIndex: '9999',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #F9F6EC',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      contain: 'none' // Explicitly disable CSS containment
    };
    
    // Apply all the styles
    Object.assign(header.style, headerStyles);
    
    // Mark the header as not to be contained
    header.setAttribute('data-contain-force', 'false');
    
    // Add body padding to prevent content from being hidden under header
    const headerHeight = header.offsetHeight || 64;
    document.body.style.paddingTop = headerHeight + 'px';
    
    // Log success
    console.log(`Fixed header position and added ${headerHeight}px body padding`);
    
    // Add style to prevent any other fixed elements from receiving containment
    const styleEl = document.createElement('style');
    styleEl.id = 'containment-safety-style';
    styleEl.textContent = `
      /* Prevent containment on fixed/sticky elements */
      [style*="position:fixed"], [style*="position: fixed"],
      [style*="position:sticky"], [style*="position: sticky"] {
        contain: none !important;
      }
      
      /* Prevent bottom values on fixed headers */
      header[style*="position:fixed"], header[style*="position: fixed"],
      .header[style*="position:fixed"], .header[style*="position: fixed"] {
        bottom: auto !important;
      }
      
      /* Ensure header stays at top */
      header.fixed, 
      header[style*="position:fixed"], 
      header[style*="position: fixed"],
      .header.fixed, 
      .header[style*="position:fixed"], 
      .header[style*="position: fixed"] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Find any elements with contain: strict or contain: content and fix them
    const containedElements = document.querySelectorAll('[style*="contain:"], [style*="contain :"]');
    containedElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
        el.style.contain = 'none';
        el.setAttribute('data-contain-fixed', 'disabled');
        console.log('Disabled containment on fixed/sticky element:', el);
      }
    });
    
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
    observer.observe(header, { attributes: true });
  }
  
  // Function to detect and fix any fixed elements that have bottom values
  function fixBottomValuesOnFixed() {
    // Get all fixed elements
    const fixedElements = document.querySelectorAll('[style*="position:fixed"], [style*="position: fixed"]');
    
    fixedElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        
        // Check if the element has a bottom value that's not auto and not touching the bottom
        // Only fix problematic ones that could create stacking issues
        if (computedStyle.bottom !== 'auto' && 
            computedStyle.bottom !== '0px' && 
            computedStyle.bottom !== '0') {
          
          // Force no containment on fixed elements
          el.style.contain = 'none';
          
          // Fix header-like elements that shouldn't have a bottom value
          if (el.tagName.toLowerCase() === 'header' || 
              el.classList.contains('header') || 
              el.classList.contains('fixed-top')) {
            el.style.bottom = 'auto';
            console.log('Fixed bottom value on header-like element', el);
          }
        }
      }
    });
  }
  
  // Run immediately if document already loaded
  if (document.readyState !== 'loading') {
    fixHeader();
    fixBottomValuesOnFixed();
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      fixHeader();
      fixBottomValuesOnFixed();
    });
  }
  
  // Also run on load as a backup
  window.addEventListener('load', () => {
    fixHeader();
    fixBottomValuesOnFixed();
    
    // Set up a periodic check for the first 10 seconds
    let checkCount = 0;
    const interval = setInterval(() => {
      fixBottomValuesOnFixed();
      checkCount++;
      if (checkCount >= 5) clearInterval(interval);
    }, 2000);
  });
})();