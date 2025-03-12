
import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import Header from '../components/Header';
import { Hero } from '../components/hero/Hero';
import Footer from '../components/Footer';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { BackgroundEffects } from '@/components/features/BackgroundEffects';

// Lazy-loaded components
const OptimizedHowItWorks = lazy(() => import('../components/how-it-works/OptimizedHowItWorks'));
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('../components/preview-search'));

// Simple loading fallback
const SectionLoader = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Main landing page component with performance optimizations
 */
const Index = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const isMobile = useIsMobile();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<{[key: number]: boolean}>({
    0: true, // Hero section is visible by default
    1: true, 
    2: true,
    3: true,
    4: true
  });
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    setShowGlowDialog(!hasVisited);
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);
  
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.getAttribute('data-section-index') || '-1', 10);
      if (index >= 0) {
        setVisibleSections(prev => ({
          ...prev,
          [index]: entry.isIntersecting || prev[index] // Keep sections visible once they've been seen
        }));
      }
    });
  }, []);
  
  useEffect(() => {
    try {
      const observer = new IntersectionObserver(
        observerCallback,
        { threshold: 0.1, rootMargin: '200px' }
      );
      
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        
        section.setAttribute('data-section-index', index.toString());
        observer.observe(section);
      });

      // Safety timeout to make all sections visible if they aren't already
      const safetyTimeout = setTimeout(() => {
        setVisibleSections({
          0: true,
          1: true,
          2: true,
          3: true,
          4: true
        });
      }, 1000);
      
      return () => {
        observer.disconnect();
        clearTimeout(safetyTimeout);
      };
    } catch (error) {
      console.error("Error in intersection observer:", error);
      // If observer fails, set all sections to visible
      setVisibleSections({
        0: true,
        1: true,
        2: true,
        3: true,
        4: true
      });
      return () => {};
    }
  }, [observerCallback]);
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  // Helper function to add section refs
  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      {showBanner && !isMobile && (
        <div className="relative">
          <Banner variant="purple" size="lg" action={
              <Button 
                variant="secondary" 
                size="sm" 
                className={cn(
                  "flex text-xs sm:text-sm items-center whitespace-nowrap", 
                  "px-3 py-2 sm:px-5 sm:py-2.5 min-w-[8rem] sm:min-w-[9rem] min-h-[2.25rem] sm:min-h-[2.5rem]", 
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
            className="animate-in fade-in slide-in-from-top duration-500 relative overflow-hidden min-h-[3.25rem] sm:min-h-[3.5rem] my-0 py-0"
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

      <main className="flex-1 pb-16 sm:pb-0 w-full">
        {/* Hero Section with its own background */}
        <BackgroundEffects 
          blobColors={{
            first: "bg-purple-100",
            second: "bg-indigo-100",
            third: "bg-violet-100"
          }}
          blobOpacity={0.15}
          withSpotlight={true}
          spotlightClassName="from-purple-500/5 via-violet-500/5 to-blue-500/5"
          baseColor="bg-white/80" 
          pattern="none"
          className="py-0"
          animationSpeed="slow"
        >
          <section ref={addSectionRef(0)} className="w-full">
            <Hero />
          </section>
        </BackgroundEffects>
        
        {/* How It Works Section */}
        <section 
          ref={addSectionRef(1)} 
          id="how-it-works" 
          className={cn(
            "relative w-full",
            isMobile && "bg-gradient-to-b from-blue-50/30 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-blue-50/30 after:to-transparent"
          )}
        >
          <Suspense fallback={<SectionLoader />}>
            <OptimizedHowItWorks />
          </Suspense>
        </section>
        
        {/* Search Section */}
        <section 
          ref={addSectionRef(2)} 
          id="find-creators" 
          className={cn(
            "relative w-full",
            isMobile && "bg-gradient-to-b from-indigo-50/30 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-indigo-50/30 after:to-transparent"
          )}
        >
          <div className="max-w-7xl mx-auto relative z-10 py-10 sm:py-16 lg:py-20">
            <Suspense fallback={<SectionLoader />}>
              <PreviewSearch />
            </Suspense>
          </div>
        </section>
        
        {/* Professional Content Creation Services */}
        <section 
          ref={addSectionRef(3)} 
          className={cn(
            "w-full",
            isMobile && "bg-gradient-to-b from-violet-50/30 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-indigo-50/30 after:to-transparent"
          )}
        >
          <Suspense fallback={<SectionLoader />}>
            <FeaturesSectionWithHoverEffects />
          </Suspense>
        </section>

        {/* Pricing Section */}
        <section 
          ref={addSectionRef(4)} 
          className={cn(
            "w-full",
            isMobile && "bg-gradient-to-b from-purple-50/30 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-purple-50/30 after:to-transparent"
          )}
        >
          <Suspense fallback={<SectionLoader />}>
            <Pricing />
          </Suspense>
        </section>

        {/* Removed Final CTA Section (Our Guarantee) as requested */}
        
        <Footer />
      </main>
      {/* Bottom nav now handled by the BottomNav component itself */}
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default Index;
