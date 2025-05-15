/**
 * CLS Verification Script
 * 
 * This script verifies that the CLS fixes have been properly applied to the page.
 * It checks for:
 * 1. Proper viewport height variables
 * 2. Fixed hero section dimensions
 * 3. Fixed rotating text container dimensions
 * 4. Proper hardware acceleration on key elements
 * 5. Layout shift detection using PerformanceObserver
 * 
 * To use: Add ?debug=cls to the URL to enable debugging output
 */

(function() {
  // Configuration
  const CONFIG = {
    DEBUG: window.location.search.includes('debug=cls'),
    ELEMENT_SELECTORS: {
      HERO: '#hero, .hero, [data-hero-section="true"]',
      ROTATING_TEXT: '.rotating-text-container, [data-rotating-text="true"]',
      TITLE: '#hero-title, h1#hero-title, [data-hero-title="true"]',
      FIXED_ELEMENTS: '[style*="position:fixed"], [style*="position: fixed"], .fixed, [data-cls-fixed="true"]',
      MOBILE_CTA: '#mobile-hero-cta-section, .mobile-cta-button'
    },
    CSS_VARIABLES: [
      '--vh',
      '--window-height',
      '--hero-mobile-height',
      '--rotating-text-height-mobile',
      '--header-height'
    ],
    CRITICAL_STYLES: {
      HERO: {
        height: ['auto', 'var(--hero-mobile-height)', 'calc(var(--vh, 1vh) * 100)'],
        minHeight: ['auto', 'var(--hero-min-mobile-height)', 'calc(var(--vh, 1vh) * 100)']
      },
      ROTATING_TEXT: {
        height: ['var(--rotating-text-height-mobile)', 'var(--rotating-text-height-desktop)'],
        minHeight: ['var(--rotating-text-height-mobile)', 'var(--rotating-text-height-desktop)']
      },
      FIXED_ELEMENTS: {
        bottom: 'auto',
        top: '0'
      }
    }
  };

  // Only run in specific debug mode or during tests
  if (!CONFIG.DEBUG && !window.location.search.includes('test=cls')) {
    return;
  }

  // Create debug console
  let debugConsole;
  
  function initDebugConsole() {
    debugConsole = document.createElement('div');
    debugConsole.id = 'cls-debug-console';
    Object.assign(debugConsole.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      width: '300px',
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '10px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: '9999',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
    });
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: 'transparent',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    });
    closeButton.addEventListener('click', () => debugConsole.remove());
    
    // Add title
    const title = document.createElement('h3');
    title.innerText = 'CLS Debug Console';
    title.style.margin = '0 0 10px 0';
    
    // Add to console
    debugConsole.appendChild(closeButton);
    debugConsole.appendChild(title);
    
    // Add to body when it's available
    if (document.body) {
      document.body.appendChild(debugConsole);
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(debugConsole);
      });
    }
  }
  
  function log(message, type = 'info') {
    if (!CONFIG.DEBUG) return;
    
    if (!debugConsole) {
      initDebugConsole();
    }
    
    const logEntry = document.createElement('div');
    logEntry.style.marginBottom = '5px';
    logEntry.style.borderLeft = '3px solid ' + (type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'green');
    logEntry.style.paddingLeft = '5px';
    logEntry.innerText = message;
    
    debugConsole.appendChild(logEntry);
    console[type]('[CLS Verification]', message);
    
    // Scroll to bottom
    debugConsole.scrollTop = debugConsole.scrollHeight;
  }
  
  // Verify CSS variables are properly set
  function verifyCSS() {
    const rootStyles = getComputedStyle(document.documentElement);
    
    log('Verifying CSS variables for CLS prevention');
    
    // Check CSS variables
    let missingVars = [];
    CONFIG.CSS_VARIABLES.forEach(variable => {
      const value = rootStyles.getPropertyValue(variable);
      if (!value) {
        missingVars.push(variable);
        log(`Missing CSS variable: ${variable}`, 'warning');
      } else {
        log(`CSS variable ${variable} = ${value}`);
      }
    });
    
    if (missingVars.length > 0) {
      log(`Missing ${missingVars.length} CSS variables for proper CLS prevention`, 'error');
    } else {
      log('All required CSS variables are properly set', 'info');
    }
    
    // Check for viewport height fix
    const vh = rootStyles.getPropertyValue('--vh');
    if (vh) {
      log(`Viewport height fix is active: --vh = ${vh}`);
    } else {
      log('Viewport height fix is not active', 'warning');
    }
  }
  
  // Verify elements have proper CLS-safe styles
  function verifyElements() {
    log('Verifying elements for CLS-safe styling');
    
    // Check Hero section
    const heroElements = document.querySelectorAll(CONFIG.ELEMENT_SELECTORS.HERO);
    if (heroElements.length === 0) {
      log('No hero section found', 'warning');
    } else {
      heroElements.forEach((hero, i) => {
        log(`Checking hero element #${i + 1}`);
        const styles = window.getComputedStyle(hero);
        
        // Check explicit dimensions
        const height = styles.height;
        const minHeight = styles.minHeight;
        
        // Check for safe values
        const hasValidHeight = CONFIG.CRITICAL_STYLES.HERO.height.some(
          val => height.includes(val)
        );
        
        const hasValidMinHeight = CONFIG.CRITICAL_STYLES.HERO.minHeight.some(
          val => minHeight.includes(val)
        );
        
        if (hasValidHeight) {
          log(`Hero has valid height: ${height}`);
        } else {
          log(`Hero has potentially unsafe height: ${height}`, 'warning');
        }
        
        if (hasValidMinHeight) {
          log(`Hero has valid min-height: ${minHeight}`);
        } else {
          log(`Hero has potentially unsafe min-height: ${minHeight}`, 'warning');
        }
        
        // Check hardware acceleration
        const transform = styles.transform;
        if (transform.includes('translateZ') || transform.includes('translate3d')) {
          log('Hero has hardware acceleration');
        } else {
          log('Hero is missing hardware acceleration', 'warning');
        }
      });
    }
    
    // Check rotating text container
    const rotatingTextElements = document.querySelectorAll(CONFIG.ELEMENT_SELECTORS.ROTATING_TEXT);
    if (rotatingTextElements.length === 0) {
      log('No rotating text container found', 'warning');
    } else {
      rotatingTextElements.forEach((textContainer, i) => {
        log(`Checking rotating text container #${i + 1}`);
        const styles = window.getComputedStyle(textContainer);
        
        // Check explicit dimensions
        const height = styles.height;
        const minHeight = styles.minHeight;
        
        // Check for safe values
        const hasValidHeight = CONFIG.CRITICAL_STYLES.ROTATING_TEXT.height.some(
          val => height.includes(val)
        );
        
        const hasValidMinHeight = CONFIG.CRITICAL_STYLES.ROTATING_TEXT.minHeight.some(
          val => minHeight.includes(val)
        );
        
        if (hasValidHeight) {
          log(`Rotating text has valid height: ${height}`);
        } else {
          log(`Rotating text has potentially unsafe height: ${height}`, 'warning');
        }
        
        if (hasValidMinHeight) {
          log(`Rotating text has valid min-height: ${minHeight}`);
        } else {
          log(`Rotating text has potentially unsafe min-height: ${minHeight}`, 'warning');
        }
      });
    }
    
    // Check fixed elements
    const fixedElements = document.querySelectorAll(CONFIG.ELEMENT_SELECTORS.FIXED_ELEMENTS);
    let problematicFixedElements = 0;
    
    if (fixedElements.length === 0) {
      log('No fixed elements found');
    } else {
      log(`Found ${fixedElements.length} fixed elements`);
      
      fixedElements.forEach((element, i) => {
        const styles = window.getComputedStyle(element);
        
        // Check if it's a problem element with bottom value
        if (styles.bottom !== 'auto' && styles.bottom !== '0px' && 
            element.tagName.toLowerCase() !== 'nav' && 
            !element.classList.contains('bottom-nav')) {
          problematicFixedElements++;
          log(`Problematic fixed element #${i + 1}: ${element.tagName}.${element.className} has bottom: ${styles.bottom}`, 'warning');
        }
      });
      
      if (problematicFixedElements === 0) {
        log('No problematic fixed elements found');
      } else {
        log(`Found ${problematicFixedElements} potentially problematic fixed elements`, 'warning');
      }
    }
  }
  
  // Track CLS using PerformanceObserver
  function trackCLS() {
    if (!('PerformanceObserver' in window)) {
      log('PerformanceObserver is not available in this browser', 'warning');
      return;
    }
    
    try {
      // Variable to store the current CLS value
      let clsValue = 0;
      let clsEntries = [];
      
      // Create the observer
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          // Only count entries without recent user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push({
              value: entry.value,
              time: new Date().toISOString(),
              sources: entry.sources || []
            });
            
            // Log the shift in the console
            log(`CLS shift detected: ${entry.value.toFixed(4)} (cumulative: ${clsValue.toFixed(4)})`, 
                entry.value > 0.1 ? 'error' : entry.value > 0.05 ? 'warning' : 'info');
            
            // If we have sources, log them
            if (entry.sources && entry.sources.length > 0) {
              entry.sources.forEach(source => {
                if (source.node) {
                  let nodeName = source.node.nodeName.toLowerCase();
                  let classes = source.node.className;
                  let id = source.node.id;
                  
                  log(`Shift source: <${nodeName}${id ? ' id="' + id + '"' : ''}${classes ? ' class="' + classes + '"' : ''}>`, 'warning');
                  
                  // Apply temporary highlighting to the element
                  const originalOutline = source.node.style.outline;
                  const originalBackground = source.node.style.backgroundColor;
                  
                  source.node.style.outline = '2px solid red';
                  source.node.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                  
                  setTimeout(() => {
                    source.node.style.outline = originalOutline;
                    source.node.style.backgroundColor = originalBackground;
                  }, 5000);
                }
              });
            }
          }
        });
      });
      
      // Start observing
      observer.observe({ type: 'layout-shift', buffered: true });
      
      log('CLS tracking enabled. Look for red-highlighted elements causing layout shifts.');
      
      // Create a global variable for debugging
      window.__clsVerification = {
        clsValue: () => clsValue,
        clsEntries: () => clsEntries,
        problematicElements: () => {
          const elements = [];
          document.querySelectorAll(CONFIG.ELEMENT_SELECTORS.FIXED_ELEMENTS).forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.bottom !== 'auto' && styles.bottom !== '0px' && 
                el.tagName.toLowerCase() !== 'nav' && 
                !el.classList.contains('bottom-nav')) {
              elements.push({
                element: el,
                bottom: styles.bottom,
                position: styles.position
              });
            }
          });
          return elements;
        },
        resetCLS: () => {
          clsValue = 0;
          clsEntries = [];
          log('CLS values reset to 0', 'info');
        }
      };
      
    } catch (error) {
      log(`Error setting up CLS tracking: ${error.message}`, 'error');
    }
  }
  
  // Run verification when DOM is loaded
  function runVerification() {
    log('Starting CLS verification checks');
    verifyCSS();
    verifyElements();
    trackCLS();
    log('CLS verification complete. Monitor for any red highlights indicating layout shifts.');
    log('Use window.__clsVerification in console for additional information.');
  }
  
  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runVerification);
  } else {
    // Give a slight delay to ensure everything has initialized
    setTimeout(runVerification, 500);
  }
  
  // Also run after full page load to catch any late DOM manipulations
  window.addEventListener('load', () => {
    setTimeout(runVerification, 1000);
  });
})();