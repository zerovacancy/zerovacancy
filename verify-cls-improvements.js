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
    font-family: monospace;
    z-index: 9999;
    max-width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
  `;
  
  // Add header
  const header = document.createElement('h3');
  header.textContent = 'CLS Measurements';
  header.style.cssText = `
    margin: 0 0 10px 0;
    font-size: 14px;
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
    list-style-type: square;
  `;
  container.appendChild(resultsList);
  
  // Add timestamp
  const timestamp = document.createElement('div');
  timestamp.id = 'cls-timestamp';
  timestamp.style.cssText = `
    font-size: 10px;
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
    cursor: pointer;
    opacity: 0.7;
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
    color: ${good ? 'lightgreen' : 'coral'};
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
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/web-vitals/dist/web-vitals.iife.js';
    script.onload = () => {
      window.webVitals = webVitals;
      resolve(window.webVitals);
    };
    script.onerror = () => reject(new Error('Failed to load web-vitals'));
    document.head.appendChild(script);
  });
}

// Main function to measure CLS
async function measureCLS() {
  try {
    // Create results container
    createResultsContainer();
    
    // Load web-vitals if needed
    const webVitals = await loadWebVitals();
    
    // Track initial CLS value
    webVitals.getCLS(({ value }) => {
      const good = value < 0.1; // Good CLS is below 0.1
      addMeasurement('CLS (Initial)', value, good);
      console.log(`Initial CLS: ${value.toFixed(3)} - ${good ? 'Good' : 'Needs improvement'}`);
    }, { reportAllChanges: false });
    
    // Track all CLS changes for detailed analysis
    webVitals.getCLS(({ value }) => {
      const good = value < 0.1;
      addMeasurement('CLS (Cumulative)', value, good);
      console.log(`Updated CLS: ${value.toFixed(3)} - ${good ? 'Good' : 'Needs improvement'}`);
    }, { reportAllChanges: true });
    
    // Separately track FID, LCP, and INP
    webVitals.getFID(({ value }) => {
      const good = value < 100;
      addMeasurement('FID', value, good);
      console.log(`FID: ${value.toFixed(1)}ms - ${good ? 'Good' : 'Needs improvement'}`);
    });
    
    webVitals.getLCP(({ value }) => {
      const good = value < 2500;
      addMeasurement('LCP', value / 1000, good);
      console.log(`LCP: ${(value / 1000).toFixed(2)}s - ${good ? 'Good' : 'Needs improvement'}`);
    });
    
    // INP is still experimental but useful to track
    if (webVitals.getINP) {
      webVitals.getINP(({ value }) => {
        const good = value < 200;
        addMeasurement('INP', value, good);
        console.log(`INP: ${value.toFixed(1)}ms - ${good ? 'Good' : 'Needs improvement'}`);
      });
    }
    
    // Track TTFB for network performance
    webVitals.getTTFB(({ value }) => {
      const good = value < 800;
      addMeasurement('TTFB', value / 1000, good);
      console.log(`TTFB: ${(value / 1000).toFixed(2)}s - ${good ? 'Good' : 'Needs improvement'}`);
    });
    
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

// Export functions for manual use
window.clsVerifier = {
  measure: measureCLS,
  reset: () => {
    const container = document.getElementById('cls-results');
    if (container) container.remove();
    measureCLS();
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
`);