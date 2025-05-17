import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Web Vitals Monitoring - Core Performance Improvement
 * 
 * Tracks and reports Core Web Vitals metrics using the web-vitals library
 * to provide insights into real user performance.
 */

type MetricName = 'CLS' | 'LCP' | 'FID' | 'INP' | 'TTFB' | 'FCP';

interface MetricBase {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: unknown[];
  navigationType: string | undefined;
}

interface Metric extends MetricBase {
  rating?: 'good' | 'needs-improvement' | 'poor';
}

interface VitalsConfig {
  reportTo?: string; // URL to send metrics to
  analyticsId?: string; // Optional analytics ID for tracking
  debug?: boolean; // Enable console logging of vitals
  samplingRate?: number; // Rate between 0-1 to sample users
}

// Store metrics in memory for debugging
const metricStore: Record<string, Metric> = {};

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void, config?: VitalsConfig) {
  const { 
    debug = false, 
    samplingRate = 1.0, 
    reportTo,
    analyticsId
  } = config || {};

  // Skip based on sampling rate (0-1)
  if (Math.random() > samplingRate) return;

  // Only run in browser
  if (typeof window === 'undefined') return;

  // Dynamically import the web-vitals library
  // Use a more specific type for the web-vitals library
  let webVitalsLib: {
    onCLS: (cb: (metric: Metric) => void) => void;
    onFID: (cb: (metric: Metric) => void) => void;
    onLCP: (cb: (metric: Metric) => void) => void;
    onINP: (cb: (metric: Metric) => void) => void;
    onTTFB: (cb: (metric: Metric) => void) => void;
    onFCP: (cb: (metric: Metric) => void) => void;
  } | null = null;
  
  try {
    // Use dynamic import instead of require to avoid ESLint errors
    import('web-vitals').then((webVitals) => {
      webVitalsLib = webVitals;
      const { onCLS, onFID, onLCP, onINP, onTTFB, onFCP } = webVitals;
      
      // Set up event handlers for each metric
      onCLS((metric) => handleMetric('CLS', metric, onPerfEntry, { debug, reportTo, analyticsId }));
      onLCP((metric) => handleMetric('LCP', metric, onPerfEntry, { debug, reportTo, analyticsId }));
      onFID((metric) => handleMetric('FID', metric, onPerfEntry, { debug, reportTo, analyticsId }));
      onINP((metric) => handleMetric('INP', metric, onPerfEntry, { debug, reportTo, analyticsId }));
      onTTFB((metric) => handleMetric('TTFB', metric, onPerfEntry, { debug, reportTo, analyticsId }));
      onFCP((metric) => handleMetric('FCP', metric, onPerfEntry, { debug, reportTo, analyticsId }));
    }).catch(error => {
      if (debug) {
        console.warn('Failed to load web-vitals library:', error);
      }
    });
  } catch (error) {
    if (debug) {
      console.warn('Error initializing web-vitals:', error);
    }
  }
}

/**
 * Process and handle metric reporting
 */
function handleMetric(
  name: MetricName, 
  metric: Metric, 
  onPerfEntry?: (metric: Metric) => void,
  options?: {
    debug?: boolean;
    reportTo?: string;
    analyticsId?: string;
  }
) {
  const { debug = false, reportTo, analyticsId } = options || {};
  
  // Store metric for debugging
  metricStore[name] = metric;
  
  // Add name to metric object
  const metricWithName = {
    ...metric,
    name,
  };
  
  // Call custom handler if provided
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onPerfEntry(metricWithName);
  }
  
  // Log to console in debug mode
  if (debug) {
    let status = '';
    let color = '';
    
    // Determine status based on metric values
    // These thresholds are based on Google's Core Web Vitals guidelines
    switch (name) {
      case 'CLS':
        if (metric.value <= 0.1) {
          status = 'Good';
          color = 'green';
        } else if (metric.value <= 0.25) {
          status = 'Needs Improvement';
          color = 'orange';
        } else {
          status = 'Poor';
          color = 'red';
        }
        break;
      case 'LCP':
        if (metric.value <= 2500) {
          status = 'Good';
          color = 'green';
        } else if (metric.value <= 4000) {
          status = 'Needs Improvement';
          color = 'orange';
        } else {
          status = 'Poor';
          color = 'red';
        }
        break;
      case 'FID':
      case 'INP':
        if (metric.value <= 100) {
          status = 'Good';
          color = 'green';
        } else if (metric.value <= 300) {
          status = 'Needs Improvement';
          color = 'orange';
        } else {
          status = 'Poor';
          color = 'red';
        }
        break;
      case 'TTFB':
        if (metric.value <= 800) {
          status = 'Good';
          color = 'green';
        } else if (metric.value <= 1800) {
          status = 'Needs Improvement';
          color = 'orange';
        } else {
          status = 'Poor';
          color = 'red';
        }
        break;
      case 'FCP':
        if (metric.value <= 1800) {
          status = 'Good';
          color = 'green';
        } else if (metric.value <= 3000) {
          status = 'Needs Improvement';
          color = 'orange';
        } else {
          status = 'Poor';
          color = 'red';
        }
        break;
    }
    
    console.log(
      `%c${name}: %c${metric.value.toFixed(2)} %c${metric.rating || status}`,
      'font-weight: bold;', 
      'font-weight: normal;', 
      `color: ${color}; font-weight: bold;`
    );
  }
  
  // Send to analytics if URL is provided
  if (reportTo) {
    const body = {
      name: name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      analyticsId: analyticsId || 'default',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
    
    // Use sendBeacon if supported to avoid delaying page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(reportTo, JSON.stringify(body));
    } else {
      // Fallback to fetch with keepalive
      fetch(reportTo, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true
      }).catch(() => {
        // Silently fail if fetch fails
      });
    }
  }
}

/**
 * Returns a debugging component that will display Web Vitals metrics
 * in the corner of the page (only in development)
 */
export function initWebVitalsMonitoring() {
  // Only run in browser and only in development
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  
  reportWebVitals(undefined, { debug: true });
  
  // Create a debug panel for development
  const container = document.createElement('div');
  container.id = 'web-vitals-debug';
  container.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    border-top-left-radius: 4px;
  `;
  
  // Add to document
  document.body.appendChild(container);
  
  // Update the debug panel every second
  setInterval(() => {
    if (!container) return;
    
    let html = '<h4 style="margin: 0 0 4px 0;">Core Web Vitals</h4>';
    
    Object.entries(metricStore).forEach(([name, metric]) => {
      let color = '';
      
      // Determine color based on metric rating
      switch (metric.rating) {
        case 'good':
          color = 'green';
          break;
        case 'needs-improvement':
          color = 'orange';
          break;
        case 'poor':
          color = 'red';
          break;
      }
      
      html += `<div><strong>${name}:</strong> <span style="color: ${color}">${metric.value.toFixed(2)}</span></div>`;
    });
    
    container.innerHTML = html;
  }, 1000);
}

/**
 * Use this function to get all current metrics
 */
export function getCurrentMetrics() {
  return { ...metricStore };
}

/**
 * Creates a properly throttled scroll event handler for performance
 * using requestAnimationFrame for better performance than setTimeout
 * 
 * @param callback The function to call when scroll event fires
 * @param delay Optional delay between calls (defaults to rAF timing)
 * @returns A throttled event handler function
 */

/**
 * Utility to detect and report layout shifts in real-time
 * for improved debugging of CLS issues
 */
export function monitorLayoutShift(options: {
  debugMode?: boolean; 
  reportCallback?: (shift: {value: number, elements: string[]}) => void;
} = {}) {
  const { debugMode = false, reportCallback } = options;
  
  if (typeof window === 'undefined') return;
  
  // Keep track of cumulative layout shift
  let cumulativeLayoutShift = 0;
  let observer: PerformanceObserver | null = null;
  
  try {
    // Create a PerformanceObserver instance
    observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as PerformanceEntry[]) {
        // Make sure it's a layout-shift entry
        if (entry.entryType === 'layout-shift' && !((entry as any).hadRecentInput)) {
          const shiftValue = (entry as any).value;
          cumulativeLayoutShift += shiftValue;
          
          // Get impacted elements if possible
          const nodes: string[] = [];
          const nodeNames: string[] = [];
          
          try {
            if ((entry as any).sources) {
              for (const source of (entry as any).sources) {
                if (source.node) {
                  const nodeName = source.node.nodeName || 'unknown';
                  const nodeId = source.node.id ? `#${source.node.id}` : '';
                  const className = source.node.className ? 
                    `.${source.node.className.split(' ').join('.')}` : '';
                  
                  const nodeIdentifier = `${nodeName}${nodeId}${className}`;
                  nodeNames.push(nodeIdentifier);
                  
                  // Only in debug mode, we highlight the problematic elements
                  if (debugMode) {
                    // Temporarily highlight the element that shifted
                    const originalOutline = source.node.style.outline;
                    const originalZIndex = source.node.style.zIndex;
                    
                    source.node.style.outline = '3px solid red';
                    source.node.style.zIndex = '10000';
                    
                    setTimeout(() => {
                      source.node.style.outline = originalOutline;
                      source.node.style.zIndex = originalZIndex;
                    }, 1000);
                  }
                }
              }
            }
          } catch (e) {
            // Safely handle any errors in accessing source nodes
          }
          
          // Log to console if debug mode is enabled
          if (debugMode) {
            console.warn(`Layout shift detected: ${shiftValue.toFixed(5)}`, {
              cumulativeLayoutShift: cumulativeLayoutShift.toFixed(5),
              elements: nodeNames.length ? nodeNames : 'Unknown elements',
              timestamp: new Date().toISOString()
            });
          }
          
          // Call the report callback if provided
          if (reportCallback) {
            reportCallback({
              value: shiftValue,
              elements: nodeNames
            });
          }
        }
      }
    });
    
    // Start observing layout-shift entries
    observer.observe({ type: 'layout-shift', buffered: true });
    
  } catch (e) {
    if (debugMode) {
      console.error('Layout Shift monitoring not supported in this browser', e);
    }
  }
  
  // Return a function that can be called to stop monitoring
  return function stopMonitoring() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

/**
 * Creates a properly throttled scroll event handler for performance
 * using requestAnimationFrame for better performance than setTimeout
 * 
 * @param callback The function to call when scroll event fires
 * @param delay Optional delay between calls (defaults to rAF timing)
 * @returns A throttled event handler function
 */
export function createThrottledScrollHandler<T extends (...args: unknown[]) => unknown>(
  callback: T, 
  delay?: number
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastCallTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = performance.now();
    const elapsed = now - lastCallTime;
    
    // If using delay mode and not enough time has passed, skip
    if (delay && elapsed < delay) {
      return;
    }
    
    // Cancel any pending rAF to prevent queueing multiple calls
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    // Schedule the callback in the next animation frame
    rafId = requestAnimationFrame(() => {
      lastCallTime = performance.now();
      callback(...args);
      rafId = null;
    });
  };
}

/**
 * React hook for properly throttled scroll events
 * 
 * @param callback The function to call when scroll event fires
 * @param delay Optional delay between calls (in ms)
 * @param deps Dependencies array for the callback
 */
 
export function useThrottledScroll<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay?: number,
  deps: React.DependencyList = []
): void {
  // Use a ref to store the latest callback without triggering effect reruns
  const callbackRef = useRef(callback);
  
  // Update the callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...(deps || [])]);
  
  // Memoize the throttled handler
  const throttledHandler = useCallback(
    () => {
      callbackRef.current();
    },
    []
  );
  
  // Set up the throttled scroll listener
  useEffect(() => {
    const handler = createThrottledScrollHandler(throttledHandler, delay);
    
    window.addEventListener('scroll', handler, { passive: true });
    
    // Initial call to set starting values
    handler();
    
    return () => window.removeEventListener('scroll', handler);
  }, [throttledHandler, delay]);
}

/**
 * Creates a properly throttled resize event handler
 * 
 * @param callback The function to call when resize event fires
 * @param delay Optional delay between calls (in ms)
 * @returns A throttled event handler function
 */
 
export function createThrottledResizeHandler<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 100
): (...args: Parameters<T>) => void {
  return createThrottledScrollHandler(callback, delay);
}

/**
 * Enhanced smooth scrolling with easing
 * @param elementId ID of the element to scroll to
 * @param offset Optional offset from the top in pixels
 * @param duration Duration of the scroll animation in ms
 */
export function smoothScrollTo(elementId: string, offset = 0, duration = 800): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Get the element's position accounting for any offset
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  // Starting position
  const startPosition = window.pageYOffset;
  // Distance to scroll
  const distance = offsetPosition - startPosition;
  
  let startTime: number | null = null;
  
  // Easing function - easeInOutQuad
  function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);
    
    window.scrollTo(0, startPosition + distance * easedProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  // Start the animation
  requestAnimationFrame(animation);
}

/**
 * Hook for section transitions with z-index management
 * 
 * @param _sectionsCount Total number of sections (currently unused, but kept for API compatibility)
 * @returns Object with section style utilities
 */
/**
 * A React hook that provides stable viewport height measurements
 * to prevent layout shifts caused by mobile browser UI changes
 * 
 * @returns An object with:
 * - vh: CSS vh unit value in pixels (1% of viewport height)
 * - windowHeight: Current stable window height
 * - setStableHeight: Function to manually update height
 * - isStabilized: Boolean indicating if height has been stabilized
 * - fixBottomNav: Function to adjust bottom nav spacing
 */
export function useStableViewportHeight() {
  const [vh, setVh] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight * 0.01 : 0
  );
  const [windowHeight, setWindowHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  
  const resizeTimeoutRef = useRef<number | null>(null);
  const orientationTimeoutRef = useRef<number | null>(null);
  const initialHeightRef = useRef<number>(windowHeight);
  const lastWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Set initial values on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    initialHeightRef.current = window.innerHeight;
    lastWidthRef.current = window.innerWidth;
    setVh(window.innerHeight * 0.01);
    setWindowHeight(window.innerHeight);
    
    // Also set CSS variables for use in stylesheets
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    
    // Calculate and set hero height variables
    const isMobile = window.innerWidth < 768;
    const heroMobileHeight = isMobile ? Math.round(window.innerHeight * 0.7) : 450;
    document.documentElement.style.setProperty('--hero-mobile-height', `${heroMobileHeight}px`);
    document.documentElement.style.setProperty('--hero-min-mobile-height', `${heroMobileHeight}px`);
    
    // Mark as stabilized after initial values are set
    setTimeout(() => {
      setIsStabilized(true);
    }, 50);
    
    const handleResize = () => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Store current dimensions
      const currentHeight = window.innerHeight;
      const currentWidth = window.innerWidth;
      
      // Check if this is an orientation change or just a UI change
      const isOrientationChange = 
        (lastWidthRef.current !== currentWidth) && 
        Math.abs(lastWidthRef.current - currentWidth) > 100;
      
      // For orientation changes we need special handling
      if (isOrientationChange) {
        // Immediately update width reference
        lastWidthRef.current = currentWidth;
        
        // For orientation changes, we need to update immediately to prevent major layout shifts
        document.documentElement.style.setProperty('--viewport-width', `${currentWidth}px`);
        
        // Then we'll do multiple updates to catch the height as it settles
        // Clear any pending orientation timeout
        if (orientationTimeoutRef.current !== null) {
          window.clearTimeout(orientationTimeoutRef.current);
        }
        
        // Initial update (immediate)
        updateVhValues(currentHeight);
        
        // Second update after a short delay to catch iOS toolbar adjustments
        orientationTimeoutRef.current = window.setTimeout(() => {
          updateVhValues(window.innerHeight);
          
          // Final update after the browser has fully adjusted
          orientationTimeoutRef.current = window.setTimeout(() => {
            updateVhValues(window.innerHeight);
            orientationTimeoutRef.current = null;
          }, 300);
        }, 100);
        
        return;
      }
      
      // For normal resize events (not orientation changes)
      // Only trigger an update if height changes significantly (>3%)
      // This prevents rapid flickering updates from browser UI
      const heightDiff = Math.abs(currentHeight - initialHeightRef.current);
      const threshold = initialHeightRef.current * 0.03; // 3% threshold (more sensitive than before)
      
      if (heightDiff > threshold) {
        // Debounce the update to handle rapid changes
        resizeTimeoutRef.current = window.setTimeout(() => {
          updateVhValues(currentHeight);
          resizeTimeoutRef.current = null;
        }, 150); // Slightly faster updates for better responsiveness
      }
    };
    
    // Helper function to update all vh-related values
    const updateVhValues = (height: number) => {
      const newVh = height * 0.01;
      setVh(newVh);
      setWindowHeight(height);
      
      // Update CSS variables
      document.documentElement.style.setProperty('--vh', `${newVh}px`);
      document.documentElement.style.setProperty('--window-height', `${height}px`);
      
      // Update hero height for mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const heroHeight = Math.round(height * 0.7);
        document.documentElement.style.setProperty('--hero-mobile-height', `${heroHeight}px`);
        document.documentElement.style.setProperty('--hero-min-mobile-height', `${heroHeight}px`);
      }
      
      // Update the reference value
      initialHeightRef.current = height;
    };
    
    // Set up event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', () => {
      // Mark as unstabilized during orientation change
      setIsStabilized(false);
      
      // Re-stabilize after orientation change is complete
      setTimeout(() => {
        setIsStabilized(true);
      }, 500);
      
      // Force handler to run on orientation change
      handleResize();
    }, { passive: true });
    
    // Clean up listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      if (orientationTimeoutRef.current !== null) {
        window.clearTimeout(orientationTimeoutRef.current);
      }
    };
  }, []);
  
  // Function to manually update the height (useful for orientation changes)
  const setStableHeight = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const newVh = window.innerHeight * 0.01;
    setVh(newVh);
    setWindowHeight(window.innerHeight);
    
    // Update CSS variables
    document.documentElement.style.setProperty('--vh', `${newVh}px`);
    document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    
    // Update hero height variables for mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const heroHeight = Math.round(window.innerHeight * 0.7);
      document.documentElement.style.setProperty('--hero-mobile-height', `${heroHeight}px`);
      document.documentElement.style.setProperty('--hero-min-mobile-height', `${heroHeight}px`);
    }
    
    // Update the reference value
    initialHeightRef.current = window.innerHeight;
    lastWidthRef.current = window.innerWidth;
    
    // Mark as stabilized
    setIsStabilized(true);
  }, []);
  
  // Function to specifically fix bottom nav placement and spacing
  const fixBottomNav = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Update bottom nav specific variables
    const bottomNav = document.querySelector('.bottom-nav-container');
    if (bottomNav) {
      const height = bottomNav.getBoundingClientRect().height;
      if (height > 0) {
        document.documentElement.style.setProperty('--mobile-bottom-nav-height', `${height}px`);
        
        // Check if we need to add safe area inset
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS) {
          document.documentElement.style.setProperty(
            '--content-bottom-padding', 
            `calc(${height}px + env(safe-area-inset-bottom, 0px))`
          );
        } else {
          document.documentElement.style.setProperty('--content-bottom-padding', `${height}px`);
        }
      }
    }
  }, []);
  
  return { vh, windowHeight, setStableHeight, isStabilized, fixBottomNav };
}

export function useSectionStyles(_sectionsCount: number) {
  /**
   * Get CSS transition string for consistent section transitions
   * @param property CSS property to transition (default: all)
   * @param duration Duration in seconds
   * @returns Transition string
   */
  const getTransition = (property = 'all', duration = 0.6) => 
    `${property} ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
  
  /**
   * Get background transition styles for smooth color changes
   * @param _index Section index (currently unused, but kept for API compatibility)
   * @returns Background transition styles
   */
  const getBackgroundTransition = (_index: number) => {
    return {
      transition: `background-color 0.8s ease-in-out, 
                  background-image 0.8s ease-in-out,
                  opacity 0.5s ease-in-out, 
                  transform 0.5s ease-out,
                  box-shadow 0.5s ease-in-out`,
      willChange: 'transform, opacity, background-color, background-image, box-shadow'
    };
  };
  
  /**
   * Get z-index for a section to prevent z-fighting
   * Higher indices for sections lower in the document flow
   * 
   * @param index Section index (0-based)
   * @returns z-index style object
   */
  const getZIndex = (index: number) => {
    // Base z-index of 10 to avoid conflicts with other elements
    // We use a higher base (50) to ensure sections stay above other elements
    // We invert the order so that earlier sections (like the hero) have higher z-index
    // This prevents content from being cut off during transitions
    const zIndex = 50 - index;
    return { zIndex };
  };

  return {
    getTransition,
    getBackgroundTransition,
    getZIndex
  };
}