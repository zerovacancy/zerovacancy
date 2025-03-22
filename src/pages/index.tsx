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
import { BackgroundEffects } from '@/components/features/BackgroundEffects';
import SEO from '@/components/SEO';
import { homepageSchema, organizationSchema } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const { useState, useEffect, useRef, lazy, Suspense, useCallback } = React;

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
  }, [observerCallback, isMobile]);
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full">
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
          className="py-2 sm:py-3 lg:py-4 -mt-1 sm:-mt-2 lg:-mt-3"
          animationSpeed="slow"
        >
          {isMobile ? (
            <section ref={addSectionRef(0)} className="w-full bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-200/95 via-indigo-100/90 to-blue-50/80"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 left-0 w-32 h-32 bg-indigo-300/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <Hero />
              </div>
            </section>
          ) : (
            <section ref={addSectionRef(0)} className="w-full">
              <Hero />
            </section>
          )}
        </BackgroundEffects>
        
        <section 
          ref={addSectionRef(1)} 
          id="find-creators" 
          className={cn(
            "relative w-full",
            !isMobile && "bg-[#F5F0FF]/40 py-4 sm:py-6 lg:py-8",
            isMobile && "bg-[#FCFAFF]/70 relative"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoader />}>
              <PreviewSearch />
            </Suspense>
          </div>
        </section>
        
        <section 
          ref={addSectionRef(2)} 
          id="how-it-works" 
          className={cn(
            "relative w-full py-4 sm:py-6 lg:py-8 -mt-2 sm:-mt-4 lg:-mt-6",
            isMobile && "bg-gradient-to-b from-blue-50/20 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-6 after:bg-gradient-to-t after:from-blue-50/20 after:to-transparent"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoader />}>
              <OptimizedHowItWorks />
            </Suspense>
          </div>
        </section>
        
        <section 
          ref={addSectionRef(3)}
          id="features" 
          className={cn(
            "w-full py-4 sm:py-6 lg:py-8 -mt-2 sm:-mt-4 lg:-mt-6",
            isMobile && "bg-gradient-to-b from-violet-50/20 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-6 after:bg-gradient-to-t after:from-indigo-50/20 after:to-transparent"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSectionWithHoverEffects />
            </Suspense>
          </div>
        </section>

        <section 
          ref={addSectionRef(4)}
          id="pricing" 
          className={cn(
            "w-full py-4 sm:py-6 lg:py-8 -mt-2 sm:-mt-4 lg:-mt-6",
            isMobile && "bg-gradient-to-b from-purple-50/20 via-transparent to-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-6 after:bg-gradient-to-t after:from-purple-50/20 after:to-transparent"
          )}
        >
          <Suspense fallback={<SectionLoader />}>
            <Pricing />
          </Suspense>
        </section>

        <section 
          ref={addSectionRef(5)}
          id="blog" 
          className={cn(
            "w-full py-4 sm:py-6 lg:py-8 -mt-2 sm:-mt-4 lg:-mt-6",
            isMobile && "bg-gradient-to-b from-indigo-50/20 via-transparent to-transparent"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionLoader />}>
              <FeaturedBlogPosts />
            </Suspense>
          </div>
        </section>

        {!isMobile && (
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
            {['find-creators', 'how-it-works', 'features', 'pricing', 'blog'].map((section, index) => {
              const isActive = visibleSections[index + 1];
              return (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    isActive 
                      ? "bg-purple-600 scale-125 shadow-sm" 
                      : "bg-purple-300/50 hover:bg-purple-400"
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
