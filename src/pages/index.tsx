import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '../components/Header';
import { Hero } from '../components/hero/Hero';
import Footer from '../components/Footer';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { useSectionStyles, smoothScrollTo } from '@/utils/web-vitals';
import { BackgroundEffects } from '@/components/features/BackgroundEffects';
import SEO from '@/components/SEO';
import { homepageSchema, organizationSchema } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  heroPatternDotMatrix, 
  findCreatorsPatternGrid, 
  howItWorksPatternDiagonal,
  featuresPatternHoneycomb,
  pricingPatternPaper,
  generateBackgroundWithPattern 
} from '@/utils/background-patterns';
import { mobileOptimizationClasses as moc } from '@/utils/mobile-optimization';

const { useState, useEffect, useRef, lazy, Suspense, useCallback } = React;

// Section transition component with subtle gradient effect and optional curve
const SectionTransition = ({ 
  fromColor, 
  toColor, 
  height = 40,
  withOverlap = true 
}: { 
  fromColor: string; 
  toColor: string; 
  height?: number;
  withOverlap?: boolean;
}) => {
  const isMobile = useIsMobile();
  
  // Adjust height for mobile without negative margins
  const mobileHeight = Math.max(height / 2, 40); // Increased minimum height on mobile
  const actualHeight = isMobile ? mobileHeight : height;

  return (
    <div 
      className={cn(
        "w-full overflow-visible relative z-10", // Changed to overflow-visible to prevent clipping
        isMobile && "touch-action-pan-y overscroll-behavior-none"
      )}
      style={{ 
        height: `${actualHeight}px`,
        // No negative margins to prevent jittering
        marginTop: '0',
        marginBottom: '0',
        // Create a fuller blend between sections
        padding: isMobile ? '0' : '10px', // Remove padding on mobile
        // Fix mobile scrolling
        touchAction: isMobile ? 'pan-y' : 'auto',
        pointerEvents: 'none',
        // Ensure no borders on mobile
        borderTop: isMobile ? 'none' : undefined,
        borderBottom: isMobile ? 'none' : undefined,
        // Standard width without overflow
        width: '100%',
        marginLeft: '0'
      }}
    >
      {/* Gradient background for smooth transition */}
      <div 
        className="w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`, // Simpler gradient for all devices
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          boxShadow: 'none'
        }}
      />
    </div>
  );
};

// Scroll target component with fixed height to prevent layout shifts
interface ScrollTargetProps {
  id: string;
  height?: number;
  className?: string;
}

const ScrollTarget: React.FC<ScrollTargetProps> = ({ id, height = 12, className }) => {
  const isMobile = useIsMobile();
  return (
    <div 
      id={id}
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden invisible block",
        className,
        isMobile && "touch-action-pan-y overscroll-behavior-none"
      )}
      style={{ 
        height: `${height}px`,
        position: 'relative', // Changed to always be relative instead of absolute
        zIndex: 10, // Consistent z-index
        background: 'transparent',
        marginTop: '0', // Removed negative margin completely
        pointerEvents: 'none', // Prevent blocking clicks on other elements
        // Removed transform property to prevent hardware acceleration
        touchAction: isMobile ? 'pan-y' : 'auto' // Fix mobile scrolling
      }}
    />
  );
};

const OptimizedHowItWorks = lazy(() => import('../components/how-it-works/OptimizedHowItWorks'));
const FeaturesSectionWithHoverEffects = lazy(() => import('@/components/features/Features'));
const Pricing = lazy(() => import('@/components/Pricing'));
const PreviewSearch = lazy(() => import('../components/preview-search'));
const FeaturedBlogPosts = lazy(() => import('@/components/blog/FeaturedBlogPosts'));

const SectionLoader = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Main landing page component with performance optimizations
 */
const Index = () => {
  const { getZIndex, getTransition, getBackgroundTransition } = useSectionStyles(6); // Total of 6 sections
  const [showBanner, setShowBanner] = useState(true);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<{[key: number]: boolean}>({
    0: true, // Hero section is visible by default
    1: true, 
    2: true,
    3: true,
    4: true,
    5: true
  });
  
  // Safari-specific fixes for jittering issues
  useEffect(() => {
    // Check if browser is Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
      // Add a class to the document for Safari-specific CSS
      document.documentElement.classList.add('safari');
      
      // Create and add Safari-specific CSS
      const safariStyle = document.createElement('style');
      safariStyle.innerHTML = `
        /* Disable problematic hardware acceleration in creator section */
        .safari .creator-section * {
          will-change: auto !important;
          transform: none !important;
          backface-visibility: visible !important;
          perspective: none !important;
          transition: none !important;
        }
        
        /* Fix the unstable positioning */
        .safari .creator-section {
          isolation: isolate;
          position: relative;
          z-index: 10;
        }
        
        /* Prevent section transitions from causing jitter */
        .safari .w-full.overflow-visible.relative.z-10 {
          margin: 0 !important;
          overflow: hidden !important;
          transition: none !important;
        }
        
        /* Fix scroll targets in Safari */
        .safari [id="find-creators"],
        .safari [id="how-it-works"],
        .safari [id="features"],
        .safari [id="pricing"],
        .safari [id="blog"] {
          position: relative !important;
          margin: 0 !important;
          transform: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(safariStyle);
    }
  }, []);
  
  // Simple flag to track Alt+A+Z key combination
  const adminLoginRef = React.useRef({
    altPressed: false,
    redirected: false
  });
  
  // Add a simpler secure admin login method with keyboard shortcut
  useEffect(() => {
    // Simple keyboard shortcut handling for Alt+A+Z
    const handleKeyDown = (event: KeyboardEvent) => {
      // Track Alt key state (use event.altKey for cross-browser compatibility)
      adminLoginRef.current.altPressed = event.altKey;
      
      // Check for the 'a' key when Alt is pressed
      if (event.altKey && event.key.toLowerCase() === 'a') {
        // Wait for the 'z' key to complete the sequence
        const checkForZ = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === 'z') {
            // Success - the full Alt+A+Z sequence was pressed
            document.removeEventListener('keydown', checkForZ);
            
            // Prompt for verification word
            const secretWord = prompt('Enter admin verification word:');
            if (secretWord === 'zerovacancy2025') {
              // Set the admin access token before navigating
              sessionStorage.setItem('adminAccessToken', 'granted');
              
              // Only redirect if not already done
              if (!adminLoginRef.current.redirected) {
                adminLoginRef.current.redirected = true;
                navigate('/hidden-admin-login');
              }
            }
          } else {
            // Wrong key pressed after Alt+A, remove listener
            document.removeEventListener('keydown', checkForZ);
          }
        };
        
        // Add a temporary listener for the 'z' key
        document.addEventListener('keydown', checkForZ, { once: true });
      }
    };
    
    // Add the keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
  
  // Observer that uses requestAnimationFrame for better performance
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    if (!entries.length) return;
    
    // Use requestAnimationFrame to batch DOM updates and avoid layout thrashing
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-section-index') || '-1', 10);
        if (index >= 0) {
          setVisibleSections(prev => ({
            ...prev,
            [index]: entry.isIntersecting || prev[index] // Keep sections visible once they've been seen
          }));
        }
      });
    });
  }, []);
  
  useEffect(() => {
    // Simplified section visibility - show all sections immediately
    // This eliminates the performance overhead of multiple observers
    setVisibleSections({
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true
    });
    
    return () => {
      // No cleanup needed
    };
  }, [isMobile]);
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };
  
  // Enhanced scroll with custom easing and offset
  const scrollToSection = (id: string) => {
    // Use 80px offset to account for header and provide some breathing room
    smoothScrollTo(id, 80, 1000); // Longer duration (1000ms) for smoother scrolling
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#EBE3FF]" 
         style={isMobile ? {
           width: '100vw', 
           maxWidth: '100vw', 
           overflow: 'hidden',
           margin: 0,
           padding: 0
         } : {}}>
      <SEO 
        title="Property Content Creators | ZeroVacancy" 
        description="Connect with elite content creators who transform your spaces into compelling visual stories. Find photographers, videographers, and more for your properties."
        canonicalPath="/"
        structuredData={[homepageSchema, organizationSchema]}
      />
      <Header />
      {showBanner && !isMobile && (
        <div className="relative mb-0">
          <Banner variant="purple" size="lg" action={
              <div className="relative">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className={cn(
                    // Light background with subtle gradient from white to light purple
                    "bg-gradient-to-b from-white to-[#F8F5FF]",
                    // Using brand purple for text to match other CTAs
                    "text-[#7633DC] font-semibold",
                    // Refined border for definition
                    "border border-[rgba(255,255,255,0.2)]", 
                    // Sophisticated 3D shadow effect matching other CTAs
                    "shadow-[0_1px_2px_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.07),_0_4px_8px_rgba(0,0,0,0.07),_0_8px_16px_rgba(0,0,0,0.05),_0_0_8px_rgba(118,51,220,0.03)]",
                    // Enhanced hover effects
                    "hover:bg-gradient-to-b hover:from-white hover:to-[#F5F0FF]",
                    "hover:shadow-[0_1px_2px_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.07),_0_4px_8px_rgba(0,0,0,0.07),_0_8px_16px_rgba(0,0,0,0.06),_0_0_12px_rgba(118,51,220,0.04)]",
                    "hover:scale-[1.02]",
                    // Adding transition for all properties
                    "transition-all duration-300 ease-out"
                    // Removed backdrop blur
                  )} 
                  onClick={handleTryNowClick}
                >
                  Get Early Access
                </Button>
              </div>
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

      <main className="flex-1 pb-16 sm:pb-0 w-full mt-0" 
             style={isMobile ? {
               width: '100vw',
               maxWidth: '100vw',
               overflow: 'hidden',
               margin: 0,
               padding: 0
             } : {}}
             id="main-content">
        {/* Hero Section */}
        <section 
          ref={addSectionRef(0)} 
          style={isMobile ? 
            { 
              position: 'static', 
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden',  // Changed to hidden to prevent content from flowing outside
              isolation: 'auto'
            } : 
            { ...getZIndex(0), ...getBackgroundTransition(0) }
          }
          className={cn(
            "w-full bg-[#EBE3FF]", // Lavender background for hero section
            moc.sectionWrapper, // Standardized section wrapper
            isMobile && "touch-action-pan-y overscroll-behavior-none" // Fix mobile scrolling
          )}
        >
          <div 
            style={isMobile ? 
              { 
                position: 'static',
                contain: 'none',
                willChange: 'auto',
                width: '100%',
                overflow: 'hidden'
              } : 
              { position: 'relative' }
            } 
            className="w-full max-w-none"
          >
            <Hero />
          </div>
        </section>
        
        {/* Scroll Target for Find Creators */}
        <ScrollTarget id="find-creators" height={12} />
        
        {/* Section Transition: Hero to Find Creators */}
        <SectionTransition 
          fromColor="#EBE3FF" 
          toColor="#F9F6EC" 
          height={isMobile ? 100 : 80}
          withOverlap={true}
        />
        
        {/* Find Creators Section */}
        <section 
          ref={addSectionRef(1)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden',
              width: '100vw', // Ensure full viewport width on mobile
              maxWidth: '100vw', // Prevent overflow
              marginLeft: '0', // Remove any margin
              marginRight: '0', // Remove any margin
              paddingLeft: '0', // Remove horizontal padding
              paddingRight: '0', // Remove horizontal padding
              backgroundColor: '#F9F6EC' // Explicitly set tan background on mobile
            } : 
            {
              ...getZIndex(1),
              ...getBackgroundTransition(1)
            }
          }
          className={cn(
            "relative w-full pt-20 pb-24", // Increased vertical spacing
            "bg-[#F9F6EC]", // Soft champagne - now applied to both mobile and desktop
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper, // Standardized section wrapper
            "creator-section", // Added this class for Safari-specific fixes
            isMobile && "px-0 mx-0 max-w-none find-creators-section" // Remove horizontal padding/margin on mobile
          )}
        >
          <div className={cn(
            "w-full overflow-hidden",
            isMobile ? "px-0 mx-0" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          )}>
            <Suspense fallback={<SectionLoader />}>
              <PreviewSearch />
            </Suspense>
          </div>
        </section>
        
        {/* Scroll Target for How It Works */}
        <ScrollTarget id="how-it-works" height={12} />
        
        {/* Section Transition: Find Creators to How It Works */}
        <SectionTransition 
          fromColor="#F9F6EC" 
          toColor="#EDF7F2" 
          height={isMobile ? 100 : 80}
          withOverlap={true}
        />
        
        {/* How It Works Section */}
        <section 
          ref={addSectionRef(2)} 
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(2),
              ...getBackgroundTransition(2)
            }
          }
          className={cn(
            "relative w-full pt-20 pb-24", // Increased vertical spacing
            "bg-[#EDF7F2]", // Pale mint - now applied to both mobile and desktop
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <OptimizedHowItWorks />
            </Suspense>
          </div>
        </section>
        
        {/* Section Transition: How It Works to Features */}
        <SectionTransition 
          fromColor="#EDF7F2" 
          toColor="#E7E9FF" 
          height={80}
          withOverlap={true}
        />
        
        {/* Scroll Target for Features */}
        <ScrollTarget id="features" height={12} />
        
        {/* Features Section */}
        <section 
          ref={addSectionRef(3)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(3),
              ...getBackgroundTransition(3)
            }
          }
          className={cn(
            "relative w-full pt-20 pb-24", // Increased vertical spacing
            "bg-[#E7E9FF]", // Rich periwinkle - now applied to both mobile and desktop
            isMobile && cn("py-8", moc.sectionPaddingMain, "touch-action-pan-y overscroll-behavior-none"), // Standardized mobile padding with scroll fix
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSectionWithHoverEffects />
            </Suspense>
          </div>
        </section>

        {/* Section Transition: Features to Pricing */}
        <SectionTransition 
          fromColor="#E7E9FF" 
          toColor="#EEF3F9" 
          height={80}
          withOverlap={true}
        />

        {/* Scroll Target for Pricing */}
        <ScrollTarget id="pricing" height={12} />

        {/* Pricing Section */}
        <section 
          ref={addSectionRef(4)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(4),
              ...getBackgroundTransition(4)
            }
          }
          className={cn(
            "relative w-full pt-20 pb-24", // Increased vertical spacing
            "bg-[#EEF3F9]", // Soft blue-grey - now applied to both mobile and desktop
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <Pricing />
            </Suspense>
          </div>
        </section>

        {/* Section Transition: Pricing to Blog */}
        <SectionTransition 
          fromColor="#EEF3F9" 
          toColor="#F9F6EC" 
          height={80}
          withOverlap={true}
        />

        {/* Scroll Target for Blog */}
        <ScrollTarget id="blog" height={12} />

        {/* Blog Section */}
        <section 
          ref={addSectionRef(5)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(5),
              ...getBackgroundTransition(5)
            }
          }
          className={cn(
            "relative w-full pt-20 pb-24", // Increased vertical spacing
            "bg-[#F9F6EC]", // Soft champagne (same as Find Creators) - now applied to both mobile and desktop
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturedBlogPosts />
            </Suspense>
          </div>
        </section>

        {/* Section Transition: Blog to Footer - Hidden on mobile */}
        {!isMobile && (
          <SectionTransition 
            fromColor="#F9F6EC" 
            toColor="#f8f8fb" 
            height={80}
            withOverlap={true}
          />
        )}

        {!isMobile && (
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-3">
            {['find-creators', 'how-it-works', 'features', 'pricing', 'blog'].map((section, index) => {
              const isActive = visibleSections[index + 1];
              return (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  style={{
                    boxShadow: isActive 
                      ? '0 0 0 2px rgba(255,255,255,0.15), 0 0 10px rgba(138,66,245,0.5)' 
                      : '0 0 0 1px rgba(255,255,255,0.1)',
                    position: 'relative',
                    zIndex: 100
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    isActive 
                      ? "bg-purple-600 scale-125" 
                      : "bg-purple-300/70 hover:bg-purple-400"
                  )}
                  aria-label={`Scroll to ${section.replace('-', ' ')}`}
                />
              );
            })}
          </div>
        )}

        <Footer />
      </main>
      
      <GlowDialog 
        open={showGlowDialog} 
        onOpenChange={setShowGlowDialog}
        triggerStrategy="combined"
      />
    </div>
  );
};

export default Index;