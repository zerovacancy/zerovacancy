// Quick performance optimizations for mobile browsers
(function() {
  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  // Add mobile class to document for CSS targeting
  if (isMobile) {
    document.documentElement.classList.add('mobile');
  }
  
  // Create global recovery function for CSS loading failures
  window.recoverFromCSSFailure = function() {
    try {
      // Find all CSS links
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      
      // Reload each stylesheet with cache busting
      cssLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (originalHref) {
          // Create cache-busting URL
          const cacheBustUrl = originalHref.includes('?') 
            ? `${originalHref}&_cb=${Date.now()}` 
            : `${originalHref}?_cb=${Date.now()}`;
          
          // Replace the stylesheet
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = cacheBustUrl;
          
          // Add to document
          document.head.appendChild(newLink);
        }
      });
      
      // Create emergency inline styles to ensure basic layout
      const emergencyStyles = document.createElement('style');
      emergencyStyles.textContent = `
        /* Emergency styles to recover from CSS loading failure */
        body { font-family: system-ui, sans-serif; background: #fff; color: #333; }
        .mobile-sticky-header { position: fixed; top: 0; left: 0; right: 0; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 1000; }
        button, a { cursor: pointer; }
        section { margin: 1rem 0; }
        img { max-width: 100%; height: auto; }
        #root { display: block; min-height: 100vh; }
        header { position: sticky; top: 0; background: #fff; z-index: 10; }
      `;
      document.head.appendChild(emergencyStyles);
      
      console.log('Attempted recovery from CSS loading failure');
    } catch (e) {
      console.error('Error during CSS recovery:', e);
    }
  };
  
  // Early error handling with safeguards
  let cssFailureDetected = false;
  const originalErrorHandler = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Skip null error cases to prevent issues
    if (!message) return false;
    
    try {
      // Check if it's a CSS loading error
      if (typeof message === 'string' && (
          message.includes('CSS') || 
          message.includes('stylesheet') || 
          (message.includes('index-') && message.includes('.css'))
        )) {
        console.warn('Potential CSS loading error detected:', message);
        cssFailureDetected = true;
        
        // Attempt recovery after a short delay
        setTimeout(function() {
          if (cssFailureDetected) {
            window.recoverFromCSSFailure();
          }
        }, 3000);
      }
      
      // Call original error handler if it exists
      if (typeof originalErrorHandler === 'function') {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
    } catch (e) {
      console.error('Error in error handler:', e);
    }
    
    // Return false to allow default browser error handling
    return false;
  };
  
  // Detect white screen on mobile and attempt recovery - with proper error handling
  if (isMobile) {
    // Check for white screen after page should be loaded
    setTimeout(function() {
      try {
        // Look for any visible content
        const visibleContent = document.querySelector('header, main, #root > *');
        
        // If no visible content, attempt recovery
        const contentInvisible = !visibleContent || 
                               (visibleContent && 
                                getComputedStyle(visibleContent).opacity === '0');
        
        if (contentInvisible) {
          console.warn('Possible white screen detected - attempting recovery');
          window.recoverFromCSSFailure();
          
          // Force reload only as last resort
          setTimeout(function() {
            try {
              // Check again if content is now visible
              const visibleContentAfterRecovery = document.querySelector('header, main, #root > *');
              if (!visibleContentAfterRecovery || getComputedStyle(visibleContentAfterRecovery).opacity === '0') {
                // Only reload in production, not during development
                if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
                  // Clear cache and reload as last resort
                  window.location.reload(true);
                }
              }
            } catch (error) {
              console.warn('Error checking for visible content after recovery:', error);
            }
          }, 2000);
        }
      } catch (error) {
        console.warn('Error checking for visible content:', error);
      }
    }, 5000);
  }
  
  // Monitor resource loading with proper error handling
  if (isMobile && window.performance && window.performance.getEntriesByType) {
    window.addEventListener('load', function() {
      // Check if any CSS resources failed
      setTimeout(function() {
        try {
          const resources = window.performance.getEntriesByType('resource');
          let cssResourcesFound = false;
          let cssFailuresFound = false;
          
          resources.forEach(function(resource) {
            if (resource.name && resource.name.includes('.css')) {
              cssResourcesFound = true;
              
              // Check for failed resources (transferSize of 0 often indicates failure)
              if (resource.transferSize === 0 && !resource.decodedBodySize) {
                cssFailuresFound = true;
                console.warn('Failed CSS resource detected:', resource.name);
              }
            }
          });
          
          // If we found CSS resources but some failed, attempt recovery
          if (cssResourcesFound && cssFailuresFound) {
            window.recoverFromCSSFailure();
          }
        } catch (error) {
          console.warn('Error monitoring resource loading:', error);
        }
      }, 2000);
    });
  }
})();
