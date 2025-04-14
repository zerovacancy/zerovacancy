import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SafeHeader from '../components/SafeHeader';
import { HeroSection } from '../components/hero/new';
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

// Import additional React hooks
import { lazy, Suspense } from 'react';

// Add type declaration for window methods we'll use
declare global {
  interface Window {
    removeDebugOverlays?: () => void;
    removeDebugElements?: () => void;
  }
}

// Completely revised section transition component to eliminate all gaps on both mobile and desktop
const SectionTransition = ({ 
  fromColor, 
  toColor, 
  height = 60, // Increased default height for better coverage
  withOverlap = true // Parameter maintained for backward compatibility
}: { 
  fromColor: string; 
  toColor: string; 
  height?: number;
  withOverlap?: boolean;
}) => {
  const isMobile = useIsMobile();
  
  // Ensure sufficient height for complete coverage
  const actualHeight = Math.max(height, 60); // Increased minimum height to ensure overlap
  
  return (
    <div 
      className="w-full overflow-visible relative z-30 section-transition"
      aria-hidden="true"
      style={{ 
        height: `${actualHeight}px`,
        margin: isMobile ? '-40px 0' : '-30px 0', // More aggressive negative margins
        padding: 0,
        pointerEvents: 'none',
        width: '100vw', // Full viewport width to prevent side gaps
        maxWidth: '100vw',
        position: 'relative',
        backgroundColor: 'transparent', // Use transparent background to prevent color bleed
        backgroundImage: 'none', // Prevent any default backgrounds
        left: 0,
        right: 0,
        borderWidth: 0, // Explicitly remove any borders
        overflow: 'visible' // Allow gradient to extend beyond bounds
      }}>
      <div 
        className="absolute"
        style={{
          // For mobile devices, we completely REVERSE the gradient direction
          background: isMobile ? 
            `linear-gradient(to top, 
              ${toColor} 0%, 
              ${toColor} 25%, 
              ${modifyColorOpacity(toColor, fromColor, 0.9)} 40%,
              ${modifyColorOpacity(toColor, fromColor, 0.5)} 50%,
              ${modifyColorOpacity(toColor, fromColor, 0.1)} 60%,
              ${fromColor} 75%, 
              ${fromColor} 100%)`
            :
            `linear-gradient(to top, 
              ${fromColor} 0%, 
              ${fromColor} 25%, 
              ${modifyColorOpacity(fromColor, toColor, 0.9)} 40%,
              ${modifyColorOpacity(fromColor, toColor, 0.5)} 50%,
              ${modifyColorOpacity(fromColor, toColor, 0.1)} 60%,
              ${toColor} 75%, 
              ${toColor} 100%)`,
          position: 'absolute',
          top: isMobile ? '-40px' : '-50px', // More aggressive extension
          left: 0,
          right: 0,
          bottom: isMobile ? '-40px' : '-50px', // More aggressive extension
          height: isMobile ? 'calc(100% + 80px)' : 'calc(100% + 100px)', // Taller gradient for better coverage
          width: '100%',
          boxShadow: 'none',
          borderWidth: 0, // Explicitly remove any borders
          zIndex: 1 // Ensure this is above background but below content
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

// Optimized scroll target component designed to work seamlessly with section transitions
interface ScrollTargetProps {
  id: string;
  height?: number;
  className?: string;
}

const ScrollTarget: React.FC<ScrollTargetProps & { style?: React.CSSProperties }> = ({ id, height = 1, className, style = {} }) => {
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
        position: 'relative',
        zIndex: 5, // Lower z-index to prevent interfering with transitions
        background: 'transparent',
        margin: 0,
        padding: 0,
        pointerEvents: 'none',
        touchAction: isMobile ? 'pan-y' : 'auto',
        ...style // Allow additional styles to be passed in
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
    
    // Enhanced debug overlay removal that works on both mobile and desktop
    const removeDebugElements = () => {
      // Import the function from our script declaration
      if (typeof window.removeDebugOverlays === 'function') {
        window.removeDebugOverlays();
      } else {
        // Fallback implementation if the script function isn't available yet
        // Look for any debug overlays with lavender background and class information display
        const debugSelectors = [
          'body > div[style*="#EBE3FF"]',
          'div[style*="background-color: #EBE3FF"]', 
          'div[style*="background: #EBE3FF"]',
          'div:not([id]):not([class])[style*="393 x"]',
          'div[style*=" x "]',
          'body > div:not([id]):not([class])',
          // More aggressive selectors to catch any debug overlays
          'div[style*="position: absolute"][style*="z-index: 9999"]',
          'div[style*="position:absolute"][style*="z-index:9999"]',
          'div:not([id]):not([class])',
          'body > div:empty',
          // Target any elements displaying CSS class names
          'div[style*="393"]',
          'div[style*="bg-gradient"]',
          'div:not([id]):not([class]):not([role])'
        ];
        
        const debugOverlays = document.querySelectorAll(debugSelectors.join(','));
        
        debugOverlays.forEach(el => {
          // Check content for debugging information
          const content = el.textContent || '';
          if (
            content.includes(' x ') || 
            content.includes('section') || 
            content.includes('creator-section') ||
            content.includes('find-creators-section') ||
            content.includes('relative') ||
            content.includes('absolute') ||
            content.includes('py-') ||
            content.includes('px-') ||
            content.includes('w-full') ||
            content.includes('overflow-') ||
            content.includes('px') ||
            content.includes('bg-gradient') ||
            content.includes('div.') ||
            content.includes('[8px]') ||
            content.includes('ACCESSIBILITY') ||
            content.includes('/30.via') ||
            // Special check for Lovable tool debug output which shows component dimensions
            (content.match(/\d+(\.\d+)? x \d+(\.\d+)?/) !== null)
          ) {
            // Try to remove it from the DOM
            try {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            } catch (e) {
              // If removal fails, make it invisible
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.position = 'absolute';
              el.style.pointerEvents = 'none';
              el.style.zIndex = '-9999';
            }
          }
        });
        
        // Also target by element position - especially useful for mobile
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
          const rect = div.getBoundingClientRect();
          // Check if this is a small overlay element at the top of the viewport
          if (rect.top < 100 && rect.height < 50 && rect.width > 300 && div.textContent && 
              (div.textContent.includes('bg-gradient') || div.textContent.includes(' x ') || div.textContent.includes('div.'))) {
            try {
              if (div.parentNode) {
                div.parentNode.removeChild(div);
              }
            } catch (e) {
              div.style.display = 'none';
              div.style.visibility = 'hidden';
            }
          }
        });
      }
    };
    
    // Attach the function to window for access by our script
    window.removeDebugElements = removeDebugElements;
    
    // Run immediately
    removeDebugElements();
    
    // Run multiple times with increasing delay to catch elements that appear during rendering
    const timers = [
      setTimeout(removeDebugElements, 100),
      setTimeout(removeDebugElements, 500),
      setTimeout(removeDebugElements, 1000),
      setTimeout(removeDebugElements, 2000),
      setTimeout(removeDebugElements, 5000)
    ];
    
    // Set up a MutationObserver to watch for dynamically added debug elements
    const observer = new MutationObserver((mutations) => {
      let hasRelevantChanges = false;
      
      mutations.forEach(mutation => {
        // Check if nodes were added
        if (mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            // Check if it's an element node
            if (node.nodeType === 1) {
              // Check if it looks like a debug overlay
              if (
                (node.nodeName === 'DIV' && !node.id && !node.className) ||
                (node instanceof HTMLElement && 
                 (node.style.backgroundColor === '#EBE3FF' || 
                  (node.getAttribute('style') || '').includes('#EBE3FF')))
              ) {
                hasRelevantChanges = true;
                break;
              }
            }
          }
        }
      });
      
      // Only run removal if relevant changes were detected
      if (hasRelevantChanges) {
        removeDebugElements();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      // Clean up timers and observer
      timers.forEach(timer => clearTimeout(timer));
      observer.disconnect();
    };
  }, []);
  
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
    <div className="flex flex-col min-h-screen w-full" 
         style={{
           width: isMobile ? '100vw' : '100%',
           maxWidth: isMobile ? '100vw' : '100%',
           overflow: 'hidden',
           margin: 0,
           padding: 0,
           backgroundColor: '#F9F6EC' // Tan/gold background for consistency
         }}>
      {/* Fix for fixed element bottom value issue */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Reset specific fixed element with large bottom value */
        .fixed.top-0.left-0.right-0.z-\\[60\\] {
          bottom: auto !important;
          height: 1px !important;
        }
        
        /* Target all fixed elements in the hero context */
        .fixed:not(.mobile-sticky-header):not([role="dialog"]) {
          bottom: auto !important;
        }

        /* Fix specific elements that might have excessive bottom values */
        body > div > div > .fixed,
        #__next > div > .fixed,
        #root > div > .fixed,
        main > .fixed,
        [data-hero-section="true"] ~ .fixed,
        .fixed[style*="bottom:"],
        .fixed[style*="bottom"] {
          bottom: auto !important;
          top: auto !important;
          position: fixed !important;
          transform: translateZ(0) !important;
          will-change: transform !important;
        }

        /* Fix cookie consent container */
        .cookie-consent-container {
          position: fixed !important;
          bottom: auto !important;
          height: auto !important;
          transform: translateY(0) !important;
          will-change: transform !important;
        }

        /* Add special diagnostic code to count fixed elements */
        body:after {
          content: "" !important;
          display: block !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: auto !important;
          bottom: auto !important;
          height: 1px !important;
          width: 1px !important;
          z-index: -9999 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}} />
      <SEO 
        title="Property Content Creators | ZeroVacancy" 
        description="Connect with elite content creators who transform your spaces into compelling visual stories. Find photographers, videographers, and more for your properties."
        canonicalPath="/"
        structuredData={[homepageSchema, organizationSchema]}
      />
      {/* Mobile styles now handled directly by mobile-hero.css - no dynamic injection needed */}
      <SafeHeader />
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
             style={{
               width: isMobile ? '100vw' : '100%',
               maxWidth: isMobile ? '100vw' : '100%',
               overflow: 'hidden',
               margin: 0,
               padding: 0,
               backgroundColor: '#F9F6EC' // Tan/gold background for consistency 
             }}
             id="main-content">
        {/* Hero Section */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Basic layout styles for root container */
          #root {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          /* DESKTOP-ONLY HEIGHT CONSTRAINTS - Mobile heights are controlled by mobile-hero.css */
          @media (min-width: 769px) {
            /* Fixed height ONLY FOR DESKTOP */
            section#hero, 
            section[data-hero-section="true"], 
            div[data-hero-section="true"], 
            [data-hero-section="true"] {
              height: 650px !important;
              min-height: 650px !important;
              max-height: 650px !important;
              position: relative !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
              overflow: visible !important;
            }
          }
          
          /* Remove transition elements and scroll indicators */
          section#hero + div,
          .flex.flex-col.items-center.opacity-60 {
            display: none !important;
          }
          
          /* Clean up debug overlays */
          body > div:not([id]):not([class]),
          div[style*="#EBE3FF"],
          div:not([id]):not([class])[style*="393 x"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            z-index: -9999 !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          /* Minimal mobile styles - only non-height related properties */
          @media (max-width: 768px) {
            /* No height settings here - fully controlled by mobile-hero.css */
            .find-creators-section {
              margin-top: 16px !important;
            }
          }
          `}} />

        {/* 
          IMPORTANT: All JavaScript DOM manipulation for hero section has been removed.
          The hero section layout is now fully controlled by CSS files:
          
          - For mobile devices (max-width: 768px):
            mobile-hero.css is the ONLY source of height/layout rules
            It enforces a 450px height with proper flex spacing
          
          - For desktop (min-width: 769px):
            hero-section.css and inline styles set the 650px height
          
          No JavaScript functions should manipulate the hero section layout after page load.
          This ensures consistent layout without shifts or missing content.
        */}
        
        <div
          data-hero-section="true"
          ref={addSectionRef(0)} 
          style={{
            ...(isMobile ? { 
              position: 'relative',
              zIndex: 70, // High z-index but lower than creator section
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'visible', // Changed from hidden to visible
              isolation: 'auto',
              display: 'flex'
              // Removed height constraints to let CSS control them
            } : { 
              ...getZIndex(0), 
              ...getBackgroundTransition(0),
              display: 'flex',
              alignItems: 'center', // Change to center alignment
              justifyContent: 'center',
              paddingTop: '0', // Removed top padding for proper centering
              paddingBottom: '0', // Removed bottom padding for proper centering
              minHeight: 'auto',
              marginBottom: '-30px', // Add negative margin to eliminate gap
              position: 'relative',
              zIndex: 70, // Consistent z-index with mobile
              width: '100%', // Ensure full width
              maxWidth: '100%', // Prevent overflow
              height: '650px', // Match the height to the CSS
            })
          }}
          className={cn(
            "w-full bg-[#F9F6EC]", // Tan/gold background for hero section (desktop)
            !isMobile && "flex items-center justify-center pt-0 pb-0", // Reduced vertical padding
            moc.sectionWrapper, // Standardized section wrapper
            isMobile && "touch-action-pan-y overscroll-behavior-none" // Fix mobile scrolling
          )}
        >
          <div 
            style={{
              ...(isMobile ? { 
                position: 'static',
                contain: 'none',
                willChange: 'auto',
                width: '100%',
                overflow: 'hidden'
              } : { 
                position: 'relative',
                display: 'flex',
                alignItems: 'center', /* Changed from flex-start to center for consistent alignment */
                justifyContent: 'center',
                width: '100%',
                paddingTop: '0', // Explicitly remove top padding
                paddingBottom: '0', // Explicitly remove bottom padding
                margin: 0 // Remove all margins to fix hero centering
              })
            }} 
            className={cn(
              "w-full max-w-none",
              !isMobile && "flex items-center justify-center" /* Changed from items-start to items-center */
            )}
          >
            <HeroSection />
            
            {/* 
            REMOVED: Dynamic style manipulation script (preventHeroLayoutShifts)
            
            The hero layout is now entirely controlled by CSS:
            - mobile-hero.css handles all mobile layout (max-width: 768px)
            - hero-section.css handles all desktop layout (min-width: 769px)
            
            Benefits of this change:
            1. No more layout shifts caused by JavaScript overriding CSS
            2. Consistent rendering across all devices and browsers
            3. Better performance by eliminating DOM manipulations
            4. Cleaner separation of concerns (CSS for styling, JS for behavior)
            
            If layout issues occur:
            - Check mobile-hero.css for the correct 450px height and flex spacing
            - Ensure the rotating text container has a fixed 40px height
            - Verify that no inline styles are being added elsewhere
            */}
          </div>
        </div>

        {/* Transition element completely removed for mobile */}
        {false && isMobile && (
          <div 
            style={{
              display: 'none',
              visibility: 'hidden',
              height: '0',
              width: '0',
              position: 'absolute',
              zIndex: -1,
              opacity: 0
            }}
          ></div>
        )}
        
        {/* Desktop transition element - ONLY shown on desktop */}
        {!isMobile && (
          <div 
            style={{
              height: '40px',
              width: '100%',
              position: 'relative',
              zIndex: 10, // Reduced z-index to prevent overlap with social proof
              marginTop: '-5px',
              marginBottom: '-5px',
              pointerEvents: 'none',
              background: 'linear-gradient(to bottom, #F9F6EC 0%, rgba(249, 246, 236, 0.95) 20%, rgba(249, 246, 236, 0.9) 40%, rgba(242, 237, 245, 0.8) 60%, rgba(235, 227, 255, 0.9) 80%, #EBE3FF 100%)',
              overflow: 'hidden',
              display: isMobile ? 'none' : 'block' // Extra check to ensure it's hidden on mobile
            }}
          >
            {/* Visual divider for desktop */}
            <div 
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2" 
              style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(to right, rgba(138, 66, 245, 0.1), rgba(138, 66, 245, 0.3), rgba(138, 66, 245, 0.1))',
                borderRadius: '2px',
                zIndex: 51
              }}
            />
          </div>
        )}
        
        {/* Scroll Target for Find Creators - zero height and absolute position to avoid blocking content */}
        <ScrollTarget id="find-creators" height={0} style={{ 
          backgroundColor: 'transparent',
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0,
          top: isMobile ? 'calc(100vh - 200px)' : 'auto'
        }} />
        
        {/* Find Creators Section */}
        <section 
          ref={addSectionRef(1)}
          style={isMobile ?
            {
              position: 'relative',
              zIndex: 80, // Higher z-index to ensure it's above the Hero section
              contain: 'none',
              willChange: 'auto',
              transform: 'none',
              overflow: 'hidden',
              width: '100vw',
              maxWidth: '100vw',
              marginLeft: '0',
              marginRight: '0',
              paddingLeft: '0',
              paddingRight: '0',
              backgroundColor: '#EBE3FF', // Explicitly set lavender background on mobile
              backgroundImage: 'none', // Reset backgroundImage
              background: '#EBE3FF', // Solid lavender background for the Creator section
              marginTop: '0', // NO negative margin - clean edge
              paddingTop: '40px', // Reduced padding for better flow from hero section
              borderTopWidth: '0', // No border on top
              borderBottomWidth: '0',
              borderLeftWidth: '0',
              borderRightWidth: '0',
              borderColor: 'transparent',
              borderStyle: 'none',
              outline: 'none',
              boxShadow: 'none'
            } : 
            {
              ...getZIndex(1),
              // Removed getBackgroundTransition to avoid color conflicts
              position: 'relative',
              zIndex: 80,
              marginTop: '0', // No negative margin
              paddingTop: '10px', // Standard padding on desktop
              backgroundColor: '#EBE3FF', // Lavender background on desktop
              background: '#EBE3FF', // Ensure solid background with no gradient
              backgroundImage: 'none', // Prevent any background patterns
              borderTopWidth: '0' // No top border
            }
          }
          // Remove background classes from the className to avoid conflicts with inline styles
          className={cn(
            "relative w-full pt-16 pb-20", // Standardized vertical spacing
            // Removed background classes that could conflict with inline styles
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper, // Standardized section wrapper
            "creator-section", // Class for Safari-specific fixes
            isMobile && "px-0 mx-0 max-w-none find-creators-section" // Remove horizontal padding/margin on mobile
          )}
        >
          {/* Removed gradient overlay for consistent background */}
          
          <div 
            className={cn(
              "w-full overflow-hidden",
              isMobile ? "px-0 mx-0" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            )}
            style={ 
              // Apply same style for both mobile and desktop
              {
                backgroundColor: 'transparent', // Make container transparent to show section background
                backgroundImage: 'none',
                position: 'relative',
                zIndex: 10, // Balanced z-index
                paddingTop: isMobile ? '20px' : '0' // Add padding only on mobile
              }
            }>
          
            <Suspense fallback={<SectionLoader />}>
              <PreviewSearch />
            </Suspense>
          </div>
        </section>
        
        {/* Scroll Target for How It Works */}
        <ScrollTarget id="how-it-works" height={0} />
        
        {/* Section Transition: Find Creators to How It Works - Unified flow */}
        {/* Section transition - hidden on mobile */}
        {!isMobile && (
          <div style={{ 
            marginTop: '-50px', 
            position: 'relative',
            zIndex: 30
          }}>
            <SectionTransition 
              fromColor="#F9F6EC" 
              toColor="#EDF7F2" 
              height={40} // Reduced height significantly
            />
          </div>
        )}
        
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
            "relative w-full pt-16 pb-20", // Standardized vertical spacing (reduced)
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
        
        {/* Section Transition: How It Works to Features - Subtle gradient */}
        <div style={{ 
          marginTop: isMobile ? '-30px' : '-50px', // Adjusted for different devices
          position: 'relative',
          zIndex: 30
        }}>
          <SectionTransition 
            fromColor="#EDF7F2" 
            toColor="#E7E9FF" 
            height={40} // Reduced height significantly
          />
        </div>
        
        {/* Scroll Target for Features */}
        <ScrollTarget id="features" height={0} />
        
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
            "relative w-full pt-16 pb-20", // Standardized vertical spacing (reduced)
            "bg-[#E3E4FF]", // Slightly lighter periwinkle for better differentiation
            isMobile && cn("py-8", moc.sectionPaddingMain, "touch-action-pan-y overscroll-behavior-none"), // Standardized mobile padding with scroll fix
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          {/* Subtle top accent for better section definition on mobile */}
          {isMobile && (
            <div className="absolute top-0 left-0 right-0 h-[8px] bg-gradient-to-r from-indigo-300/30 via-indigo-400/50 to-indigo-300/30 z-10"></div>
          )}
          
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSectionWithHoverEffects />
            </Suspense>
          </div>
        </section>

        {/* Section Transition: Features to Pricing - Enhanced for better visual differentiation */}
        <div style={{ 
          marginTop: isMobile ? '-30px' : '-50px', // Adjusted for different devices
          position: 'relative',
          zIndex: 30
        }}>
          <SectionTransition 
            fromColor="#E3E4FF" 
            toColor="#E5F0FD" // More distinct color for pricing section
            height={40} // Reduced height significantly
          />
        </div>

        {/* Scroll Target for Pricing */}
        <ScrollTarget id="pricing" height={0} />

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
            "relative w-full pt-16 pb-20", // Standardized vertical spacing (reduced)
            "bg-[#E5F0FD]", // Lighter blue for better differentiation from features
            isMobile && cn("py-8", moc.sectionPaddingMain), // Standardized mobile padding
            moc.sectionWrapper // Standardized section wrapper
          )}
        >
          {/* Distinctive section divider specifically for mobile */}
          {isMobile && (
            <div className="absolute top-0 left-0 right-0 overflow-hidden">
              <div className="h-[6px] bg-gradient-to-r from-blue-200 via-blue-300/60 to-blue-200 w-full"></div>
              <div className="flex justify-center -mt-3 pt-4 pb-1">
                <div className="w-16 h-1 bg-blue-300/50 rounded-full"></div>
              </div>
            </div>
          )}
          <div className={cn(
            "w-full max-w-7xl mx-auto overflow-hidden", 
            moc.contentPadding // Standardized content padding
          )}>
            <Suspense fallback={<SectionLoader />}>
              <Pricing />
            </Suspense>
          </div>
        </section>

        {/* Section Transition: Pricing to Blog - Seamless blend */}
        <div style={{ 
          marginTop: isMobile ? '-30px' : '-50px', // Adjusted for different devices
          position: 'relative',
          zIndex: 30
        }}>
          <SectionTransition 
            fromColor="#EEF3F9" 
            toColor="#F9F6EC" 
            height={40} // Reduced height significantly
          />
        </div>

        {/* Scroll Target for Blog */}
        <ScrollTarget id="blog" height={0} />

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
            "relative w-full pt-16 pb-20", // Standardized vertical spacing (reduced)
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

        {/* Section Transition: Blog to Footer - Minimal subtle transition */}
        <div style={{ 
          marginTop: isMobile ? '-30px' : '-50px', // Adjusted for different devices
          position: 'relative',
          zIndex: 30
        }}>
          <SectionTransition 
            fromColor="#F9F6EC" 
            toColor="#f8f8fb" 
            height={40} // Reduced height significantly
          />
        </div>

        {/* Navigation dots removed to prevent UI issues */}

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