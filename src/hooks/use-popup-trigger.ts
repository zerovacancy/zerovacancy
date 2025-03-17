
import { useState, useEffect, useCallback, useRef } from 'react';

type TriggerStrategy = 'immediate' | 'exit-intent' | 'scroll-depth' | 'time-delay' | 'combined';

interface PopupTriggerOptions {
  strategy?: TriggerStrategy;
  scrollThreshold?: number; // Percentage of page scrolled (0-100)
  timeDelay?: number; // Milliseconds before showing
  minEngagementTime?: number; // Minimum time (ms) user should be on page
  maxFrequency?: number; // Show once per X hours
  showOnlyOnce?: boolean; // Show only once ever (using localStorage)
  storageKey?: string; // localStorage key for tracking display history
}

export function usePopupTrigger({
  strategy = 'combined',
  scrollThreshold = 60,
  timeDelay = 40000, // 40 seconds
  minEngagementTime = 10000, // 10 seconds
  maxFrequency = 24, // hours
  showOnlyOnce = false,
  storageKey = 'popup_last_shown'
}: PopupTriggerOptions = {}) {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [hasEngagedEnough, setHasEngagedEnough] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const engagementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Check if we should show based on frequency rules
  const checkFrequencyRules = useCallback(() => {
    try {
      // For "show only once" rule
      if (showOnlyOnce) {
        const hasShownBefore = localStorage.getItem(`${storageKey}_shown`);
        if (hasShownBefore === 'true') {
          return false;
        }
      }
      
      // For frequency-based rule
      const lastShown = localStorage.getItem(storageKey);
      if (lastShown) {
        const lastShownTime = parseInt(lastShown, 10);
        const currentTime = new Date().getTime();
        const hoursSinceLastShown = (currentTime - lastShownTime) / (1000 * 60 * 60);
        
        if (hoursSinceLastShown < maxFrequency) {
          return false;
        }
      }
      
      return true;
    } catch (e) {
      // In case of localStorage errors
      console.error('Error checking frequency rules:', e);
      return true;
    }
  }, [maxFrequency, showOnlyOnce, storageKey]);
  
  // Update localStorage when popup is shown
  const recordPopupShown = useCallback(() => {
    try {
      localStorage.setItem(storageKey, new Date().getTime().toString());
      if (showOnlyOnce) {
        localStorage.setItem(`${storageKey}_shown`, 'true');
      }
    } catch (e) {
      console.error('Error recording popup shown:', e);
    }
  }, [storageKey, showOnlyOnce]);
  
  // Exit intent detection
  const setupExitIntent = useCallback(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the page
      if (e.clientY <= 5 && checkFrequencyRules() && hasEngagedEnough) {
        setShouldShowPopup(true);
        recordPopupShown();
        // Remove the listener after trigger
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    
    // Only add for desktop browsers
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {};
  }, [checkFrequencyRules, hasEngagedEnough, recordPopupShown]);
  
  // Scroll depth detection
  const setupScrollDepth = useCallback(() => {
    const handleScroll = () => {
      if (hasScrolledEnough) return;
      
      const scrollPosition = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / docHeight) * 100;
      
      if (scrollPercentage >= scrollThreshold) {
        setHasScrolledEnough(true);
        
        // Check if we should show popup based on strategy
        if ((strategy === 'scroll-depth' || strategy === 'combined') 
            && checkFrequencyRules() && hasEngagedEnough) {
          setShouldShowPopup(true);
          recordPopupShown();
        }
        
        // Remove listener after reaching threshold
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkFrequencyRules, hasEngagedEnough, hasScrolledEnough, recordPopupShown, scrollThreshold, strategy]);
  
  // Time delay trigger
  const setupTimeDelay = useCallback(() => {
    if (strategy === 'time-delay' || strategy === 'combined') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        if (checkFrequencyRules() && hasEngagedEnough) {
          setShouldShowPopup(true);
          recordPopupShown();
        }
      }, timeDelay);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkFrequencyRules, hasEngagedEnough, recordPopupShown, strategy, timeDelay]);
  
  // Engagement time tracking
  useEffect(() => {
    // Set minimum engagement time
    engagementTimeoutRef.current = setTimeout(() => {
      setHasEngagedEnough(true);
    }, minEngagementTime);
    
    return () => {
      if (engagementTimeoutRef.current) clearTimeout(engagementTimeoutRef.current);
    };
  }, [minEngagementTime]);
  
  // Setup all triggers
  useEffect(() => {
    // If immediate, show popup right away if it meets frequency rules
    if (strategy === 'immediate' && checkFrequencyRules()) {
      setShouldShowPopup(true);
      recordPopupShown();
      return () => {};
    }
    
    // Setup each trigger based on strategy
    const cleanupFunctions: Array<() => void> = [];
    
    if (strategy === 'exit-intent' || strategy === 'combined') {
      cleanupFunctions.push(setupExitIntent());
    }
    
    if (strategy === 'scroll-depth' || strategy === 'combined') {
      cleanupFunctions.push(setupScrollDepth());
    }
    
    if (strategy === 'time-delay' || strategy === 'combined') {
      cleanupFunctions.push(setupTimeDelay());
    }
    
    // Cleanup all listeners on unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [checkFrequencyRules, recordPopupShown, setupExitIntent, setupScrollDepth, setupTimeDelay, strategy]);
  
  // Reset function
  const resetTrigger = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  
  // Manual trigger function
  const triggerPopup = useCallback(() => {
    if (checkFrequencyRules()) {
      setShouldShowPopup(true);
      recordPopupShown();
    }
  }, [checkFrequencyRules, recordPopupShown]);
  
  return {
    shouldShowPopup,
    resetTrigger,
    triggerPopup,
    hasScrolledEnough,
    hasEngagedEnough
  };
}
