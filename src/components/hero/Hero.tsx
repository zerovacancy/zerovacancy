import React, { useRef, useEffect, useState } from "react";
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
  
  // Import confetti directly in component
  useEffect(() => {
    // Add confetti to window to ensure it's available
    if (typeof window !== 'undefined' && !window.hasOwnProperty('confetti')) {
      window.confetti = confetti;
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
      
      // Fire confetti immediately
      if (typeof window !== 'undefined' && window.celebrateSuccess) {
        try {
          window.celebrateSuccess(true);
        } catch (err) {
          console.error("Error triggering confetti:", err);
          try {
            // Fallback
            confetti();
          } catch (e) {
            console.error("Fallback confetti also failed:", e);
          }
        }
      } else {
        try {
          // Direct call if global method not available
          confetti();
        } catch (err) {
          console.error("Direct confetti call failed:", err);
        }
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
  
  // Direct trigger for confetti when showing success message
  useEffect(() => {
    if (showInlineSuccess) {
      console.log("Firing confetti for mobile success");
      
      // Set a timeout to ensure the UI is rendered first
      setTimeout(() => {
        try {
          // Try using the global function first
          if (typeof window !== 'undefined' && window.celebrateSuccess) {
            window.celebrateSuccess(true);
          } else if (typeof window !== 'undefined' && window.confetti) {
            // Use direct window.confetti as fallback
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.3 }
            });
          } else {
            // Use imported confetti as last resort
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.3 }
            });
          }
        } catch (err) {
          console.error("All confetti attempts failed:", err);
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
        className="w-full min-w-full h-[56px] font-medium rounded-[12px] text-white relative flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          fontSize: '14px',
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
        <div className="flex flex-col gap-2 w-full">
          <div className="relative">
            {/* Email input */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-[52px] px-4 py-3 rounded-t-[12px] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
              style={{
                fontSize: '16px', // Prevent iOS zoom on focus
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
            className="w-full h-[52px] bg-gradient-to-b from-purple-600 to-purple-700 text-white font-medium rounded-t-none rounded-b-[12px] flex items-center justify-center transition-all duration-200"
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
          {typeof window !== 'undefined' && window.celebrateSuccess && (
            <script dangerouslySetInnerHTML={{ 
              __html: `setTimeout(function() { window.celebrateSuccess(true); }, 0);` 
            }} />
          )}
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
      ref={sectionRef}
      className={cn(
        "flex items-center justify-center flex-col w-full", 
        "px-0", 
        isMobile ? "py-6 my-0 pt-10 pb-16" : "pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32 mt-1", // Increased bottom padding on desktop
        "min-h-fit",
        "relative z-10", 
        "gap-3 sm:gap-4", 
        "touch-manipulation",
        isMobile 
          ? "bg-gradient-to-b from-[#f8f5ff] via-[#f5f1fe] to-[#f7f5ff]" 
          : "", // Remove gradient from classname - now applied to absolute elements
        "opacity-100", // Always visible to prevent layout shifts
      )}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: isMobile ? "0 550px" : "0 600px"
      }}
    >
      {isMobile ? (
        // Static mobile background with subtle gradient and pattern
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9f7ff] via-[#f3efff] to-[#f0edff]"></div>
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/80 to-transparent"></div>
          
          {/* Subtle diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjN2EzZGZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1vcGFjaXR5PSIwLjIiPjxwYXRoIGQ9Ik0wIDBMNjAgNjAiLz48cGF0aCBkPSJNNjAgMEwwIDYwIi8+PC9nPjwvc3ZnPg==')]"></div>
          
          {/* Subtle radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(149,118,255,0.05)_0%,rgba(255,255,255,0)_60%)]"></div>
        </div>
      ) : (
        <>
          {/* Optimized desktop background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 to-indigo-50/80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,99,255,0.04)_0%,rgba(255,255,255,0)_70%)]"></div>
        </>
      )}
      
      <div 
        className={cn(
          "flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8",
          "gap-1 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          {/* SEO-friendly text that is visually hidden but available to crawlers and screen readers */}
          <h1 className="sr-only">ZeroVacancy - Property Content That Converts, Captivates, and Closes</h1>
          
          {/* Visual heading for users */}
          <div aria-hidden="true" className={cn(
            "tracking-tight leading-[1.15] font-bold font-jakarta mx-auto",
            isMobile ? "mb-3 mt-4 text-center" : "mb-0 sm:mb-0 text-center max-w-5xl"
          )}>
            <span 
              className={cn(
                isMobile ? "text-[2rem]" : "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "block sm:inline-block mb-0 font-jakarta",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                "font-bold",
                isMobile 
                  ? "drop-shadow-[0_1px_3px_rgba(74,45,217,0.2)]" 
                  : "drop-shadow-[0_1px_2px_rgba(74,45,217,0.05)]", 
                isMobile && "relative",
                isMobile && "mb-3",
                "w-full mx-auto text-center",
                !isMobile && "mb-3" // Added bottom margin
              )}
              style={{ height: isMobile ? "auto" : "auto", letterSpacing: isMobile ? "-0.03em" : "-0.02em" }}
            >
              {isMobile && (
                <div className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(#8A57DE_1px,transparent_1px)] [background-size:20px_20px] blur-[0.5px]"></div>
              )}
              PROPERTY CONTENT THAT
            </span>

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                isMobile 
                  ? "h-[4em] mt-1" // Increased height for mobile
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-0 mb-6", // Equal vertical spacing
                "overflow-visible",
                "gpu-accelerated will-change-auto",
                isMobile && "mobile-optimize"
              )}
              style={{ 
                width: isMobile ? "100%" : "100%",
                height: isMobile ? "4em" : "auto",
                minHeight: isMobile ? "90px" : "auto"
              }}
            >
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center"
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
                  isMobile ? "text-[4rem]" : "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.03em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  isMobile ? "" : "animate-shimmer-slide bg-size-200",
                  isMobile ? "" : "overflow-visible",
                  "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
                  "filter brightness-110",
                  "leading-[1]"
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
          </div>
        </div>

        <div 
          className={cn(
            "text-base leading-relaxed",
            "text-brand-text-primary", 
            isMobile ? "text-center" : "text-center", 
            "max-w-[95%] sm:max-w-[650px]",
            "mx-auto", 
            "font-inter",
            "relative",
            isMobile ? "mt-4 mb-10 text-sm px-4 py-2" : "mt-6 mb-8"
          )}
        >
          {isMobile ? (
            <>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-[0.5px] w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                  <h2 className="text-gray-800 font-semibold text-[1.25rem] mt-0 font-jakarta tracking-tight">Elite content that works</h2>
                  <div className="h-[1px] w-10 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mx-auto mt-1"></div>
                </div>
                <p className="text-gray-700 font-normal text-[15px] max-w-[300px] leading-relaxed mb-0 mt-1.5 font-sans">
                  Connect with top creators who transform your spaces with professional photography, video, and 3D tours that showcase your property's potential.
                </p>
              </div>
            </>
          ) : (
            "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential."
          )}
        </div>
      </div>

      <div 
        className={cn(
          "w-full", 
          isMobile ? "mt-[-8px]" : "mt-3 sm:mt-4",
          isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8",
          isInView ? "animate-fade-in delay-200" : "opacity-0",
          isMobile && "relative"
        )}
      >
        {!isMobile && (
          <div className="w-full max-w-5xl mx-auto relative" id="hero-cta-section">
            <div className="flex flex-row justify-center gap-[8%] mb-3 relative items-start">
              <div className="flex flex-col w-[45%] max-w-[280px]">
                <WaitlistCTA 
                  buttonText="RESERVE EARLY ACCESS" 
                  showSocialProof={false}
                />
              </div>
              
              <div className="flex flex-col w-[45%] max-w-[280px] relative">
                <div className="relative">
                  <WaitlistCreatorCTA 
                    buttonText="JOIN AS CREATOR" 
                    showSocialProof={false}
                    className=""
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <SocialProof className="mt-1" />
            </div>
          </div>
        )}
        
        {isMobile && (
          <>
            <div className="w-full flex flex-col items-center">
              <div className="w-[92%] max-w-[320px] mx-auto flex flex-col items-center gap-5">
                {/* Mobile CTA with inline email form expansion */}
                <div className="w-full relative">
                  <MobileHeroCTA />
                </div>
                
                <div className="w-full flex justify-center mt-3 mb-3 relative z-10">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-[1px] h-3 bg-gradient-to-b from-transparent via-purple-300/20 to-purple-300/40"></div>
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
            
            <div className="w-full flex justify-center mt-10">
              <div className="flex flex-col items-center opacity-60">
                <div className="text-xs text-purple-600 mb-1 font-medium">Scroll to explore</div>
                <svg width="18" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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