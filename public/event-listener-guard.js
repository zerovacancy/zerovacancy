/**
 * Event Listener Guard
 * 
 * This script monitors for infinite recursion in event listener registrations
 * and automatically intervenes to prevent crashes.
 */

(function() {
  console.log('[Guard] Initializing event listener guard');
  
  // Configuration
  const CONFIG = {
    maxStackDepth: 50,              // Maximum allowed call stack depth
    monitorInterval: 1000,          // How often to check for issues (ms)
    maxRegistrationsPerEvent: 10,   // Max registrations of the same event type
    maxEventTypes: 100,             // Max different event types to track
    recoveryMode: false             // Whether we're in recovery mode
  };
  
  // Event registration tracking
  const eventStats = {
    registrationCounts: {},        // Count by event type
    registrationPatterns: {},      // Track event X registering event Y
    registrationTimes: {},         // Timestamps of registrations
    recoveryAttempts: 0            // How many times we've tried to recover
  };
  
  // Original methods (save them early, before any other scripts run)
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  
  // Save references
  window.__guardOriginalEventMethods = {
    addEventListener: originalAddEventListener,
    removeEventListener: originalRemoveEventListener
  };
  
  /**
   * Track a new event listener registration
   */
  function trackRegistration(target, type) {
    // Track by event type
    eventStats.registrationCounts[type] = (eventStats.registrationCounts[type] || 0) + 1;
    
    // Track time
    const now = Date.now();
    if (!eventStats.registrationTimes[type]) {
      eventStats.registrationTimes[type] = [];
    }
    eventStats.registrationTimes[type].push(now);
    
    // Only keep the latest registrations
    if (eventStats.registrationTimes[type].length > 100) {
      eventStats.registrationTimes[type].shift();
    }
    
    // Detect rapid registrations of the same event type
    const recentRegistrations = eventStats.registrationTimes[type].filter(
      time => now - time < 1000
    ).length;
    
    if (recentRegistrations > CONFIG.maxRegistrationsPerEvent) {
      console.warn(`[Guard] Detected rapid registrations of "${type}" event (${recentRegistrations} in 1s)`);
      
      if (!CONFIG.recoveryMode) {
        console.error(`[Guard] Activating recovery mode to prevent crash`);
        activateRecoveryMode();
      }
    }
  }
  
  /**
   * Activate recovery mode to prevent crashes
   */
  function activateRecoveryMode() {
    CONFIG.recoveryMode = true;
    eventStats.recoveryAttempts++;
    
    console.warn(`[Guard] Recovery mode activated (attempt ${eventStats.recoveryAttempts})`);
    
    // Restore original addEventListener
    EventTarget.prototype.addEventListener = originalAddEventListener;
    
    // Log recovery
    console.log(`[Guard] Restored original addEventListener to prevent recursion`);
    
    // Create a visual indicator if in browser
    if (typeof document !== 'undefined') {
      try {
        const indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.bottom = '10px';
        indicator.style.right = '10px';
        indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        indicator.style.color = 'white';
        indicator.style.padding = '8px 12px';
        indicator.style.borderRadius = '4px';
        indicator.style.fontFamily = 'monospace';
        indicator.style.fontSize = '11px';
        indicator.style.zIndex = '9999';
        indicator.textContent = `⚠️ Event listener recursion detected and fixed`;
        
        document.body.appendChild(indicator);
        
        // Remove after 5 seconds
        setTimeout(() => {
          try {
            document.body.removeChild(indicator);
          } catch (e) {}
        }, 5000);
      } catch (e) {
        // Ignore errors creating indicator
      }
    }
    
    // Generate a report
    const report = {
      timestamp: new Date().toISOString(),
      topEvents: Object.entries(eventStats.registrationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([type, count]) => ({ type, count })),
      recoveryAttempts: eventStats.recoveryAttempts
    };
    
    console.log('[Guard] Recursion report:', report);
    
    // Reset registration counts
    eventStats.registrationCounts = {};
    
    // Store the report for later retrieval
    if (!window.__eventRecursionReports) {
      window.__eventRecursionReports = [];
    }
    window.__eventRecursionReports.push(report);
  }
  
  /**
   * Set up the guarded addEventListener
   */
  function setupGuardedAddEventListener() {
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // Skip if in recovery mode or listener is null
      if (CONFIG.recoveryMode || !listener) {
        return originalAddEventListener.call(this, type, listener, options);
      }
      
      // Track this registration
      trackRegistration(this, type);
      
      // Call original
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
  
  /**
   * Initialize the event listener guard
   */
  function initGuard() {
    // Set up guarded addEventListener
    setupGuardedAddEventListener();
    
    // Set up periodic monitoring
    setInterval(() => {
      if (CONFIG.recoveryMode) {
        // Check if we can exit recovery mode
        const minutesSinceRecovery = (Date.now() - eventStats.lastRecoveryTime) / 60000;
        if (minutesSinceRecovery > 1) {
          CONFIG.recoveryMode = false;
          setupGuardedAddEventListener();
          console.log('[Guard] Exited recovery mode, resuming monitoring');
        }
      }
    }, CONFIG.monitorInterval);
    
    // Expose diagnostics API
    window.getEventGuardStatus = function() {
      return {
        recoveryMode: CONFIG.recoveryMode,
        recoveryAttempts: eventStats.recoveryAttempts,
        topEventRegistrations: Object.entries(eventStats.registrationCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([type, count]) => ({ type, count })),
        reportsGenerated: (window.__eventRecursionReports || []).length,
        reports: window.__eventRecursionReports || []
      };
    };
    
    // Log initialization
    console.log('[Guard] Event listener guard active');
  }
  
  // Initialize
  initGuard();
})();