
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Single source of truth for viewport state with stable references
const viewportState = {
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  isTablet: typeof window !== 'undefined' ? (window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT) : false
};

// Stable reference to subscribers
const subscribers = new Set<() => void>();

// Throttled resize handler to prevent too many updates
let resizeTimeout: number | null = null;

// Setup one global listener that only runs once
if (typeof window !== 'undefined') {
  const updateViewportState = () => {
    const prevMobile = viewportState.isMobile;
    const prevTablet = viewportState.isTablet;
    
    viewportState.width = window.innerWidth;
    viewportState.height = window.innerHeight;
    viewportState.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    viewportState.isTablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;
    
    // Only notify if there was an actual change in state
    if (prevMobile !== viewportState.isMobile || prevTablet !== viewportState.isTablet) {
      notifySubscribers();
    }
  };
  
  const notifySubscribers = () => {
    subscribers.forEach(callback => callback());
  };
  
  const handleResize = () => {
    if (resizeTimeout) {
      window.clearTimeout(resizeTimeout);
    }
    
    // Significant throttle to prevent rapid updates
    resizeTimeout = window.setTimeout(updateViewportState, 200);
  };
  
  // Initial check
  updateViewportState();
  
  // Passive listener for better performance
  window.addEventListener('resize', handleResize, { passive: true });
}

/**
 * Hook that returns a stable boolean indicating if the device is mobile
 * Uses a shared viewport state and only triggers re-renders when the mobile status changes
 */
export function useIsMobile() {
  // Use state initialization from the global state
  const [isMobile, setIsMobile] = React.useState(viewportState.isMobile);
  
  // Only subscribe to changes once
  React.useEffect(() => {
    // Update function that only calls setIsMobile if the value changed
    const updateState = () => {
      if (isMobile !== viewportState.isMobile) {
        setIsMobile(viewportState.isMobile);
      }
    };
    
    // Add subscriber
    subscribers.add(updateState);
    
    // Cleanup
    return () => {
      subscribers.delete(updateState);
    };
  }, [isMobile]); // Only re-subscribe if isMobile changes
  
  // Return stable value that doesn't cause re-renders unless actually changed
  return isMobile;
}

/**
 * Hook that returns a stable boolean indicating if the device is a tablet
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(viewportState.isTablet);
  
  React.useEffect(() => {
    const updateState = () => {
      if (isTablet !== viewportState.isTablet) {
        setIsTablet(viewportState.isTablet);
      }
    };
    
    subscribers.add(updateState);
    
    return () => {
      subscribers.delete(updateState);
    };
  }, [isTablet]);
  
  return isTablet;
}

/**
 * Hook that returns a stable boolean indicating if the device is mobile or tablet
 */
export function useIsMobileOrTablet() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Memoized to prevent unnecessary re-renders
  return React.useMemo(() => isMobile || isTablet, [isMobile, isTablet]);
}

/**
 * Hook that returns the current viewport size with stable reference
 */
export function useViewportSize() {
  const [size, setSize] = React.useState({
    width: viewportState.width,
    height: viewportState.height
  });
  
  React.useEffect(() => {
    const updateSize = () => {
      if (size.width !== viewportState.width || size.height !== viewportState.height) {
        setSize({
          width: viewportState.width,
          height: viewportState.height
        });
      }
    };
    
    subscribers.add(updateSize);
    
    return () => {
      subscribers.delete(updateSize);
    };
  }, [size.width, size.height]);
  
  return size;
}
