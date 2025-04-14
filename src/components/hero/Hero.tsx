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
        <div className="mobile-card w-full max-w-[250px] py-space-md px-space-sm mobile-card-gradient text-white relative flex flex-col items-center justify-center animate-fade-in gpu-accelerated">
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
          paddingLeft: '52px'
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
      >
        <div className="flex flex-col w-full shadow-lg">
          <div className="relative">
            {/* Email input with mobile styling */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mobile-input w-full rounded-t-[var(--mobile-border-radius)] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
              style={{
                backgroundColor: 'white'
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
          
          {/* Submit button with mobile styling */}
          <button
            type="submit"
            disabled={isLoading}
            className="mobile-button bg-gradient-to-b from-[#8A42F5] to-[#7837DB] text-white font-semibold rounded-t-none rounded-b-[var(--mobile-border-radius)] flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span className="mobile-text-base">Joining...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="mobile-text-base">JOIN WAITLIST</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Fire confetti when showConfetti is true */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[5000]">
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
      ref={sectionRef}
      className={cn(
        "flex flex-col items-center w-full bg-[#F9F6EC] relative",
        isMobile ? "pt-[var(--mobile-header-height)] pb-space-xl" : "pt-[60px] pb-[60px]",
        "gpu-accelerated"
      )}
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
          )}>
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
              className="flex justify-center w-full text-center"
              style={{ 
                height: isMobile ? "60px" : "70px"
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
                  isMobile ? "mobile-text-3xl" : "text-4xl sm:text-5xl lg:text-6xl",
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
                maxWidth: '280px'
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