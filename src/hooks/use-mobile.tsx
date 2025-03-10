
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Create a cached context to prevent unnecessary re-renders
const MobileContext = React.createContext<{
  isMobile: boolean;
  isTablet: boolean;
  isLowPerformance: boolean;
}>({ isMobile: false, isTablet: false, isLowPerformance: false });

// Helper function to detect if device is likely low performance
const detectLowPerformanceDevice = () => {
  // Check for low memory
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
    return true;
  }
  
  // Check for low-end processors via hardwareConcurrency
  if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  // Fallback: check for iOS devices which might throttle JS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  // Attempt to detect older devices via user agent
  const isOlderDevice = /Android\s(4|5|6)/.test(navigator.userAgent) || 
                      /iPhone OS (8|9|10|11|12)_/.test(navigator.userAgent);
  
  return isIOS || isOlderDevice;
};

// Provider that can be used to wrap the app
export function MobileContextProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isTablet, setIsTablet] = React.useState<boolean>(false);
  const [isLowPerformance, setIsLowPerformance] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Initial check for device capabilities
    setIsLowPerformance(detectLowPerformanceDevice());
    
    // Initial check for screen size
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    
    // Check on mount
    checkMobile();
    
    // Debounce resize events for better performance
    let timeoutId: number | null = null;
    
    const handleResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        checkMobile();
      }, 100);
    };
    
    // Set up event listener using matchMedia for better performance
    const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const mqlTablet = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    );
    
    // Use the appropriate event listener based on browser support
    if (mqlMobile.addEventListener && mqlTablet.addEventListener) {
      mqlMobile.addEventListener("change", handleResize);
      mqlTablet.addEventListener("change", handleResize);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", handleResize, { passive: true });
    }
    
    // Cleanup
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      
      if (mqlMobile.removeEventListener && mqlTablet.removeEventListener) {
        mqlMobile.removeEventListener("change", handleResize);
        mqlTablet.removeEventListener("change", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile, isTablet, isLowPerformance }}>
      {children}
    </MobileContext.Provider>
  );
}

// Hook that returns whether the current viewport is mobile
export function useIsMobile() {
  // For code that doesn't have access to the context, fallback to the old behavior
  const context = React.useContext(MobileContext);
  
  if (context.isMobile !== undefined) {
    return context.isMobile;
  }
  
  // Fallback for when the provider isn't available
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    
    // Debounce resize events
    let timeoutId: number | null = null;
    const handleResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkMobile, 100);
    };
    
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

// Hook to detect if the device is likely low performance
export function useIsLowPerformance() {
  const context = React.useContext(MobileContext);
  
  if (context.isLowPerformance !== undefined) {
    return context.isLowPerformance;
  }
  
  // Fallback when context isn't available
  const [isLowPerformance, setIsLowPerformance] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    setIsLowPerformance(detectLowPerformanceDevice());
  }, []);
  
  return isLowPerformance;
}

// The rest of the hooks remain with performance improvements
export function useIsTablet() {
  const context = React.useContext(MobileContext);
  
  if (context.isTablet !== undefined) {
    return context.isTablet;
  }
  
  const [isTablet, setIsTablet] = React.useState<boolean>(
    typeof window !== 'undefined' 
      ? window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT 
      : false
  );

  React.useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    
    checkTablet();
    
    let timeoutId: number | null = null;
    const handleResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkTablet, 100);
    };
    
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isTablet;
}

export function useIsMobileOrTablet() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return isMobile || isTablet;
}

// Optimized viewport size hook with debouncing
export function useViewportSize() {
  const [size, setSize] = React.useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  React.useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Debounce the resize event to improve performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSize, 100);
    };
    
    // Initialize on mount
    updateSize();
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);
  
  return size;
}

// Hook that provides device capability information for adaptive rendering
export function useDeviceCapabilities() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLowPerformance = useIsLowPerformance();
  
  return {
    isMobile,
    isTablet, 
    isLowPerformance,
    // Use reduced animations when on mobile or low-performance devices
    shouldUseReducedAnimations: isMobile || isLowPerformance,
    // Use simplified UI on very constrained devices
    shouldUseSimplifiedUI: isLowPerformance && isMobile
  };
}
