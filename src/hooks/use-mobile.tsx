
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Use a single shared state for mobile detection to prevent multiple listeners
let globalIsMobile: boolean | undefined = undefined;
let globalIsTablet: boolean | undefined = undefined;
let globalViewportSize = { width: 0, height: 0 };

// Listeners for state updates
const mobileListeners: Set<(isMobile: boolean) => void> = new Set();
const tabletListeners: Set<(isTablet: boolean) => void> = new Set();
const viewportListeners: Set<(size: {width: number, height: number}) => void> = new Set();

// Initialize once globally
if (typeof window !== 'undefined') {
  const checkDimensions = () => {
    const width = window.innerWidth;
    globalIsMobile = width < MOBILE_BREAKPOINT;
    globalIsTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
    globalViewportSize = { width, height: window.innerHeight };
    
    // Notify listeners
    mobileListeners.forEach(listener => listener(globalIsMobile!));
    tabletListeners.forEach(listener => listener(globalIsTablet!));
    viewportListeners.forEach(listener => listener(globalViewportSize));
  };
  
  // Initial check
  checkDimensions();
  
  // Throttled resize handler
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(checkDimensions, 100);
  };
  
  // Set up one global listener
  window.addEventListener('resize', handleResize, { passive: true });
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(!!globalIsMobile);
  
  React.useEffect(() => {
    // Set initial value if available
    if (globalIsMobile !== undefined) {
      setIsMobile(globalIsMobile);
    }
    
    // Add listener
    const listener = (value: boolean) => setIsMobile(value);
    mobileListeners.add(listener);
    
    // Cleanup
    return () => {
      mobileListeners.delete(listener);
    };
  }, []);
  
  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(!!globalIsTablet);
  
  React.useEffect(() => {
    // Set initial value if available
    if (globalIsTablet !== undefined) {
      setIsTablet(globalIsTablet);
    }
    
    // Add listener
    const listener = (value: boolean) => setIsTablet(value);
    tabletListeners.add(listener);
    
    // Cleanup
    return () => {
      tabletListeners.delete(listener);
    };
  }, []);
  
  return isTablet;
}

export function useIsMobileOrTablet() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return isMobile || isTablet;
}

export function useViewportSize() {
  const [size, setSize] = React.useState<{ width: number; height: number }>(globalViewportSize);
  
  React.useEffect(() => {
    // Set initial value
    setSize(globalViewportSize);
    
    // Add listener
    const listener = (value: {width: number, height: number}) => setSize(value);
    viewportListeners.add(listener);
    
    // Cleanup
    return () => {
      viewportListeners.delete(listener);
    };
  }, []);
  
  return size;
}
