import React, { lazy, Suspense, useEffect, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
// Import our temporary environment checker (dev only)
import EnvChecker from './check-env-browser';
// Import from mobile utils for better SSR compatibility 
import { isMobileDevice } from '@/utils/mobile-optimization';
import { reduceAnimationComplexity } from '@/utils/mobile-optimization';
import { initializeViewport } from '@/utils/viewport-config';
import { initMobileSafety } from '@/utils/mobile-safety';
import { initJavaScriptOptimizations } from '@/utils/js-optimization';
import { initMobileImageOptimization } from '@/utils/mobile-image-optimizer';
import { initRenderingSystem, auditFixedElements } from '@/utils/rendering-system';
// Import CLS prevention hooks
import { useStableViewportHeight, monitorLayoutShift } from '@/utils/web-vitals';
// Import ConditionalBottomNav component
import ConditionalBottomNav from '@/components/ConditionalBottomNav';
// Import CSS module for header styling
import './styles/header-navigation.css';
// Lazy-load Analytics to reduce initial bundle size
// Only load if explicitly enabled in environment
const LazyAnalytics = React.lazy(() => {
  // Check if analytics is enabled via environment variable
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  
  return analyticsEnabled 
    ? import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics }))
    : Promise.resolve({ default: () => null }); // Return empty component if disabled
});
import { SEOProvider } from '@/components/SEO';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { CookieConsent } from '@/components/ui/cookie-consent';
import FontLoader from '@/components/FontLoader';
import CriticalPreload from '@/components/CriticalPreload';
import FOUCPrevention from '@/components/FOUCPrevention';
import { AuthProvider } from '@/components/auth/AuthContext';
import AuthForms from '@/components/auth/AuthForms';

const Index = lazy(() => import('./pages/index'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Terms = lazy(() => import('./pages/Terms'));
const Account = lazy(() => import('./pages/Account'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const CreatorDashboard = lazy(() => import('./pages/creator/Dashboard'));
const PropertyDashboard = lazy(() => import('./pages/property/Dashboard'));
const ConnectSuccess = lazy(() => import('./pages/ConnectSuccess'));
const ConnectRefresh = lazy(() => import('./pages/ConnectRefresh'));
const ConnectOnboarding = lazy(() => import('./pages/ConnectOnboarding'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogTest = lazy(() => import('./pages/blog-test'));
const BlogAdmin = lazy(() => import('./pages/admin/BlogAdmin'));
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-16 h-16 relative">
        <div className="w-full h-full rounded-full border-4 border-purple-100"></div>
        <div className="w-full h-full rounded-full border-4 border-brand-purple animate-spin absolute top-0 left-0 border-t-transparent"></div>
      </div>
    </div>
  );
};

const ScrollToTopComponent = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    if (location.hash && (navigationType === 'PUSH' || navigationType === 'REPLACE')) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else if (!location.hash && navigationType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [location, navigationType]);
  
  return null;
};


function App() {
  // Use the direct function instead of the hook for better SSR compatibility
  const [isMobile, setIsMobile] = useState(false);
  
  // Use the stable viewport height hook for CLS prevention
  const { vh, windowHeight, isStabilized, fixBottomNav } = useStableViewportHeight();
  
  // Initialize mobile detection after mount - memoize the resize handler
  const handleResize = useCallback(() => {
    setIsMobile(isMobileDevice());
    
    // Ensure bottom nav is correctly positioned on resize
    fixBottomNav();
  }, [fixBottomNav]);
  
  // Define setVh callback outside of useEffect (deprecated, kept for compatibility)
  const setVh = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  
  // Create passive event handler outside of useEffect
  const passiveEventHandler = useCallback(() => {}, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial mobile state
      setIsMobile(isMobileDevice());
      
      // Add resize listener to update mobile state
      window.addEventListener('resize', handleResize, { passive: true });
      
      // Initialize CLS monitoring in development or if debug parameter is present
      // Create a separate error boundary for CLS monitoring to prevent app crashes
      let stopMonitoring: (() => void) | undefined;

      if (import.meta.env.DEV || window.location.search.includes('debug=')) {
        try {
          // Create a CLS monitoring script element that runs in isolation
          const clsMonitoringScript = document.createElement('script');
          clsMonitoringScript.id = 'cls-monitoring-script';

          // Inject CLS monitoring code as inline script to isolate it from React
          clsMonitoringScript.textContent = `
            (function() {
              try {
                // This will load the verify-cls-improvements.js script which has its own error handling
                const script = document.createElement('script');
                script.src = '/verify-cls-improvements.js';
                script.async = true;
                script.onerror = function() {
                  console.warn('Failed to load CLS monitoring script');
                };
                document.head.appendChild(script);
              } catch (err) {
                console.warn('Error setting up CLS monitoring:', err);
              }
            })();
          `;

          // Add the script to the document
          document.head.appendChild(clsMonitoringScript);

          // Also initialize the normal monitoring but with try/catch
          try {
            const debug = window.location.search.includes('debug=cls') ||
                        window.location.search.includes('debug=all');

            stopMonitoring = monitorLayoutShift({
              debugMode: debug,
              reportCallback: (shift) => {
                if (shift.value > 0.05) {
                  console.warn('Significant layout shift detected:', shift);
                }
              }
            });
          } catch (err) {
            console.warn('Error in CLS monitoring:', err);
          }
        } catch (err) {
          console.warn('Failed to set up CLS monitoring:', err);
        }

        return () => {
          window.removeEventListener('resize', handleResize);
          if (stopMonitoring) stopMonitoring();

          // Clean up the script
          const monitoringScript = document.getElementById('cls-monitoring-script');
          if (monitoringScript && monitoringScript.parentNode) {
            monitoringScript.parentNode.removeChild(monitoringScript);
          }
        };
      }
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize]);
  
  useEffect(() => {
    // Add a direct style override for hero heights
    const heroHeightOverride = document.createElement('style');
    heroHeightOverride.id = 'hero-height-override';
    heroHeightOverride.innerHTML = `
      /* Direct override for any Core Web Vitals setting min-height */
      @media (max-width: 768px) {
        #hero, div#hero, .hero-height-reset, [id="hero"] {
          min-height: 100vh !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          max-height: none !important;
          padding-top: 10px !important; /* Reduced spacing from header */
        }
      }
      
      @media (min-width: 769px) {
        #hero, div#hero, .hero-height-reset, [id="hero"] {
          min-height: auto !important;
          height: auto !important;
          max-height: none !important;
        }
      }
      
      /* Target for performance optimizations */
      .hero-height-reset * {
        min-height: auto !important;
      }
      
      /* Override for sections that might have explicit heights */
      @media (max-width: 768px) {
        section[id="hero"], section.hero, section[class*="hero"] {
          min-height: 100vh !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
        }
      }
      
      @media (min-width: 769px) {
        section[id="hero"], section.hero, section[class*="hero"] {
          min-height: auto !important;
          height: auto !important;
        }
      }
    `;
    document.head.appendChild(heroHeightOverride);
    
    // Initialize mobile optimizations - in order of importance
    initializeViewport();
    initMobileSafety();
    reduceAnimationComplexity();
    
    // Initialize the rendering system to fix header positioning issues
    initRenderingSystem();
    
    // Run audit for fixed elements with bottom values
    setTimeout(() => {
      auditFixedElements();
    }, 2000);
    
    // Initialize all JavaScript optimizations 
    // This includes the shared intersection observer, event handling,
    // and performance monitoring
    initJavaScriptOptimizations();
    
    // Initialize mobile image optimization
    // This sets up responsive images and uses mobile-specific versions
    initMobileImageOptimization();
    
    // Initialize Web Vitals monitoring based on environment
    // Wrapped in a separate ErrorBoundary to prevent errors from breaking the entire app
    const WebVitalsMonitoring = () => {
      useEffect(() => {
        if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_VITALS === 'true') {
          import('./utils/web-vitals').then(({ initWebVitalsMonitoring }) => {
            initWebVitalsMonitoring();
          }).catch(err => console.warn('Failed to initialize Web Vitals monitoring:', err));
        } else {
          // In production, we still want to report vitals but not show the UI
          import('./utils/web-vitals').then(({ reportWebVitals }) => {
            const samplingRate = import.meta.env.VITE_VITALS_SAMPLING_RATE
              ? parseFloat(import.meta.env.VITE_VITALS_SAMPLING_RATE)
              : 0.1; // Default to tracking 10% of users

            reportWebVitals(undefined, {
              samplingRate,
              debug: false
            });
          }).catch(err => console.warn('Failed to initialize Web Vitals reporting:', err));
        }
      }, []);

      return null;
    };

    // Mount the monitoring component with its own error boundary
    const WebVitalsMonitoringWithErrorBoundary = document.createElement('div');
    WebVitalsMonitoringWithErrorBoundary.id = 'web-vitals-container';
    document.body.appendChild(WebVitalsMonitoringWithErrorBoundary);

    try {
      // Using this approach to avoid React interference with the main app
      // This isolates the Web Vitals monitoring to prevent it from affecting the main app
      const WebVitalsScript = document.createElement('script');
      WebVitalsScript.textContent = `
        (function() {
          try {
            // Load web-vitals as an isolated script
            const script = document.createElement('script');
            script.src = '/assets/js/web-vitals.iife.js';
            script.async = true;

            // Add robust error handling with multiple fallbacks
            script.onerror = function() {
              console.warn('Failed to load web-vitals.iife.js from /assets/js/, trying fallback...');

              // First try unpkg CDN (most reliable)
              const fallbackScript = document.createElement('script');
              fallbackScript.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
              fallbackScript.async = true;

              // Add another fallback if the first one fails
              fallbackScript.onerror = function() {
                console.warn('Failed to load web-vitals from unpkg, trying jsDelivr fallback...');

                // Try jsDelivr as a second CDN fallback
                const jsdelivrScript = document.createElement('script');
                jsdelivrScript.src = 'https://cdn.jsdelivr.net/npm/web-vitals@3/dist/web-vitals.iife.js';
                jsdelivrScript.async = true;
                jsdelivrScript.onerror = function() {
                  console.warn('Failed to load web-vitals from all locations');
                };
                document.head.appendChild(jsdelivrScript);
              };

              document.head.appendChild(fallbackScript);
            };

            document.head.appendChild(script);
          } catch (e) {
            console.warn('Failed to initialize isolated Web Vitals:', e);
          }
        })();
      `;
      document.head.appendChild(WebVitalsScript);
    } catch (e) {
      console.warn('Failed to add Web Vitals monitoring:', e);
    }
    
    // Initialize viewport configuration which handles landscape mode
    const cleanupViewport = initializeViewport();
    
    const timer = setTimeout(() => {
      import('./pages/index');
    }, 200);
    
    // Only add passive touch events if needed for mobile
    // This prevents unnecessary event listeners on desktop browsers
    if (isMobile) {
      const passiveOption = { passive: true };
      document.addEventListener('touchstart', passiveEventHandler, passiveOption);
      document.addEventListener('touchmove', passiveEventHandler, passiveOption);
    }
    
    if (isMobile) {
      document.body.classList.add('optimize-animations-mobile');
    } else {
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
    }
    
    // Set viewport height initially
    setVh();
    
    // Add event listeners for viewport height changes
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', setVh, { passive: true });
    
    return () => {
      clearTimeout(timer);
      // Only remove events that were added
      if (isMobile) {
        document.removeEventListener('touchstart', passiveEventHandler);
        document.removeEventListener('touchmove', passiveEventHandler);
      }
      
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
      
      // Remove our height override style
      const heroHeightStyle = document.getElementById('hero-height-override');
      if (heroHeightStyle && heroHeightStyle.parentNode) {
        heroHeightStyle.parentNode.removeChild(heroHeightStyle);
      }
      
      if (cleanupViewport) cleanupViewport();
      
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [isMobile, passiveEventHandler, setVh]);

  return (
    <SEOProvider>
      {/* Only render EnvChecker in development */}
      {import.meta.env.DEV && <EnvChecker />}
      <Router>
        <AuthProvider>
          {/* Only wrap the CLS reporter with an ErrorBoundary */}
          <>
            {/* Web Vitals monitoring with its own error boundary */}
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={(error) => {
                console.warn('Web Vitals Error (contained):', error);
                // Re-throw if it's a fatal error that should crash the app
                if (error && error.message && error.message.includes('FATAL:')) {
                  throw error;
                }
              }}
            >
              <div id="web-vitals-monitoring" style={{ display: 'none' }}>
                {/* This component is isolated so errors don't affect the main app */}
                {import.meta.env.DEV && <Suspense fallback={null}>
                  <LazyAnalytics />
                </Suspense>}
              </div>
            </ErrorBoundary>

            {/* Critical performance components */}
            <FOUCPrevention />
            <FontLoader />
            <CriticalPreload />
            <ScrollToTop />
            <ScrollProgress />
            <ScrollToTopComponent />

            <div className="min-h-screen flex flex-col relative">
              {/* Nothing in this div has overflow:hidden or contain properties */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/blog-test" element={<BlogTest />} />

                  {/* Auth Routes */}
                  <Route path="/account" element={<Account />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/signup" element={<Navigate to="/" replace />} />

                  {/* Dashboard Routes */}
                  <Route path="/creator/dashboard" element={<CreatorDashboard />} />
                  <Route path="/property/dashboard" element={<PropertyDashboard />} />

                  {/* Connect Routes */}
                  <Route path="/connect/success" element={<ConnectSuccess />} />
                  <Route path="/connect/refresh" element={<ConnectRefresh />} />
                  <Route path="/connect/onboarding" element={<ConnectOnboarding />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/hidden-admin-login" element={<AdminLogin />} />
                  <Route path="/admin/blog" element={<BlogAdmin />} />
                  <Route path="/admin/blog/new" element={<BlogEditor />} />
                  <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <ConditionalBottomNav />
            </div>

            {/* UI elements that should be outside any containment and won't break the app */}
            <CookieConsent />
            <Toaster />
            <SonnerToaster
              position="top-right"
              closeButton
              richColors
              toastOptions={{
                duration: 3000
              }}
            />
            {/* Temporary environment checker */}
            <EnvChecker />
            <AuthForms />

            {/* Analytics with its own error boundary */}
            <ErrorBoundary
              FallbackComponent={() => null}
              onError={(error) => console.warn('Analytics Error:', error)}
            >
              <Suspense fallback={null}>
                <LazyAnalytics />
              </Suspense>
            </ErrorBoundary>
          </>
        </AuthProvider>
      </Router>
    </SEOProvider>
  );
}

export default App;