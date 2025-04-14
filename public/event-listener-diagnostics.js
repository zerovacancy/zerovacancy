/**
 * Event Listener Diagnostics
 * 
 * This script monitors event listener registration across the application
 * and helps identify patterns that could lead to recursion or performance issues.
 */

// Update service worker if available
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    // Send update message to force service worker refresh
    registration.active.postMessage({ type: 'SKIP_WAITING' });
    
    console.log('[Event Diagnostics] Service worker update requested');
  }).catch(err => {
    console.warn('[Event Diagnostics] Service worker update failed:', err);
  });
}

// Hook monitoring for admin pages
if (window.location.pathname.includes('/admin/')) {
  console.log('[Event Diagnostics] Running admin page diagnostics');
  
  // Add React hook consistency monitoring
  window.__REACT_HOOK_MONITOR = {
    hookCalls: {},
    logHookCall: function(componentName, hookName) {
      if (!this.hookCalls[componentName]) {
        this.hookCalls[componentName] = {};
      }
      if (!this.hookCalls[componentName][hookName]) {
        this.hookCalls[componentName][hookName] = 0;
      }
      this.hookCalls[componentName][hookName]++;
    },
    reset: function() {
      this.hookCalls = {};
    }
  };
}

(function() {
  console.log('[Event Diagnostics] Initializing event listener monitoring');
  
  // Store statistics
  window.__eventDiagnostics = {
    // Track total listeners registered
    listenerCount: {},
    
    // Track listener registrations by location
    registrationSites: {},
    
    // Track recursive registrations
    recursiveRegistrations: [],
    
    // Track registration patterns
    registrationPatterns: {},
    
    // Current registration stack depth
    currentStackDepth: 0,
    
    // Maximum observed stack depth
    maxStackDepth: 0
  };
  
  // Keep track of event registrations in the current event handling cycle
  let currentEvent = null;
  let registrationsDuringEvents = {};
  
  // Save original methods before any other script modifies them
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
  
  // Store for later reference and restoration
  window.__originalEventMethods = {
    addEventListener: originalAddEventListener,
    removeEventListener: originalRemoveEventListener,
    dispatchEvent: originalDispatchEvent
  };
  
  /**
   * Get a simplified stack trace to identify registration sites
   */
  function getStackTrace() {
    try {
      throw new Error('Stack trace');
    } catch (e) {
      // Extract and simplify the stack
      return e.stack
        .split('\n')
        .slice(2, 7) // Take 5 relevant frames
        .map(line => line.trim())
        .join(' -> ');
    }
  }
  
  /**
   * Monitor addEventListener to track registrations
   */
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Skip tracking for empty listeners (like the ones added for passive detection)
    if (listener && typeof listener === 'function' && listener.toString() === '() => {}') {
      return originalAddEventListener.call(this, type, listener, options);
    }
    
    // Track statistics
    window.__eventDiagnostics.listenerCount[type] = (window.__eventDiagnostics.listenerCount[type] || 0) + 1;
    
    // Get registration site
    const stackTrace = getStackTrace();
    if (!window.__eventDiagnostics.registrationSites[type]) {
      window.__eventDiagnostics.registrationSites[type] = {};
    }
    window.__eventDiagnostics.registrationSites[type][stackTrace] = 
      (window.__eventDiagnostics.registrationSites[type][stackTrace] || 0) + 1;
    
    // Check if we're registering inside an event handler (potential recursion)
    if (currentEvent) {
      if (!registrationsDuringEvents[currentEvent]) {
        registrationsDuringEvents[currentEvent] = {};
      }
      if (!registrationsDuringEvents[currentEvent][type]) {
        registrationsDuringEvents[currentEvent][type] = 0;
      }
      registrationsDuringEvents[currentEvent][type]++;
      
      // Log potential recursive registration pattern
      const pattern = `${currentEvent} handler registers ${type}`;
      window.__eventDiagnostics.registrationPatterns[pattern] = 
        (window.__eventDiagnostics.registrationPatterns[pattern] || 0) + 1;
      
      console.warn(`[Event Diagnostics] Potential recursive pattern: ${pattern} (${window.__eventDiagnostics.registrationPatterns[pattern]} times)`);
      
      // Add to recursive registrations list
      window.__eventDiagnostics.recursiveRegistrations.push({
        triggeringEvent: currentEvent,
        registeredEvent: type,
        stack: stackTrace,
        timestamp: Date.now()
      });
    }
    
    // Track stack depth
    window.__eventDiagnostics.currentStackDepth++;
    window.__eventDiagnostics.maxStackDepth = Math.max(
      window.__eventDiagnostics.maxStackDepth, 
      window.__eventDiagnostics.currentStackDepth
    );
    
    // Call original with monitoring
    try {
      if (typeof listener === 'function') {
        // Wrap the listener to detect handlers that register more events
        const wrappedListener = function(event) {
          const previousEvent = currentEvent;
          currentEvent = type;
          try {
            return listener.apply(this, arguments);
          } finally {
            currentEvent = previousEvent;
          }
        };
        return originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
        // For object listeners
        return originalAddEventListener.call(this, type, listener, options);
      }
    } finally {
      window.__eventDiagnostics.currentStackDepth--;
    }
  };
  
  /**
   * Monitor removeEventListener
   */
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    // Track statistics
    if (window.__eventDiagnostics.listenerCount[type]) {
      window.__eventDiagnostics.listenerCount[type]--;
    }
    
    // Call original
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  /**
   * Provide a method to get diagnostics report
   */
  window.getEventListenerDiagnostics = function() {
    return {
      totalListeners: Object.entries(window.__eventDiagnostics.listenerCount)
        .reduce((sum, [type, count]) => sum + count, 0),
      byEventType: { ...window.__eventDiagnostics.listenerCount },
      topRegistrationSites: Object.entries(window.__eventDiagnostics.registrationSites)
        .reduce((result, [type, sites]) => {
          result[type] = Object.entries(sites)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([site, count]) => ({ site, count }));
          return result;
        }, {}),
      recursivePatterns: { ...window.__eventDiagnostics.registrationPatterns },
      recentRecursiveRegistrations: window.__eventDiagnostics.recursiveRegistrations
        .slice(-5),
      maxStackDepth: window.__eventDiagnostics.maxStackDepth,
      registrationsDuringEvents: { ...registrationsDuringEvents }
    };
  };
  
  /**
   * Provide a method to restore original addEventListener
   */
  window.restoreEventListeners = function() {
    EventTarget.prototype.addEventListener = originalAddEventListener;
    EventTarget.prototype.removeEventListener = originalRemoveEventListener;
    EventTarget.prototype.dispatchEvent = originalDispatchEvent;
    console.log('[Event Diagnostics] Restored original event listener methods');
  };
  
  // Report initial setup
  console.log('[Event Diagnostics] Event listener monitoring active');
  console.log('[Event Diagnostics] Use window.getEventListenerDiagnostics() to see statistics');
  console.log('[Event Diagnostics] Use window.restoreEventListeners() to restore original methods');
})();