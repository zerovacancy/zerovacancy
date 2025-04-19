import React, { lazy, Suspense, useEffect, useCallback, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
// Import from mobile utils for better SSR compatibility 
import { isMobileDevice } from '@/utils/mobile-optimization';
import { mobileOptimizationClasses, reduceAnimationComplexity } from '@/utils/mobile-optimization';
import { initializeViewport } from '@/utils/viewport-config';
import { initMobileSafety } from '@/utils/mobile-safety';
import { SharedIntersectionObserver, initJavaScriptOptimizations } from '@/utils/js-optimization';
import { initMobileImageOptimization } from '@/utils/mobile-image-optimizer';
import { initRenderingSystem, auditFixedElements } from '@/utils/rendering-system';
import { BottomNav } from '@/components/navigation/BottomNav';
// Import CSS module for header styling
import './styles/header-navigation.css';
// Lazy-load Analytics to reduce initial bundle size
const LazyAnalytics = React.lazy(() =>
  import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics }))
);
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

const ConditionalBottomNav = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(isMobileDevice());
      
      const handleResize = () => {
        setIsMobile(isMobileDevice());
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  if (location.pathname === "/" || !isMobile) {
    return null;
  }
  
  return <BottomNav />;
};

function App() {
  // Use the direct function instead of the hook for better SSR compatibility
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialize mobile detection after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(isMobileDevice());
      
      // Add resize listener to update mobile state
      const handleResize = () => {
        setIsMobile(isMobileDevice());
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const passiveEventHandler = useCallback(() => {}, []);
  
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
    
    // Initialize Web Vitals monitoring - only in development
    if (process.env.NODE_ENV === 'development') {
      import('./utils/web-vitals').then(({ initWebVitalsMonitoring }) => {
        initWebVitalsMonitoring();
      }).catch(err => console.warn('Failed to initialize Web Vitals monitoring:', err));
    } else {
      // In production, we still want to report vitals but not show the UI
      import('./utils/web-vitals').then(({ reportWebVitals }) => {
        reportWebVitals(undefined, { 
          samplingRate: 0.1, // Only track 10% of users in production
          debug: false 
        });
      }).catch(err => console.warn('Failed to initialize Web Vitals reporting:', err));
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
    
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
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
  }, [isMobile, passiveEventHandler]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SEOProvider>
        <Router>
          <AuthProvider>
            {/* Critical performance components */}
            <FOUCPrevention />
            <FontLoader />
            <CriticalPreload />
            <ScrollToTop />
            <ScrollProgress />
            <ScrollToTopComponent />
            
            {/* Main content area - modified to ensure header works correctly */}
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
            
            {/* UI elements that should be outside any containment */}
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
            <AuthForms />
            <Suspense fallback={null}>
              <LazyAnalytics />
            </Suspense>
          </AuthProvider>
        </Router>
      </SEOProvider>
    </ErrorBoundary>
  );
}

export default App;