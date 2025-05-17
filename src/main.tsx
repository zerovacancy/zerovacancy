// React hooks fix applied via package.json resolutions
// No need for complex singleton pattern

// Import React explicitly to ensure proper singleton instance is used
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';
import ErrorFallback from './components/ErrorFallback.tsx';
import { initializePerformanceOptimizations, mobilePerformanceEnhancements } from './utils/performance-optimizations';
import { setupCSSContainment } from './utils/css-optimization/init-containment';

/**
 * Initialize performance optimizations early
 */
// Determine if we're on a mobile device
let isMobile = false;

// Access window and navigator safely to avoid ReferenceErrors in non-browser environments
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    window.innerWidth < 768;
}

// Apply performance optimizations
if (typeof window !== 'undefined') {
  // Initialize performance optimizations
  initializePerformanceOptimizations();
  
  // Apply mobile-specific optimizations
  mobilePerformanceEnhancements(isMobile);
  
  // Initialize CSS containment optimizations
  setupCSSContainment();
  
  // Mark the start time for performance measurement
  window.performance.mark('app-init-start');
}

/**
 * Root application renderer with error boundary
 * This pattern helps to catch and handle global errors gracefully
 * Wrap in StrictMode only in development to avoid double rendering in production
 */
const root = createRoot(document.getElementById("root")!);

// Handle hydration errors by retrying with client-only rendering
try {
  root.render(
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the app state here
        window.location.href = '/';
      }}
      onError={(error) => {
        console.error("Root error boundary caught:", error);
        
        // If it's a hydration error, retry with client-only rendering
        if (error.message && error.message.includes("hydrat")) {
          console.log("Detected hydration error, falling back to client-only rendering");
          
          // Use a short timeout to allow React to clean up
          setTimeout(() => {
            root.unmount();
            root.render(<App key={Date.now()} />);
          }, 10);
        }
      }}
    >
      <App />
    </ErrorBoundary>
  );
  
  // Load text-fouc-fix.js after the app is mounted and only in production
  if (process.env.NODE_ENV === 'production') {
    // Ensure the header is mounted before applying FOUC fix
    setTimeout(() => {
      import('/public/text-fouc-fix.js')
        .catch(err => console.warn('Failed to load text-fouc-fix.js:', err));
    }, 100);
  }
} catch (error) {
  console.error("Error during initial render:", error);
  
  // Fallback to minimal UI
  root.render(
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Something went wrong</h1>
      <p>The application encountered an error. Please try reloading the page.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}

// Mark render complete
if (typeof window !== 'undefined') {
  // Use requestIdleCallback to avoid blocking main thread
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      window.performance.mark('app-init-end');
      window.performance.measure('app-initialization', 'app-init-start', 'app-init-end');
    });
  } else {
    setTimeout(() => {
      window.performance.mark('app-init-end');
      window.performance.measure('app-initialization', 'app-init-start', 'app-init-end');
    }, 0);
  }
}
