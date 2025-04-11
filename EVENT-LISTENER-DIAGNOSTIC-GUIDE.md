# Event Listener Diagnostic Guide

## Problem Overview

The ZeroVacancy website has experienced JavaScript errors on mobile devices related to event listener recursion. The root issue appears to be multiple scripts attempting to override `addEventListener`, resulting in infinite recursion and browser crashes.

Primary error observed:
```
RangeError: Maximum call stack size exceeded
at Da.window.addEventListener (index-BYAtUjMk.js:51:2771)
```

## Diagnostic Tools Added

To diagnose and prevent this issue, we've implemented the following diagnostic tools:

1. **Event Listener Guard** (`/public/event-listener-guard.js`)
   - Detects and prevents infinite recursion in event listener registrations
   - Monitors for rapid registration of the same event type
   - Automatically restores native addEventListener if recursion is detected
   - Provides diagnostic reporting via `window.getEventGuardStatus()`

2. **Event Listener Diagnostics** (`/public/event-listener-diagnostics.js`)
   - Tracks detailed statistics about all event listener registrations
   - Identifies potential recursive patterns (listeners registering more listeners)
   - Records stack traces of where listeners are registered
   - Provides reporting via `window.getEventListenerDiagnostics()`

3. **Enhanced Mobile Fix** (Update to `/public/mobile-fix.js`)
   - Added detailed logging of event listener state
   - Improved listener registration tracking
   - Added periodic monitoring to ensure addEventListener isn't overridden

4. **Enhanced JS Optimization** (Update to `/src/utils/js-optimization.ts`)
   - Added safety guards to prevent duplicate initialization
   - Added mobile-specific optimization paths
   - Added diagnostic logging for all operations
   - Added recursion detection in setupPerformantEventListeners()
   - Added runtime diagnostics with `window.getJsOptimizationStatus()`

## Root Causes Identified

1. **Multiple addEventListener Overrides**
   - In `js-optimization.ts`, the `setupPerformantEventListeners()` function overrides `window.addEventListener`
   - Other scripts or libraries may also be attempting to override or monkey-patch addEventListener
   - When these overrides interact, they can create infinite recursion

2. **Event Handler Recursion**
   - Event handlers that register more event listeners can create a chain reaction
   - Event handler A triggers → registers event handler B → which triggers and registers handler A again

3. **Mobile-Desktop Code Path Differences**
   - Different initialization paths for mobile vs desktop devices
   - Mobile-specific optimizations interacting with desktop optimizations

4. **Missing Singleton Pattern**
   - Some optimization functions were being called multiple times
   - Each call would re-initialize and re-override native functions

## How to Use the Diagnostic Tools

### Console Commands for Debugging

When the site is running, you can use these commands in the browser console:

1. Check event listener stats:
   ```javascript
   window.getEventListenerDiagnostics()
   ```

2. Check guard status and recursion reports:
   ```javascript
   window.getEventGuardStatus()
   ```

3. Check JS optimization status:
   ```javascript
   window.getJsOptimizationStatus()
   ```

4. Restore native addEventListener if needed:
   ```javascript
   window.restoreEventListeners()
   ```

### Analyzing the Reports

The listener diagnostics report includes:

- **totalListeners**: Total number of event listeners registered
- **byEventType**: Count of listeners by event type
- **topRegistrationSites**: Stack traces of where most listeners are registered
- **recursivePatterns**: Event handler → registration patterns that could cause loops
- **maxStackDepth**: Maximum observed call stack depth
- **registrationsDuringEvents**: Event registrations that occurred during event handling

The guard status report includes:

- **recoveryMode**: Whether emergency recovery mode is active
- **recoveryAttempts**: Count of times recursion was detected and fixed
- **topEventRegistrations**: Most frequently registered event types
- **reports**: Detailed logs of recursion incidents

## Implementation Summary

1. Diagnostic scripts are loaded early in the page lifecycle via index.html
2. Both scripts use safe patterns that won't interfere with each other
3. Original method references are stored for recovery
4. Monitoring and protection run throughout the page lifecycle
5. If recursion is detected, the site self-heals by restoring native methods

## Best Practices Moving Forward

1. **Never Override Native Browser Methods**
   - Instead of replacing addEventListener, use wrapper functions
   - If overriding is necessary, use proper method chaining

2. **Use Singleton Patterns for Global Services**
   - Ensure optimization functions are only initialized once
   - Use initialization flags to prevent duplicate setup

3. **Mobile-Specific Testing**
   - Test mobile optimizations separately from desktop
   - Use mobile emulation to verify fixes work

4. **Prevent Event Registration in Handlers**
   - Be cautious about registering event listeners within event handlers
   - Ensure event registration is idempotent (safe to call multiple times)

## Next Steps

1. Continue monitoring the console logs for recursion warnings
2. If recursion is detected, check which scripts are interacting
3. Consider permanently incorporating these diagnostic tools for production
4. Refactor `js-optimization.ts` to avoid overriding native browser methods
5. Implement a central event bus for better event management