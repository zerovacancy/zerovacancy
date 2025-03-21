
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';
import ErrorFallback from './components/ErrorFallback.tsx';
import { initializePerformanceOptimizations, mobilePerformanceEnhancements } from './utils/performance-optimizations';

/**
 * Initialize performance optimizations early
 */
// Check if we're on a mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Apply performance optimizations
if (typeof window !== 'undefined') {
  // Initialize performance optimizations
  initializePerformanceOptimizations();
  
  // Apply mobile-specific optimizations
  mobilePerformanceEnhancements(isMobile);
  
  // Mark the start time for performance measurement
  window.performance.mark('app-init-start');
}

/**
 * Root application renderer with error boundary
 * This pattern helps to catch and handle global errors gracefully
 */
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary 
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // Reset the app state here
      window.location.href = '/';
    }}
  >
    <App />
  </ErrorBoundary>
);

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
