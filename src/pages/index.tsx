
import React, { useState, useEffect, lazy, Suspense } from 'react';
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

// Lazy-loaded components
const OptimizedHowItWorks = lazy(() => import('../components/how-it-works/OptimizedHowItWorks'));
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('@/components/preview-search'));

// Simple loading fallback
const SectionLoader = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-gray-200 rounded-full relative">
      <div className="w-8 h-8 rounded-full border-4 border-blue-600 animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
  </div>
);

/**
 * Main landing page component with performance optimizations
 */
const Index = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Initialize local storage and dialog state
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    setShowGlowDialog(!hasVisited);
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  // Mobile-specific background settings - simplified for performance
  const mobileBackgroundSettings = {
    blobColors: {
      first: "bg-purple-200",
      second: "bg-indigo-200",
      third: "bg-violet-200"
    },
    blobOpacity: isMobile ? 0.1 : 0.35,
    withSpotlight: !isMobile,
    spotlightClassName: "from-purple-500/10 via-violet-500/10 to-blue-500/10",
    baseColor: "bg-white",
    pattern: "none" as const,
    animationSpeed: "slow" as const
  };
  
  return (
    <div className={cn("flex flex-col min-h-screen w-full relative", isMobile && "mobile-view")}>
      <Header />
      {showBanner && !isMobile && (
        <div className="relative">
          <Banner 
            variant="purple" 
            size="lg" 
            action={
              <Button 
                onClick={handleTryNowClick} 
                className={cn(
                  "flex text-xs sm:text-sm items-center whitespace-nowrap",
                  "px-3 py-2 sm:px-5 sm:py-2.5 min-w-[8rem] sm:min-w-[9rem] min-h-[2.25rem] sm:min-h-[2.5rem]",
                  "bg-white/90 hover:bg-white/95 text-violet-600 font-bold",
                  "border border-violet-100",
                  "transition-all duration-200",
                  "touch-manipulation",
                  "shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2",
                  "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
                  "before:animate-shimmer-slide before:bg-gradient-to-r",
                  "before:from-transparent before:via-violet-100/30 before:to-transparent",
                  "relative overflow-hidden"
                )}
                aria-label="Get early access to our platform"
              >
                <span className="relative z-10">Get Early Access</span>
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

      <BackgroundEffects 
        blobColors={mobileBackgroundSettings.blobColors}
        blobOpacity={mobileBackgroundSettings.blobOpacity}
        withSpotlight={mobileBackgroundSettings.withSpotlight}
        spotlightClassName={mobileBackgroundSettings.spotlightClassName}
        baseColor={mobileBackgroundSettings.baseColor}
        pattern={mobileBackgroundSettings.pattern}
        animationSpeed={mobileBackgroundSettings.animationSpeed}
        className={cn("py-0", isMobile && "mobile-background")}
        layoutClassName="flex-1 pb-16 sm:pb-0 w-full"
      >
        <div className={cn("space-y-4 w-full overflow-visible", isMobile && "mobile-sections-container")}>
          {/* Hero Section */}
          <section className={cn("w-full", isMobile && "mobile-section mobile-hero")}>
            <Hero />
          </section>
          
          {/* How It Works Section */}
          <section id="how-it-works" className={cn("relative w-full", isMobile && "mobile-section")}>
            <div className={cn("relative z-10", isMobile && "mobile-content-container")}>
              <Suspense fallback={<SectionLoader />}>
                <OptimizedHowItWorks />
              </Suspense>
            </div>
          </section>
          
          {/* Search Section */}
          <section id="find-creators" className={cn("relative w-full", isMobile && "mobile-section")}>
            <div className={cn("max-w-7xl mx-auto relative z-10 py-10 sm:py-16 lg:py-20", isMobile && "mobile-content-container py-6")}>
              <Suspense fallback={<SectionLoader />}>
                <PreviewSearch />
              </Suspense>
            </div>
          </section>
          
          {/* Professional Content Creation Services */}
          <section className={cn("w-full", isMobile && "mobile-section mobile-features")}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSectionWithHoverEffects />
            </Suspense>
          </section>

          {/* Pricing Section */}
          <section className={cn("w-full", isMobile && "mobile-section mobile-pricing")}>
            <Suspense fallback={<SectionLoader />}>
              <Pricing />
            </Suspense>
          </section>

          {/* Final CTA Section */}
          <div className={cn("relative w-full", isMobile && "mobile-section mobile-cta")}>
            <div className={cn("relative z-10 max-w-7xl mx-auto py-14 sm:py-20 lg:py-24", isMobile && "py-8 mobile-content-container")}>
              <CallToActionSection />
            </div>
          </div>
        </div>
      </BackgroundEffects>
      
      <Footer />
      <BottomNav />
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default Index;
