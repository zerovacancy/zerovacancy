import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './navigation/BottomNav';
import { isMobileDevice } from '@/utils/mobile-optimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { addBottomNavSpacer } from '@/utils/mobile-safety';
import { useStableViewportHeight } from '@/utils/web-vitals';

/**
 * ConditionalBottomNav - Renders the bottom navigation bar on mobile devices
 * Includes CLS prevention techniques to ensure stable layout during page loads
 */
const ConditionalBottomNav: React.FC = () => {
  const location = useLocation();
  const isMobileFromHook = useIsMobile(); // Use the hook for more reliable detection
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  
  // Use the enhanced stable viewport height hook for CLS prevention
  const { isStabilized, fixBottomNav } = useStableViewportHeight();
  
  // Use both the hook and direct check to avoid flickering during hydration
  const isMobile = isInitialized ? isMobileFromHook : false;
  
  // Early initialization to prevent layout shifts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Immediately check if we're on mobile to avoid layout shifts
      const initialIsMobile = isMobileDevice();
      
      // If we're on mobile and not on the home page, add the spacer immediately
      if (initialIsMobile && location.pathname !== "/" && location.pathname !== "") {
        // Add the spacer immediately to prevent layout shifts
        addBottomNavSpacer();
        document.body.classList.add('has-fixed-bottom');
        
        // Set CSS variables for layout stability
        const height = '64px'; // Standard height of bottom nav
        document.documentElement.style.setProperty('--mobile-bottom-nav-height', height);
        
        // Check if we need to add safe area inset
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS) {
          document.documentElement.style.setProperty(
            '--content-bottom-padding', 
            `calc(64px + env(safe-area-inset-bottom, 0px))`
          );
        }
        
        // Add a special class to body for CLS prevention
        document.body.classList.add('has-bottom-nav');
        
        // Apply hardware acceleration to the body to prevent CLS during scrolling
        document.body.style.transform = 'translateZ(0)';
        document.body.style.backfaceVisibility = 'hidden';
        document.body.style.webkitBackfaceVisibility = 'hidden';
      }
      
      // Mark as initialized after first render
      setIsInitialized(true);
    }
  }, [location.pathname]);
  
  // Monitor element dimensions for responsive behavior
  useEffect(() => {
    if (!bottomNavRef.current || location.pathname === "/" || !isMobile) {
      return;
    }
    
    // Create a ResizeObserver to monitor the bottom nav's dimensions
    // This is more reliable than window resize events for detecting actual component size changes
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === bottomNavRef.current) {
            const height = entry.contentRect.height;
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
        }
      });
      
      resizeObserver.observe(bottomNavRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isMobile, location.pathname, isInitialized]);
  
  // Handle resize events for responsive behavior
  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentIsMobile = isMobileDevice();
      
      // Only update things if the mobile status changes or we're on a route that shows the nav
      if (currentIsMobile && location.pathname !== "/" && location.pathname !== "") {
        // Use the fixBottomNav utility from useStableViewportHeight hook
        fixBottomNav();
        
        // Additional measurement for extra precision
        if (bottomNavRef.current) {
          const height = bottomNavRef.current.offsetHeight;
          if (height > 0) {
            document.documentElement.style.setProperty('--mobile-bottom-nav-height', `${height}px`);
          }
        }
      }
    }
  }, [location.pathname, fixBottomNav]);
  
  // Set up resize and orientation change listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleResize, { passive: true });
      
      // Initial resize to set proper dimensions
      handleResize();
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        
        // Clean up when component unmounts to prevent memory leaks
        document.body.classList.remove('has-fixed-bottom');
        document.body.classList.remove('has-bottom-nav');
        
        // Remove hardware acceleration styles
        document.body.style.transform = '';
        document.body.style.backfaceVisibility = '';
        document.body.style.webkitBackfaceVisibility = '';
      };
    }
  }, [handleResize]);
  
  // Don't render on home page or non-mobile devices
  if (location.pathname === "/" || !isMobile) {
    return null;
  }
  
  return (
    <div 
      ref={bottomNavRef} 
      className={`bottom-nav-container${isStabilized ? ' stabilized' : ''}`}
      style={{
        // Apply stable rendering properties to prevent layout shifts
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
        transition: 'opacity 0.15s ease-in-out',
        opacity: isStabilized ? 1 : 0.99
      }}
    >
      <BottomNav />
    </div>
  );
};

export default ConditionalBottomNav;