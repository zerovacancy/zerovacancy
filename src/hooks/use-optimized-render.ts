import { useState, useEffect, useRef, useCallback, DependencyList } from 'react';
import { detectDeviceCapability } from '@/utils/js-optimization';

/**
 * Optimized rendering hook that delays initialization or updates for non-critical components
 * @param initializeFn - Function to run when component should initialize
 * @param dependencies - Dependencies that trigger re-initialization
 * @param options - Configuration options
 * @returns An object with initialization state and manual control functions
 */
export function useOptimizedRender<T>(
  initializeFn: () => T,
  dependencies: DependencyList = [],
  options: {
    delay?: number;
    priority?: 'high' | 'medium' | 'low';
    disableOnLowEnd?: boolean;
    manualControl?: boolean;
  } = {}
) {
  const {
    delay = 0,
    priority = 'medium',
    disableOnLowEnd = false,
    manualControl = false,
  } = options;
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deviceRef = useRef<'high' | 'medium' | 'low'>('medium');
  
  // Detect device capability on mount
  useEffect(() => {
    deviceRef.current = detectDeviceCapability();
    
    // For high priority components, disable optimization
    if (priority === 'high') {
      runInitialization();
      return;
    }
    
    // For low-end devices, check if we should disable the component
    if (deviceRef.current === 'low' && disableOnLowEnd) {
      return;
    }
    
    // For manual control, don't auto-initialize
    if (manualControl) {
      return;
    }
    
    // Calculate dynamic delay based on device and priority
    let dynamicDelay = delay;
    
    if (deviceRef.current === 'low') {
      // Increase delay on low-end devices
      dynamicDelay += priority === 'medium' ? 500 : 1000;
    } else if (deviceRef.current === 'medium') {
      // Slight increase for medium devices
      dynamicDelay += priority === 'low' ? 200 : 0;
    }
    
    // Schedule initialization
    if (dynamicDelay > 0) {
      // Use rAF + setTimeout for better scheduling
      requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(runInitialization, dynamicDelay);
      });
    } else {
      // Run immediately for zero delay
      runInitialization();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [manualControl, disableOnLowEnd, priority, delay]);
  
  // Initialize the component
  const runInitialization = useCallback(() => {
    try {
      const result = initializeFn();
      setResult(result);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsInitialized(false);
    }
  }, [initializeFn]);
  
  // Re-run initialization when dependencies change and component is already initialized
  useEffect(() => {
    if (isInitialized && !manualControl) {
      runInitialization();
    }
  }, [...dependencies, isInitialized, manualControl, runInitialization]);
  
  // Manual control functions
  const initialize = useCallback(() => {
    if (!isInitialized) {
      runInitialization();
    }
  }, [isInitialized, runInitialization]);
  
  const reset = useCallback(() => {
    setIsInitialized(false);
    setResult(null);
    setError(null);
  }, []);
  
  // Return state and control functions
  return {
    isInitialized,
    result,
    error,
    initialize,
    reset,
    deviceCapability: deviceRef.current
  };
}

/**
 * Hook to defer mounting of non-critical components until after page load or idle time
 * @param shouldMount - Whether the component should eventually mount
 * @param options - Configuration options
 * @returns Boolean indicating if component should be mounted now
 */
export function useDeferredMount(
  shouldMount: boolean = true,
  options: {
    delayMs?: number; 
    idleTimeout?: number;
    strategy?: 'requestIdleCallback' | 'setTimeout' | 'afterPaint';
  } = {}
): boolean {
  const {
    delayMs = 300,
    idleTimeout = 2000,
    strategy = 'requestIdleCallback'
  } = options;
  
  const [shouldRender, setShouldRender] = useState(false);
  const deviceCapability = useRef(detectDeviceCapability());
  
  useEffect(() => {
    if (!shouldMount) {
      setShouldRender(false);
      return;
    }
    
    // Skip delays for high-end devices
    if (deviceCapability.current === 'high') {
      setShouldRender(true);
      return;
    }
    
    let timeoutId: any;
    
    if (strategy === 'requestIdleCallback' && 'requestIdleCallback' in window) {
      // Use requestIdleCallback for browsers that support it
      timeoutId = (window as any).requestIdleCallback(
        () => setShouldRender(true),
        { timeout: idleTimeout }
      );
    } else if (strategy === 'afterPaint') {
      // Wait for next paint then set a timeout
      requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setShouldRender(true), delayMs);
      });
    } else {
      // Fallback to basic setTimeout
      timeoutId = setTimeout(() => setShouldRender(true), delayMs);
    }
    
    return () => {
      if (strategy === 'requestIdleCallback' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(timeoutId);
      } else {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldMount, delayMs, idleTimeout, strategy]);
  
  return shouldRender;
}

/**
 * Hook to optimize animations and transitions based on device capability
 * @param animationOptions - Configuration for the animation
 * @returns Object with animation settings adjusted for device capability
 */
export function useOptimizedAnimation(
  animationOptions: {
    duration?: number;
    delay?: number;
    easing?: string;
    enabled?: boolean;
    reduceMotion?: boolean;
  } = {}
) {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    enabled = true,
    reduceMotion = false
  } = animationOptions;
  
  const deviceCapability = useRef(detectDeviceCapability());
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  
  // Determine if animations should be disabled
  const shouldDisableAnimations = 
    !enabled || 
    (reduceMotion && prefersReducedMotion.current) ||
    (deviceCapability.current === 'low');
  
  // Adjust duration based on device capability
  const adjustedDuration = useMemo(() => {
    if (shouldDisableAnimations) return 0;
    
    switch (deviceCapability.current) {
      case 'high': return duration;
      case 'medium': return Math.round(duration * 0.8); // 20% shorter
      case 'low': return Math.round(duration * 0.5); // 50% shorter
      default: return duration;
    }
  }, [duration, shouldDisableAnimations]);
  
  // Adjust delay based on device capability
  const adjustedDelay = useMemo(() => {
    if (shouldDisableAnimations) return 0;
    
    switch (deviceCapability.current) {
      case 'high': return delay;
      case 'medium': return Math.round(delay * 0.8); // 20% shorter
      case 'low': return Math.min(10, Math.round(delay * 0.25)); // 75% shorter, max 10ms
      default: return delay;
    }
  }, [delay, shouldDisableAnimations]);
  
  // Simplify easing for low-end devices
  const adjustedEasing = useMemo(() => {
    if (shouldDisableAnimations) return 'ease';
    
    if (deviceCapability.current === 'low') {
      // Simplify complex easing functions
      if (easing.includes('cubic-bezier') || easing.includes('bounce')) {
        return 'ease-out';
      }
    }
    
    return easing;
  }, [easing, shouldDisableAnimations]);
  
  return {
    duration: adjustedDuration,
    delay: adjustedDelay,
    easing: adjustedEasing,
    isDisabled: shouldDisableAnimations,
    deviceCapability: deviceCapability.current,
    cssProperties: {
      transition: shouldDisableAnimations 
        ? 'none' 
        : `all ${adjustedDuration}ms ${adjustedEasing} ${adjustedDelay}ms`,
      willChange: shouldDisableAnimations ? 'auto' : 'transform, opacity'
    }
  };
}
