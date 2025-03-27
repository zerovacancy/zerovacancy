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
        <div className="w-full min-w-full py-5 px-4 font-medium rounded-[12px] text-white relative flex flex-col items-center justify-center animate-fade-in"
          style={{
            background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          }}
        >
          <div className="h-16 w-16 bg-purple-50/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
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
          "w-full min-w-full font-medium rounded-[12px] text-white relative flex items-center justify-center",
          "h-10 min-h-[40px] px-4 py-2 rounded-lg", // Smaller custom size
          "text-sm" // Smaller text size
        )}
        style={{
          background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          fontWeight: 600,
          paddingLeft: '52px',
        }}
      >
        {/* Icon container */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 ml-6 flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            background: '#8A42F5', // Match the purple button color
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
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
        className="w-full relative animate-fade-in"
      >
        <div className={cn(
          "flex flex-col w-full",
          mobileOptimizationClasses.spacingInteractive // Standard spacing
        )}>
          <div className="relative">
            {/* Email input */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={cn(
                "w-full rounded-t-[12px] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40",
                mobileOptimizationClasses.mobileFriendlyInput // Standard mobile input
              )}
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
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full bg-gradient-to-b from-purple-600 to-purple-700 text-white font-medium rounded-t-none rounded-b-[12px] flex items-center justify-center transition-all duration-200",
              mobileOptimizationClasses.mobileFriendlyButton, // Standard mobile button
              mobileOptimizationClasses.tapTargetExtraLarge // Easy tap target
            )}
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

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
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
    };
  }, []);

  return (
    <div
      id="hero" 
      ref={sectionRef}
      className={cn(
        "flex items-center justify-center flex-col w-full bg-[#F9F6EC]", // Center both horizontally and vertically, tan/gold background for all devices
        "px-0", 
        !isMobile && "relative z-10",
        "gap-0", // Removed gap completely
        "touch-manipulation",
        "opacity-100"
        // Removed problematic classes
      )}
      style={{
        ...(isMobile ? {
          // Mobile styles directly applied with highest specificity
          height: '100vh',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'hidden',
          position: 'relative',
          paddingTop: '10px', /* Greatly reduced padding from top */
          zIndex: 10,
          marginTop: '0',
          transform: 'none',
          overflow: 'visible',
          isolation: 'auto',
          contain: 'none',
          willChange: 'auto',
          backgroundImage: 'none',
          borderBottomWidth: '0',
          paddingBottom: '0'
        } : {
          // Desktop styles
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '20px',
          paddingBottom: '80px',
          borderBottomWidth: '0',
          marginTop: '0',
          height: 'auto',
          minHeight: 'auto',
          maxHeight: 'none',
          // These styles are now directly applied above with higher specificity
          // Styles already applied above
        })
      }}
      aria-labelledby="hero-title"
    >
      
      <div 
        className={cn(
          "flex flex-col items-center justify-start max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8",
          "gap-0", // Removed gap completely
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
        style={isMobile ? { 
          position: 'static', 
          zIndex: 'auto',
          contain: 'none',
          willChange: 'auto',
          transform: 'none'
        } : {
          position: 'relative'
        }}
      >
        <div style={isMobile ? 
          { 
            position: 'static',
            marginBottom: '0',
            paddingBottom: '0',
            height: 'auto',
            minHeight: '0',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column'
          } : { 
            position: 'relative',
            marginBottom: '0',
            paddingBottom: '0',
            height: 'auto',
            minHeight: '0',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column'
          }}>
          {/* Main heading - both screen-reader friendly and visually styled */}
          <h1 id="hero-title" className={cn(
            "tracking-tight leading-[1.15] font-bold font-jakarta mx-auto headingLarge",
            "text-center max-w-5xl mb-0", // Added explicit zero bottom margin
            "flex flex-col items-center justify-center" // Added flex to control child spacing
          )} style={{ 
            marginBottom: '0', 
            paddingBottom: '0',
            ...(isMobile && {
              lineHeight: 0.9, // Even tighter line height on mobile
              marginTop: '-60px', // Even larger negative margin to pull content up drastically
              marginBottom: '-20px' // Pull next elements closer
            })
          }}>
            <span 
              className={cn(
                isMobile ? "text-[2rem]" : "text-3xl sm:text-5xl lg:text-6xl", // Original size
                "tracking-[-0.02em]",
                "block sm:inline-block font-jakarta",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                "font-bold",
                isMobile 
                  ? "drop-shadow-[0_1px_3px_rgba(74,45,217,0.2)]" 
                  : "drop-shadow-[0_1px_2px_rgba(74,45,217,0.05)]", 
                isMobile && "relative",
                "w-full mx-auto text-center",
                "mb-0" // No margin needed - removing space completely
              )}
              style={{ 
                letterSpacing: isMobile ? "-0.03em" : "-0.02em",
                lineHeight: isMobile ? "1.1" : "1.2" // Added tighter line height
              }}
            >
              {/* Removed background pattern for mobile */}
              PROPERTY CONTENT THAT
            </span>

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                "overflow-visible",
                "gpu-accelerated will-change-auto",
                isMobile && "mobile-optimize"
              )}
              style={{ 
                width: "100%",
                height: isMobile ? "70px" : "70px", // Original height
                minHeight: isMobile ? "70px" : "70px", // Match minHeight to height
                overflow: "visible", // Allow text to overflow beyond the container
                marginBottom: isMobile ? "-20px" : "10px", // Negative margin on mobile to pull next element up
                marginTop: isMobile ? "-10px" : "0" // Pull this element up on mobile
              }}
            >
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center h-auto"
                staggerFrom="last"
                // Simplified transitions for mobile
                initial={{ opacity: 1 }} // Start visible to improve LCP
                animate={{ opacity: 1 }} // Stay visible
                exit={isMobile ? { opacity: 0 } : { y: "-40%", opacity: 0, scale: 0.95 }}
                // No staggering on mobile
                staggerDuration={0}
                // Slower rotation on mobile
                rotationInterval={isMobile ? 4500 : 3000}
                splitLevelClassName={isMobile ? "" : "overflow-visible"}
                elementLevelClassName={cn(
                  isMobile ? "text-[2.8rem]" : "text-4xl sm:text-5xl lg:text-6xl", // Original size
                  "font-bold font-jakarta tracking-[-0.03em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  isMobile ? "" : "animate-shimmer-slide bg-size-200",
                  "overflow-visible", // Always allow overflow
                  "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
                  isMobile ? "" : "filter brightness-110",
                  "leading-[1.1]", // Slightly looser line height for readability
                  "h-auto min-h-0", // Minimize height
                  "py-2" // Add padding for better spacing
                )}
                // Simpler tween animation for mobile
                transition={isMobile ? 
                  { 
                    type: "tween", 
                    duration: 0.3,
                    ease: "easeInOut"
                  } : { 
                    type: "spring",
                    damping: 30,
                    stiffness: 250,
                    mass: 0.5,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                auto={true}
              />
            </div>
          </h1>
        </div>

        <p 
          className={cn(
            "text-base leading-relaxed bodyText",
            "text-brand-text-primary", 
            "text-center", 
            "max-w-[95%] sm:max-w-[650px]",
            "mx-auto", 
            "font-inter",
            "relative",
            isMobile ? "mb-4 text-sm px-4 py-0" : "mb-6" // Standard spacing
          )}
          style={{
            marginTop: isMobile ? '-20px' : '0', // Negative margin on mobile to pull up
            position: 'relative',
            zIndex: 10, // Ensure text appears above any backgrounds
            paddingTop: isMobile ? '0' : '10px' // No padding on mobile
          }}
        >
          {isMobile ? (
            // The mobile version has additional heading structure
            <>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-1"> {/* Further reduced margin */}
                  <div className="absolute left-1/2 w-16 h-[2px] bg-purple-300/50" style={{ transform: 'translateX(-50%)', top: '-0.5px' }}></div>
                  <h2 className={cn(
                    mobileOptimizationClasses.headingMedium, // Standardized heading
                    "text-gray-800 mt-0 font-jakarta"
                  )}>
                    Elite content that works
                  </h2>
                  <div className="h-[1px] w-10 bg-purple-300/30 mx-auto mt-1"></div> {/* Reduced mt-2 to mt-1 */}
                </div>
                Connect with top creators who transform your spaces with professional photography, video, and 3D tours that showcase your property's potential.
              </div>
            </>
          ) : (
            "Connect with elite content creators who transform your spaces into compelling visual stories. Access the most in-demand creators for content that doesn't just show your property—it showcases its potential."
          )}
        </p>
      </div>

      <div 
        className={cn(
          "w-full", 
          "mt-0", // No top margin
          isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8",
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
        style={isMobile ? { 
          position: 'static', 
          zIndex: 'auto',
          contain: 'none',
          willChange: 'auto',
          marginTop: '10px', // Change to positive margin
          transform: 'none',
          overflow: 'visible' 
        } : {}}
      >
        {!isMobile && (
          <div className="w-full max-w-5xl mx-auto relative" id="hero-cta-section">
            <div className="flex flex-row justify-center gap-[8%] mb-2 relative items-start">
              <div className="flex flex-col w-[45%] max-w-[280px]">
                <WaitlistCTA 
                  buttonText="RESERVE YOUR SPOT" 
                  showSocialProof={false}
                  aria-label="Reserve your spot"
                  className="primary-cta"
                />
              </div>
              
              <div className="flex flex-col w-[45%] max-w-[280px] relative">
                <div className="relative">
                  <WaitlistCreatorCTA 
                    buttonText="JOIN AS CREATOR" 
                    showSocialProof={false}
                    aria-label="Join as a content creator"
                    className="secondary-cta"
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <SocialProof className="mt-0" />
            </div>
          </div>
        )}
        
        {isMobile && (
          <>
            <div className="w-full flex flex-col items-center" style={{ position: 'static' }}>
              <div className="w-[80%] max-w-[280px] mx-auto flex flex-col items-center gap-3" style={{ position: 'static' }}>
                {/* Mobile CTA with inline email form expansion */}
                <div className="w-full" style={{ position: 'static' }}>
                  <MobileHeroCTA />
                </div>
                
                <div className="w-full flex justify-center mt-3 mb-3">
                  {/* Removed divider line */}
                  <SocialProof 
                    className="mt-0 transform scale-[0.95]"
                    style={{
                      borderRadius: '12px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      background: '#F8F8FA',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full flex justify-center mt-10" style={{ position: 'static', transform: 'none' }}>
              <div className="flex flex-col items-center opacity-60" style={{ position: 'static', transform: 'none' }}>
                <span className="text-xs text-purple-600 mb-1 font-medium block" style={{ position: 'static', transform: 'none' }}>Scroll to explore</span>
                <svg width="18" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', overflow: 'visible', position: 'static', transform: 'none'}}>
                  <path d="M1 1L10 9L19 1" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;