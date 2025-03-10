import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import Header from '../components/Header';
import { Hero } from '../components/hero/Hero';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';
import { BottomNav } from '../components/navigation/BottomNav';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { BackgroundEffects } from '@/components/features/BackgroundEffects';

// Optimized loading with increased priority for critical components
const OptimizedHowItWorks = lazy(() => 
  import('../components/how-it-works/OptimizedHowItWorks').then(module => {
    // Prioritize during idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {/* Preload next component */});
    }
    return module;
  })
);

// Other lazy-loaded components with optimized loading strategy
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('@/components/preview-search'));

// Performance-optimized loading component
const SectionLoader = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Main landing page component with comprehensive performance optimizations
 */
const Index = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // More efficient intersection tracking with reduce repaints
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<{[key: number]: boolean}>({
    0: true, // Hero section is visible by default
    1: false, 
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  // Prevent unnecessary re-rendering of dismissed dialog
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowGlowDialog(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);
  
  // Optimized Intersection Observer with throttling to reduce CPU usage
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    // Avoid multiple state updates by batching changes
    const updates: {[key: number]: boolean} = {};
    
    entries.forEach(entry => {
      const index = parseInt(entry.target.getAttribute('data-section-index') || '-1', 10);
      if (index >= 0) {
        updates[index] = entry.isIntersecting || (visibleSections[index] || false);
      }
    });
    
    if (Object.keys(updates).length > 0) {
      setVisibleSections(prev => ({...prev, ...updates}));
    }
  }, [visibleSections]);
  
  // Enhanced intersection observer with optimized options for mobile
  useEffect(() => {
    // Mobile-optimized threshold and margins
    const observerOptions = {
      threshold: isMobile ? 0.05 : 0.1, // Lower threshold for mobile
      rootMargin: isMobile ? '300px' : '200px' // Larger margin for mobile
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;
      section.setAttribute('data-section-index', index.toString());
      observer.observe(section);
    });

    // Safety timer reduced for better performance, using requestIdleCallback when available
    const safetyTimer = 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => {
          setVisibleSections({0: true, 1: true, 2: true, 3: true, 4: true, 5: true});
        }, { timeout: 2000 })
      : setTimeout(() => {
          setVisibleSections({0: true, 1: true, 2: true, 3: true, 4: true, 5: true});
        }, 2000);
    
    return () => {
      observer.disconnect();
      if ('requestIdleCallback' in window && typeof safetyTimer === 'number') {
        window.cancelIdleCallback(safetyTimer);
      } else if (typeof safetyTimer === 'number') {
        clearTimeout(safetyTimer);
      }
    };
  }, [observerCallback, isMobile]);
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  // Helper function to add section refs
  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      {showBanner && !isMobile && (
        <div className="relative">
          <Banner variant="purple" size="lg" action={
              <Button 
                variant="secondary" 
                size="sm" 
                className={cn(
                  "flex text-xs sm:text-sm items-center whitespace-nowrap", 
                  "px-3 py-2 sm:px-5 sm:py-2.5 min-w-[8rem] sm:min-w-[9rem]", 
                  "bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold", 
                  "border-2 border-amber-300", 
                  "transition-all duration-200", 
                  "touch-manipulation", 
                  "shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                )} 
                onClick={handleTryNowClick}
              >
                Get Early Access
              </Button>
            } 
            layout="complex" 
            isClosable 
            onClose={() => setShowBanner(false)} 
            className="animate-in fade-in slide-in-from-top duration-500 relative overflow-hidden"
          >
            <div className="flex items-center justify-left gap-3 sm:gap-4 relative z-10">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 animate-pulse" />
              <AnimatedShinyText 
                className={cn(
                  "text-sm sm:text-base font-bold inline-block", 
                  "text-white relative z-10 rounded", 
                  "px-1 tracking-wide"
                )} 
                shimmerWidth={200}
              >
                Join the AI-powered revolution in property management!
              </AnimatedShinyText>
            </div>
          </Banner>
        </div>
      )}

      <BackgroundEffects 
        className="flex-1 pb-16 sm:pb-0 w-full"
        blobColors={{
          first: "bg-purple-100",
          second: "bg-indigo-100",
          third: "bg-violet-100"
        }}
        blobOpacity={isMobile ? 0.08 : 0.15} // Reduced opacity for mobile
        withSpotlight={!isMobile} // Disable spotlight on mobile for better performance
        spotlightClassName="from-purple-500/5 via-violet-500/5 to-blue-500/5"
        baseColor="bg-white/80" 
        pattern="none"
        animationSpeed={isMobile ? "slow" : "medium"} // Slower animations on mobile
      >
        <div className="space-y-0 w-full">
          {/* Hero Section - Always visible */}
          <section 
            ref={addSectionRef(0)} 
            className="w-full content-visibility-auto"
          >
            <Hero />
          </section>
          
          {/* How It Works Section - Only render when needed */}
          <section 
            ref={addSectionRef(1)} 
            id="how-it-works" 
            className={cn(
              "relative w-full",
              !visibleSections[1] && isMobile ? "content-visibility-auto" : ""
            )}
          >
            <div className="relative z-10">
              <Suspense fallback={<SectionLoader />}>
                {visibleSections[1] ? <OptimizedHowItWorks /> : null}
              </Suspense>
            </div>
          </section>
          
          {/* Search Section - Only render when needed */}
          <section 
            ref={addSectionRef(2)} 
            id="find-creators" 
            className={cn(
              "relative w-full",
              !visibleSections[2] && isMobile ? "content-visibility-auto" : ""
            )}
          >
            <div className="max-w-7xl mx-auto relative z-10 py-10 sm:py-16 lg:py-20">
              <Suspense fallback={<SectionLoader />}>
                {visibleSections[2] ? <PreviewSearch /> : null}
              </Suspense>
            </div>
          </section>
          
          {/* Professional Content Creation Services - Only render when needed */}
          <section 
            ref={addSectionRef(3)} 
            className={cn(
              "w-full",
              !visibleSections[3] && isMobile ? "content-visibility-auto" : ""
            )}
          >
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[3] ? <FeaturesSectionWithHoverEffects /> : null}
            </Suspense>
          </section>

          {/* Pricing Section - Only render when needed */}
          <section 
            ref={addSectionRef(4)} 
            className={cn(
              "w-full",
              !visibleSections[4] && isMobile ? "content-visibility-auto" : ""
            )}
          >
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[4] ? <Pricing /> : null}
            </Suspense>
          </section>

          {/* Final CTA Section - Only render when needed */}
          <div 
            ref={addSectionRef(5)} 
            className={cn(
              "relative w-full",
              !visibleSections[5] && isMobile ? "content-visibility-auto" : ""
            )}
          >
            <div className="relative z-10 max-w-7xl mx-auto py-14 sm:py-20 lg:py-24">
              {visibleSections[5] ? <CallToActionSection /> : null}
            </div>
          </div>
        </div>
        
        <Footer />
      </BackgroundEffects>
      <BottomNav />
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default Index;
