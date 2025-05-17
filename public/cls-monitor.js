/**
 * CLS Monitor
 * 
 * Background monitoring script for Cumulative Layout Shift.
 * This script runs in the background and logs CLS violations,
 * ideal for ongoing development and testing.
 */

(function() {
  // Skip if already loaded
  if (window.__clsMonitorActive) return;
  window.__clsMonitorActive = true;
  
  // Configuration
  const config = {
    // Report threshold - log shifts above this value
    thresholdValue: 0.01,
    // Debug mode - log all shifts
    debug: false,
    // Element highlighting
    highlightElements: true,
    // Duration to show highlights (ms)
    highlightDuration: 3000,
    // Log to console
    logToConsole: true,
    // Store history
    storeHistory: true,
    // Maximum history entries
    maxHistoryEntries: 100
  };
  
  // Storage for shift history
  const shiftHistory = [];
  let cumulativeScore = 0;
  let sessionStartTime = performance.now();
  
  // Create console logger with styled output
  const logger = {
    log: function(message, ...args) {
      if (config.logToConsole) {
        console.log(`%c[CLS Monitor] ${message}`, 'color: #6741d9;', ...args);
      }
    },
    warn: function(message, ...args) {
      if (config.logToConsole) {
        console.warn(`%c[CLS Monitor] ${message}`, 'color: #ff9800; font-weight: bold;', ...args);
      }
    },
    error: function(message, ...args) {
      if (config.logToConsole) {
        console.error(`%c[CLS Monitor] ${message}`, 'color: #f44336; font-weight: bold;', ...args);
      }
    },
    info: function(message, ...args) {
      if (config.logToConsole && config.debug) {
        console.info(`%c[CLS Monitor] ${message}`, 'color: #2196f3;', ...args);
      }
    }
  };
  
  /**
   * Create a visual highlight around an element that shifted
   */
  function highlightShiftedElement(node, value) {
    if (!node || !config.highlightElements) return;
    
    // Skip if shift is too small and not in debug mode
    if (value < config.thresholdValue && !config.debug) return;
    
    try {
      // Create highlight element
      const highlight = document.createElement('div');
      const colorIntensity = Math.min(1, value * 10); // Scale color intensity based on shift value
      const colorR = Math.floor(255 * colorIntensity);
      const colorG = Math.floor(20 * (1 - colorIntensity));
      const colorB = Math.floor(20 * (1 - colorIntensity));
      
      highlight.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        border: 2px solid rgba(${colorR}, ${colorG}, ${colorB}, 0.8);
        background-color: rgba(${colorR}, ${colorG}, ${colorB}, 0.2);
        box-shadow: 0 0 8px rgba(${colorR}, ${colorG}, ${colorB}, 0.5);
        transition: opacity 0.5s ease;
        opacity: 0.8;
      `;
      
      // Position the highlight using fixed positioning
      const rect = node.getBoundingClientRect();
      highlight.style.top = rect.top + 'px';
      highlight.style.left = rect.left + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
      
      // Add label with shift value
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -22px;
        left: 0;
        background-color: rgba(${colorR}, ${colorG}, ${colorB}, 0.9);
        color: white;
        font-size: 11px;
        font-family: monospace;
        padding: 2px 4px;
        border-radius: 2px;
        white-space: nowrap;
      `;
      label.textContent = `CLS: ${value.toFixed(4)}`;
      highlight.appendChild(label);
      
      // Add to document
      document.body.appendChild(highlight);
      
      // Remove after specified duration
      setTimeout(() => {
        highlight.style.opacity = '0';
        setTimeout(() => {
          if (highlight.parentNode) {
            highlight.parentNode.removeChild(highlight);
          }
        }, 500);
      }, config.highlightDuration);
    } catch (error) {
      // Silent failure for highlighting
    }
  }
  
  /**
   * Get a description of an element for logging
   */
  function getElementDescription(element) {
    if (!element) return 'Unknown Element';
    
    try {
      const tagName = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : '';
      const className = element.className && typeof element.className === 'string' 
        ? `.${element.className.replace(/\s+/g, '.')}` 
        : '';
      
      return `${tagName}${id}${className}`;
    } catch (error) {
      return `${element.tagName || 'Unknown Element'}`;
    }
  }
  
  /**
   * Store shift information in history
   */
  function storeShift(entry) {
    if (!config.storeHistory) return;
    
    try {
      // Create a record of this shift
      const shiftRecord = {
        timestamp: performance.now(),
        relativeTime: (performance.now() - sessionStartTime) / 1000,
        value: entry.value,
        sources: entry.sources ? entry.sources.map(source => ({
          node: source.node,
          description: getElementDescription(source.node),
          previousRect: source.previousRect,
          currentRect: source.currentRect
        })) : [],
        url: window.location.href,
        pageHeight: document.body.scrollHeight,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY
      };
      
      // Add to history, keeping under the maximum length
      shiftHistory.unshift(shiftRecord);
      if (shiftHistory.length > config.maxHistoryEntries) {
        shiftHistory.pop();
      }
    } catch (error) {
      logger.error('Error storing shift history:', error);
    }
  }
  
  /**
   * Analyze a layout shift and log problematic elements
   */
  function analyzeLayoutShift(entry) {
    if (!entry.sources || entry.sources.length === 0) {
      logger.info('Layout shift without identified sources:', entry.value);
      return;
    }
    
    // Loop through all sources of the shift
    entry.sources.forEach(source => {
      if (!source.node) return;
      
      // Highlight the shifted element
      highlightShiftedElement(source.node, entry.value);
      
      // Skip further analysis if below threshold and not in debug mode
      if (entry.value < config.thresholdValue && !config.debug) return;
      
      // Get element description
      const elementDesc = getElementDescription(source.node);
      
      // Log the shift
      const logMethod = entry.value >= config.thresholdValue ? 'warn' : 'info';
      logger[logMethod](`Layout shift: ${entry.value.toFixed(4)} - ${elementDesc}`);
      
      // Additional diagnostics for significant shifts
      if (entry.value >= config.thresholdValue) {
        // Check for common issues
        const style = window.getComputedStyle(source.node);
        
        // Fixed positioning issues
        if (style.position === 'fixed') {
          logger.warn(`Fixed element causing shift: ${elementDesc}`, {
            position: style.position,
            top: style.top,
            bottom: style.bottom,
            left: style.left,
            right: style.right,
            zIndex: style.zIndex,
            transform: style.transform
          });
          
          // Check for common fixed positioning issues
          if (style.bottom !== 'auto' && source.node.tagName.toLowerCase() === 'header') {
            logger.error(`Header with non-auto bottom value detected: ${elementDesc}. This is a common cause of CLS.`);
          }
        }
        
        // Image without dimensions
        if (source.node.tagName.toLowerCase() === 'img') {
          const img = source.node as HTMLImageElement;
          if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            logger.error(`Image without explicit dimensions: ${elementDesc}`);
          }
        }
        
        // Dynamic content containers
        if (elementDesc.includes('hero') || elementDesc.includes('container') || 
            elementDesc.includes('carousel') || elementDesc.includes('slider')) {
          logger.warn(`Dynamic content container shift: ${elementDesc}`, {
            height: style.height,
            minHeight: style.minHeight,
            maxHeight: style.maxHeight,
            width: style.width,
            overflow: style.overflow,
            contain: style.contain
          });
        }
      }
    });
  }
  
  /**
   * Initialize the layout shift observer
   */
  function initLayoutShiftObserver() {
    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) {
      logger.error('PerformanceObserver not supported in this browser');
      return;
    }
    
    // Create and start the observer
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          // Skip shifts that had recent user input (not counted in CLS)
          if (entry.hadRecentInput) return;
          
          // Update cumulative score
          cumulativeScore += entry.value;
          
          // Store shift in history
          storeShift(entry);
          
          // Analyze the shift
          analyzeLayoutShift(entry);
        });
      });
      
      // Start observing layout-shift entries
      layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Store observer reference for cleanup
      window.__clsObserver = layoutShiftObserver;
      
      logger.log('CLS Monitor initialized successfully');
      logger.log(`Current thresholds: warning=${config.thresholdValue}, debug=${config.debug}`);
    } catch (error) {
      logger.error('Error initializing CLS Monitor:', error);
    }
  }
  
  /**
   * Initialize visual feedback component
   */
  function initializeStatusIndicator() {
    // Create an unobtrusive indicator for the corner of the screen
    try {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(103, 65, 217, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: system-ui, sans-serif;
        font-size: 11px;
        z-index: 10000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      indicator.textContent = 'CLS: 0.000';
      
      // Add a unique ID
      indicator.id = 'cls-monitor-indicator';
      
      // Add to document
      document.body.appendChild(indicator);
      
      // Update indicator periodically
      setInterval(() => {
        const indicator = document.getElementById('cls-monitor-indicator');
        if (indicator) {
          indicator.textContent = `CLS: ${cumulativeScore.toFixed(3)}`;
          
          // Change color based on value
          if (cumulativeScore > 0.25) {
            indicator.style.background = 'rgba(244, 67, 54, 0.8)'; // Red
          } else if (cumulativeScore > 0.1) {
            indicator.style.background = 'rgba(255, 152, 0, 0.8)'; // Orange
          } else {
            indicator.style.background = 'rgba(103, 65, 217, 0.8)'; // Purple
          }
        }
      }, 1000);
    } catch (error) {
      // Silent failure for indicator
    }
  }
  
  /**
   * Print a summary report to console
   */
  function printCLSSummary() {
    logger.log('=== CLS Monitor Summary ===');
    logger.log(`CLS Score: ${cumulativeScore.toFixed(4)}`);
    
    // Rating based on thresholds
    let rating = 'Good';
    let color = 'green';
    
    if (cumulativeScore > 0.25) {
      rating = 'Poor';
      color = 'red';
    } else if (cumulativeScore > 0.1) {
      rating = 'Needs Improvement';
      color = 'orange';
    }
    
    logger.log(`Rating: %c${rating}`, `color: ${color}; font-weight: bold;`);
    
    // If we have history, show notable shifts
    if (shiftHistory.length > 0) {
      // Sort by value (highest first)
      const sortedShifts = [...shiftHistory].sort((a, b) => b.value - a.value);
      
      // Show top 3 worst offenders
      logger.log('Top 3 largest shifts:');
      for (let i = 0; i < Math.min(3, sortedShifts.length); i++) {
        const shift = sortedShifts[i];
        logger.log(`${i+1}. Value: ${shift.value.toFixed(4)}, Time: ${shift.relativeTime.toFixed(1)}s`);
        
        // List sources (elements) if available
        if (shift.sources && shift.sources.length > 0) {
          shift.sources.forEach(source => {
            logger.log(`   - Element: ${source.description}`);
          });
        }
      }
    } else {
      logger.log('No layout shifts recorded yet!');
    }
    
    // Final message
    logger.log('=========================');
  }
  
  // Public API
  window.__clsMonitor = {
    getScore: () => cumulativeScore,
    getHistory: () => [...shiftHistory],
    clearHistory: () => {
      shiftHistory.length = 0;
      cumulativeScore = 0;
      sessionStartTime = performance.now();
      logger.log('CLS history and score reset');
    },
    setConfig: (newConfig) => {
      Object.assign(config, newConfig);
      logger.log('Configuration updated:', config);
    },
    printSummary: printCLSSummary
  };
  
  // Initialize when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLayoutShiftObserver();
      if (config.debug) {
        initializeStatusIndicator();
      }
    });
  } else {
    initLayoutShiftObserver();
    if (config.debug) {
      initializeStatusIndicator();
    }
  }
  
  // Print summary on page unload
  window.addEventListener('beforeunload', printCLSSummary);
  
  // Initial log
  logger.log('CLS Monitor loaded and waiting for document ready');
})();