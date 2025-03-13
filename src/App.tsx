
import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { mobileOptimizationClasses, optimizeMobileViewport } from '@/utils/mobile-optimization';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

const Index = lazy(() => import('./pages/index'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Terms = lazy(() => import('./pages/Terms'));
const Account = lazy(() => import('./pages/Account'));
const ConnectSuccess = lazy(() => import('./pages/ConnectSuccess'));
const ConnectRefresh = lazy(() => import('./pages/ConnectRefresh'));
const ConnectOnboarding = lazy(() => import('./pages/ConnectOnboarding'));

const PageLoader = () => {
  const { gradientBgMobile } = mobileOptimizationClasses;
  const isMobile = useIsMobile();
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isMobile ? gradientBgMobile : 'bg-background'}`}>
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
  const { coloredBgMobile } = mobileOptimizationClasses;
  
  // Apply mobile optimization immediately for better responsiveness
  useEffect(() => {
    // Apply mobile optimization on mount, not conditionally
    optimizeMobileViewport();
    
    // Prefetch index page
    const timer = setTimeout(() => {
      import('./pages/index');
    }, 200);
    
    // Optimize event handlers for better touch response
    const passiveOption = { passive: true };
    document.addEventListener('touchstart', () => {}, passiveOption);
    document.addEventListener('touchmove', () => {}, passiveOption);
    
    if (isMobile) {
      document.body.classList.add('color-white-bg-mobile');
      document.body.classList.add('optimize-animations-mobile');
      
      // Set viewport scale on mobile for iOS
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
    };
  }, [isMobile]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <ScrollToTop />
        <div className={`relative min-h-screen overflow-x-hidden ${isMobile ? coloredBgMobile : ''}`}>
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
        <Analytics />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
