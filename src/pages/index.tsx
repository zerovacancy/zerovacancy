
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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

// Optimized loading with increased priority for critical components
const OptimizedHowItWorks = lazy(() => import('../components/how-it-works/OptimizedHowItWorks'));
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('@/components/preview-search'));

// Simple loading component
const SectionLoader = () => (
  <div className="w-full py-8 flex items-center justify-center">
    <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Main landing page component
 */
const Index = () => {
  const [showBanner, setShowBanner] = useState(false); // Start with banner hidden on mobile
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState({
    0: true, // Hero section is visible by default
    1: false, 
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  // Show banner only on desktop
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowGlowDialog(true);
      localStorage.setItem('hasVisited', 'true');
    }
    
    // Only show banner on desktop
    setShowBanner(!isMobile);
  }, [isMobile]);
  
  // Simple intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = parseInt(entry.target.getAttribute('data-section-index') || '-1', 10);
          if (index >= 0) {
            setVisibleSections(prev => ({
              ...prev,
              [index]: entry.isIntersecting
            }));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;
      section.setAttribute('data-section-index', index.toString());
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  
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
          <Banner 
            variant="purple" 
            size="lg" 
            action={
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold" 
                onClick={handleTryNowClick}
              >
                Get Early Access
              </Button>
            } 
            layout="complex" 
            isClosable 
            onClose={() => setShowBanner(false)} 
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-300 animate-pulse" />
              <AnimatedShinyText className="text-white font-bold">
                Join the AI-powered revolution in property management!
              </AnimatedShinyText>
            </div>
          </Banner>
        </div>
      )}

      <div className="flex-1 pb-16 sm:pb-0 w-full">
        <div className="space-y-0 w-full">
          {/* Hero Section - Always visible */}
          <section 
            ref={addSectionRef(0)} 
            className="w-full"
          >
            <Hero />
          </section>
          
          {/* How It Works Section */}
          <section 
            ref={addSectionRef(1)} 
            id="how-it-works" 
          >
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[1] && <OptimizedHowItWorks />}
            </Suspense>
          </section>
          
          {/* Search Section */}
          <section 
            ref={addSectionRef(2)} 
            id="find-creators" 
          >
            <div className="max-w-7xl mx-auto py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<SectionLoader />}>
                {visibleSections[2] && <PreviewSearch />}
              </Suspense>
            </div>
          </section>
          
          {/* Professional Content Creation Services */}
          <section 
            ref={addSectionRef(3)} 
            className="w-full"
          >
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[3] && <FeaturesSectionWithHoverEffects />}
            </Suspense>
          </section>

          {/* Pricing Section */}
          <section 
            ref={addSectionRef(4)} 
            className="w-full"
          >
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[4] && <Pricing />}
            </Suspense>
          </section>

          {/* Final CTA Section */}
          <div 
            ref={addSectionRef(5)} 
            className="w-full"
          >
            <div className="max-w-7xl mx-auto py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
              {visibleSections[5] && <CallToActionSection />}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
      <BottomNav />
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default Index;
