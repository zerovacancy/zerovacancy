import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { WaitlistCreatorCTA } from "../ui/waitlist-creator-cta";
import { TextRotate } from "../ui/text-rotate";
import { SocialProof } from "../ui/waitlist/social-proof";
import { SuccessConfirmation } from "../ui/waitlist/success-confirmation";
import { toast } from "sonner";
import { CheckCircle, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";
import { heroPatternDotMatrix } from "@/utils/background-patterns";
import { mobileOptimizationClasses } from "@/utils/mobile-optimization";

// Import consolidated CLS prevention styles
import "./hero-cls-prevention.css";

// Hero CTA with email form for mobile that transitions from button to form
// Uses an inline success message instead of a modal dialog for better mobile compatibility
const MobileHeroCTA = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Validate email as user types
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(email.length > 0 && emailRegex.test(email));
  }, [email]);
  
  // Focus input after showing form
  useEffect(() => {
    if (showForm && inputRef.current) {
      // Add small delay to ensure element is mounted and renderable
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showForm]);
  
  // Handle initial button click
  const handleButtonClick = () => {
    setShowForm(true);
  };
  
  // Handle form submission - using EXACT same flow as desktop
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Include metadata for tracking
      const metadata = {
        source: "mobile_hero",
        referrer: document.referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      
      // Submit to waitlist API
      const { data, error } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source: "mobile_hero", 
          marketingConsent: true,
          metadata
        }
      });
      
      if (error) {
        console.error("Error submitting email:", error);
        toast.error("Failed to join waitlist. Please try again.");
        return;
      }
      
      // Store the email for the confirmation dialog
      const emailToStore = email;
      setSubmittedEmail(emailToStore);
      
      // Check if already subscribed - SAME as desktop flow
      setAlreadySubscribed(data?.status === 'already_subscribed');
      
      // Clear form
      setEmail("");
      setShowForm(false);
      
      // On mobile, we'll use an inline success message instead of a dialog
      // This avoids all the issues with dialog rendering on mobile browsers
      setShowInlineSuccess(true);
      
      // Fire confetti immediately - simplified to avoid window object issues
      try {
        // Just use the imported confetti directly
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 }
        });
      } catch (err) {
        console.error("Confetti failed:", err);
      }
      
      // Set state to true for conditional rendering
      setShowConfetti(true);
      
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Direct trigger for confetti when showing success message - simplified
  useEffect(() => {
    if (showInlineSuccess) {
      console.log("Firing confetti for mobile success");
      
      // Set a timeout to ensure the UI is rendered first
      setTimeout(() => {
        try {
          // Use imported confetti directly - avoiding window object
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 }
          });
        } catch (err) {
          console.error("Confetti failed:", err);
        }
      }, 100);
    }
  }, [showInlineSuccess]);
  
  // Render success state after submission
  if (showInlineSuccess) {
    return (
      <>
        <div 
          className="mobile-card w-full max-w-[250px] py-space-md px-space-sm mobile-card-gradient text-white relative flex flex-col items-center justify-center animate-fade-in gpu-accelerated"
          style={{
            // CLS-CRITICAL: Fixed dimensions to match initial button
            height: '54px',
            minHeight: '54px',
            // Hardware acceleration
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Animation only affects opacity, not layout
            transition: 'opacity 0.3s ease-in-out',
            // Consistent borders
            borderRadius: 'var(--mobile-border-radius, 12px)'
          }}
        >
          <div className="h-14 w-14 bg-purple-50/20 rounded-full flex items-center justify-center mb-space-xs">
            <CheckCircle className="h-7 w-7 text-white" />
          </div>
          <h3 className="mobile-text-lg mobile-heading text-white mb-1">
            {alreadySubscribed ? "Already Subscribed" : "Success!"}
          </h3>
          <p className="mobile-text-sm text-white/90 text-center max-w-[24rem] mb-1">
            {alreadySubscribed 
              ? `${submittedEmail} is already on our waitlist.`
              : `We've added ${submittedEmail} to our waitlist.`
            }
          </p>
          <p className="mobile-text-xs text-white/80">
            We'll notify you as soon as we launch.
          </p>
        </div>
      </>
    );
  }

  // Render initial button if form isn't shown
  if (!showForm) {
    return (
      <button
        onClick={handleButtonClick}
        className={cn(
          "mobile-button mobile-touch-target w-full mx-auto font-medium text-white relative flex items-center justify-center",
          "max-w-[250px] rounded-[var(--mobile-border-radius)]",
          "bg-gradient-to-b from-[#8A42F5] to-[#7837DB]",
          "gpu-accelerated"
        )}
        style={{
          paddingLeft: '52px',
          // CLS-CRITICAL: Fixed dimensions for button
          height: '54px',
          minHeight: '54px',
          // Hardware acceleration
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Animation only affects opacity
          transition: 'opacity 0.3s ease, transform 0.2s ease',
          // Avoid any layout shifts
          position: 'relative'
        }}
      >
        {/* Icon container */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 flex items-center justify-center bg-[#8A42F5] rounded-lg border border-white/30"
          style={{
            width: '32px',
            height: '32px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
          </svg>
        </div>
        <span className="mobile-text-base font-semibold">RESERVE EARLY ACCESS</span>
      </button>
    );
  }
  
  // Form state after button is clicked
  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-[250px] mx-auto relative animate-fade-in gpu-accelerated z-30"
        style={{
          // CLS-CRITICAL: Consistent dimensions with button
          height: 'var(--cta-button-mobile-height, 54px)',
          minHeight: 'var(--cta-button-mobile-height, 54px)',
          // Hardware acceleration
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Prevent any layout shifts
          position: 'relative',
          // Transitions that don't affect layout
          transition: 'opacity 0.3s ease-in-out',
          // Fixed containment to prevent any external impact
          contain: 'layout style',
          // Explicit width matching the button
          width: '100%',
          maxWidth: '250px'
        }}
      >
        <div 
          className="flex flex-col w-full shadow-lg"
          style={{
            // Fixed height to match button for smooth transition
            height: 'var(--cta-button-mobile-height, 54px)',
            // Hardware acceleration
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Ensure stable rendering
            position: 'relative'
          }}
        >
          <div className="relative h-full">
            {/* Email input with mobile styling */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mobile-input w-full rounded-t-[var(--mobile-border-radius)] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
              style={{
                backgroundColor: 'white',
                // Prevent height changes during focus
                height: 'calc(var(--cta-button-mobile-height, 54px) / 2)',
                minHeight: 'calc(var(--cta-button-mobile-height, 54px) / 2)',
                // Prevent unexpected layout changes
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
              required
            />
            
            {/* Check mark for valid email */}
            {isValid && (
              <div 
                className="absolute right-3 top-1/4 transform -translate-y-1/2 text-green-500 z-10"
                style={{
                  // Hardware acceleration
                  transform: 'translateY(-50%) translateZ(0)',
                  willChange: 'opacity',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>
          
          {/* Submit button with mobile styling */}
          <button
            type="submit"
            disabled={isLoading}
            className="mobile-button bg-gradient-to-b from-[#8A42F5] to-[#7837DB] text-white font-semibold rounded-t-none rounded-b-[var(--mobile-border-radius)] flex items-center justify-center"
            style={{
              // Fixed height for the bottom half of the form
              height: 'calc(var(--cta-button-mobile-height, 54px) / 2)',
              minHeight: 'calc(var(--cta-button-mobile-height, 54px) / 2)',
              // Prevent padding from changing height
              boxSizing: 'border-box',
              // Hardware acceleration
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              // Only animate properties that don't affect layout
              transition: 'opacity 0.3s ease, background-color 0.3s ease'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 
                  className="w-5 h-5 mr-2 animate-spin" 
                  style={{ flexShrink: 0 }}
                />
                <span className="mobile-text-base">Joining...</span>
              </>
            ) : (
              <>
                <ShieldCheck 
                  className="w-5 h-5 mr-2" 
                  style={{ flexShrink: 0 }}
                />
                <span className="mobile-text-base">JOIN WAITLIST</span>
                <ArrowRight 
                  className="w-4 h-4 ml-2" 
                  style={{ flexShrink: 0 }}
                />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Fire confetti when showConfetti is true */}
      {showConfetti && (
        <div 
          className="fixed inset-0 pointer-events-none z-[5000]"
          style={{
            // Prevent any layout impact
            pointerEvents: 'none',
            // Hardware acceleration
            transform: 'translateZ(0)',
            willChange: 'opacity'
          }}
        >
          {/* Confetti handled via the confetti library */}
        </div>
      )}
    </>
  );
};

const TITLES = ["CONVERTS", "CAPTIVATES", "CLOSES"];

// Export with both default and named export for compatibility
export const Hero = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Initialize the viewport height custom property
  useViewportHeight();
  
  // Text rotation state references
  const rotatingContainerRef = useRef<HTMLDivElement>(null);
  const [rotatingContainerStable, setRotatingContainerStable] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInView) {
      const intervalTime = isMobile ? 3500 : 3000;
      
      interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % TITLES.length);
      }, intervalTime);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInView, isMobile]);
  
  // Use ResizeObserver to ensure rotation container stability
  useEffect(() => {
    // Get the rotating text container by attribute
    const rotatingContainer = sectionRef.current?.querySelector('[data-rotating-text="true"]');
    if (!rotatingContainer || !(rotatingContainer instanceof HTMLElement)) return;
    
    // Set the reference
    rotatingContainerRef.current = rotatingContainer;
    
    // Create a ResizeObserver to detect and handle any size changes
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const expectedHeight = isMobile
          ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rotating-text-height-mobile') || '44')
          : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rotating-text-height-desktop') || '64');
        
        // When height changes, enforce our defined height
        if (Math.abs(entry.contentRect.height - expectedHeight) > 1) {
          const heightVar = isMobile
            ? 'var(--rotating-text-height-mobile, 44px)'
            : 'var(--rotating-text-height-desktop, 64px)';
            
          target.style.setProperty('height', heightVar, 'important');
          target.style.setProperty('min-height', heightVar, 'important');
          target.style.setProperty('max-height', heightVar, 'important');
        }
      }
      
      // Mark as stable after observing
      if (!rotatingContainerStable) {
        setRotatingContainerStable(true);
      }
    });
    
    // Start observing the container
    resizeObserver.observe(rotatingContainer);
    
    // Clean up the observer
    return () => {
      resizeObserver.disconnect();
    };
  }, [isMobile, rotatingContainerStable]);
  
  // Consolidated effect for style management and CLS prevention
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Function to apply styles with !important to override any conflicting styles
    const applyStyle = (el: HTMLElement, prop: string, value: string) => {
      el.style.setProperty(prop, value, 'important');
    };
    
    // Consolidated function to enforce CLS-preventing styles
    const enforceCLSPreventionStyles = () => {
      if (!sectionRef.current) return;
      
      // Get the hero element
      const hero = sectionRef.current;
      
      // 1. CORE LAYOUT STRUCTURE - essential for preventing CLS
      // ------------------------------------------------------
      
      // Basic structure for both mobile and desktop
      applyStyle(hero, 'display', 'flex');
      applyStyle(hero, 'flex-direction', 'column');
      applyStyle(hero, 'align-items', 'center');
      applyStyle(hero, 'margin', '0');
      
      // Handle viewport height with CSS variables
      if (isMobile) {
        // Mobile uses viewport-height variables for consistency across browsers
        applyStyle(hero, 'height', 'var(--hero-mobile-height, 450px)');
        applyStyle(hero, 'min-height', 'var(--hero-mobile-height, 450px)');
        applyStyle(hero, 'max-height', 'var(--hero-vh-height, 100vh)');
        applyStyle(hero, 'padding-top', '80px');
        applyStyle(hero, 'padding-bottom', '60px');
        applyStyle(hero, 'justify-content', 'flex-start');
      } else {
        // Desktop uses simpler auto-height approach
        applyStyle(hero, 'height', 'auto');
        applyStyle(hero, 'min-height', 'auto');
        applyStyle(hero, 'max-height', 'none');
        applyStyle(hero, 'padding-top', '60px');
        applyStyle(hero, 'padding-bottom', '60px');
        applyStyle(hero, 'justify-content', 'center');
      }
      
      // 2. CLS PREVENTION FOR NESTED ELEMENTS
      // ------------------------------------------------------
      
      // Reset heights on all containers to avoid unexpected constraints
      hero.querySelectorAll('div').forEach(container => {
        if (container instanceof HTMLElement && 
            !container.classList.contains('rotating-text-container') && 
            !container.hasAttribute('data-rotating-text')) {
          applyStyle(container, 'min-height', 'auto');
        }
      });
      
      // 3. HERO TITLE CONTAINER - critical for CLS
      // ------------------------------------------------------
      const heroTitle = hero.querySelector('#hero-title');
      if (heroTitle && heroTitle instanceof HTMLElement) {
        applyStyle(heroTitle, 'margin', '0 0 30px 0');
        applyStyle(heroTitle, 'padding', '0');
        applyStyle(heroTitle, 'width', '100%');
        applyStyle(heroTitle, 'text-align', 'center');
        
        // Use explicit height only on mobile
        if (isMobile) {
          applyStyle(heroTitle, 'min-height', 'calc(var(--rotating-text-height-mobile, 44px) + 48px)');
        } else {
          applyStyle(heroTitle, 'min-height', 'auto');
        }
      }
      
      // 4. ROTATING TEXT CONTAINER - most critical for CLS
      // ------------------------------------------------------
      const rotatingTextContainer = hero.querySelector('[data-rotating-text="true"]');
      if (rotatingTextContainer && rotatingTextContainer instanceof HTMLElement) {
        // Critical: fixed height based on device
        if (isMobile) {
          applyStyle(rotatingTextContainer, 'height', 'var(--rotating-text-height-mobile, 44px)');
          applyStyle(rotatingTextContainer, 'min-height', 'var(--rotating-text-height-mobile, 44px)');
          applyStyle(rotatingTextContainer, 'max-height', 'var(--rotating-text-height-mobile, 44px)');
        } else {
          applyStyle(rotatingTextContainer, 'height', 'var(--rotating-text-height-desktop, 64px)');
          applyStyle(rotatingTextContainer, 'min-height', 'var(--rotating-text-height-desktop, 64px)');
          applyStyle(rotatingTextContainer, 'max-height', 'var(--rotating-text-height-desktop, 64px)');
        }
        
        // Ensure proper centering and overflow handling
        applyStyle(rotatingTextContainer, 'margin-top', '4px');
        applyStyle(rotatingTextContainer, 'margin-bottom', '8px');
        applyStyle(rotatingTextContainer, 'width', '100%');
        applyStyle(rotatingTextContainer, 'padding', '0');
        applyStyle(rotatingTextContainer, 'position', 'relative');
        applyStyle(rotatingTextContainer, 'overflow', 'visible');
        
        // Hardware acceleration for smooth animations
        applyStyle(rotatingTextContainer, 'transform', 'translateZ(0)');
        applyStyle(rotatingTextContainer, 'backface-visibility', 'hidden');
        applyStyle(rotatingTextContainer, '-webkit-backface-visibility', 'hidden');
        
        // Contain style to prevent layout shifts
        applyStyle(rotatingTextContainer, 'contain', 'paint style');
      }
      
      // 5. HERO DESCRIPTION - controlled spacing to prevent shifts
      // ------------------------------------------------------
      const paragraphs = hero.querySelectorAll('p');
      paragraphs.forEach(el => {
        if (el instanceof HTMLElement) {
          // Basic text styling
          applyStyle(el, 'line-height', '1.5');
          
          if (isMobile) {
            applyStyle(el, 'margin-top', '24px');
            applyStyle(el, 'margin-bottom', '32px');
            applyStyle(el, 'text-align', 'center');
            applyStyle(el, 'font-size', '0.95rem');
            applyStyle(el, 'padding', '0 16px');
            applyStyle(el, 'max-width', '310px'); // Control line length for readability
          } else {
            applyStyle(el, 'margin-top', '24px');
            applyStyle(el, 'margin-bottom', '32px');
            applyStyle(el, 'padding', '0 16px');
          }
        }
      });
      
      // 6. CTA SECTIONS - ensure consistent dimensions
      // ------------------------------------------------------
      if (isMobile) {
        const mobileCTASection = hero.querySelector('#mobile-hero-cta-section');
        if (mobileCTASection && mobileCTASection instanceof HTMLElement) {
          applyStyle(mobileCTASection, 'width', '100%');
          applyStyle(mobileCTASection, 'max-width', '280px');
          applyStyle(mobileCTASection, 'margin', '0 auto');
          applyStyle(mobileCTASection, 'padding', '0');
          applyStyle(mobileCTASection, 'min-height', 'var(--cta-button-mobile-height, 54px)');
          applyStyle(mobileCTASection, 'height', 'var(--cta-button-mobile-height, 54px)');
          
          // Hardware acceleration
          applyStyle(mobileCTASection, 'transform', 'translateZ(0)');
          applyStyle(mobileCTASection, 'backface-visibility', 'hidden');
          applyStyle(mobileCTASection, '-webkit-backface-visibility', 'hidden');
        }
      } else {
        const ctaSection = hero.querySelector('#hero-cta-section');
        if (ctaSection && ctaSection instanceof HTMLElement) {
          applyStyle(ctaSection, 'width', '100%');
          applyStyle(ctaSection, 'max-width', '680px');
          applyStyle(ctaSection, 'margin', '0 auto');
          applyStyle(ctaSection, 'padding', '0');
          applyStyle(ctaSection, 'min-height', 'auto');
          
          // CLS prevention for desktop button container
          const buttonContainer = ctaSection.querySelector('.flex.flex-row');
          if (buttonContainer && buttonContainer instanceof HTMLElement) {
            applyStyle(buttonContainer, 'display', 'flex');
            applyStyle(buttonContainer, 'justify-content', 'center');
            applyStyle(buttonContainer, 'align-items', 'center');
            applyStyle(buttonContainer, 'gap', '24px');
            applyStyle(buttonContainer, 'margin-bottom', '16px');
          }
          
          // Consistent spacing for social proof
          const socialProof = ctaSection.querySelector('.flex.justify-center');
          if (socialProof && socialProof instanceof HTMLElement) {
            applyStyle(socialProof, 'margin-top', '20px');
            applyStyle(socialProof, 'margin-bottom', '16px');
          }
        }
      }
    };
    
    // Apply styles immediately
    enforceCLSPreventionStyles();
    
    // Create a single MutationObserver to reinforce styles if they change
    const styleObserver = new MutationObserver(() => {
      enforceCLSPreventionStyles();
    });
    
    // Start observing style and class attribute changes
    styleObserver.observe(sectionRef.current, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    // Set up resize listener to reapply styles on viewport changes
    window.addEventListener('resize', enforceCLSPreventionStyles, { passive: true });
    
    // Apply after load to override any other scripts
    window.addEventListener('load', enforceCLSPreventionStyles);
    
    // Set up intersection observer for visibility detection
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          // Apply styles again when visible
          enforceCLSPreventionStyles();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '100px'
      }
    );

    // Start observing visibility
    intersectionObserver.observe(sectionRef.current);

    // Cleanup
    return () => {
      styleObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('load', enforceCLSPreventionStyles);
      window.removeEventListener('resize', enforceCLSPreventionStyles);
    };
  }, [isMobile]);

  return (
    <section
      id="hero" 
      ref={sectionRef}
      data-hero-section="true"
      className={cn(
        "flex flex-col items-center w-full bg-[#F9F6EC] relative",
        isMobile ? "pt-[var(--mobile-header-height)] pb-space-xl" : "pt-[60px] pb-[60px]",
        "gpu-accelerated"
      )}
      style={{
        // CLS prevention with explicit dimensions using CSS variables
        height: isMobile ? 'var(--hero-mobile-height, 450px)' : 'auto',
        minHeight: isMobile ? 'var(--hero-mobile-height, 450px)' : 'var(--hero-desktop-height, 650px)',
        // Use viewport height when available via CSS variable
        maxHeight: isMobile ? 'var(--hero-vh-height, 100vh)' : 'none',
        // Hardware acceleration for smoother rendering
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Force immediate paint for critical content
        contentVisibility: 'visible',
        // Prevent layout shifts with stable contain value
        contain: 'paint style layout',
        // Ensure proper box sizing
        boxSizing: 'border-box',
        // Ensure stable stacking context
        zIndex: 1
      }}
      aria-labelledby="hero-title"
    >
      <div 
        className={cn(
          "flex flex-col items-center w-full max-w-7xl",
          isMobile ? "px-container-padding-mobile" : "px-4 sm:px-6 lg:px-8",
          "text-center",
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col items-center w-full text-center" 
          style={{
            maxWidth: isMobile ? '100%' : '920px'
          }}
        >
          {/* Main heading - both screen-reader friendly and visually styled */}
          <h1 id="hero-title" className={cn(
            "tracking-tight font-bold text-center w-full flex flex-col items-center",
            "mobile-heading",
            isMobile ? "mb-space-md" : "mb-[30px]"
          )}
          data-hero-title="true"
          style={{
            // CLS-CRITICAL: Consistent height for hero title container
            minHeight: isMobile ? 'var(--title-container-height, 120px)' : 'auto',
            // Hardware acceleration for smooth rendering
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}>
            <span 
              className={cn(
                isMobile ? "mobile-text-2xl" : "text-4xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "font-jakarta mb-2",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                "font-bold",
                "w-full mx-auto text-center"
              )}
            >
              PROPERTY CONTENT THAT
            </span>

            <div 
              className="flex justify-center w-full text-center rotating-text-container"
              style={{ 
                // CLS-CRITICAL: Explicit fixed dimensions for text rotation container
                height: isMobile ? "var(--rotating-text-height-mobile, 44px)" : "var(--rotating-text-height-desktop, 64px)",
                minHeight: isMobile ? "var(--rotating-text-height-mobile, 44px)" : "var(--rotating-text-height-desktop, 64px)",
                maxHeight: isMobile ? "var(--rotating-text-height-mobile, 44px)" : "var(--rotating-text-height-desktop, 64px)",
                width: '100%',
                // Hardware acceleration
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                // Layout stability
                position: 'relative',
                overflow: 'visible',
                // Prevent content shifts
                contain: 'paint style',
                // CLS-safe animations
                transition: 'opacity var(--animation-duration-normal, 0.3s) ease-in-out'
              }}
              data-rotating-text="true"
            >
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center h-auto"
                staggerFrom="last"
                // CLS-CRITICAL: ONLY animate opacity, nothing that affects layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Disable staggering to prevent any timing-related layout shifts
                staggerDuration={0}
                // Use device-appropriate interval
                rotationInterval={isMobile ? 3500 : 3000}
                // Ensure consistent positioning and overflow handling
                splitLevelClassName="overflow-visible absolute inset-0 flex items-center justify-center"
                // Combine classes with device-specific typography
                elementLevelClassName={cn(
                  // CRITICAL: Use mobile-specific text size
                  isMobile ? "mobile-text-3xl" : "text-4xl sm:text-5xl lg:text-6xl",
                  // Typography that won't cause shifts
                  "font-bold font-jakarta tracking-[-0.03em]",
                  // Gradient text that won't affect layout
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  // Visual effects that don't affect layout
                  "animate-shimmer-slide bg-size-200",
                  "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
                  "filter brightness-110",
                  // Fixed line height to prevent text height variations
                  "leading-[1.3]",
                  // Essential hardware acceleration
                  "gpu-accelerated transform-gpu backface-hidden"
                )}
                // CLS-CRITICAL: Animation that ONLY affects opacity, with consistent timing
                transition={{ 
                  type: "tween", 
                  duration: 0.3,
                  ease: "easeInOut",
                  // Only animate opacity
                  opacity: { duration: 0.3 }
                }}
                // Use automatic rotation
                auto={true}
                // CRITICAL: Fixed dimensions and hardware acceleration
                containerStyle={{
                  // Static positioning
                  position: 'relative',
                  // Explicit dimensions
                  width: '100%',
                  height: '100%',
                  // Fixed content height that matches CSS variable
                  minHeight: isMobile ? 'var(--rotating-text-height-mobile, 44px)' : 'var(--rotating-text-height-desktop, 64px)',
                  maxHeight: isMobile ? 'var(--rotating-text-height-mobile, 44px)' : 'var(--rotating-text-height-desktop, 64px)',
                  // Hardware acceleration
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  // Ensure visibility without overflow impact
                  overflow: 'visible',
                  // Contain to prevent impact on other elements
                  contain: 'paint style',
                  // Transitions that don't affect layout
                  transition: 'opacity 0.3s ease-in-out',
                }}
                // Reference for ResizeObserver to maintain stability
                ref={rotatingContainerRef}
              />
            </div>
          </h1>
        </div>

        <p className={cn(
          isMobile ? "mobile-text-base mobile-body" : "text-gray-700 font-inter",
          "text-center",
          "w-full",
          isMobile ? "max-w-[95%] mb-space-lg" : "max-w-[650px] mb-10"
        )}>
          {isMobile ? (
            "Connect with top creators who transform your spaces with professional photography, video, and 3D tours that showcase your property's potential."
          ) : (
            "Connect with elite content creators who transform your spaces into compelling visual stories. Access the most in-demand creators for content that doesn't just show your property—it showcases its potential."
          )}
        </p>
      </div>

      <div 
        className={cn(
          "flex flex-col items-center w-full",
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        {!isMobile && (
          <div className="flex flex-col items-center w-full" id="hero-cta-section" 
            style={{
              maxWidth: '680px'
            }}
          >
            {/* Container for both buttons in a row with fixed width and centering */}
            <div className="flex flex-row justify-center items-center w-full gap-6 mb-6">
              {/* Reserve Your Spot button - fixed width */}
              <div style={{ width: '260px' }}>
                <WaitlistCTA 
                  buttonText="RESERVE YOUR SPOT" 
                  showSocialProof={false}
                  aria-label="Reserve your spot"
                  className="primary-cta w-full"
                  style={{
                    button: {
                      width: '100%',
                      margin: '0 auto'
                    }
                  }}
                />
              </div>
              
              {/* Join as Creator button - fixed width */}
              <div style={{ width: '260px' }}>
                <WaitlistCreatorCTA 
                  buttonText="JOIN AS CREATOR" 
                  showSocialProof={false}
                  aria-label="Join as a content creator"
                  className="secondary-cta w-full"
                  style={{
                    button: {
                      width: '100%',
                      margin: '0 auto'
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Social proof below both buttons */}
            <div className="flex justify-center items-center w-full">
              <SocialProof className="mx-auto" />
            </div>
          </div>
        )}
        
        {isMobile && (
          <>
            <div className="flex flex-col items-center w-full gap-space-sm" 
              id="mobile-hero-cta-section"
              style={{ 
                maxWidth: '280px',
                // CLS-CRITICAL: Fixed consistent height for mobile CTA section
                minHeight: 'var(--cta-button-mobile-height, 54px)',
                height: 'var(--cta-button-mobile-height, 54px)',
                // Hardware acceleration for smooth rendering
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {/* Mobile CTA with inline email form expansion */}
              <div className="w-full flex justify-center items-center">
                <MobileHeroCTA />
              </div>
              
              {/* Centered social proof */}
              <div className="flex justify-center items-center w-full mt-space-xs">
                <SocialProof 
                  className="mx-auto"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}
                />
              </div>
              
              {/* Scroll indicator */}
              <div className="flex flex-col items-center opacity-60 mt-space-sm">
                <span className="mobile-text-xs text-purple-600 mb-1 font-medium">Scroll to explore</span>
                <svg width="16" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L10 9L19 1" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;