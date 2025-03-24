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
import { mobileOptimizationClasses as moc, mobileSpacingUtils } from '@/utils/mobile-optimization';

const { useState, useEffect, useRef, lazy, Suspense, useCallback } = React;

// Further reduced spacing system based on identified issues
const getResponsiveSpacing = (index: number, isMobile: boolean) => {
  // Even more dramatically reduced spacing values (50% reduction from previous values)
  const baseSpacingDesktop = {
    top: [32, 24, 24, 20, 20, 20],    // 32px top for first section, less for others
    bottom: [32, 28, 24, 24, 20, 20], // More bottom than top for visual separation
  };
  
  // Small consistent spacing for mobile
  const baseSpacingMobile = {
    top: [16, 12, 12, 12, 12, 12],    // 16px (1rem) for first section, 12px for others
    bottom: [16, 16, 12, 12, 12, 12], // Equal spacing for consistent rhythm
  };
  
  // Use proper className output instead of style attributes
  if (isMobile) {
    // Convert to Tailwind classes for more consistent styling
    const topPadding = baseSpacingMobile.top[Math.min(index, baseSpacingMobile.top.length - 1)];
    const bottomPadding = baseSpacingMobile.bottom[Math.min(index, baseSpacingMobile.bottom.length - 1)];
    
    return {
      paddingTop: `${topPadding}px`,
      paddingBottom: `${bottomPadding}px`,
      className: `pt-${topPadding / 4} pb-${bottomPadding / 4}` // Convert to Tailwind (px/4)
    };
  }
  
  // Desktop classes
  const topPadding = baseSpacingDesktop.top[Math.min(index, baseSpacingDesktop.top.length - 1)];
  const bottomPadding = baseSpacingDesktop.bottom[Math.min(index, baseSpacingDesktop.bottom.length - 1)];
  
  return {
    paddingTop: `${topPadding}px`,
    paddingBottom: `${bottomPadding}px`,
    className: `pt-${topPadding / 4} pb-${bottomPadding / 4}` // Convert to Tailwind (px/4)
  };
};

// Minimal transition heights to reduce spacing between sections
const getTransitionHeight = (index: number, isMobile: boolean) => {
  // Apply recommended 60% reduction to transition heights
  const heights = [40, 32, 28, 24, 20];      // First section transition taller (40px)
  const mobileHeights = [24, 20, 16, 16, 12]; // Mobile transitions start at 24px, go down to 12px
  
  const heightArray = isMobile ? mobileHeights : heights;
  return heightArray[Math.min(index, heightArray.length - 1)];
};

// Optional: Add a customized version of the ScrollTarget specifically for mobile
const MobileScrollTarget = ({ id }: { id: string }) => {
  return (
    <div 
      id={id}
      aria-hidden="true"
      className="w-full invisible block m-0 p-0 h-0.5 touch-action-pan-y overscroll-behavior-none"
      style={{ 
        position: 'relative',
        zIndex: 5,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
};

// Minimal transition component using unified approach
const ScrollTransition = ({ 
  id,
  fromColor, 
  toColor, 
  height = 40
}: { 
  id: string;
  fromColor: string; 
  toColor: string; 
  height?: number;
}) => {
  const isMobile = useIsMobile();
  
  // Apply height directly with NO minimum values
  const actualHeight = height; // Use exactly what's provided
  
  // Ultra-compact implementation with minimal styles
  return (
    <div 
      id={id}
      aria-hidden="true" // Accessibility hint that this is decorative
      className="w-full overflow-hidden relative z-10 section-transition"
      style={{ 
        height: `${actualHeight}px`,
        margin: 0,
        padding: 0,
        pointerEvents: 'none', // Prevent interaction
        backgroundColor: fromColor, // Base color for transition
      }}
    >
      <div 
        className="absolute inset-0" // Efficiently position the gradient
        style={{
          background: `linear-gradient(to bottom, 
            ${fromColor} 0%, 
            ${modifyColorOpacity(fromColor, toColor, 0.7)} 35%,
            ${modifyColorOpacity(fromColor, toColor, 0.3)} 65%,
            ${toColor} 100%)`,
        }}
      />
    </div>
  );
};

// Helper function to create intermediate colors for smoother transitions
const modifyColorOpacity = (fromColor: string, toColor: string, ratio: number) => {
  // Simple implementation for hex colors
  if (fromColor.startsWith('#') && toColor.startsWith('#')) {
    try {
      // Parse hex colors
      const r1 = parseInt(fromColor.slice(1, 3), 16);
      const g1 = parseInt(fromColor.slice(3, 5), 16);
      const b1 = parseInt(fromColor.slice(5, 7), 16);
      
      const r2 = parseInt(toColor.slice(1, 3), 16);
      const g2 = parseInt(toColor.slice(3, 5), 16);
      const b2 = parseInt(toColor.slice(5, 7), 16);
      
      // Blend colors
      const r = Math.round(r1 * ratio + r2 * (1 - ratio));
      const g = Math.round(g1 * ratio + g2 * (1 - ratio));
      const b = Math.round(b1 * ratio + b2 * (1 - ratio));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (e) {
      // Fallback if parsing fails
      return ratio > 0.5 ? fromColor : toColor;
    }
  }
  
  // For other color formats like rgb, rgba, or named colors
  return `color-mix(in srgb, ${fromColor} ${ratio * 100}%, ${toColor} ${(1 - ratio) * 100}%)`;
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
  
  // Simple performance optimization only - no browser-specific code
  useEffect(() => {
    // Add only basic scroll performance enhancement
    const scrollScript = document.createElement('script');
    scrollScript.innerHTML = `
      (function() {
        let isScrolling = false;
        let scrollTimer = null;
        
        function onScroll() {
          if (!isScrolling) {
            document.documentElement.classList.add('is-scrolling');
            isScrolling = true;
          }
          
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            document.documentElement.classList.remove('is-scrolling');
            isScrolling = false;
          }, 150);
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
      })();
    `;
    document.head.appendChild(scrollScript);
    
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      /* Pause animations during scroll for better performance */
      .is-scrolling * {
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(styleTag);
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
      {/* Banner displayed before header, and now visible on all devices */}
      {showBanner && (
        <div className="relative z-50">
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
      <Header />

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
        {/* Hero Section - Using standardized structure */}
        <section 
          ref={addSectionRef(0)}
          style={isMobile ? 
            { 
              position: 'static', 
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden',
              // Only use the essential styles
            } : 
            { 
              ...getZIndex(0), 
              ...getBackgroundTransition(0),
            }
          }
          className={cn(
            "w-full bg-[#EBE3FF]",
            // Apply consistent Tailwind padding classes directly
            isMobile ? "pt-4 pb-4" : "pt-8 pb-8", // 16px/32px - reduced from previous values
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none"
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
            className={cn(
              "w-full max-w-none",
              isMobile && mobileSpacingUtils.zeroGap // Apply zero-gap to eliminate unwanted space
            )}
          >
            {/* Hero component wrapper with custom hero-specific styles */}
            <div className="hero-compact-container" style={{
              // Apply mobile-first spacing variables
              "--mobile-density": isMobile ? "1" : "0",
              "--desktop-density": isMobile ? "0" : "1",
              
              // Using the established spacing system
              "--hero-heading-margin": "calc(var(--space-sm) * var(--desktop-density) + var(--space-xs) * var(--mobile-density))",
              "--hero-paragraph-margin": "calc(var(--space-sm) * var(--desktop-density) + var(--space-xs) * var(--mobile-density))",
              "--hero-button-margin": "calc(var(--space-sm) * var(--desktop-density) + var(--space-xs) * var(--mobile-density))",
              "--content-spacing": "calc(var(--space-sm) * var(--desktop-density) + var(--space-xs) * var(--mobile-density))"
            }}>
              <style>{`
                /* Mobile spacing system with consistent scale */
                :root {
                  --space-xs: 0.5rem;  /* 8px */
                  --space-sm: 1rem;    /* 16px */
                  --space-md: 1.5rem;  /* 24px */
                  --space-lg: 2rem;    /* 32px */
                  --space-xl: 3rem;    /* 48px */
                }
                
                /* Hero spacing system using consistent scale */
                .hero-compact-container h1, 
                .hero-compact-container h2, 
                .hero-compact-container [role="heading"] {
                  margin-bottom: var(--space-sm); /* 16px - standard spacing between related elements */
                }
                
                .hero-compact-container p {
                  margin-bottom: var(--space-sm); /* 16px - consistent spacing */
                }
                
                .hero-compact-container [class*="button-container"],
                .hero-compact-container [id*="hero-cta-section"] {
                  margin-top: var(--space-sm); /* 16px - adequate spacing for touch targets */
                }
                
                /* Reduced internal padding based on spacing analysis */
                .hero-compact-container > div {
                  padding-top: var(--space-sm);    /* 16px - reduced from 24px */
                  padding-bottom: var(--space-sm); /* 16px - reduced from 24px */
                }
                
                /* Proper spacing for CTA sections */
                .hero-compact-container [id="hero-cta-section"],
                .hero-compact-container [id="hero-cta-section"] + div {
                  margin-bottom: var(--space-sm); /* 16px - standard spacing */
                }
                
                /* Mobile CTA container using spacing system */
                .hero-compact-container .w-[92%],
                .hero-compact-container .mt-10 {
                  margin-top: var(--space-xs);    /* 8px - tightly coupled elements */
                  margin-bottom: var(--space-xs); /* 8px - compact but readable */
                }
                
                /* Social proof with consistent spacing system */
                .hero-compact-container .social-proof,
                .hero-compact-container [class*="SocialProof"] {
                  margin-top: var(--space-xs);    /* 8px - subtle separation */
                  margin-bottom: var(--space-xs); /* 8px - compact but clear */
                  transform: scale(0.95);         /* Slight scale for visual hierarchy */
                }
                
                /* Modest desktop spacing based on analysis */
                @media (min-width: 640px) {
                  /* Less excessive spacing for desktop */
                  .hero-compact-container > div {
                    padding-top: var(--space-md);    /* 24px - reduced from 32px */
                    padding-bottom: var(--space-md); /* 24px - reduced from 32px */
                  }
                  
                  /* More generous spacing for desktop content */
                  .hero-compact-container > div > div[class*="flex"] {
                    margin-bottom: var(--space-sm); /* 16px - standard spacing */
                  }
                  
                  /* Consistent system for desktop CTA section */
                  .hero-compact-container #hero-cta-section,
                  .hero-compact-container div[id="hero-cta-section"] {
                    margin-bottom: var(--space-sm); /* 16px - standard spacing */
                  }
                  
                  /* Maintain consistent system for social proof */
                  .hero-compact-container div:last-child .social-proof,
                  .hero-compact-container div:last-child [class*="SocialProof"] {
                    margin-top: var(--space-xs);    /* 8px - subtle separation */
                    margin-bottom: var(--space-xs); /* 8px - maintains consistency */
                  }
                }
                
                /* Optimized scroll indicator using spacing system */
                .hero-compact-container div:last-child > div.flex.flex-col.items-center.opacity-60,
                .hero-compact-container .w-full.flex.justify-center.mt-10 {
                  margin-top: var(--space-xs);  /* 8px - subtle separation */
                  transform: scale(0.9);        /* Subtle scaling for hierarchy */
                  height: var(--space-lg);      /* 32px - adequate touch target */
                }
                
                /* Optimized text in scroll indicator for mobile */
                .hero-compact-container .text-xs.text-purple-600.mb-1.font-medium.block {
                  margin-bottom: calc(var(--space-xs) / 2);  /* 4px - minimal spacing */
                  font-size: 0.75rem;                        /* 12px - readable but compact */
                  line-height: 1.2;                          /* Tight but readable line height */
                  min-height: calc(var(--space-sm) * 1.2);   /* 19px - ensures adequate touch area */
                }
              `}</style>
              <Hero />
            </div>
          </div>
        </section>
        
        {/* Combined Scroll Target and Transition */}
        <ScrollTransition 
          id="find-creators"
          fromColor="#EBE3FF" 
          toColor="#F9F6EC" 
          // Minimal transition height based on analysis findings
          height={isMobile ? 16 : 24} // Reduced by ~30% to minimize excess spacing
        />
        
        {/* Find Creators Section */}
        {/* Find Creators Section - Standardized structure */}
        <section 
          ref={addSectionRef(1)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden',
              // Mobile-specific styles for full width
              width: '100vw',
              maxWidth: '100vw',
              marginLeft: 0,
              marginRight: 0,
            } : 
            {
              ...getZIndex(1),
              ...getBackgroundTransition(1),
            }
          }
          className={cn(
            "w-full bg-[#F9F6EC]",
            // Direct Tailwind padding classes - 50% reduction from original
            isMobile ? "pt-4 pb-4" : "pt-7 pb-7", // 16px mobile, 28px desktop (was 64px/80px)
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none px-0 mx-0",
            "creator-section" // Safari fixes
          )}
        >
          <div className={cn(
            "w-full overflow-hidden",
            isMobile ? "px-0 mx-0" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" // Removed negative margins for better layout stability
          )}>
            <Suspense fallback={<SectionLoader />}>
              <PreviewSearch />
            </Suspense>
          </div>
        </section>
        
        {/* Combined Scroll Target and Transition */}
        <ScrollTransition 
          id="how-it-works"
          fromColor="#F9F6EC" 
          toColor="#EDF7F2" 
          height={getTransitionHeight(1, isMobile)}
        />
        
        {/* How It Works Section */}
        {/* How It Works Section - Standardized structure */}
        <section 
          ref={addSectionRef(2)} 
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(2),
              ...getBackgroundTransition(2)
            }
          }
          className={cn(
            "w-full bg-[#EDF7F2]",
            // Direct Tailwind padding classes with progressive reduction
            isMobile ? "pt-3 pb-3" : "pt-6 pb-7", // 12px/28px - further reduced from previous sections
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none"
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding, // Standardized content padding
            isMobile && mobileSpacingUtils.contentSpacing // Add compact content spacing for mobile
          )}>
            <Suspense fallback={<SectionLoader />}>
              <OptimizedHowItWorks />
            </Suspense>
          </div>
        </section>
        
        {/* Combined Scroll Target and Transition */}
        <ScrollTransition 
          id="features"
          fromColor="#EDF7F2" 
          toColor="#E7E9FF" 
          height={getTransitionHeight(2, isMobile)}
        />
        
        {/* Features Section */}
        {/* Features Section - Standardized structure */}
        <section 
          ref={addSectionRef(3)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(3),
              ...getBackgroundTransition(3)
            }
          }
          className={cn(
            "w-full bg-[#E7E9FF]",
            // Further reduced padding for consistent flow down the page
            isMobile ? "pt-3 pb-3" : "pt-6 pb-6", // 12px/24px - consistent reduction pattern
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none"
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding, // Standardized content padding
            isMobile && mobileSpacingUtils.contentSpacing // Add compact content spacing for mobile
          )}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSectionWithHoverEffects />
            </Suspense>
          </div>
        </section>

        {/* Combined Scroll Target and Transition */}
        <ScrollTransition 
          id="pricing"
          fromColor="#E7E9FF" 
          toColor="#EEF3F9" 
          height={getTransitionHeight(3, isMobile)}
        />

        {/* Pricing Section */}
        {/* Pricing Section - Standardized structure */}
        <section 
          ref={addSectionRef(4)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(4),
              ...getBackgroundTransition(4)
            }
          }
          className={cn(
            "w-full bg-[#EEF3F9]",
            // Further reduced padding as we go down the page
            isMobile ? "pt-3 pb-3" : "pt-5 pb-5", // 12px/20px - continuing the reduction pattern
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none"
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding, // Standardized content padding
            isMobile && mobileSpacingUtils.contentSpacing // Add compact content spacing for mobile
          )}>
            <Suspense fallback={<SectionLoader />}>
              <Pricing />
            </Suspense>
          </div>
        </section>

        {/* Combined Scroll Target and Transition */}
        <ScrollTransition 
          id="blog"
          fromColor="#EEF3F9" 
          toColor="#F9F6EC" 
          height={getTransitionHeight(4, isMobile)}
        />

        {/* Blog Section */}
        {/* Blog Section - Standardized structure */}
        <section 
          ref={addSectionRef(5)}
          style={isMobile ?
            {
              position: 'static',
              zIndex: 'auto',
              transform: 'none',
              overflow: 'hidden'
            } : 
            {
              ...getZIndex(5),
              ...getBackgroundTransition(5)
            }
          }
          className={cn(
            "w-full bg-[#F9F6EC]",
            // Smallest padding for the final section
            isMobile ? "pt-3 pb-3" : "pt-5 pb-5", // 12px/20px - minimal but still adequate
            moc.sectionWrapper,
            isMobile && "touch-action-pan-y overscroll-behavior-none"
          )}
        >
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding, // Standardized content padding
            isMobile && mobileSpacingUtils.contentSpacing // Add compact content spacing for mobile
          )}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturedBlogPosts />
            </Suspense>
          </div>
        </section>

        {/* Combined Scroll Target and Footer Transition */}
        <ScrollTransition 
          id="footer-transition"
          fromColor="#F9F6EC" 
          toColor="#f8f8fb" 
          height={getTransitionHeight(5, isMobile)}
        />

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