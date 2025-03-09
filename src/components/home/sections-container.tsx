
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { lazy, Suspense } from 'react';
import { BackgroundEffects } from '@/components/features/BackgroundEffects';
import { SectionLoader } from './section-loader';
import { Hero } from '@/components/hero/Hero';
import CallToActionSection from '@/components/CallToActionSection';

// Lazy-loaded components
const OptimizedHowItWorks = lazy(() => import('@/components/how-it-works/OptimizedHowItWorks'));
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('@/components/preview-search'));

interface SectionsContainerProps {
  showGlowDialog: boolean;
  setShowGlowDialog: (show: boolean) => void;
}

export const SectionsContainer: React.FC<SectionsContainerProps> = ({
  showGlowDialog,
  setShowGlowDialog
}) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<{[key: number]: boolean}>({
    0: true, // Hero section is visible by default
    1: false, 
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  // Optimized Intersection Observer with useCallback to avoid recreating functions
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
  
  // Use Intersection Observer to optimize rendering of sections with safety timeout
  useEffect(() => {
    const observer = new IntersectionObserver(
      observerCallback,
      { threshold: 0.1, rootMargin: '200px' }
    );
    
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        section.setAttribute('data-section-index', index.toString());
        observer.observe(section);
      }
    });

    // Safety timeout to make all sections visible if they aren't already
    const safetyTimeout = setTimeout(() => {
      setVisibleSections({
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
      });
    }, 1000);
    
    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, [observerCallback]);
  
  // Helper function to add section refs
  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  return (
    <BackgroundEffects 
      blobColors={{
        first: "bg-purple-200",
        second: "bg-indigo-200",
        third: "bg-violet-200"
      }}
      blobOpacity={0.35}
      withSpotlight={true}
      spotlightClassName="from-purple-500/10 via-violet-500/10 to-blue-500/10"
      baseColor="bg-white/60" 
      pattern="dots"
      className="py-0"
      animationSpeed="slow"
    >
      <div className="space-y-0 w-full">
        {/* Hero Section - Always visible */}
        <section ref={addSectionRef(0)} className="w-full">
          <Hero />
        </section>
        
        {/* How It Works Section */}
        <section 
          ref={addSectionRef(1)} 
          id="how-it-works" 
          className="relative w-full"
        >
          <div className="relative z-10">
            <Suspense fallback={<SectionLoader />}>
              {visibleSections[1] && <OptimizedHowItWorks />}
            </Suspense>
          </div>
        </section>
        
        {/* Search Section */}
        <section 
          ref={addSectionRef(2)} 
          id="find-creators" 
          className="relative w-full"
        >
          <div className="max-w-7xl mx-auto relative z-10 py-10 sm:py-16 lg:py-20">
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
        <section 
          ref={addSectionRef(5)} 
          className="relative w-full"
        >
          <div className="relative z-10 max-w-7xl mx-auto py-14 sm:py-20 lg:py-24">
            {visibleSections[5] && <CallToActionSection />}
          </div>
        </section>
      </div>
    </BackgroundEffects>
  );
};
