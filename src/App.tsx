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
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { AuthProvider } from '@/components/auth/AuthContext';

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
const BlogAdmin = lazy(() => import('./pages/admin/BlogAdmin'));
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
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
  const isMobile = useIsMobile();
  
  if (location.pathname === "/" || !isMobile) {
    return null;
  }
  
  return <BottomNav />;
};

function App() {
  const isMobile = useIsMobile();
  
  const passiveEventHandler = useCallback(() => {}, []);
  
  useEffect(() => {
    optimizeMobileViewport();
    
    const cleanupLandscapeFixes = applyLandscapeOrientationFixes();
    
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
      
      if (cleanupLandscapeFixes) cleanupLandscapeFixes();
      
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [isMobile, passiveEventHandler]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SEOProvider>
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <ScrollProgress />
            <ScrollToTopComponent />
            <div className="relative landscape-container">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/creator/dashboard" element={<CreatorDashboard />} />
                  <Route path="/property/dashboard" element={<PropertyDashboard />} />
                  <Route path="/connect/success" element={<ConnectSuccess />} />
                  <Route path="/connect/refresh" element={<ConnectRefresh />} />
                  <Route path="/connect/onboarding" element={<ConnectOnboarding />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/admin/blog" element={<BlogAdmin />} />
                  <Route path="/admin/blog/new" element={<BlogEditor />} />
                  <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <ConditionalBottomNav />
            </div>
            <CookieConsent />
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
          </AuthProvider>
        </Router>
      </SEOProvider>
    </ErrorBoundary>
  );
}

export default App;
