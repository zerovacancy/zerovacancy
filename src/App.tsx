
import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { mobileOptimizationClasses, optimizeMobileViewport, applyLandscapeOrientationFixes } from '@/utils/mobile-optimization';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Analytics } from '@vercel/analytics/react';
import { SEOProvider } from '@/components/SEO';

const Index = lazy(() => import('./pages/index'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Terms = lazy(() => import('./pages/Terms'));
const Account = lazy(() => import('./pages/Account'));
const ConnectSuccess = lazy(() => import('./pages/ConnectSuccess'));
const ConnectRefresh = lazy(() => import('./pages/ConnectRefresh'));
const ConnectOnboarding = lazy(() => import('./pages/ConnectOnboarding'));

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

const ScrollToTop = () => {
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
  const isMobile = useIsMobile();
  
  if (location.pathname === "/" || !isMobile) {
    return null;
  }
  
  return <BottomNav />;
};

function App() {
  const isMobile = useIsMobile();
  
  // Use memoized callback functions for event listeners
  const passiveEventHandler = useCallback(() => {}, []);
  
  useEffect(() => {
    // Always apply mobile viewport optimizations, regardless of device type
    optimizeMobileViewport();
    
    // Apply landscape orientation fixes
    const cleanupLandscapeFixes = applyLandscapeOrientationFixes();
    
    const timer = setTimeout(() => {
      import('./pages/index');
    }, 200);
    
    // Add event listeners with the same function references
    const passiveOption = { passive: true };
    document.addEventListener('touchstart', passiveEventHandler, passiveOption);
    document.addEventListener('touchmove', passiveEventHandler, passiveOption);
    document.addEventListener('wheel', passiveEventHandler, passiveOption);
    
    if (isMobile) {
      // Removed color-white-bg-mobile to prevent global purple background
      document.body.classList.add('optimize-animations-mobile');
    } else {
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
    }
    
    // Fix for viewport height issues on iOS
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initial calculation and setup event listener
    setVh();
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', setVh, { passive: true });
    
    return () => {
      clearTimeout(timer);
      // Remove event listeners using the same function references
      document.removeEventListener('touchstart', passiveEventHandler);
      document.removeEventListener('touchmove', passiveEventHandler);
      document.removeEventListener('wheel', passiveEventHandler);
      
      // Remove both classes for consistency, even though we're not adding color-white-bg-mobile anymore
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
      
      // Clean up the landscape orientation fixes
      if (cleanupLandscapeFixes) cleanupLandscapeFixes();
      
      // Clean up viewport height fix
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [isMobile, passiveEventHandler]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SEOProvider>
        <Router>
          <ScrollToTop />
          <div className="relative landscape-container">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/account" element={<Account />} />
              <Route path="/connect/success" element={<ConnectSuccess />} />
              <Route path="/connect/refresh" element={<ConnectRefresh />} />
              <Route path="/connect/onboarding" element={<ConnectOnboarding />} />
            </Routes>
          </Suspense>
          <ConditionalBottomNav />
        </div>
        <Toaster />
        {/* Only use SonnerToaster for error notifications, not for success */}
        <SonnerToaster 
          position="top-right" 
          closeButton 
          richColors
          toastOptions={{
            duration: 3000
          }} 
        />
        <Analytics />
      </Router>
      </SEOProvider>
    </ErrorBoundary>
  );
}

export default App;
