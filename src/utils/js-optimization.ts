/**
 * JavaScript performance optimization utilities
 * These utilities help improve JavaScript execution performance and reduce main thread blocking
 */

// Break large tasks into smaller chunks to prevent long-running scripts
export function chunkedOperation<T, R>(
  items: T[],
  operation: (item: T) => R,
  chunkSize: number = 5,
  delay: number = 0
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;

    function processNextChunk() {
      const chunk = items.slice(index, index + chunkSize);
      index += chunkSize;

      // Process this chunk
      for (const item of chunk) {
        results.push(operation(item));
      }

      // If we've processed all items, resolve the promise
      if (index >= items.length) {
        resolve(results);
        return;
      }

      // Otherwise, schedule the next chunk
      if (delay > 0) {
        setTimeout(processNextChunk, delay);
      } else {
        // Use requestAnimationFrame for smoother UI when no delay is specified
        requestAnimationFrame(processNextChunk);
      }
    }

    // Start processing
    processNextChunk();
  });
}

// Debounce function to prevent rapid-fire executions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

// Throttle function to limit execution frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number = 0;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Schedule low-priority work during idle periods
export function scheduleIdleWork<T>(
  work: () => T,
  timeout: number = 2000
): Promise<T> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(
        () => {
          const result = work();
          resolve(result);
        },
        { timeout }
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const result = work();
        resolve(result);
      }, 1);
    }
  });
}

// Use a web worker for CPU-intensive tasks
export function executeInWorker<T, R>(
  task: (data: T) => R,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    // Create a blob that contains our worker code
    const blob = new Blob([
      `self.onmessage = function(e) {
        try {
          const result = (${task.toString()})(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      }`
    ], { type: 'application/javascript' });
    
    // Create worker from blob
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    
    // Set up message handling
    worker.onmessage = function(e) {
      if (e.data.success) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
      
      // Clean up
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    
    // Handle errors
    worker.onerror = function(error) {
      reject(error);
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    
    // Start the worker
    worker.postMessage(data);
  });
}

// Use IntersectionObserver to delay JavaScript execution until elements are visible
export function executeWhenVisible(
  element: Element,
  callback: () => void,
  options: { rootMargin?: string; threshold?: number } = {}
): () => void {
  const { rootMargin = '0px', threshold = 0 } = options;
  
  // Create observer
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        callback();
        observer.disconnect();
      }
    },
    { rootMargin, threshold }
  );
  
  // Start observing
  observer.observe(element);
  
  // Return function to cancel observation
  return () => observer.disconnect();
}

// Optimize expensive DOM operations to reduce reflows
export function batchDOMOperations<T extends Element>(
  elements: T[],
  operation: (element: T) => void
): void {
  // Use document fragment for batch operations
  const fragment = document.createDocumentFragment();
  const parent = elements[0]?.parentElement;
  
  if (!parent) return;
  
  // Remove elements from DOM temporarily
  const placeholders: Comment[] = [];
  elements.forEach(el => {
    const placeholder = document.createComment('DOM batch placeholder');
    parent.insertBefore(placeholder, el);
    placeholders.push(placeholder);
    fragment.appendChild(el);
  });
  
  // Apply operations while elements are detached
  elements.forEach(operation);
  
  // Reinsert elements
  placeholders.forEach((placeholder, index) => {
    parent.insertBefore(elements[index], placeholder);
    parent.removeChild(placeholder);
  });
}

// Use passive event listeners for touchstart and wheel events
export function addPassiveEventListener(
  element: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options: AddEventListenerOptions = {}
): () => void {
  // Ensure passive flag is set for touch and wheel events
  if (['touchstart', 'touchmove', 'wheel', 'mousewheel'].includes(event)) {
    options = { ...options, passive: true };
  }
  
  element.addEventListener(event, handler, options);
  
  // Return function to remove listener
  return () => element.removeEventListener(event, handler);
}

// Detect high-end vs. low-end devices for adaptive performance
export function detectDeviceCapability(): 'high' | 'medium' | 'low' {
  const memory = (navigator as any).deviceMemory || 4; // Default to 4GB if not available
  const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores if not available
  const connection = (navigator as any).connection?.effectiveType || '4g'; // Default to 4G
  
  // Low-end device detection
  if (
    memory <= 2 || 
    cores <= 2 || 
    connection === 'slow-2g' || 
    connection === '2g'
  ) {
    return 'low';
  }
  
  // High-end device detection
  if (
    memory >= 8 && 
    cores >= 6 && 
    (connection === '4g' || connection === 'wifi')
  ) {
    return 'high';
  }
  
  // Medium-end device (default)
  return 'medium';
}

// Scale performance based on device capability
export function getAdaptiveConfig(deviceCapability: 'high' | 'medium' | 'low') {
  return {
    // Animation settings
    enableComplexAnimations: deviceCapability !== 'low',
    animationFramesPerSecond: deviceCapability === 'high' ? 60 : deviceCapability === 'medium' ? 30 : 15,
    
    // Rendering settings
    enableParallaxEffects: deviceCapability !== 'low',
    enableBlurEffects: deviceCapability === 'high',
    
    // Performance settings
    chunkSize: deviceCapability === 'high' ? 10 : deviceCapability === 'medium' ? 5 : 3,
    debounceWait: deviceCapability === 'high' ? 100 : deviceCapability === 'medium' ? 200 : 300,
    throttleLimit: deviceCapability === 'high' ? 50 : deviceCapability === 'medium' ? 100 : 200,
    
    // Resource loading
    lazyLoadDistance: deviceCapability === 'high' ? '500px' : deviceCapability === 'medium' ? '300px' : '100px',
    preloadAssets: deviceCapability === 'high',
  };
}

/**
 * A shared IntersectionObserver manager that reduces the number of observers created.
 * This significantly improves performance, especially on mobile devices.
 */
export class SharedIntersectionObserver {
  private static instance: SharedIntersectionObserver;
  private observers: Map<string, IntersectionObserver> = new Map();
  private elements: Map<Element, Set<(entry: IntersectionObserverEntry) => void>> = new Map();
  private rootObserverCallbacks: Map<string, Set<(entries: IntersectionObserverEntry[]) => void>> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance of the SharedIntersectionObserver
   */
  public static getInstance(): SharedIntersectionObserver {
    if (!SharedIntersectionObserver.instance) {
      SharedIntersectionObserver.instance = new SharedIntersectionObserver();
    }
    return SharedIntersectionObserver.instance;
  }

  /**
   * Create a key to identify observers with the same options
   */
  private getObserverKey(options: IntersectionObserverInit = {}): string {
    const rootId = options.root ? (options.root as Element).id || 'root' : 'document';
    const rootMargin = options.rootMargin || '0px';
    const threshold = JSON.stringify(options.threshold || 0);
    return `${rootId}-${rootMargin}-${threshold}`;
  }

  /**
   * Get or create an observer with the given options
   */
  private getObserver(options: IntersectionObserverInit = {}): IntersectionObserver {
    const key = this.getObserverKey(options);
    
    if (!this.observers.has(key)) {
      // Create a new observer with these options
      const observer = new IntersectionObserver((entries) => {
        // Process all entries
        entries.forEach(entry => {
          // Call individual element callbacks
          const callbacks = this.elements.get(entry.target);
          if (callbacks) {
            callbacks.forEach(callback => callback(entry));
          }
        });
        
        // Call any root observer callbacks
        const rootCallbacks = this.rootObserverCallbacks.get(key);
        if (rootCallbacks && rootCallbacks.size > 0) {
          rootCallbacks.forEach(callback => callback(entries));
        }
      }, options);
      
      this.observers.set(key, observer);
      this.rootObserverCallbacks.set(key, new Set());
    }
    
    return this.observers.get(key)!;
  }

  /**
   * Observe an element with the given callback and options
   */
  public observe(
    element: Element, 
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ): () => void {
    // Get the appropriate observer
    const observer = this.getObserver(options);
    
    // Store the callback for this element
    if (!this.elements.has(element)) {
      this.elements.set(element, new Set());
      // Start observing the element
      observer.observe(element);
    }
    
    // Add this callback to the element's callbacks
    this.elements.get(element)!.add(callback);
    
    // Return function to stop observing
    return () => {
      this.unobserve(element, callback, options);
    };
  }

  /**
   * Add a callback that will be called with all entries for an observer
   */
  public observeRoot(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): () => void {
    const key = this.getObserverKey(options);
    const observer = this.getObserver(options);
    
    // Make sure we have a set for this observer
    if (!this.rootObserverCallbacks.has(key)) {
      this.rootObserverCallbacks.set(key, new Set());
    }
    
    // Add this callback to the root callbacks
    this.rootObserverCallbacks.get(key)!.add(callback);
    
    // Return function to remove this callback
    return () => {
      const callbacks = this.rootObserverCallbacks.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Stop observing an element with the given callback and options
   */
  public unobserve(
    element: Element, 
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ): void {
    const key = this.getObserverKey(options);
    const observer = this.observers.get(key);
    if (!observer) return;
    
    // Remove this callback from the element's callbacks
    const callbacks = this.elements.get(element);
    if (callbacks) {
      callbacks.delete(callback);
      
      // If no more callbacks for this element, stop observing it
      if (callbacks.size === 0) {
        this.elements.delete(element);
        observer.unobserve(element);
      }
    }
  }

  /**
   * Disconnect all observers and clear all callbacks
   */
  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.elements.clear();
    this.rootObserverCallbacks.clear();
  }
}

/**
 * Convenience function to observe an element with the shared observer
 */
export function observeElement(
  element: Element,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
): () => void {
  return SharedIntersectionObserver.getInstance().observe(
    element,
    (entry) => callback(entry.isIntersecting),
    options
  );
}

/**
 * Convenience function for lazy loading
 */
export function lazyLoad(
  element: Element,
  onIntersect: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px', threshold: 0 }
): () => void {
  let hasIntersected = false;
  
  return observeElement(
    element,
    (isIntersecting) => {
      if (isIntersecting && !hasIntersected) {
        hasIntersected = true;
        onIntersect();
      }
    },
    options
  );
}

/**
 * Efficiently detects touch/mobile devices by feature rather than user agent
 * This is more reliable than UA sniffing
 */
export function isTouch(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    ((navigator as any).msMaxTouchPoints > 0)
  );
}

/**
 * Optimizes event listeners for better performance
 * Ensures touch events and scroll events are passive when possible
 */
export function setupPerformantEventListeners(): void {
  if (typeof window === 'undefined') return;
  
  // DIAGNOSTIC: Add a flag to check if setup has already been called
  if ((window as any).__performantEventListenersSetup) {
    console.warn('[Diagnostic] setupPerformantEventListeners called multiple times. Skipping to prevent recursion.');
    return;
  }
  
  // Mark that setup has been performed
  (window as any).__performantEventListenersSetup = true;
  
  // DIAGNOSTIC: Add listener count tracking
  (window as any).__eventListenerCount = (window as any).__eventListenerCount || {};
  
  console.log('[Diagnostic] Setting up performant event listeners');
  
  // Events that should be passive for better scrolling performance
  const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll'];
  
  // Add passive listeners for these events to document
  passiveEvents.forEach(event => {
    document.addEventListener(event, () => {}, { passive: true });
    
    // DIAGNOSTIC: Track listener
    (window as any).__eventListenerCount[event] = ((window as any).__eventListenerCount[event] || 0) + 1;
    console.log(`[Diagnostic] Added passive listener for ${event}. Count: ${(window as any).__eventListenerCount[event]}`);
  });
  
  // DIAGNOSTIC: Check if addEventListener has already been modified
  if ((window as any).originalAddEventListener) {
    console.warn('[Diagnostic] window.addEventListener already overridden! Using existing override to prevent recursion.');
    return;
  }
  
  // Add window resize throttle wrapper for better performance
  const originalAddEventListener = window.addEventListener;
  (window as any).originalAddEventListener = originalAddEventListener;
  
  console.log('[Diagnostic] Stored original addEventListener');
  
  // Replace addEventListener to automatically throttle resize/scroll events
  window.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    // DIAGNOSTIC: Track event listener registration
    (window as any).__eventListenerCount[type] = ((window as any).__eventListenerCount[type] || 0) + 1;
    
    // Add safety check for recursive calls
    if ((window as any).__inAddEventListener) {
      console.error(`[Diagnostic] Recursive addEventListener call detected for ${type}. Using original to prevent stack overflow.`);
      return originalAddEventListener.call(this, type, listener, options);
    }
    
    // Set recursion guard
    (window as any).__inAddEventListener = true;
    
    try {
      // For resize and scroll events, automatically throttle them
      if (type === 'resize' || type === 'scroll') {
        // If it's an object event listener
        if (typeof listener === 'object' && listener.handleEvent) {
          const originalHandleEvent = listener.handleEvent.bind(listener);
          const throttledHandler = throttle((event: Event) => {
            originalHandleEvent(event);
          }, 100);
          const newListener = {
            ...listener,
            handleEvent: throttledHandler,
          };
          console.log(`[Diagnostic] Adding throttled object handler for ${type}. Count: ${(window as any).__eventListenerCount[type]}`);
          (window as any).originalAddEventListener.call(this, type, newListener, options);
        } else if (typeof listener === 'function') {
          // If it's a function listener
          const throttledFunction = throttle(listener as EventListener, 100);
          console.log(`[Diagnostic] Adding throttled function for ${type}. Count: ${(window as any).__eventListenerCount[type]}`);
          (window as any).originalAddEventListener.call(this, type, throttledFunction, options);
        }
      } else {
        // For all other events, proceed normally
        console.log(`[Diagnostic] Adding normal listener for ${type}. Count: ${(window as any).__eventListenerCount[type]}`);
        (window as any).originalAddEventListener.call(this, type, listener, options);
      }
    } finally {
      // Clear recursion guard
      (window as any).__inAddEventListener = false;
    }
  };
  
  // DIAGNOSTIC: Add a method to check listener stats
  (window as any).getEventListenerStats = function() {
    return { ...(window as any).__eventListenerCount };
  };
  
  console.log('[Diagnostic] Replaced addEventListener with optimized version');
  
  // Optimize RAF for animation frames
  setupOptimizedRAF();
}

/**
 * Optimizes requestAnimationFrame for smoother animations
 * Prevents multiple rAF calls in the same frame
 */
export function setupOptimizedRAF(): void {
  if (typeof window === 'undefined' || (window as any).rafOptimized) return;
  
  (window as any).rafOptimized = true;
  const originalRAF = window.requestAnimationFrame;
  const callbacks = new Map<number, (time: number) => void>();
  let nextId = 0;
  let scheduledId: number | null = null;
  
  // Replace requestAnimationFrame with a batched version
  window.requestAnimationFrame = function(callback: (time: number) => void): number {
    const myId = nextId++;
    callbacks.set(myId, callback);
    
    // If we haven't scheduled a frame yet, do so now
    if (scheduledId === null) {
      scheduledId = originalRAF((time) => {
        const callbacksToRun = new Map(callbacks);
        callbacks.clear();
        scheduledId = null;
        
        // Run all callbacks with the same timestamp
        callbacksToRun.forEach(callback => {
          try {
            callback(time);
          } catch (e) {
            console.error('Error in requestAnimationFrame callback:', e);
          }
        });
      });
    }
    
    return myId;
  };
  
  // Update cancelAnimationFrame to work with our system
  const originalCancel = window.cancelAnimationFrame;
  window.cancelAnimationFrame = function(id: number): void {
    callbacks.delete(id);
    if (callbacks.size === 0 && scheduledId !== null) {
      originalCancel(scheduledId);
      scheduledId = null;
    }
  };
}

/**
 * Master function to initialize all JavaScript performance optimizations
 * This function now includes safety checks to prevent duplicate initializations
 * and recursion detection
 */
export function initJavaScriptOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Safety check - don't initialize twice
  if ((window as any).__jsOptimizationsInitialized) {
    console.warn('[JS Optimization] JavaScript optimizations already initialized. Skipping to prevent conflicts.');
    return;
  }
  
  console.log('[JS Optimization] Initializing JavaScript optimizations');
  (window as any).__jsOptimizationsInitialized = true;
  
  // Check for mobile device to apply appropriate optimizations
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                  window.innerWidth < 768;
  
  try {
    // Initialize shared IntersectionObserver - safe for both mobile and desktop
    SharedIntersectionObserver.getInstance();
    console.log('[JS Optimization] Shared IntersectionObserver initialized');
    
    // Check for diagnostic tools - these take precedence if present
    const hasDiagnostics = typeof (window as any).__eventDiagnostics !== 'undefined' || 
                          typeof (window as any).__guardOriginalEventMethods !== 'undefined';
    
    // Only set up optimized event listeners if no diagnostics are running
    // and we're not on mobile (where it's known to cause issues)
    if (!hasDiagnostics && !isMobile) {
      console.log('[JS Optimization] Setting up performant event listeners (desktop mode)');
      setupPerformantEventListeners();
    } else if (isMobile) {
      console.log('[JS Optimization] Mobile device detected, using simplified event optimizations');
      // For mobile, just add passive event listeners directly
      const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll'];
      passiveEvents.forEach(event => {
        document.addEventListener(event, () => {}, { passive: true });
        window.addEventListener(event, () => {}, { passive: true });
      });
    } else {
      console.log('[JS Optimization] Event diagnostics active, skipping event listener optimizations');
    }
    
    // Safe optimizations for all devices
    optimizeLocalStorage();
    console.log('[JS Optimization] localStorage optimizations applied');
    
    // Only monitor long tasks on desktop for performance reasons
    if (!isMobile) {
      monitorLongTasks();
      console.log('[JS Optimization] Long task monitoring enabled (desktop only)');
    }
    
    // Use optimized RAF only on desktop - causes issues on some mobile browsers
    if (!isMobile) {
      setupOptimizedRAF();
      console.log('[JS Optimization] RAF optimizations enabled (desktop only)');
    }
    
    console.log('[JS Optimization] JavaScript optimizations successfully initialized');
    
    // Expose API to check initialization status
    (window as any).getJsOptimizationStatus = function() {
      return {
        initialized: true,
        timestamp: new Date().toISOString(),
        device: isMobile ? 'mobile' : 'desktop',
        features: {
          eventListenerOptimized: !isMobile && !hasDiagnostics,
          localStorageOptimized: true,
          longTasksMonitored: !isMobile,
          rafOptimized: !isMobile,
          intersectionObserverShared: true
        }
      };
    };
  } catch (error) {
    console.error('[JS Optimization] Error initializing JavaScript optimizations:', error);
    (window as any).__jsOptimizationsError = error;
  }
}

/**
 * Batches localStorage operations for better performance
 */
function optimizeLocalStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Create a memory cache to reduce actual localStorage operations
  const cache: Record<string, string> = {};
  let writeQueue: string[] = [];
  let writeScheduled = false;
  
  // Store original methods
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalGetItem = localStorage.getItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);
  
  // Replace setItem to use caching and batching
  localStorage.setItem = (key: string, value: string): void => {
    cache[key] = value;
    if (!writeQueue.includes(key)) {
      writeQueue.push(key);
    }
    
    if (!writeScheduled) {
      writeScheduled = true;
      setTimeout(flushWrites, 100);
    }
  };
  
  // Replace getItem to use cache when available
  localStorage.getItem = (key: string): string | null => {
    if (key in cache) {
      return cache[key];
    }
    
    // Cache miss, get from localStorage
    const value = originalGetItem(key);
    if (value !== null) {
      cache[key] = value;
    }
    return value;
  };
  
  // Replace removeItem to update cache
  localStorage.removeItem = (key: string): void => {
    delete cache[key];
    originalRemoveItem(key);
  };
  
  // Flush writes in batch
  function flushWrites(): void {
    const keysToWrite = [...writeQueue];
    writeQueue = [];
    writeScheduled = false;
    
    keysToWrite.forEach(key => {
      try {
        originalSetItem(key, cache[key]);
      } catch (e) {
        console.warn(`Failed to write ${key} to localStorage:`, e);
      }
    });
  }
  
  // Flush writes before page unload
  window.addEventListener('beforeunload', () => {
    if (writeQueue.length > 0) {
      flushWrites();
    }
  });
}

/**
 * Monitors long tasks (>50ms) that might cause jank
 */
function monitorLongTasks(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    const longTasks: {duration: number, startTime: number}[] = [];
    
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        longTasks.push({
          duration: entry.duration,
          startTime: entry.startTime
        });
        
        // Alert about very long tasks (>100ms)
        if (entry.duration > 100) {
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms at ${entry.startTime.toFixed(2)}ms`);
        }
      });
      
      // Keep only the last 10 tasks
      if (longTasks.length > 10) {
        longTasks.splice(0, longTasks.length - 10);
      }
    });
    
    observer.observe({ type: 'longtask', buffered: true });
    
    // Add API to inspect long tasks
    (window as any).getLongTasks = () => {
      return [...longTasks];
    };
  } catch (e) {
    console.warn('Long task monitoring not supported:', e);
  }
}
