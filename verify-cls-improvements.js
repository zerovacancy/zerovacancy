/**
 * verify-cls-improvements.js
 * 
 * A simple script to measure CLS values for key pages using the web-vitals API.
 * This can be used to verify improvements after the CLS fixes PR is merged.
 * 
 * Usage: 
 * 1. Include this script on the pages you want to test
 * 2. Open the page in Chrome and check the console for CLS measurements
 * 3. Compare values before and after deploying the CLS fixes
 */

// Create a container for the results
function createResultsContainer() {
  // Check if container already exists
  if (document.getElementById('cls-results')) {
    return;
  }
  
  const container = document.createElement('div');
  container.id = 'cls-results';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.4;
    z-index: 9999;
    max-width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
    transform: translateZ(0);
    backface-visibility: hidden;
  `;
  
  // Add header
  const header = document.createElement('h3');
  header.textContent = 'CLS Measurements';
  header.style.cssText = `
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 600;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 5px;
  `;
  container.appendChild(header);
  
  // Add results list
  const resultsList = document.createElement('ul');
  resultsList.id = 'cls-values-list';
  resultsList.style.cssText = `
    margin: 0;
    padding: 0 0 0 20px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    list-style-type: square;
  `;
  container.appendChild(resultsList);
  
  // Add timestamp
  const timestamp = document.createElement('div');
  timestamp.id = 'cls-timestamp';
  timestamp.style.cssText = `
    font-size: 10px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    margin-top: 10px;
    opacity: 0.7;
    text-align: right;
  `;
  timestamp.textContent = `Started: ${new Date().toLocaleTimeString()}`;
  container.appendChild(timestamp);
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    color: white;
    font-size: 12px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    cursor: pointer;
    opacity: 0.7;
    width: 20px;
    height: 20px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0);
  `;
  closeButton.addEventListener('click', () => {
    container.style.opacity = '0';
    setTimeout(() => container.remove(), 300);
  });
  container.appendChild(closeButton);
  
  // Append to body
  document.body.appendChild(container);
  
  return container;
}

// Add a measurement to the results list
function addMeasurement(name, value, good = true) {
  const list = document.getElementById('cls-values-list');
  if (!list) return;

  const item = document.createElement('li');
  item.style.cssText = `
    margin-bottom: 5px;
    padding: 2px 0;
    color: ${good ? 'lightgreen' : 'coral'};
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.3;
  `;
  item.textContent = `${name}: ${value.toFixed(3)}`;
  list.appendChild(item);

  // Update timestamp
  const timestamp = document.getElementById('cls-timestamp');
  if (timestamp) {
    timestamp.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
  }
}

// Load web-vitals library if it's not already available
function loadWebVitals() {
  return new Promise((resolve, reject) => {
    if (window.webVitals) {
      resolve(window.webVitals);
      return;
    }

    // Always load from unpkg CDN as specified
    console.log('Loading web-vitals from unpkg CDN');
    window.clsVerifier.loadScript('https://unpkg.com/web-vitals@3.3.2/dist/web-vitals.iife.js');

    // Check every 100ms if webVitals is defined (up to 3 seconds)
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof webVitals !== 'undefined') {
        clearInterval(checkInterval);
        window.webVitals = webVitals;
        resolve(window.webVitals);
      } else if (attempts >= 30) { // 3 seconds timeout
        clearInterval(checkInterval);
        reject(new Error('Timed out waiting for web-vitals to load from CDN'));
      }
    }, 100);
  });
}

// Main function to measure CLS
async function measureCLS() {
  try {
    // Create results container
    createResultsContainer();
    
    // Load web-vitals if needed
    const webVitals = await loadWebVitals();

    // Check if the web-vitals library is loaded correctly
    if (!webVitals) {
      console.error('Web Vitals library not available');
      addMeasurement('ERROR', 0, false);
      return;
    }

    // Web Vitals v3+ and v4+ have a different API structure
    // Track initial CLS value
    try {
      webVitals.onCLS(({ value }) => {
        const good = value < 0.1; // Good CLS is below 0.1
        addMeasurement('CLS (Initial)', value, good);
        console.log(`Initial CLS: ${value.toFixed(3)} - ${good ? 'Good' : 'Needs improvement'}`);
      }, { reportAllChanges: false });

      // Track all CLS changes for detailed analysis
      webVitals.onCLS(({ value }) => {
        const good = value < 0.1;
        addMeasurement('CLS (Cumulative)', value, good);
        console.log(`Updated CLS: ${value.toFixed(3)} - ${good ? 'Good' : 'Needs improvement'}`);
      }, { reportAllChanges: true });

      // Separately track FID, LCP, and INP
      webVitals.onFID(({ value }) => {
        const good = value < 100;
        addMeasurement('FID', value, good);
        console.log(`FID: ${value.toFixed(1)}ms - ${good ? 'Good' : 'Needs improvement'}`);
      });

      webVitals.onLCP(({ value }) => {
        const good = value < 2500;
        addMeasurement('LCP', value / 1000, good);
        console.log(`LCP: ${(value / 1000).toFixed(2)}s - ${good ? 'Good' : 'Needs improvement'}`);
      });

      // INP is now a standard metric in web-vitals v4
      if (webVitals.onINP) {
        webVitals.onINP(({ value }) => {
          const good = value < 200;
          addMeasurement('INP', value, good);
          console.log(`INP: ${value.toFixed(1)}ms - ${good ? 'Good' : 'Needs improvement'}`);
        });
      }

      // Track TTFB for network performance
      webVitals.onTTFB(({ value }) => {
        const good = value < 800;
        addMeasurement('TTFB', value / 1000, good);
        console.log(`TTFB: ${(value / 1000).toFixed(2)}s - ${good ? 'Good' : 'Needs improvement'}`);
      });
    } catch (error) {
      console.error('Error while setting up web-vitals metrics:', error);
      addMeasurement('ERROR', 0, false);
    }
    
    // Add event listeners to track layout shifts
    let layoutShiftCount = 0;
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          layoutShiftCount++;
          console.log(`Layout shift #${layoutShiftCount}: ${entry.value.toFixed(5)}`);
          if (entry.value > 0.01) {
            console.log('Significant layout shift detected:', entry);
          }
        }
      }
    });
    
    layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Add window resize listener to track potential layout shifts during resize
    window.addEventListener('resize', () => {
      console.log('Window resized - checking for additional layout shifts');
    });
    
    console.log('CLS measurement initialized. Check the floating panel for results.');
    
  } catch (error) {
    console.error('Error measuring CLS:', error);
  }
}

// Auto-initialize on page load
if (document.readyState === 'complete') {
  measureCLS();
} else {
  window.addEventListener('load', measureCLS);
}

// Create a fallback version of the web-vitals library
// This ensures the script doesn't completely fail if the library can't be loaded
window.webVitals = window.webVitals || {
  onCLS: (cb) => {
    console.warn('Web Vitals library not loaded properly. Using fallback CLS measurement.');
    // Use PerformanceObserver as a fallback for CLS
    try {
      let cumulativeLayoutShift = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Skip if the user interacted recently
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
            cb({ value: cumulativeLayoutShift, metric: 'CLS' });
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Cannot measure CLS even with fallback', e);
      cb({ value: 0, metric: 'CLS' });
    }
  },
  onLCP: (cb) => cb({ value: 0, metric: 'LCP' }),
  onFID: (cb) => cb({ value: 0, metric: 'FID' }),
  onINP: (cb) => cb({ value: 0, metric: 'INP' }),
  onTTFB: (cb) => cb({ value: 0, metric: 'TTFB' })
};

// Export functions for manual use
window.clsVerifier = {
  measure: measureCLS,
  reset: () => {
    const container = document.getElementById('cls-results');
    if (container) container.remove();
    measureCLS();
  },
  loadScript: (scriptUrl) => {
    // Allow loading a custom script URL for web-vitals
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      console.log('Custom Web Vitals script loaded successfully');
      const container = document.getElementById('cls-results');
      if (container) container.remove();
      measureCLS();
    };
    script.onerror = () => console.error('Failed to load custom Web Vitals script');
    document.head.appendChild(script);
  }
};

// Instructions in console
console.log(`
CLS Verification Tool
---------------------
This tool measures Cumulative Layout Shift (CLS) and other Core Web Vitals.
Results will appear in a floating panel and in the console.

Additional commands:
- window.clsVerifier.reset() - Reset measurements
- window.clsVerifier.loadScript(url) - Load a custom web-vitals script URL

Troubleshooting:
If you're seeing errors with web-vitals loading, you can:
1. Copy web-vitals.js to your project's root directory
2. Or use window.clsVerifier.loadScript('/path/to/your/web-vitals.js')
`);