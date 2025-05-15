/**
 * Quick CLS Check Script
 * 
 * Drop this into the browser console to get instant CLS measurements and diagnostics.
 * This tool will identify elements causing layout shifts in real-time.
 */

(function() {
  console.log('%c🔍 Quick CLS Check', 'font-size: 16px; font-weight: bold; color: #6741d9;');
  console.log('Monitoring layout shifts for 5 seconds...');

  // Create observer for layout shifts
  let cumulativeScore = 0;
  let shiftEntries = [];
  let startTime = performance.now();
  let endTime = startTime + 5000; // 5 second observation window
  
  // Load web-vitals if needed
  function loadWebVitals() {
    return new Promise((resolve) => {
      if (window.webVitals) {
        resolve(window.webVitals);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
      script.onload = () => {
        window.webVitals = webVitals;
        resolve(window.webVitals);
      };
      document.head.appendChild(script);
    });
  }

  // Create visual indicator for shifted elements
  function highlightShiftedElement(entry) {
    if (!entry.sources || entry.sources.length === 0) return;
    
    entry.sources.forEach(source => {
      const node = source.node;
      if (!node) return;
      
      // Skip very small shifts
      if (entry.value < 0.01) return;
      
      // Create highlight element
      const highlight = document.createElement('div');
      highlight.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 10000;
        border: 2px solid red;
        background-color: rgba(255, 0, 0, 0.2);
        box-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
        transition: opacity 0.5s ease;
        opacity: 0.8;
      `;
      
      // Position the highlight
      const rect = node.getBoundingClientRect();
      highlight.style.top = rect.top + window.scrollY + 'px';
      highlight.style.left = rect.left + window.scrollX + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
      
      // Add label with element info and shift value
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -22px;
        left: 0;
        background-color: red;
        color: white;
        font-size: 12px;
        font-family: monospace;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
      `;
      label.textContent = `CLS: ${entry.value.toFixed(4)} - ${node.tagName.toLowerCase()}${node.id ? '#'+node.id : ''}${node.className ? '.'+node.className.replace(/\s+/g, '.') : ''}`;
      highlight.appendChild(label);
      
      // Add to document
      document.body.appendChild(highlight);
      
      // Remove after 3 seconds
      setTimeout(() => {
        highlight.style.opacity = '0';
        setTimeout(() => {
          if (highlight.parentNode) {
            highlight.parentNode.removeChild(highlight);
          }
        }, 500);
      }, 3000);
    });
  }

  // Main function to check CLS
  async function checkCLS() {
    // Load web-vitals library
    const webVitals = await loadWebVitals();
    
    // Create PerformanceObserver for layout-shift
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Skip if had recent input (not counted in CLS)
        if (entry.hadRecentInput) continue;
        
        // Add to cumulative score
        cumulativeScore += entry.value;
        
        // Record entry for analysis
        shiftEntries.push({
          timestamp: performance.now(),
          value: entry.value,
          sources: entry.sources,
          elements: entry.sources ? entry.sources.map(source => source.node) : []
        });
        
        // Highlight the shifted element
        highlightShiftedElement(entry);
        
        // Log immediate feedback
        console.log(`Layout shift detected: ${entry.value.toFixed(4)}, cumulative: ${cumulativeScore.toFixed(4)}`);
      }
    });
    
    // Observe layout-shift entries
    layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Use web-vitals for more detailed tracking
    webVitals.onCLS(({ value }) => {
      console.log(`CLS value from web-vitals: ${value.toFixed(4)}`);
    }, { reportAllChanges: true });
    
    // Wait for 5 seconds then report findings
    setTimeout(() => {
      layoutShiftObserver.disconnect();
      
      console.log('%c🔍 CLS Check Results', 'font-size: 16px; font-weight: bold; color: #6741d9;');
      
      // Format result
      let resultColor = 'green';
      let resultText = 'Good';
      
      if (cumulativeScore > 0.25) {
        resultColor = 'red';
        resultText = 'Poor';
      } else if (cumulativeScore > 0.1) {
        resultColor = 'orange';
        resultText = 'Needs Improvement';
      }
      
      console.log(`%cCumulative Layout Shift: %c${cumulativeScore.toFixed(4)} %c(${resultText})`, 
        'font-weight: bold;', 
        'font-weight: normal;', 
        `color: ${resultColor}; font-weight: bold;`
      );
      
      // Analyze results
      if (shiftEntries.length === 0) {
        console.log('%c✅ No layout shifts detected! Great job!', 'color: green; font-weight: bold;');
      } else {
        console.log(`Found ${shiftEntries.length} layout shifts. Analyzing most significant shifts...`);
        
        // Sort by value (highest first)
        const sortedEntries = [...shiftEntries].sort((a, b) => b.value - a.value);
        
        // Show top 3 worst offenders
        const worstOffenders = sortedEntries.slice(0, 3);
        worstOffenders.forEach((entry, index) => {
          console.log(`%c#${index + 1} Layout Shift: ${entry.value.toFixed(4)}`, 'font-weight: bold;');
          
          if (entry.sources && entry.sources.length > 0) {
            entry.sources.forEach(source => {
              if (source.node) {
                const element = source.node;
                const tagName = element.tagName.toLowerCase();
                const id = element.id ? `#${element.id}` : '';
                const className = element.className && typeof element.className === 'string' 
                  ? `.${element.className.replace(/\s+/g, '.')}` 
                  : '';
                
                console.log(`  Element: %c${tagName}${id}${className}`, 'color: blue;');
                console.log('  Element:', element);
                
                // Get computed style for more info
                const style = window.getComputedStyle(element);
                console.log(`  Position: ${style.position}, Display: ${style.display}, Width: ${style.width}, Height: ${style.height}`);
                
                if (style.position === 'fixed') {
                  console.warn('  ⚠️ This is a fixed element, check for proper bottom/top values and hardware acceleration');
                }
                
                // Check if it's an image without dimensions
                if (tagName === 'img') {
                  if (!element.hasAttribute('width') || !element.hasAttribute('height')) {
                    console.warn('  ⚠️ Image is missing width/height attributes, likely causing CLS');
                  }
                }
                
                // Check containers that might need stable height
                if (element.classList.contains('hero') || element.id === 'hero' || 
                    className.includes('container') || className.includes('wrapper')) {
                  console.warn('  ⚠️ This is a container element that might need explicit dimensions or containment');
                }
              }
            });
          }
        });
        
        // Recommendations
        console.log('%cRecommendations:', 'font-weight: bold;');
        if (cumulativeScore > 0.1) {
          console.log('%c1. Use explicit dimensions for images (width/height attributes)', 'color: #333;');
          console.log('%c2. Pre-allocate space for dynamic content', 'color: #333;');
          console.log('%c3. Ensure fixed headers use top: 0 and bottom: auto', 'color: #333;');
          console.log('%c4. Apply hardware acceleration (transform: translateZ(0)) to fixed/sticky elements', 'color: #333;');
          console.log('%c5. Verify hero sections have stable heights on mobile', 'color: #333;');
        } else {
          console.log('%c✅ CLS is within acceptable range, but consider addressing highlighted elements for further improvement', 'color: green;');
        }
      }
      
      console.log('%cRun this script again after scrolling or interacting with the page to check for additional shifts', 'font-style: italic;');
    }, 5000);
  }
  
  // Create a simple visual indicator
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #6741d9;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `;
  indicator.innerHTML = `
    <div>CLS Check: <span id="cls-check-status">Running...</span></div>
    <div><small id="cls-check-timer">5</small></div>
  `;
  document.body.appendChild(indicator);
  
  // Update the timer
  const timerEl = document.getElementById('cls-check-timer');
  const statusEl = document.getElementById('cls-check-status');
  let secondsLeft = 5;
  
  const timerInterval = setInterval(() => {
    secondsLeft--;
    if (timerEl) timerEl.textContent = secondsLeft;
    
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      if (statusEl) statusEl.textContent = 'Complete';
      
      // Remove the indicator after 2 seconds
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.style.opacity = '0';
          indicator.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            if (indicator.parentNode) {
              indicator.parentNode.removeChild(indicator);
            }
          }, 500);
        }
      }, 2000);
    }
  }, 1000);
  
  // Start the CLS check
  checkCLS();
})();
</script>