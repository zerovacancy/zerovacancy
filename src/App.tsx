
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from '@/components/ui/toaster';
import { MobileOptimizer } from './components/mobile/MobileOptimizer';

// Lazy load all pages for improved performance
const Index = lazy(() => import('./pages/index'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Terms = lazy(() => import('./pages/Terms'));
const Account = lazy(() => import('./pages/Account'));
const ConnectSuccess = lazy(() => import('./pages/ConnectSuccess'));
const ConnectRefresh = lazy(() => import('./pages/ConnectRefresh'));
const ConnectOnboarding = lazy(() => import('./pages/ConnectOnboarding'));

// Simple loading component to show during lazy loading
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="w-16 h-16 relative">
      <div className="w-full h-full rounded-full border-4 border-gray-200"></div>
      <div className="w-full h-full rounded-full border-4 border-blue-600 animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
  </div>
);

function App() {
  // Preload critical resources
  useEffect(() => {
    // Preload the Index component after initial render
    const timer = setTimeout(() => {
      import('./pages/index');
    }, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <MobileOptimizer>
          <div className="app-container relative">
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
          </div>
          <Toaster />
        </MobileOptimizer>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
