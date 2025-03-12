import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { mobileOptimizationClasses, optimizeMobileViewport } from '@/utils/mobile-optimization';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Analytics } from '@vercel/analytics/react';

const Index = lazy(() => import('./pages/index'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Account = lazy(() => import('./pages/Account'));
const ConnectSuccess = lazy(() => import('./pages/ConnectSuccess'));
const ConnectRefresh = lazy(() => import('./pages/ConnectRefresh'));
const ConnectOnboarding = lazy(() => import('./pages/ConnectOnboarding'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
  
  useEffect(() => {
    if (isMobile) {
      optimizeMobileViewport();
    }
    
    const timer = setTimeout(() => {
      import('./pages/index');
    }, 200);
    
    const passiveOption = { passive: true };
    document.addEventListener('touchstart', () => {}, passiveOption);
    document.addEventListener('touchmove', () => {}, passiveOption);
    document.addEventListener('wheel', () => {}, passiveOption);
    
    if (isMobile) {
      document.body.classList.add('color-white-bg-mobile');
      document.body.classList.add('optimize-animations-mobile');
    } else {
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
    }
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', () => {});
      document.removeEventListener('touchmove', () => {});
      document.removeEventListener('wheel', () => {});
      document.body.classList.remove('color-white-bg-mobile');
      document.body.classList.remove('optimize-animations-mobile');
    };
  }, [isMobile]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <ScrollToTop />
        <div className={`relative ${isMobile ? coloredBgMobile : ''}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/account" element={<Account />} />
              <Route path="/connect/success" element={<ConnectSuccess />} />
              <Route path="/connect/refresh" element={<ConnectRefresh />} />
              <Route path="/connect/onboarding" element={<ConnectOnboarding />} />
              <Route path="*" element={<NotFound />} />
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
