/**
 * Mobile site emergency fix
 * 
 * This script ensures the site displays properly on mobile devices
 * by addressing React context issues and CSS rendering problems
 */

(function() {
  console.log('[Mobile Fix] Initializing mobile site fix');

  // Detect if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;

  if (!isMobile) {
    console.log('[Mobile Fix] Not on mobile device, skipping fixes');
    return;
  }

  console.log('[Mobile Fix] Mobile device detected, applying fixes');

  /**
   * Add CSS fixes for mobile layout
   */
  function addMobileCSSFixes() {
    const style = document.createElement('style');
    style.id = 'mobile-emergency-fix';
    style.innerHTML = `
      /* Force elements to display properly on mobile */
      body, #root {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100vh !important;
        max-width: 100vw !important;
        position: relative !important;
        -webkit-overflow-scrolling: touch !important;
        touch-action: manipulation !important;
      }

      /* Fix the hero section sizing */
      #hero, .hero, section.hero, div.hero, [class*="hero-"] {
        height: 100vh !important;
        min-height: 100vh !important;
        max-height: none !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
      }

      /* Ensure all sections are visible */
      section {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: auto !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }

      /* Fix transition sections */
      [class*="transition"], [id*="transition"] {
        height: 40px !important;
        min-height: 40px !important;
        max-height: 40px !important;
      }

      /* Fix image sizing */
      img {
        opacity: 1 !important;
        max-width: 100% !important;
        height: auto !important;
      }

      /* Fix buttons and interactive elements */
      button, [role="button"], a {
        touch-action: manipulation !important;
        cursor: pointer !important;
        min-height: 44px !important;
        min-width: 44px !important;
      }

      /* Fix animations */
      [class*="animate-"], [class*="motion"] {
        animation-duration: 0.5s !important;
        transition-duration: 0.3s !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Fix viewport meta tag
   */
  function fixViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
    } else {
      // Create viewport meta if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }

  /**
   * Fix event listeners that might cause recursion - DISABLED to prevent infinite loop
   */
  function fixEventListeners() {
    // ************ CRITICAL FIX ************
    // Completely disable the addEventListener override which was causing
    // an infinite recursion loop on mobile devices
    console.log('[Mobile Fix] Event listener optimization disabled to prevent recursion');
    
    // If diagnostic mode is enabled, add more detailed logging
    if (window.__eventDiagnostics || window.__guardOriginalEventMethods) {
      console.log('[Mobile Fix] Using advanced event listener diagnostics');
      
      // Save a snapshot of our current event listener stats
      if (window.getEventListenerDiagnostics) {
        const stats = window.getEventListenerDiagnostics();
        console.log('[Mobile Fix] Current event listener stats:', stats);
      }
      
      // Check if addEventListener has been modified
      if (window.EventTarget && 
          window.EventTarget.prototype && 
          window.EventTarget.prototype.addEventListener) {
        
        const isNative = window.EventTarget.prototype.addEventListener.toString().indexOf('native code') !== -1;
        console.log('[Mobile Fix] addEventListener is native:', isNative);
        
        // Check if any monkey-patched addEventListener exists
        if (window.originalAddEventListener || 
            (window as any)?.originalAddEventListener || 
            window.__originalEventMethods?.addEventListener ||
            window.__guardOriginalEventMethods?.addEventListener) {
          
          console.log('[Mobile Fix] Found stored original addEventListener references');
        }
      }
    }
    
    // Instead, directly add passive event listeners for touch events
    // without monkey-patching addEventListener
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll'];
    try {
      // Add a counter to make sure we only add each listener once
      window.__mobileFixPassiveListeners = window.__mobileFixPassiveListeners || {};
      
      passiveEvents.forEach(event => {
        // Only add if not already added by this script
        if (!window.__mobileFixPassiveListeners[event]) {
          document.addEventListener(event, function() {}, { passive: true });
          window.addEventListener(event, function() {}, { passive: true });
          window.__mobileFixPassiveListeners[event] = true;
          console.log(`[Mobile Fix] Added passive listener for ${event}`);
        }
      });
    } catch (e) {
      console.warn('[Mobile Fix] Error applying passive event listeners:', e);
    }
    
    // Register a check to periodically ensure addEventListener isn't being overridden
    // by other scripts during runtime
    const monitorIntervalId = setInterval(() => {
      const isOverridden = window.EventTarget && 
                           window.EventTarget.prototype && 
                           window.EventTarget.prototype.addEventListener && 
                           window.EventTarget.prototype.addEventListener.toString().indexOf('native code') === -1;
      
      if (isOverridden && window.__guardOriginalEventMethods?.addEventListener) {
        console.warn('[Mobile Fix] addEventListener has been overridden! Attempting to restore...');
        
        try {
          // Try to restore from our diagnostic scripts
          window.EventTarget.prototype.addEventListener = window.__guardOriginalEventMethods.addEventListener;
          console.log('[Mobile Fix] Restored native addEventListener from guard');
        } catch (err) {
          console.error('[Mobile Fix] Failed to restore addEventListener:', err);
        }
      }
    }, 5000); // Check every 5 seconds
    
    // Store the interval ID for potential cleanup
    window.__mobileFixMonitorId = monitorIntervalId;
  }

  /**
   * Apply fixes to make sure the mobile site displays properly
   */
  function applyMobileFixes() {
    // Add all the fixes
    addMobileCSSFixes();
    fixViewport();
    fixEventListeners();
    
    // Make sure the page is visible
    document.documentElement.style.display = 'block';
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
    
    // Make sure the page continues to be visible
    setInterval(function() {
      if (document.body.style.display === 'none' || 
          document.body.style.visibility === 'hidden' || 
          document.body.style.opacity === '0') {
        document.body.style.display = 'block';
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
      }
      
      const root = document.getElementById('root');
      if (root && (
          root.style.display === 'none' || 
          root.style.visibility === 'hidden' || 
          root.style.opacity === '0')) {
        root.style.display = 'block';
        root.style.visibility = 'visible';
        root.style.opacity = '1';
      }
    }, 1000);
  }

  // Apply immediately if document is already loaded
  if (document.readyState !== 'loading') {
    applyMobileFixes();
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', applyMobileFixes);
  }
  
  // Also apply on window load event
  window.addEventListener('load', function() {
    applyMobileFixes();
    console.log('[Mobile Fix] Reapplied fixes after load');
  });
})();
