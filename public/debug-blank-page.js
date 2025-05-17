// Debug script to help diagnose blank page issues
(function() {
  console.log('Running enhanced blank page debug script');
  
  // Add visual indicator
  const debugIndicator = document.createElement('div');
  debugIndicator.id = 'debug-indicator';
  debugIndicator.style.position = 'fixed';
  debugIndicator.style.top = '10px';
  debugIndicator.style.right = '10px';
  debugIndicator.style.backgroundColor = '#ff5722';
  debugIndicator.style.color = 'white';
  debugIndicator.style.padding = '5px 10px';
  debugIndicator.style.borderRadius = '4px';
  debugIndicator.style.zIndex = '999999';
  debugIndicator.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  debugIndicator.style.fontSize = '12px';
  debugIndicator.textContent = 'Debug Mode';
  document.body.appendChild(debugIndicator);
  
  // Create debug log that will be visible on the page
  const debugLog = document.createElement('div');
  debugLog.id = 'debug-log';
  debugLog.style.position = 'fixed';
  debugLog.style.bottom = '10px';
  debugLog.style.right = '10px';
  debugLog.style.width = '300px';
  debugLog.style.maxHeight = '200px';
  debugLog.style.overflowY = 'auto';
  debugLog.style.backgroundColor = 'rgba(0,0,0,0.8)';
  debugLog.style.color = '#00ff00';
  debugLog.style.fontFamily = 'monospace';
  debugLog.style.fontSize = '10px';
  debugLog.style.padding = '10px';
  debugLog.style.borderRadius = '4px';
  debugLog.style.zIndex = '999998';
  document.body.appendChild(debugLog);
  
  function addToDebugLog(message) {
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    debugLog.appendChild(entry);
    debugLog.scrollTop = debugLog.scrollHeight;
    console.log(message);
  }
  
  // Log the document structure
  addToDebugLog(`Document state: ${document.readyState}`);
  addToDebugLog(`HTML classes: ${document.documentElement.className}`);
  addToDebugLog(`Root element exists: ${document.getElementById('root') ? 'YES' : 'NO'}`);
  
  // Log React status
  if (window.React) {
    addToDebugLog(`React version: ${window.React.version}`);
  } else {
    addToDebugLog('React not loaded yet');
  }
  
  // Check for Vite client
  if (window.__vite_plugin_react_preamble_installed__) {
    addToDebugLog('Vite React plugin detected');
  }
  
  // Log any errors
  const loggedErrors = [];
  const originalError = console.error;
  console.error = function() {
    const errorMessage = Array.from(arguments).join(' ');
    loggedErrors.push(errorMessage);
    addToDebugLog(`ERROR: ${errorMessage.substring(0, 100)}...`);
    originalError.apply(console, arguments);
  };
  
  // Track React rendering
  const checkReactRendering = function() {
    const root = document.getElementById('root');
    if (root) {
      const childCount = root.childElementCount;
      addToDebugLog(`Root children count: ${childCount}`);
      if (childCount === 0) {
        addToDebugLog('WARNING: React not rendering content');
        
        // Insert temporary content to show something is working
        const tempContent = document.createElement('div');
        tempContent.innerHTML = `
          <h2 style="color: #ff0000; margin: 20px; font-family: sans-serif;">Temporary Content</h2>
          <p style="margin: 20px; font-family: sans-serif;">React is having trouble rendering. Debugging in progress...</p>
        `;
        root.appendChild(tempContent);
      }
    }
  };
  
  // Check images
  const allImages = document.querySelectorAll('img');
  addToDebugLog(`Total images: ${allImages.length}`);
  const visibleImages = Array.from(allImages).filter(img => {
    const style = window.getComputedStyle(img);
    return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden';
  });
  addToDebugLog(`Visible images: ${visibleImages.length}`);
  
  // Monitor DOM changes
  try {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          if (mutation.target.id === 'root') {
            addToDebugLog(`Root updated: ${mutation.addedNodes.length} nodes added`);
          }
        }
      }
    });
    
    // Start observing the root element for DOM changes
    const root = document.getElementById('root');
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
      addToDebugLog('Monitoring root for changes');
    }
  } catch (e) {
    addToDebugLog(`Observer error: ${e.message}`);
  }
  
  // Check at various lifecycle points
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addToDebugLog('DOMContentLoaded fired');
      checkReactRendering();
    });
  }
  
  window.addEventListener('load', () => {
    addToDebugLog('Window load event fired');
    checkReactRendering();
    
    // Update debug indicator
    debugIndicator.textContent = 'Page Loaded';
    debugIndicator.style.backgroundColor = '#4caf50';
  });
  
  // Force show everything after 3 seconds
  setTimeout(function() {
    addToDebugLog('Applying emergency visibility fixes (3s)');
    
    // Make all images visible
    document.querySelectorAll('img').forEach(img => {
      img.style.opacity = '1';
      img.style.display = 'inline-block';
    });
    
    // Remove loading class that might be hiding content
    document.documentElement.classList.remove('loading');
    document.documentElement.classList.add('content-loaded');
    
    checkReactRendering();
  }, 3000);
  
  // More aggressive fixes after 5 seconds
  setTimeout(function() {
    addToDebugLog('Applying aggressive fixes (5s)');
    
    // Force everything to be visible
    const forceShowStyles = document.createElement('style');
    forceShowStyles.textContent = `
      body * {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      #root > * {
        display: block !important;
      }
      
      style, script, link, meta {
        display: none !important;
      }
      
      img, button, a {
        display: inline-block !important;
      }
      
      .loading {
        display: none !important;
      }
    `;
    document.head.appendChild(forceShowStyles);
    
    // Update debug indicator
    debugIndicator.textContent = 'Recovery Mode';
    debugIndicator.style.backgroundColor = '#ff9800';
    
    // Report errors
    addToDebugLog(`Total errors: ${loggedErrors.length}`);
    
    checkReactRendering();
  }, 5000);
  
  // Final fixes after 10 seconds
  setTimeout(function() {
    addToDebugLog('Final emergency measures (10s)');
    
    // Force rendering of common components
    const root = document.getElementById('root');
    if (root && root.childElementCount === 0) {
      // Create fallback content
      root.innerHTML = `
        <div style="padding: 20px; font-family: system-ui, sans-serif;">
          <h1 style="color: #d32f2f;">React Rendering Failed</h1>
          <p>The application encountered a serious error and couldn't render properly.</p>
          <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #d32f2f; overflow: auto;">
            <pre>${JSON.stringify(loggedErrors, null, 2)}</pre>
          </div>
          <button onclick="location.reload()" style="padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
    }
    
    // Update debug indicator
    debugIndicator.textContent = 'Emergency Mode';
    debugIndicator.style.backgroundColor = '#d32f2f';
  }, 10000);
})();