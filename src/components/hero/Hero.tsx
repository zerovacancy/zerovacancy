
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { WaitlistCreatorCTA } from "../ui/waitlist-creator-cta";
import { TextRotate } from "../ui/text-rotate";
import { SocialProof } from "../ui/waitlist/social-proof";

const TITLES = ["CONVERTS", "CAPTIVATES", "CLOSES"];

export function Hero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Track which rotation word is currently displayed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInView) {
      // Use longer intervals on mobile for better readability and performance
      const intervalTime = isMobile ? 4200 : 3500;
      
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
    <section 
      ref={sectionRef}
      className={cn(
        "flex items-center justify-center flex-col", 
        "px-5 sm:px-6", 
        isMobile ? "py-3 my-0 pt-8 pb-10" : "py-6 sm:py-12 lg:py-16 my-2 sm:my-6 lg:my-8", 
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-2 sm:gap-6", 
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0",
        isMobile && "after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-blue-100/60 after:via-indigo-50/30 after:to-transparent"
      )} 
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-1 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.15] text-center font-bold font-jakarta",
            isMobile ? "mb-0 mt-4" : "mb-2 sm:mb-6"
          )}>
            <span 
              className={cn(
                isMobile ? "text-[1.6rem]" : "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "block sm:inline-block mb-[-0.2em] sm:mb-0 font-jakarta",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                isMobile ? "font-medium" : "font-bold",
                "drop-shadow-[0_1px_2px_rgba(74,45,217,0.05)]", 
                isMobile && "relative",
                isMobile && "mb-3"
              )}
            >
              {/* Add subtle pattern behind text on mobile */}
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
                  ? "h-[3.5em] mt-2" // Increased height for better visibility
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-1 sm:mt-1",
                "overflow-visible",
                "gpu-accelerated",
                isMobile && "mobile-optimize"
              )}
            >
              {/* Subtle background glow effect for revolving text on mobile */}
              {isMobile && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#8A2BE2]/5 to-transparent rounded-full blur-xl transform scale-[1.5] opacity-60"></div>
              )}
              
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                staggerFrom="last"
                // Simpler, more direct animations for mobile
                initial={isMobile ? { y: 30, opacity: 0 } : { y: "40%", opacity: 0, scale: 0.95 }}
                animate={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
                exit={isMobile ? { y: -30, opacity: 0 } : { y: "-40%", opacity: 0, scale: 0.95 }}
                // Disable staggering completely on mobile
                staggerDuration={isMobile ? 0 : 0}
                // Longer rotation interval for mobile
                rotationInterval={isMobile ? 4200 : 3500}
                splitLevelClassName="overflow-visible"
                elementLevelClassName={cn(
                  isMobile ? "text-[3rem]" : "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.02em]",
                  "bg-clip-text text-transparent", 
                  isMobile 
                    ? "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]" 
                    : "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  !isMobile && "animate-shimmer-slide bg-size-200",
                  "overflow-visible",
                  isMobile 
                    ? "drop-shadow-[0_2px_8px_rgba(138,43,226,0.3)]" 
                    : "drop-shadow-[0_2px_3px_rgba(74,45,217,0.15)]",
                  "filter brightness-110",
                  !isMobile && "border-b-[3px] border-[#8A2BE2]/15 pb-1"
                )}
                transition={isMobile ? 
                  { 
                    type: "tween", 
                    duration: 0.4,
                    ease: "easeOut"
                  } : { 
                    type: "spring",
                    damping: 34,
                    stiffness: 300,
                    mass: 0.6,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                auto={true}
              />
            </div>
          </h1>
        </div>

        <div 
          className={cn(
            "text-base leading-relaxed",
            "text-brand-text-primary", 
            "text-center", 
            "max-w-[90%] sm:max-w-[500px]",
            "mx-auto", 
            "font-inter",
            "relative",
            isMobile ? "-mt-2 mb-6 text-sm" : ""
          )}
        >
          {isMobile ? (
            <>
              <span className="relative animate-fade-in delay-150">
                <span className="text-[#303042] leading-tight">Connect with elite content creators who transform your spaces into compelling visual stories.</span>
              </span>
            </>
          ) : (
            "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential."
          )}
        </div>
      </div>

      <div 
        className={cn(
          "w-full", 
          isMobile ? "mt-0" : "mt-5 sm:mt-6",
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0",
          isMobile && "relative"
        )}
      >
        {/* Desktop CTA layout with audience labels and side-by-side buttons */}
        {!isMobile && (
          <div className="w-full max-w-4xl mx-auto relative" id="hero-cta-section">
            {/* Buttons container */}
            <div className="flex flex-row justify-center gap-[10%] mb-6 relative items-start">
              {/* Property Owner CTA */}
              <div className="flex flex-col w-[45%] max-w-[280px]">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-[0.5px] w-5 bg-purple-300/80 mr-2"></div>
                  <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Property Owners</span>
                  <div className="h-[0.5px] w-5 bg-purple-300/80 ml-2"></div>
                </div>
                <WaitlistCTA 
                  buttonText="RESERVE EARLY ACCESS" 
                  showSocialProof={false}
                />
              </div>
              
              {/* Creator CTA */}
              <div className="flex flex-col w-[45%] max-w-[280px] relative">
                <div className="flex items-center justify-center mb-3">
                  <div className="h-[0.5px] w-5 bg-purple-300/80 mr-2"></div>
                  <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Content Creators</span>
                  <div className="h-[0.5px] w-5 bg-purple-300/80 ml-2"></div>
                </div>
                <div className="relative">
                  <WaitlistCreatorCTA 
                    buttonText="JOIN AS CREATOR" 
                    showSocialProof={false}
                    className="[&_button]:border-[3px]"
                  />
                </div>
              </div>
            </div>
            
            {/* Social proof centered below both buttons */}
            <div className="w-full flex justify-center">
              <SocialProof className="mt-2.5" />
            </div>
          </div>
        )}
        
        {/* Mobile CTA layout (stacked with reduced spacing) */}
        {isMobile && (
          <>
            {/* Container with entrance animation */}
            <div className="w-full flex flex-col items-center animate-fade-in-up">
              {/* CTA button container - consistent width */}
              <div className="w-full max-w-[280px] mx-auto flex flex-col">
                {/* Primary CTA with social proof grouped closely */}
                <div className="flex flex-col mb-5">
                  {/* Main waitlist CTA */}
                  <WaitlistCTA 
                    className="mb-0" 
                    buttonText="RESERVE EARLY ACCESS" 
                    showSocialProof={false}
                  />
                  
                  {/* Social proof directly beneath primary CTA with tight spacing */}
                  <div className="w-full flex justify-center mt-3 animate-pulse-subtle" style={{animationDuration: "4s"}}>
                    <SocialProof className="mt-0 w-full max-w-[280px] scale-[0.9] transform-gpu origin-top" />
                  </div>
                </div>
                
                {/* Creator CTA as separate alternative option */}
                <WaitlistCreatorCTA 
                  buttonText="JOIN AS CREATOR" 
                  showSocialProof={false}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Hero;
