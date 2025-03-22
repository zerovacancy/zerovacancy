import { useCallback, useEffect, useRef } from 'react';

/**
 * Creates a properly throttled scroll event handler for performance
 * using requestAnimationFrame for better performance than setTimeout
 * 
 * @param callback The function to call when scroll event fires
 * @param delay Optional delay between calls (defaults to rAF timing)
 * @returns A throttled event handler function
 */
export function createThrottledScrollHandler<T extends (...args: any[]) => any>(
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
export function useThrottledScroll<T extends (...args: any[]) => any>(
  callback: T,
  delay?: number,
  deps: React.DependencyList = []
): void {
  // Use a ref to store the latest callback without triggering effect reruns
  const callbackRef = useRef(callback);
  
  // Update the callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);
  
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
export function createThrottledResizeHandler<T extends (...args: any[]) => any>(
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
 * @param sectionsCount Total number of sections
 * @returns Object with section style utilities
 */
export function useSectionStyles(sectionsCount: number) {
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
   * @param index Section index
   * @returns Background transition styles
   */
  const getBackgroundTransition = (index: number) => {
    return {
      transition: `background-color 0.8s ease-in-out, 
                  opacity 0.5s ease-in-out, 
                  transform 0.5s ease-out`,
      willChange: 'transform, opacity'
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