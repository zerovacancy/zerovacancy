
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Create a cached context to prevent unnecessary re-renders
const MobileContext = React.createContext<{
  isMobile: boolean;
  isTablet: boolean;
}>({ isMobile: false, isTablet: false });

// Provider that can be used to wrap the app
export function MobileContextProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isTablet, setIsTablet] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    
    // Check on mount
    checkMobile();
    
    // Throttle resize events for better performance
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
      window.addEventListener("resize", handleResize);
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
    <MobileContext.Provider value={{ isMobile, isTablet }}>
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
    
    // Throttle resize events
    let timeoutId: number | null = null;
    const handleResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkMobile, 100);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
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
    
    window.addEventListener("resize", handleResize);
    
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
    
    // Throttle the resize event to improve performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const throttledResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSize, 100);
    };
    
    // Initialize on mount
    updateSize();
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledResize);
    };
  }, []);
  
  return size;
}
