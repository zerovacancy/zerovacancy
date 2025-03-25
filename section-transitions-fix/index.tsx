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

// Import React hooks directly instead of destructuring
import { useState, useEffect, useRef, useCallback } from 'react';
import { lazy, Suspense } from 'react';

// Desktop-specific CSS styles for subtle transitions
const DesktopTransitionStyles = () => {
  const isMobile = useIsMobile();
  
  // Don't render these styles on mobile
  if (isMobile) return null;
  
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* Apply only on desktop viewports */
      @media (min-width: 768px) {
        /* General transition styling */
        .section-transition {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          position: relative;
          z-index: 10;
        }
        
        /* Ensure sections blend properly without visible dividing lines */
        .section-transition::before,
        .section-transition::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: transparent;
          z-index: 1;
        }
        
        /* Prevent any potential flicker at the edges */
        .section-transition::before {
          top: 0;
        }
        .section-transition::after {
          bottom: 0;
        }
        
        /* Optimize z-index layering */
        section {
          position: relative;
          z-index: 1;
        }
        
        /* Fix any potential overlap issues */
        main section:not(:first-child) {
          margin-top: 0 !important;
        }
        
        /* Ensure smooth rendering */
        .section-transition > div {
          transform: translateZ(0);
          backface-visibility: hidden;
          transition: background 0.3s ease-out;
        }
      }
    `}} />
  );
};

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

// Significantly reduced transition heights for desktop, keeping mobile as is
const getTransitionHeight = (index: number, isMobile: boolean) => {
  // Desktop gets ultra-low height for subtle transitions (max 30px)
  const heights = [30, 25, 20, 18, 15];      // Ultra-subtle desktop transitions
  const mobileHeights = [40, 32, 24, 20, 16]; // Keep mobile as is
  
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

// Enhanced ScrollTransition with desktop-specific smooth, subtle transitions
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
  
  // Enforce maximum heights - much smaller for desktop to create subtle transitions
  const actualHeight = isMobile ? Math.min(height, 40) : Math.min(height, 30);
  
  // Create CSS variables for better readability in DevTools
  const transitionStyles = {
    '--actual-height': `${actualHeight}px`,
    height: `var(--actual-height)`,
    maxHeight: `var(--actual-height)`,
    minHeight: `var(--actual-height)`,
    margin: '0',
    padding: '0',
    pointerEvents: 'none',
    backgroundColor: fromColor,
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden'
  } as React.CSSProperties;
  
  // Return a combined component that serves as both scroll target and transition
  return (
    <div 
      id={id} // Used for scroll targeting
      aria-hidden="true" 
      data-testid={`transition-${id}`} // For easier testing
      className="w-full section-transition scroll-target"
      style={transitionStyles}
    >
      {/* Desktop-optimized gradient with extended and more gradual color blending */}
      {!isMobile ? (
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              ${fromColor} 0%, 
              ${modifyColorOpacity(fromColor, toColor, 0.85)} 15%,
              ${modifyColorOpacity(fromColor, toColor, 0.65)} 30%,
              ${modifyColorOpacity(fromColor, toColor, 0.5)} 50%,
              ${modifyColorOpacity(fromColor, toColor, 0.35)} 70%,
              ${modifyColorOpacity(fromColor, toColor, 0.15)} 85%,
              ${toColor} 100%)`,
            height: '150%', // Extended beyond container for smoother blending
            width: '100%',
            top: '-25%', // Extends above container
            boxShadow: 'none',
            transform: 'translateZ(0)', // Hardware acceleration for smoother rendering
            backfaceVisibility: 'hidden',
            willChange: 'transform' // Further optimize rendering
          }}
        />
      ) : (
        // Keep mobile transitions as they were
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              ${fromColor} 0%, 
              ${modifyColorOpacity(fromColor, toColor, 0.7)} 35%,
              ${modifyColorOpacity(fromColor, toColor, 0.3)} 65%,
              ${toColor} 100%)`,
            height: '100%', // No extension beyond container
            width: '100%'
          }}
        />
      )}
    </div>
  );
};

// Enhanced color blending function for smoother, more subtle transitions
const modifyColorOpacity = (fromColor: string, toColor: string, ratio: number) => {
  const isMobile = useIsMobile();
  
  // Apply cubic easing to the ratio for desktop only to make transitions even smoother
  // This creates more subtle blending in the middle sections of the gradient
  const adjustedRatio = !isMobile 
    ? ratio * (ratio * (3 - 2 * ratio)) // Cubic easing curve: 3t² - 2t³
    : ratio; // Keep linear for mobile
  
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
      
      // Blend colors with adjusted ratio
      const r = Math.round(r1 * adjustedRatio + r2 * (1 - adjustedRatio));
      const g = Math.round(g1 * adjustedRatio + g2 * (1 - adjustedRatio));
      const b = Math.round(b1 * adjustedRatio + b2 * (1 - adjustedRatio));
      
      // Convert back to hex with padding for single digits
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (e) {
      // Fallback if parsing fails
      return adjustedRatio > 0.5 ? fromColor : toColor;
    }
  }
  
  // For other color formats like rgb, rgba, or named colors
  // Use the adjusted ratio here too
  return `color-mix(in srgb, ${fromColor} ${adjustedRatio * 100}%, ${toColor} ${(1 - adjustedRatio) * 100}%)`;
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
  const [showDebugBorders, setShowDebugBorders] = useState(false); // New state for debugging
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
  
  // Enhanced performance optimization with aggressive spacing fixes
  useEffect(() => {
    // Add basic scroll performance enhancement
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
    
    // Apply paused animations during scroll
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      /* Pause animations during scroll for better performance */
      .is-scrolling * {
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    // EMERGENCY SPACING OVERRIDE - Comprehensive spacing reduction targeting all levels
    const spaceFixStyle = document.createElement('style');
    spaceFixStyle.innerHTML = `
      /* ==================== */
      /* LEVEL 1: CORE LAYOUT */
      /* ==================== */
      
      /* High-specificity selector to override deeply nested components */
      #main-content section, 
      #main-content [class*="section"] {
        padding-top: 16px !important;
        padding-bottom: 24px !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        min-height: auto !important;
      }
      
      /* Force transition height reduction with high specificity */
      #main-content .section-transition,
      #main-content [id*="transition"],
      #main-content [class*="transition"],
      #main-content [class*="scroll-target"] {
        height: 60px !important;
        min-height: 60px !important;
        max-height: 60px !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Mobile optimization with greater specificity */
      @media (max-width: 640px) {
        #main-content section,
        #main-content [class*="section"] {
          padding-top: 8px !important;
          padding-bottom: 12px !important;
        }
        
        #main-content .section-transition,
        #main-content [id*="transition"],
        #main-content [class*="transition"],
        #main-content [class*="scroll-target"] {
          height: 40px !important;
          min-height: 40px !important;
          max-height: 40px !important;
        }
      }
      
      /* ========================= */
      /* LEVEL 2: COMPONENT FIXES */
      /* ========================= */
      
      /* Target all wrappers inside sections - these often have their own padding */
      #main-content section > div {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      
      /* Fix hero component specifically */
      #main-content .hero-compact-container,
      #main-content [class*="Hero"] {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        min-height: auto !important;
        max-height: none !important;
      }
      
      /* Target How It Works component by ID */
      #how-it-works-section {
        padding-top: 16px !important;
        padding-bottom: 16px !important;
      }
      
      /* Target Features section */
      #main-content section[class*="features"],
      #main-content [id*="features"] {
        padding-top: 12px !important;
        padding-bottom: 12px !important;
      }
      
      /* ========================= */
      /* LEVEL 3: ELEMENT SPACING */
      /* ========================= */
      
      /* Fix component internal spacing with high specificity */
      #main-content section h1, 
      #main-content section h2, 
      #main-content section [role="heading"] {
        margin-top: 0 !important;
        margin-bottom: 8px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      
      #main-content section p {
        margin-top: 0 !important;
        margin-bottom: 8px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      
      /* Flatten all margins in components */
      #main-content section .mt-1, #main-content section .mt-2, #main-content section .mt-3,
      #main-content section .mt-4, #main-content section .mt-6, #main-content section .mt-8,
      #main-content section .mt-10, #main-content section .mt-12, #main-content section .mt-16,
      #main-content section .mb-1, #main-content section .mb-2, #main-content section .mb-3,
      #main-content section .mb-4, #main-content section .mb-6, #main-content section .mb-8,
      #main-content section .mb-10, #main-content section .mb-12, #main-content section .mb-16,
      #main-content section .py-2, #main-content section .py-4, #main-content section .py-6,
      #main-content section .py-8, #main-content section .py-10, #main-content section .py-12,
      #main-content section .py-16, #main-content section .py-20, #main-content section .py-24 {
        margin-top: 4px !important;
        margin-bottom: 4px !important;
        padding-top: 4px !important;
        padding-bottom: 4px !important;
      }
      
      /* Override text rotation min-height */
      #main-content [role="text"],
      #main-content [class*="text-rotate"] {
        min-height: auto !important;
        margin-bottom: 8px !important;
      }
      
      /* ========================= */
      /* LEVEL 4: DEBUG UTILITIES */
      /* ========================= */
      
      /* Colorful debug borders to visualize spacing issues */
      .debug-borders section {
        border: 2px solid red !important;
        background-color: rgba(255,0,0,0.05) !important;
      }
      
      .debug-borders .section-transition {
        border: 2px solid blue !important;
        background-color: rgba(0,0,255,0.05) !important;
      }
      
      .debug-borders section > div {
        border: 2px solid green !important;
        background-color: rgba(0,255,0,0.05) !important;
      }
      
      .debug-borders section > div > div {
        border: 1px solid orange !important;
      }
      
      /* Height indicator debug tool */
      .debug-borders .section-transition::after,
      .debug-borders section::after {
        content: attr(style);
        position: absolute;
        right: 8px;
        top: 8px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 10px;
        z-index: 9999;
        white-space: nowrap;
        display: block;
      }
    `;
    document.head.appendChild(spaceFixStyle);
    
    return () => {
      document.head.removeChild(scrollScript);
      document.head.removeChild(styleTag);
      document.head.removeChild(spaceFixStyle);
    };
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
  
  // Enhanced debug tools with measurements and keyboard shortcuts
  useEffect(() => {
    // Debug state object
    const debugState = {
      showBorders: false,
      showMeasurements: false,
      showDetails: false
    };
    
    // Create debug overlay element
    const createDebugOverlay = () => {
      // Remove existing overlay if any
      const existingOverlay = document.getElementById('spacing-debug-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Create new overlay with enhanced capabilities
      const debugOverlay = document.createElement('div');
      debugOverlay.id = 'spacing-debug-overlay';
      debugOverlay.style.position = 'fixed';
      debugOverlay.style.bottom = '10px';
      debugOverlay.style.right = '10px';
      debugOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      debugOverlay.style.color = 'white';
      debugOverlay.style.padding = '8px 12px';
      debugOverlay.style.borderRadius = '4px';
      debugOverlay.style.zIndex = '10000';
      debugOverlay.style.fontSize = '12px';
      debugOverlay.style.fontFamily = 'monospace';
      debugOverlay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      debugOverlay.style.maxWidth = '300px';
      
      if (debugState.showBorders || debugState.showMeasurements || debugState.showDetails) {
        // Show active debug options
        debugOverlay.innerHTML = `
          <div style="margin-bottom:8px;font-weight:bold;">Spacing Debug Tools</div>
          <div>
            <span style="color:${debugState.showBorders ? '#4ADE80' : '#71717A'}">Borders</span> | 
            <span style="color:${debugState.showMeasurements ? '#4ADE80' : '#71717A'}">Measurements</span> | 
            <span style="color:${debugState.showDetails ? '#4ADE80' : '#71717A'}">Details</span>
          </div>
          <div style="margin-top:4px;font-size:10px;color:#D4D4D8">
            Alt+D: Toggle | Alt+M: Measure | Alt+I: Details
          </div>
        `;
        document.body.appendChild(debugOverlay);
      }
      
      // Update CSS classes based on debug state
      document.body.classList.toggle('debug-borders', debugState.showBorders);
      document.body.classList.toggle('debug-measurements', debugState.showMeasurements);
      document.body.classList.toggle('debug-details', debugState.showDetails);
      
      // Update React state for UI components
      setShowDebugBorders(debugState.showBorders);
    };
    
    // Main keyboard shortcut handler with multiple options
    const handleDebugKeypress = (e: KeyboardEvent) => {
      // Alt+D: Toggle debug borders
      if (e.altKey && e.key.toLowerCase() === 'd') {
        debugState.showBorders = !debugState.showBorders;
        createDebugOverlay();
      }
      
      // Alt+M: Toggle measurements
      if (e.altKey && e.key.toLowerCase() === 'm') {
        debugState.showMeasurements = !debugState.showMeasurements;
        
        if (debugState.showMeasurements) {
          // Add measurement script
          const measureScript = document.createElement('script');
          measureScript.id = 'spacing-measurement-script';
          measureScript.innerHTML = `
            (function() {
              // Measure heights of all sections and transitions
              function updateMeasurements() {
                const sections = document.querySelectorAll('section');
                const transitions = document.querySelectorAll('.section-transition');
                
                // Add measurement labels to sections
                sections.forEach((section, index) => {
                  const height = section.offsetHeight;
                  const existingLabel = section.querySelector('.height-label');
                  
                  if (existingLabel) {
                    existingLabel.textContent = height + 'px';
                  } else {
                    const label = document.createElement('div');
                    label.className = 'height-label';
                    label.textContent = height + 'px';
                    label.style.position = 'absolute';
                    label.style.top = '2px';
                    label.style.right = '2px';
                    label.style.backgroundColor = 'rgba(255,0,0,0.8)';
                    label.style.color = 'white';
                    label.style.padding = '2px 4px';
                    label.style.borderRadius = '2px';
                    label.style.fontSize = '10px';
                    label.style.zIndex = '9999';
                    
                    // Make sure section has a position context
                    if (window.getComputedStyle(section).position === 'static') {
                      section.style.position = 'relative';
                    }
                    
                    section.appendChild(label);
                  }
                });
                
                // Add measurement labels to transitions
                transitions.forEach((transition, index) => {
                  const height = transition.offsetHeight;
                  const existingLabel = transition.querySelector('.height-label');
                  
                  if (existingLabel) {
                    existingLabel.textContent = height + 'px';
                  } else {
                    const label = document.createElement('div');
                    label.className = 'height-label';
                    label.textContent = height + 'px';
                    label.style.position = 'absolute';
                    label.style.top = '2px';
                    label.style.right = '2px';
                    label.style.backgroundColor = 'rgba(0,0,255,0.8)';
                    label.style.color = 'white';
                    label.style.padding = '2px 4px';
                    label.style.borderRadius = '2px';
                    label.style.fontSize = '10px';
                    label.style.zIndex = '9999';
                    
                    // Make sure transition has a position context
                    if (window.getComputedStyle(transition).position === 'static') {
                      transition.style.position = 'relative';
                    }
                    
                    transition.appendChild(label);
                  }
                });
              }
              
              // Run initial measurement
              updateMeasurements();
              
              // Update on resize
              window.addEventListener('resize', updateMeasurements);
              
              // Update on scroll (throttled)
              let scrollTimeout;
              window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateMeasurements, 100);
              }, { passive: true });
            })();
          `;
          document.head.appendChild(measureScript);
        } else {
          // Remove measurement script and labels
          const measureScript = document.getElementById('spacing-measurement-script');
          if (measureScript) {
            measureScript.remove();
          }
          
          // Remove measurement labels
          document.querySelectorAll('.height-label').forEach(label => {
            label.remove();
          });
        }
        
        createDebugOverlay();
      }
      
      // Alt+I: Toggle detailed inspection
      if (e.altKey && e.key.toLowerCase() === 'i') {
        debugState.showDetails = !debugState.showDetails;
        
        if (debugState.showDetails) {
          // Log component structure to console
          console.group('Component Spacing Analysis');
          console.log('Analyzing section spacing...');
          
          // Log section measurements
          document.querySelectorAll('section').forEach((section, index) => {
            const style = window.getComputedStyle(section);
            console.group(`Section ${index + 1}`);
            console.log('Height:', section.offsetHeight + 'px');
            console.log('Padding Top:', style.paddingTop);
            console.log('Padding Bottom:', style.paddingBottom);
            console.log('Margin Top:', style.marginTop);
            console.log('Margin Bottom:', style.marginBottom);
            console.log('Section Element:', section);
            console.groupEnd();
          });
          
          // Log transition measurements
          document.querySelectorAll('.section-transition').forEach((transition, index) => {
            const style = window.getComputedStyle(transition);
            console.group(`Transition ${index + 1}`);
            console.log('Height:', transition.offsetHeight + 'px');
            console.log('Min-Height:', style.minHeight);
            console.log('Max-Height:', style.maxHeight);
            console.log('Transition Element:', transition);
            console.groupEnd();
          });
          
          console.groupEnd();
        }
        
        createDebugOverlay();
      }
    };
    
    // Add the event listener for debug keyboard shortcuts
    document.addEventListener('keydown', handleDebugKeypress);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleDebugKeypress);
      
      // Remove debug elements
      const debugOverlay = document.getElementById('spacing-debug-overlay');
      if (debugOverlay) {
        debugOverlay.remove();
      }
      
      const measureScript = document.getElementById('spacing-measurement-script');
      if (measureScript) {
        measureScript.remove();
      }
      
      document.querySelectorAll('.height-label').forEach(label => {
        label.remove();
      });
      
      // Remove debug classes
      document.body.classList.remove('debug-borders', 'debug-measurements', 'debug-details');
    };
  }, []);
  
  return (
    <div className={cn(
      "flex flex-col min-h-screen w-full bg-[#EBE3FF]",
      showDebugBorders && "debug-borders" // Add debug class conditionally
    )} 
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
      {/* Apply desktop-specific styling for transitions */}
      <DesktopTransitionStyles />
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
            // Hero section (1st) gets slightly more padding than others
            isMobile ? "pt-4 pb-4" : "pt-8 pb-8", // 16px/32px - reduced by 50% from original pt-16 pb-20
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
                
                /* Ultra-compact spacing for hero container */
                .hero-compact-container {
                  --heading-spacing: 4px;   /* Heading bottom margin */
                  --text-spacing: 4px;      /* Paragraph bottom margin */
                  --content-spacing: 8px;   /* Content blocks spacing */
                  --container-spacing: 8px; /* Container padding */
                  
                  padding: 0 !important;
                  margin: 0 !important;
                  max-height: 480px !important;
                  overflow: visible !important;
                }
                
                /* All hero components at all levels */
                .hero-compact-container, 
                .hero-compact-container div,
                .hero-compact-container [class*="flex"],
                .hero-compact-container [class*="container"] {
                  min-height: auto !important;
                }
                
                /* Ultra-compact Hero heading elements */
                .hero-compact-container h1, 
                .hero-compact-container h2, 
                .hero-compact-container [role="heading"],
                .hero-compact-container span[class*="text-"],
                .hero-compact-container div[aria-hidden="true"] {
                  margin: 0 !important;
                  margin-bottom: var(--heading-spacing) !important;
                  padding: 0 !important;
                  line-height: 1.2 !important;
                }
                
                /* Ultra-compact Hero paragraph elements */
                .hero-compact-container p,
                .hero-compact-container [class*="text-base"] {
                  margin: 0 !important;
                  margin-bottom: var(--text-spacing) !important;
                  padding: 0 !important;
                  line-height: 1.4 !important;
                }
                
                /* Override button container spacing */
                .hero-compact-container [class*="button-container"],
                .hero-compact-container [id*="hero-cta-section"],
                .hero-compact-container [class*="items-center"] > button {
                  margin: 0 !important;
                  margin-top: var(--content-spacing) !important;
                  padding: 0 !important;
                }
                
                /* Main level container - the actual Hero component */
                .hero-compact-container > div {
                  padding: var(--container-spacing) !important;
                  margin: 0 !important;
                }
                
                /* Target the TextRotate animation container */
                .hero-compact-container [role="text"],
                .hero-compact-container [class*="text-rotate"],
                .hero-compact-container [class*="relative flex"] {
                  min-height: auto !important;
                  height: auto !important;
                  margin: 0 !important;
                  margin-bottom: var(--content-spacing) !important;
                  padding: 0 !important;
                }
                
                /* Override specific utility classes */
                .hero-compact-container .pt-24, .hero-compact-container .pb-24,
                .hero-compact-container .pt-28, .hero-compact-container .pb-28,
                .hero-compact-container .pt-32, .hero-compact-container .pb-36,
                .hero-compact-container .py-10, .hero-compact-container .py-16,
                .hero-compact-container .py-20, .hero-compact-container .py-24,
                .hero-compact-container [class*="pt-"], .hero-compact-container [class*="pb-"],
                .hero-compact-container [class*="py-"], .hero-compact-container [class*="my-"],
                .hero-compact-container [class*="mt-"], .hero-compact-container [class*="mb-"] {
                  padding-top: 0 !important;
                  padding-bottom: 0 !important;
                  margin-top: 0 !important;
                  margin-bottom: 0 !important;
                }
                
                /* Mobile specific spacing adjustments */
                @media (max-width: 640px) {
                  .hero-compact-container {
                    --heading-spacing: 2px;
                    --text-spacing: 2px;
                    --content-spacing: 4px;
                    --container-spacing: 4px;
                    
                    max-height: 320px !important;
                  }
                }
                
                /* Target gap utilities specifically */
                .hero-compact-container [class*="gap-"] {
                  gap: 4px !important;
                }
                
                /* Specific hacks for classes used in the Hero.tsx component */
                .hero-compact-container .h-\\[4em\\],
                .hero-compact-container .h-\\[4.5em\\],
                .hero-compact-container [class*="h-["] {
                  height: auto !important;
                  min-height: 0 !important;
                }
                
                /* Force text size reduction for better fit */
                .hero-compact-container [class*="text-3xl"],
                .hero-compact-container [class*="text-5xl"],
                .hero-compact-container [class*="text-6xl"] {
                  font-size: 1.875rem !important; /* text-3xl size */
                  line-height: 1.15 !important;
                }
                
                /* Reduce size of controls */
                .hero-compact-container .social-proof,
                .hero-compact-container [class*="SocialProof"] {
                  transform: scale(0.85) !important;
                }
                
                /* Fix specific problem with buttons and inputs */
                .hero-compact-container input,
                .hero-compact-container button,
                .hero-compact-container .mt-2, 
                .hero-compact-container .mb-2 {
                  margin-top: 2px !important;
                  margin-bottom: 2px !important;
                }
                
                /* Fix "Scroll to explore" section */
                .hero-compact-container [class*="justify-center"].mt-10,
                .hero-compact-container .w-full.flex.justify-center.mt-10 {
                  margin-top: 4px !important;
                  transform: scale(0.8) !important;
                  height: 20px !important;
                }
                
                /* If any positioning is absolute, make it static */
                .hero-compact-container [style*="position: absolute"] {
                  position: static !important;
                }
                
                /* Desktop height constraint */
                @media (min-width: 640px) {
                  .hero-compact-container {
                    max-height: 400px !important;
                  }
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
                    padding-top: var(--space-sm);    /* 16px - 50% reduction from previous 24px */
                    padding-bottom: var(--space-sm); /* 16px - 50% reduction */
                  }
                  
                  /* More generous spacing for desktop content */
                  .hero-compact-container > div > div[class*="flex"] {
                    margin-bottom: var(--space-xs); /* 8px - 50% reduction */
                  }
                  
                  /* Consistent system for desktop CTA section */
                  .hero-compact-container #hero-cta-section,
                  .hero-compact-container div[id="hero-cta-section"] {
                    margin-bottom: var(--space-xs); /* 8px - 50% reduction */
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
        
        {/* Combined Scroll Target and Transition between Hero and Find Creators */}
        <ScrollTransition 
          id="find-creators"
          fromColor="#EBE3FF" 
          toColor="#F9F6EC" 
          // First transition uses maximum values since it's most important visually
          height={isMobile ? 40 : 60} // 60px on desktop (down from 120px)
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
            // 2nd section - progressive reduction pattern
            isMobile ? "pt-3 pb-3" : "pt-6 pb-7", // 12px mobile, 24px/28px desktop (was 64px/80px)
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
            // 3rd section - continuing the reduction pattern
            isMobile ? "pt-2 pb-3" : "pt-5 pb-5", // 8px/12px mobile, 20px desktop - 60% reduction
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
            // 4th section - more compact as we scroll down
            isMobile ? "pt-2 pb-2" : "pt-4 pb-4", // 8px mobile, 16px desktop - 70% reduction
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
            // 5th section - minimal padding 
            isMobile ? "pt-2 pb-2" : "pt-3 pb-4", // 8px mobile, 12px/16px desktop - 75% reduction
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
            // Final section - tightest spacing
            isMobile ? "pt-2 pb-2" : "pt-3 pb-3", // 8px mobile, 12px desktop - 80% reduction
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