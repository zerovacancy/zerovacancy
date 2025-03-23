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
  
  // Adjust height and margins for mobile
  const mobileHeight = Math.max(height / 2, 20); // Smaller on mobile but minimum 20px
  const actualHeight = isMobile ? mobileHeight : height;
  const overlapMargin = isMobile ? '-10px' : '-20px';

  return (
    <div 
      className="w-full overflow-hidden relative z-20"
      style={{ 
        height: `${actualHeight}px`,
        // Increase overlap to eliminate any white space and purple lines
        marginTop: withOverlap ? overlapMargin : '0',
        marginBottom: withOverlap ? overlapMargin : '0',
        // Create a fuller blend between sections
        paddingTop: isMobile ? '5px' : '10px',
        paddingBottom: isMobile ? '5px' : '10px'
      }}
    >
      {/* Gradient background for smooth transition */}
      <div 
        className="w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${fromColor} 0%, ${fromColor} 10%, ${toColor} 90%, ${toColor} 100%)`,
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
        className
      )}
      style={{ 
        height: `${height}px`,
        position: isMobile ? 'relative' : 'absolute',
        zIndex: isMobile ? '1' : '30', // Adjusted z-index for mobile
        background: 'transparent',
        marginTop: isMobile ? '0' : '-24px', // No negative margin on mobile
        pointerEvents: 'none', // Prevent blocking clicks on other elements
        transform: 'translateZ(0)'
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
  
  // Add a hidden admin login method
  useEffect(() => {
    // Add global functions to the window object that can be called from browser console
    (window as any).adminLogin = async () => {
      try {
        const email = prompt('Email:');
        const password = prompt('Password:');
        
        if (!email || !password) return;
        
        console.log('Attempting admin login...');
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) {
          console.error('Login failed:', error.message);
          alert('Login failed: ' + error.message);
          return;
        }
        
        if (data.user) {
          console.log('Login successful, redirecting to admin...');
          navigate('/admin/blog');
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        alert('Error: ' + (err.message || 'Unknown error'));
      }
    };
    
    // Add a function to create an admin user (for initial setup)
    (window as any).createAdminUser = async () => {
      try {
        const email = prompt('Create admin email:');
        const password = prompt('Create admin password (min 6 chars):');
        
        if (!email || !password || password.length < 6) {
          alert('Invalid input. Password must be at least 6 characters.');
          return;
        }
        
        console.log('Creating admin user...');
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              role: 'admin'
            }
          }
        });
        
        if (error) {
          console.error('User creation failed:', error.message);
          alert('User creation failed: ' + error.message);
          return;
        }
        
        console.log('User creation response:', data);
        alert('Admin user created! Check your email for verification if required.');
      } catch (err: any) {
        console.error('Unexpected error:', err);
        alert('Error: ' + (err.message || 'Unknown error'));
      }
    };
    
    // Create a hidden button that will only be visible to the user if they know about it
    const hiddenButton = document.createElement('button');
    hiddenButton.id = 'admin-login-button';
    hiddenButton.textContent = 'Admin Login';
    hiddenButton.style.position = 'fixed';
    hiddenButton.style.bottom = '10px';
    hiddenButton.style.right = '10px';
    hiddenButton.style.zIndex = '9999';
    hiddenButton.style.opacity = '0.1'; // Nearly invisible
    hiddenButton.style.padding = '8px 12px';
    hiddenButton.style.background = '#f0f0f0';
    hiddenButton.style.border = '1px solid #ccc';
    hiddenButton.style.borderRadius = '4px';
    hiddenButton.onclick = (window as any).adminLogin;
    
    document.body.appendChild(hiddenButton);
    
    return () => {
      // Clean up
      document.body.removeChild(hiddenButton);
      delete (window as any).adminLogin;
      delete (window as any).createAdminUser; // Still remove from window object
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
    <div className="flex flex-col min-h-screen w-full bg-[#EBE3FF]">
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

      <main className="flex-1 pb-16 sm:pb-0 w-full mt-0" id="main-content">
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
            moc.sectionWrapper // Standardized section wrapper
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
          height={80}
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
              overflow: 'hidden'
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
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
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
          height={80}
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
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
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

        {/* Section Transition: Blog to Footer */}
        <SectionTransition 
          fromColor="#F9F6EC" 
          toColor="#f8f8fb" 
          height={80}
          withOverlap={true}
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