/**
 * Enhanced Viewport Height Fixer for Mobile Browsers
 * 
 * This script solves the issue of unreliable viewport height (vh) units in mobile browsers
 * by using custom CSS variables (--vh, --window-height) that represent the real viewport height.
 * 
 * Common CLS issues this fixes:
 * 1. Address bar showing/hiding causing layout shifts
 * 2. Mobile browser chrome appearing/disappearing
 * 3. Virtual keyboard appearing/disappearing
 * 4. Content reflow when scrolling
 * 
 * Usage in CSS:
 * height: calc(var(--vh, 1vh) * 100);
 * Or:
 * height: var(--window-height, 100vh);
 * 
 * For hero sections:
 * height: var(--hero-mobile-height, 450px); // Mobile
 * height: var(--hero-desktop-height, auto); // Desktop
 */

(function() {
  // Store the initial viewport height
  let storedVh = window.innerHeight * 0.01;
  let lastWidth = window.innerWidth;
  let resizeTimeout = null;
  let orientationTimeout = null;

  // Flag for whether this is a mobile device (for optimization)
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Add device classes for specific CSS targeting
  if (isMobile) {
    document.documentElement.classList.add('mobile-device');
    if (isIOS) {
      document.documentElement.classList.add('ios-device');
    } else {
      document.documentElement.classList.add('android-device');
    }
  }
  
  // Set the value of the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${storedVh}px`);
  document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
  document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
  
  // Store initial device dimensions for hero sections
  document.documentElement.style.setProperty(
    '--hero-mobile-height', 
    `${isMobile ? Math.round(window.innerHeight * 0.7) : 450}px`
  );
  
  document.documentElement.style.setProperty(
    '--hero-desktop-height', 
    `${!isMobile ? Math.round(window.innerHeight * 0.8) : 'auto'}`
  );
  
  document.documentElement.style.setProperty(
    '--hero-min-desktop-height', 
    `${!isMobile ? '480px' : 'auto'}`
  );
  
  // Remove pre-stabilization class once variables are set
  // This allows transitions to be properly set after initial render
  requestAnimationFrame(() => {
    // Very brief delay for browsers to apply the CSS variables
    setTimeout(() => {
      document.documentElement.classList.remove('cls-pre-stabilization');
      document.documentElement.classList.add('cls-stabilized');
    }, 50);
  });
  
  /**
   * Updates the CSS variables with current viewport dimensions
   * This is throttled to avoid rapid changes during interactions
   */
  function updateVh() {
    // Cancel any pending timeout
    if (resizeTimeout !== null) {
      clearTimeout(resizeTimeout);
    }
    
    // Set a timeout to throttle updates
    resizeTimeout = setTimeout(function() {
      // Calculate vh unit based on window inner height
      const vh = window.innerHeight * 0.01;
      
      // Only update if changed by a significant amount (> 5%) or width changed (likely orientation)
      const heightChanged = Math.abs(vh - storedVh) / storedVh > 0.05;
      const widthChanged = Math.abs(window.innerWidth - lastWidth) > 50;
      
      if (heightChanged || widthChanged) {
        // Store new values
        storedVh = vh;
        lastWidth = window.innerWidth;
        
        // Update CSS variables
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
        document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
        
        // Update hero section heights based on new dimensions
        const deviceIsMobile = window.innerWidth < 768;
        
        // Set hero heights based on device type
        document.documentElement.style.setProperty(
          '--hero-mobile-height', 
          `${deviceIsMobile ? Math.round(window.innerHeight * 0.7) : 450}px`
        );
        
        document.documentElement.style.setProperty(
          '--hero-desktop-height', 
          `${!deviceIsMobile ? Math.round(window.innerHeight * 0.8) : 'auto'}`
        );
        
        document.documentElement.style.setProperty(
          '--hero-min-desktop-height', 
          `${!deviceIsMobile ? '480px' : 'auto'}`
        );
        
        // Dispatch a custom event for components that need to react
        const event = new CustomEvent('viewportHeightChanged', {
          detail: {
            vh: vh,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
          }
        });
        
        window.dispatchEvent(event);
        
        if (window.DEBUG_MODE) {
          console.log('Viewport height fix: Updated vh value', {
            vh: vh,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            heightChanged: heightChanged,
            widthChanged: widthChanged
          });
        }
      }
      
      resizeTimeout = null;
    }, isMobile ? 100 : 200); // Faster updates on mobile
  }
  
  // Handle orientation changes differently - more aggressive refresh
  function handleOrientationChange() {
    // Clear any existing timeouts
    if (orientationTimeout !== null) {
      clearTimeout(orientationTimeout);
    }
    
    // Mark as unstabilized during orientation change
    document.documentElement.classList.remove('cls-stabilized');
    document.documentElement.classList.add('cls-pre-stabilization');
    
    // Initial update right away
    updateVh();
    
    // Then update again after orientation change has fully completed
    // This is needed because some browsers report incorrect dimensions immediately after change
    orientationTimeout = setTimeout(function() {
      updateVh();
      
      // And one more time after a longer delay to catch any browser UI animations
      setTimeout(() => {
        updateVh();
        
        // Re-add stabilized class
        document.documentElement.classList.remove('cls-pre-stabilization');
        document.documentElement.classList.add('cls-stabilized');
      }, 500);
      
      // iOS often needs an extra update
      if (isIOS) {
        setTimeout(() => {
          updateVh();
          
          // Ensure we're stabilized
          document.documentElement.classList.remove('cls-pre-stabilization');
          document.documentElement.classList.add('cls-stabilized');
        }, 1000);
      }
    }, 200);
  }
  
  // Update the value when the browser resizes
  window.addEventListener('resize', updateVh, { passive: true });
  
  // Special handling for orientation changes
  if ('onorientationchange' in window) {
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
  }
  
  // Handle page load event
  window.addEventListener('load', function() {
    // Force recalculation after page load to ensure accuracy
    updateVh();
    
    // Add one more update after a delay to catch any dynamic content
    setTimeout(updateVh, 500);
  });
  
  // Handle page visibility changes (when returning to the app)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      updateVh();
    }
  });
  
  // Optional: expose an API for manual updates
  window.updateViewportHeight = updateVh;
  
  // Initial size calculation
  updateVh();
})();