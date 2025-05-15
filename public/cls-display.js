/**
 * CLS Display - A lightweight, non-intrusive CLS monitoring tool
 * 
 * This script adds a small display in the corner of the page that shows
 * real-time CLS metrics without interfering with the page itself.
 * 
 * Use ?debug=cls-display to enable automatically
 */

(function() {
  // Skip if PerformanceObserver not supported
  if (typeof PerformanceObserver !== 'function') {
    console.warn('CLS Display: PerformanceObserver not supported');
    return;
  }

  // Configuration
  const CONFIG = {
    // Display position - 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    position: 'bottom-right',
    
    // Display size in px
    size: 100,
    
    // Opacity when idle (0-1)
    idleOpacity: 0.2,
    
    // Opacity when active (0-1)
    activeOpacity: 0.9,
    
    // Time (ms) to show active opacity after a shift
    activeDuration: 3000,
    
    // CLS thresholds (from Google Web Vitals)
    goodThreshold: 0.1,
    needsImprovementThreshold: 0.25
  };
  
  // State
  let cumulativeLayoutShift = 0;
  let lastShiftTime = 0;
  let displayElement = null;
  let displayActive = false;
  let activeTimeout = null;
  
  /**
   * Creates the display element
   */
  function createDisplay() {
    // Create container
    displayElement = document.createElement('div');
    
    // Set positioning based on CONFIG.position
    const positionStyles = {
      'top-right': 'top: 10px; right: 10px;',
      'top-left': 'top: 10px; left: 10px;',
      'bottom-right': 'bottom: 10px; right: 10px;',
      'bottom-left': 'bottom: 10px; left: 10px;'
    };
    
    // Apply styles
    displayElement.style.cssText = `
      position: fixed;
      ${positionStyles[CONFIG.position] || positionStyles['bottom-right']}
      width: ${CONFIG.size}px;
      height: ${CONFIG.size}px;
      background: rgba(0, 0, 0, ${CONFIG.idleOpacity});
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: ${CONFIG.size / 5}px;
      z-index: 99999;
      opacity: ${CONFIG.idleOpacity};
      transition: opacity 0.3s ease, background-color 0.3s ease;
      pointer-events: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
      overflow: hidden;
      line-height: 1.2;
    `;
    
    // Set display content
    displayElement.innerHTML = `
      <div style="font-weight: bold;">CLS</div>
      <div style="font-size: ${CONFIG.size / 6}px;">0.00000</div>
    `;
    
    // Add to document
    document.body.appendChild(displayElement);
    
    // Add hover effect
    displayElement.addEventListener('mouseenter', () => {
      displayElement.style.opacity = CONFIG.activeOpacity;
      displayActive = true;
    });
    
    displayElement.addEventListener('mouseleave', () => {
      if (Date.now() - lastShiftTime > CONFIG.activeDuration) {
        displayElement.style.opacity = CONFIG.idleOpacity;
        displayActive = false;
      }
    });
  }
  
  /**
   * Updates the display with the current CLS value
   */
  function updateDisplay() {
    if (!displayElement) return;
    
    // Update the CLS value
    const valueDisplay = displayElement.querySelector('div:nth-child(2)');
    if (valueDisplay) {
      valueDisplay.textContent = cumulativeLayoutShift.toFixed(5);
    }
    
    // Update the color based on the CLS value
    let backgroundColor;
    if (cumulativeLayoutShift < CONFIG.goodThreshold) {
      backgroundColor = 'rgba(46, 204, 113, 0.8)'; // Green
    } else if (cumulativeLayoutShift < CONFIG.needsImprovementThreshold) {
      backgroundColor = 'rgba(243, 156, 18, 0.8)'; // Orange
    } else {
      backgroundColor = 'rgba(231, 76, 60, 0.8)'; // Red
    }
    
    displayElement.style.background = backgroundColor;
    
    // Show active state after a shift
    displayElement.style.opacity = CONFIG.activeOpacity;
    displayActive = true;
    
    // Clear any existing timeout
    if (activeTimeout) {
      clearTimeout(activeTimeout);
    }
    
    // Set timeout to return to idle state
    activeTimeout = setTimeout(() => {
      if (displayActive && !displayElement.matches(':hover')) {
        displayElement.style.opacity = CONFIG.idleOpacity;
        displayActive = false;
      }
    }, CONFIG.activeDuration);
  }
  
  /**
   * Initializes the CLS monitoring
   */
  function initMonitoring() {
    // Create the display
    createDisplay();
    
    try {
      // Create a PerformanceObserver instance
      const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          // Skip if the shift happened after user input
          if (entry.hadRecentInput) continue;
          
          // Update the cumulative layout shift
          cumulativeLayoutShift += entry.value;
          
          // Record the time of the last shift
          lastShiftTime = Date.now();
          
          // Update the display
          updateDisplay();
        }
      });
      
      // Start observing layout-shift entries
      observer.observe({ type: 'layout-shift', buffered: true });
      
      // Return a cleanup function
      return () => {
        observer.disconnect();
        if (displayElement && displayElement.parentNode) {
          displayElement.parentNode.removeChild(displayElement);
        }
      };
    } catch (error) {
      console.error('CLS Display: Error initializing monitoring', error);
      return () => {};
    }
  }
  
  // Initialize on load if auto-enabled via query parameter
  if (window.location.search.includes('debug=cls-display')) {
    if (document.readyState === 'complete') {
      initMonitoring();
    } else {
      window.addEventListener('load', initMonitoring);
    }
  }
  
  // Expose API
  window.CLSDisplay = {
    start: initMonitoring,
    getCurrentCLS: () => cumulativeLayoutShift
  };
})();