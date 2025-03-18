
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
      // Standard interval for word rotation
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
    <section 
      ref={sectionRef}
      className={cn(
        "flex items-center justify-center flex-col", 
        "px-5 sm:px-6", 
        isMobile ? "py-3 my-0 pt-7 pb-14" : "py-6 sm:py-12 lg:py-16 my-2 sm:my-6 lg:my-8", 
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-3 sm:gap-6", 
        "touch-manipulation",
        "bg-transparent",
        isInView ? "animate-fade-in" : "opacity-0",
      )} 
    >
      {!isMobile && (
        <>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,99,255,0.04)_0%,rgba(255,255,255,0)_70%)]"></div>
        </>
      )}
      
      {/* Rich background gradient for mobile */}
      {isMobile && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-200/95 via-indigo-100/90 to-blue-50/80 z-0"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-indigo-300/30 rounded-full blur-xl"></div>
        </>
      )}

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-1 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.15] font-bold font-jakarta",
            isMobile ? "mb-0 mt-2 text-center" : "mb-2 sm:mb-6 text-center"
          )}>
            <span 
              className={cn(
                isMobile ? "text-[1.7rem]" : "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "block sm:inline-block mb-[-0.2em] sm:mb-0 font-jakarta",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                "font-bold",
                isMobile 
                  ? "drop-shadow-[0_2px_4px_rgba(74,45,217,0.15)]" 
                  : "drop-shadow-[0_1px_2px_rgba(74,45,217,0.05)]", 
                isMobile && "relative",
                isMobile && "mb-3",
                "w-full mx-auto text-center"
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
                  ? "h-[3.5em] mt-0" // No margin to keep text together
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-1 sm:mt-1",
                "overflow-visible",
                "gpu-accelerated",
                isMobile && "mobile-optimize"
              )}
            >
              {/* No background glow effect for cleaner design */}
              
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
                // Standard rotation interval
                rotationInterval={isMobile ? 3500 : 3000}
                splitLevelClassName="overflow-visible"
                elementLevelClassName={cn(
                  isMobile ? "text-[3.5rem]" : "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.02em]",
                  "bg-clip-text text-transparent", 
                  isMobile 
                    ? "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]" 
                    : "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  isMobile ? "bg-size-200" : "animate-shimmer-slide bg-size-200",
                  "overflow-visible",
                  "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
                  "filter brightness-110",
                  ""
                )}
                transition={isMobile ? 
                  { 
                    type: "spring", 
                    damping: 25,
                    stiffness: 200,
                    mass: 0.6,
                    duration: 0.5,
                    ease: "easeOut"
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

        <div 
          className={cn(
            "text-base leading-relaxed",
            "text-brand-text-primary", 
            isMobile ? "text-left pl-1" : "text-center", 
            "max-w-[95%] sm:max-w-[500px]",
            "mx-auto", 
            "font-inter",
            "relative",
            isMobile ? "mt-1 mb-8 text-sm px-1 py-2" : ""
          )}
        >
          {isMobile ? (
            <>
              <div className="relative animate-fade-in delay-150 flex flex-col items-center text-center px-1">
                <div className="relative mb-1">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-[0.5px] w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                  <h2 className="text-gray-800 font-bold text-[1.3rem] mt-0">Elite content that works</h2>
                  <div className="h-[1px] w-10 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mx-auto mt-1"></div>
                </div>
                <p className="text-gray-600 font-normal text-[16px] max-w-[280px] leading-relaxed mb-0 mt-0.5">
                  Transforms properties, delivers professional photos, showcases your property's full potential
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
          isMobile ? "mt-[-8px]" : "mt-5 sm:mt-6",
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
              <div className="w-full max-w-[300px] mx-auto flex flex-col">
                {/* Primary CTA with social proof grouped closely */}
                <div className="flex flex-col mb-0">
                  {/* Main waitlist CTA */}
                  <WaitlistCTA 
                    className="mb-0 w-[95%] mx-auto origin-center transform [&_button]:rounded-2xl [&_button]:border-none [&_button]:bg-gradient-to-r [&_button]:from-purple-500 [&_button]:via-purple-600 [&_button]:to-purple-700 [&_button]:shadow-[0_3px_8px_rgba(124,58,237,0.3)] [&_button]:transition-all [&_button]:py-3.5 [&_button]:px-8 [&_button]:text-white hover:[&_button]:shadow-[0_5px_15px_rgba(124,58,237,0.4)]" 
                    buttonText="RESERVE EARLY ACCESS" 
                    showSocialProof={false}
                  />
                  
                  {/* Social proof directly beneath primary CTA with tight spacing */}
                  <div className="w-full flex justify-center mt-0 mb-4 -translate-y-2 relative z-10">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[40%] w-[1px] h-5 bg-gradient-to-b from-transparent via-purple-300/30 to-purple-300/60"></div>
                    <SocialProof className="mt-0" />
                  </div>
                </div>
                
                {/* Creator CTA as separate alternative option */}
                <WaitlistCreatorCTA 
                  buttonText="JOIN AS CREATOR" 
                  showSocialProof={false}
                  className="[&_button]:border-[0.5px] [&_button]:rounded-2xl [&_button]:border-purple-400 [&_button]:bg-purple-50/40 [&_button]:text-purple-700 [&_button]:py-3.5 [&_button]:px-8 [&_button]:shadow-sm hover:[&_button]:shadow-md [&_button]:transition-all" 
                />
              </div>
            </div>
            
            {/* Scroll indicator for mobile */}
            <div className="w-full flex justify-center mt-6">
              <div className="flex flex-col items-center opacity-70">
                <div className="text-xs text-purple-600">Scroll to explore</div>
                <svg width="20" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L10 9L19 1" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Hero;
