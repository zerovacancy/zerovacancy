import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  
  // Safely handle confetti
  useEffect(() => {
    // Avoid modifying window object directly, which can cause issues
    // Just ensure confetti is available for our component's use
    if (typeof window !== 'undefined') {
      // We'll use the imported confetti directly instead of assigning to window
    }
  }, []);
  
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
        <div className="w-full max-w-[250px] py-5 px-4 font-medium rounded-[14px] text-white relative flex flex-col items-center justify-center animate-fade-in"
          style={{
            background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
            transform: 'translateZ(0)', // Hardware acceleration
            willChange: 'transform', // Optimize for animations
            margin: '0 auto',
            position: 'relative'
          }}
        >
          <div className="h-14 w-14 bg-purple-50/20 rounded-full flex items-center justify-center mb-2"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.2)'
            }}>
            <CheckCircle className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {alreadySubscribed ? "Already Subscribed" : "Success!"}
          </h3>
          <p className="text-white/90 text-center text-sm max-w-[24rem] mb-1">
            {alreadySubscribed 
              ? `${submittedEmail} is already on our waitlist.`
              : `We've added ${submittedEmail} to our waitlist.`
            }
          </p>
          <p className="text-white/80 text-xs">
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
          "w-full mx-auto font-medium rounded-[12px] text-white relative flex items-center justify-center",
          "h-12 min-h-[48px] px-4 py-2 rounded-full", // Increased height and full rounded corners
          "text-sm",
          "max-w-[250px]" // Constrain width to ensure centering
        )}
        style={{
          background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          fontWeight: 600,
          paddingLeft: '52px',
          letterSpacing: '0.02em',
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'transform', // Optimize for animations
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Icon container */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            background: '#8A42F5', // Match the purple button color
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '10px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
          </svg>
        </div>
        RESERVE EARLY ACCESS
      </button>
    );
  }
  
  // Form state after button is clicked
  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-[250px] mx-auto relative animate-fade-in"
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'transform', // Optimize for animations
          margin: '0 auto',
          position: 'relative',
          zIndex: 30
        }}
      >
        <div className={cn(
          "flex flex-col w-full",
          "shadow-lg" // Add shadow to the entire form container
        )}>
          <div className="relative">
            {/* Email input - improved styling */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={cn(
                "w-full rounded-t-[10px] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40",
                "h-12 px-3 text-base font-medium" // Improved height and font styling
              )}
              style={{
                backgroundColor: 'white',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(138, 66, 245, 0.2)'
              }}
              disabled={isLoading}
              required
            />
            
            {/* Check mark for valid email */}
            {isValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>
          
          {/* Submit button - improved styling */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full bg-gradient-to-b from-purple-600 to-purple-700 text-white font-semibold rounded-t-none rounded-b-[10px] flex items-center justify-center transition-all duration-200",
              "h-12 text-sm" // Matching height with input
            )}
            style={{
              background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
              letterSpacing: '0.02em'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span>JOIN WAITLIST</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Fire confetti when showConfetti is true */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[5000]" style={{ position: 'fixed' }}>
          {/* Using script tags with dangerouslySetInnerHTML inside React can cause issues */}
          {/* Removed problematic script tag */}
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
  
  // Add a MutationObserver to catch any style changes and override them
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create a function that will force our styles
    const forceHeightStyles = () => {
      if (!sectionRef.current) return;
      
      // Chrome-specific fix for desktop
      if (!isMobile && navigator.userAgent.indexOf('Chrome') > -1) {
        sectionRef.current.style.setProperty('height', 'auto', 'important');
        sectionRef.current.style.setProperty('min-height', 'auto', 'important');
        sectionRef.current.style.setProperty('padding-top', '30px', 'important');
        sectionRef.current.style.setProperty('padding-bottom', '30px', 'important');
        
        // Ensure proper button container alignment in Chrome
        const ctaSection = sectionRef.current.querySelector('#hero-cta-section');
        if (ctaSection && ctaSection instanceof HTMLElement) {
          ctaSection.style.setProperty('display', 'flex', 'important');
          ctaSection.style.setProperty('flex-direction', 'column', 'important');
          ctaSection.style.setProperty('align-items', 'center', 'important');
          ctaSection.style.setProperty('justify-content', 'center', 'important');
          ctaSection.style.setProperty('width', '100%', 'important');
          ctaSection.style.setProperty('text-align', 'center', 'important');
        }
      }
    };
    
    // Create a MutationObserver to watch for style changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          // Re-apply our styles if they've been changed
          forceHeightStyles();
        }
      });
    });
    
    // Start observing style changes on the hero element
    observer.observe(sectionRef.current, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });
    
    // Apply immediately
    forceHeightStyles();
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Function to force our styles
    const forceStyles = () => {
      if (!sectionRef.current) return;
      
      // Apply styles with !important to override any conflicting styles
      const applyStyle = (el: HTMLElement, prop: string, value: string) => {
        el.style.setProperty(prop, value, 'important');
      };
      
      // Main hero element - simplified proper spacing
      const hero = sectionRef.current;
      
      // Basic clean structure for both mobile and desktop
      applyStyle(hero, 'display', 'flex');
      applyStyle(hero, 'flex-direction', 'column');
      applyStyle(hero, 'align-items', 'center');
      applyStyle(hero, 'height', 'auto');
      applyStyle(hero, 'min-height', 'auto');
      applyStyle(hero, 'max-height', 'none');
      applyStyle(hero, 'margin', '0');
      
      if (isMobile) {
        // Mobile-specific padding for navbar
        applyStyle(hero, 'padding-top', '80px');
        applyStyle(hero, 'padding-bottom', '60px');
        applyStyle(hero, 'justify-content', 'flex-start');
      } else {
        // Desktop padding
        applyStyle(hero, 'padding-top', '60px');
        applyStyle(hero, 'padding-bottom', '60px');
        applyStyle(hero, 'justify-content', 'center');
      }

      // Remove any min-height from all containers
      const containers = hero.querySelectorAll('div');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          applyStyle(container, 'min-height', 'auto');
        }
      });
      
      // Fix title styling - no negative margins
      const heroTitle = hero.querySelector('#hero-title');
      if (heroTitle && heroTitle instanceof HTMLElement) {
        applyStyle(heroTitle, 'margin', '0 0 30px 0');
        applyStyle(heroTitle, 'padding', '0');
        applyStyle(heroTitle, 'width', '100%');
        applyStyle(heroTitle, 'min-height', 'auto');
        applyStyle(heroTitle, 'text-align', 'center');
      }
      
      // Fix rotating text container
      const textRotateContainer = hero.querySelector('[style*="height"]');
      if (textRotateContainer && textRotateContainer instanceof HTMLElement) {
        if (isMobile) {
          applyStyle(textRotateContainer, 'margin-bottom', '0');
          applyStyle(textRotateContainer, 'margin-top', '0');
          applyStyle(textRotateContainer, 'height', '50px');
          applyStyle(textRotateContainer, 'min-height', '50px');
          applyStyle(textRotateContainer, 'width', '100%');
          applyStyle(textRotateContainer, 'padding', '0');
        } else {
          applyStyle(textRotateContainer, 'margin-bottom', '0');
          applyStyle(textRotateContainer, 'margin-top', '0');
          applyStyle(textRotateContainer, 'height', '60px');
          applyStyle(textRotateContainer, 'min-height', '60px');
          applyStyle(textRotateContainer, 'padding', '0');
        }
      }
      
      // Fix paragraph spacing
      const paragraphs = hero.querySelectorAll('p');
      paragraphs.forEach(el => {
        if (el instanceof HTMLElement) {
          if (isMobile) {
            applyStyle(el, 'margin-top', '24px'); // MORE space from the heading
            applyStyle(el, 'margin-bottom', '32px'); // MORE space before buttons
            applyStyle(el, 'line-height', '1.5');
            applyStyle(el, 'text-align', 'center');
            applyStyle(el, 'font-size', '0.95rem');
            applyStyle(el, 'padding', '0 16px');
          } else {
            applyStyle(el, 'margin-top', '24px'); // MORE space from the heading
            applyStyle(el, 'margin-bottom', '32px'); // MORE space before buttons
            applyStyle(el, 'line-height', '1.5');
            applyStyle(el, 'padding', '0 16px');
          }
        }
      });
      
      // Fix mobile CTA container
      if (isMobile) {
        const mobileCTASection = hero.querySelector('#mobile-hero-cta-section');
        if (mobileCTASection && mobileCTASection instanceof HTMLElement) {
          applyStyle(mobileCTASection, 'width', '100%');
          applyStyle(mobileCTASection, 'max-width', '280px');
          applyStyle(mobileCTASection, 'margin', '0 auto');
          applyStyle(mobileCTASection, 'padding', '0');
          applyStyle(mobileCTASection, 'min-height', 'auto');
        }
      }
      
      // Fix desktop CTA section
      const ctaSection = hero.querySelector('#hero-cta-section');
      if (ctaSection && ctaSection instanceof HTMLElement && !isMobile) {
        applyStyle(ctaSection, 'width', '100%');
        applyStyle(ctaSection, 'max-width', '680px');
        applyStyle(ctaSection, 'margin', '0 auto');
        applyStyle(ctaSection, 'padding', '0');
        applyStyle(ctaSection, 'min-height', 'auto');
        
        // Fix button container
        const buttonContainer = ctaSection.querySelector('.flex.flex-row');
        if (buttonContainer && buttonContainer instanceof HTMLElement) {
          applyStyle(buttonContainer, 'display', 'flex');
          applyStyle(buttonContainer, 'justify-content', 'center');
          applyStyle(buttonContainer, 'align-items', 'center');
          applyStyle(buttonContainer, 'gap', '24px');
          applyStyle(buttonContainer, 'margin-bottom', '16px');
        }
        
        // Fix social proof
        const socialProof = ctaSection.querySelector('.flex.justify-center');
        if (socialProof && socialProof instanceof HTMLElement) {
          applyStyle(socialProof, 'margin-top', '20px'); // Increased spacing from buttons
          applyStyle(socialProof, 'margin-bottom', '16px'); // Add space at bottom
        }
      }
    };
    
    // Apply styles immediately
    forceStyles();
    
    // Apply after load to override any other scripts
    window.addEventListener('load', forceStyles);
    
    // Also apply on resize in case of orientation change
    window.addEventListener('resize', forceStyles);
    
    // Regular intersection observer functionality
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          // Apply styles again when visible
          forceStyles();
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '100px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', forceStyles);
      window.removeEventListener('resize', forceStyles);
    };
  }, [isMobile]);

  return (
    <section
      id="hero" 
      data-hero-section="true"
      ref={sectionRef}
      className="flex flex-col items-center w-full bg-[#F9F6EC] relative"
      style={{
        height: 'auto',
        paddingTop: isMobile ? '80px' : '60px', // More padding on mobile for nav
        paddingBottom: '60px',
        margin: 0,
        overflow: 'visible'
      }}
      aria-labelledby="hero-title"
    >
      
      <div 
        className={cn(
          "flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        <div className="flex flex-col items-center w-full" style={{
          width: '100%',
          maxWidth: '920px',
          margin: '0 auto 20px',
          textAlign: 'center'
        }}>
          {/* Main heading - both screen-reader friendly and visually styled */}
          <h1 id="hero-title" className="tracking-tight font-bold font-jakarta text-center w-full flex flex-col items-center"
          style={{ 
            margin: '0 0 30px 0',
            padding: '0',
            width: '100%'
          }}>
            <span 
              className={cn(
                isMobile ? "text-[2rem]" : "text-4xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "font-jakarta mb-2",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                "font-bold",
                "w-full mx-auto text-center"
              )}
              style={{ 
                letterSpacing: "-0.02em",
                lineHeight: "1.3",
                margin: '0 0 8px 0'
              }}
            >
              PROPERTY CONTENT THAT
            </span>

            <div 
              className="flex justify-center w-full text-center"
              style={{ 
                width: "100%",
                height: isMobile ? "60px" : "70px",
                margin: '0',
                padding: '0'
              }}
            >
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center h-auto"
                staggerFrom="last"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                staggerDuration={0}
                rotationInterval={3000}
                splitLevelClassName="overflow-visible"
                elementLevelClassName={cn(
                  isMobile ? "text-[2.4rem]" : "text-4xl sm:text-5xl lg:text-6xl",
                  "font-bold font-jakarta tracking-[-0.03em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "animate-shimmer-slide bg-size-200",
                  "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
                  "filter brightness-110",
                  "leading-[1.3]"
                )}
                // Simpler tween animation for mobile
                transition={{ 
                  type: "tween", 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                auto={true}
              />
            </div>
          </h1>
        </div>

        <p 
          className="text-gray-700 text-center font-inter"
          style={{
            width: '100%',
            maxWidth: isMobile ? '95%' : '650px',
            margin: '0 auto 40px', // SIGNIFICANT spacing before buttons
            padding: '0 16px',
            lineHeight: '1.6',
            fontSize: isMobile ? '0.95rem' : '1rem'
          }}
        >
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
        style={{
          width: '100%',
          margin: '0 auto',
          padding: '0'
        }}
      >
        {!isMobile && (
          <div className="flex flex-col items-center w-full" id="hero-cta-section" style={{
              width: '100%',
              maxWidth: '680px', 
              margin: '0 auto',
              padding: '0'
            }}>
            {/* Container for both buttons in a row with fixed width and centering */}
            <div className="flex flex-row justify-center items-center w-full" style={{
              gap: '24px',
              marginBottom: '24px'
            }}>
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
            <div className="flex justify-center items-center w-full" style={{
              marginTop: '0',
              marginBottom: '0'
            }}>
              <SocialProof className="mx-auto" />
            </div>
          </div>
        )}
        
        {isMobile && (
          <>
            <div className="flex flex-col items-center w-full" 
              id="mobile-hero-cta-section"
              style={{ 
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto',
                padding: '0'
              }}>
              {/* Mobile CTA with inline email form expansion */}
              <div className="w-full flex justify-center items-center mb-4">
                <MobileHeroCTA />
              </div>
              
              {/* Centered social proof */}
              <div className="flex justify-center items-center w-full mb-8">
                <SocialProof 
                  className="mx-auto"
                  style={{
                    margin: '0 auto',
                    width: 'auto',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}
                />
              </div>
              
              {/* Scroll indicator */}
              <div className="flex flex-col items-center opacity-60 mt-4">
                <span className="text-[11px] text-purple-600 mb-1 font-medium">Scroll to explore</span>
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