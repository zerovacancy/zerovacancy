
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";

const TITLES = ["CONVERTS", "CAPTIVATES", "CLOSES"];

export function Hero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

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
        isMobile ? "py-3 my-0 pt-8" : "py-6 sm:py-12 lg:py-16 my-2 sm:my-6 lg:my-8",
        "min-h-fit sm:min-h-[42vh]", // Increased min height for desktop
        "relative z-10 overflow-hidden", // Added overflow-hidden
        "gap-2 sm:gap-6", 
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      {/* Base background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTMwIDAgTDYwIDMwIEwzMCA2MCBMMCAzMCBaIi8+PC9nPjwvc3ZnPg==')] opacity-70 z-[-1]"></div>

      {/* Mesh gradient background */}
      <div className="absolute inset-0 z-[-1]" style={{
        background: "radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15), transparent 40%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.15), transparent 40%)"
      }}></div>

      {/* Desktop background decorative elements - more visible */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-purple-300/30 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-300/30 rounded-full filter blur-[60px]"></div>
          <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-blue-200/20 rounded-full filter blur-[50px]"></div>
        </div>
      )}

      {/* Floating particles for desktop */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <div className="w-2 h-2 bg-purple-400/40 rounded-full absolute top-[20%] left-[30%] animate-pulse"></div>
          <div className="w-3 h-3 bg-indigo-400/40 rounded-full absolute top-[50%] right-[20%] animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400/40 rounded-full absolute bottom-[30%] left-[70%] animate-pulse"></div>
          <div className="w-4 h-4 bg-purple-300/30 rounded-full absolute bottom-[20%] right-[40%] animate-pulse"></div>
        </div>
      )}

      {/* Mobile enhanced background with more vibrant gradient */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-200/70 via-indigo-100/60 to-blue-100/50 opacity-100 z-[-1]"></div>
      )}
      
      {/* Mobile floating elements */}
      {isMobile && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-[10%] right-[5%] w-16 h-16 bg-purple-300/40 rounded-full filter blur-[15px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[10%] w-12 h-12 bg-indigo-300/40 rounded-full filter blur-[10px] animate-pulse"></div>
        </div>
      )}
      
      {/* Top edge accent for mobile */}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 z-[1]"></div>
      )}
      
      {/* Bottom wave/cutout for visual interest */}
      <div className="absolute bottom-[-2px] left-0 right-0 h-10 z-[1] opacity-70">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <path fill="#ffffff" d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-1 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.1]", // Adjusted leading
            "text-center font-bold font-jakarta",
            isMobile ? "mb-0 mt-4" : "mb-2 sm:mb-8 max-w-5xl mx-auto" // Added max-width and increased margin
          )}>
            <span 
              className={cn(
                "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "block sm:inline-block mb-1 sm:mb-0 font-jakarta", // Changed from mb-[-0.2em] to mb-1
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]"
              )}
            >
              PROPERTY CONTENT THAT
            </span>

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                isMobile 
                  ? "h-[2.8em] mt-0" 
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.7em] mt-1 sm:mt-2", // Adjusted height and margin
                "overflow-visible",
                "gpu-accelerated",
                isMobile && "mobile-optimize"
              )}
            >
              {/* Background highlight container for text rotation - always visible */}
              <div 
                className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "bg-gradient-to-r from-[#F5F0FF]/70 via-[#F0F5FF]/60 to-[#F5F0FF]/70 rounded-lg z-[-1]", // Added gradient
                  "shadow-lg border border-white/20 overflow-hidden", // Enhanced with border
                  isMobile 
                    ? "w-[105%] h-[85%] px-3" 
                    : "w-[110%] h-[80%] px-6 sm:px-8 lg:px-10"
                )}
                aria-hidden="true"
              >
                {/* Synced background glows using 3 elements with different animations */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* First glow - synced with first word */}
                  <div 
                    className="absolute w-[140%] h-[140%] opacity-0"
                    style={{
                      background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
                      animation: "opacity-pulse 10.5s infinite",
                      animationDelay: "0s"
                    }}
                  ></div>
                  
                  {/* Second glow - synced with second word */}
                  <div 
                    className="absolute w-[140%] h-[140%] opacity-0"
                    style={{
                      background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
                      animation: "opacity-pulse 10.5s infinite",
                      animationDelay: "3.5s"
                    }}
                  ></div>
                  
                  {/* Third glow - synced with third word */}
                  <div 
                    className="absolute w-[140%] h-[140%] opacity-0"
                    style={{
                      background: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%)",
                      animation: "opacity-pulse 10.5s infinite", 
                      animationDelay: "7s"
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Add global style for the animation - This will be inserted once */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes opacity-pulse {
                  0%, 30%, 100% { opacity: 0; }
                  5%, 25% { opacity: 1; }
                }
              `}} />
              
              
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                staggerFrom="last"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                staggerDuration={0}
                rotationInterval={3500}
                splitLevelClassName="overflow-visible"
                elementLevelClassName={cn(
                  "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.02em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "overflow-visible"
                )}
                transition={{ 
                  type: isMobile ? "tween" : "spring",
                  damping: isMobile ? 25 : 30,
                  stiffness: isMobile ? 100 : 200,
                  mass: isMobile ? 0.6 : 1,
                  duration: isMobile ? 0.4 : 0.4,
                  ease: isMobile ? "circOut" : "easeOut"
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
            "max-w-[90%] sm:max-w-[640px]", // Increased max width for desktop
            "mx-auto", 
            "font-inter",
            !isMobile && "text-lg", // Increased text size on desktop
            isMobile ? "-mt-3 text-sm" : ""
          )}
        >
          {isMobile ? (
            "Connect with elite content creators who transform your spaces into compelling visual stories."
          ) : (
            "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential."
          )}
        </div>
      </div>

      {/* Enhanced CTA area with more prominent background and effects */}
      <div 
        className={cn(
          "w-full relative z-10", 
          isMobile ? "mt-4" : "mt-8 sm:mt-10", // Increased spacing
          "px-4 sm:px-4",
          !isMobile && "py-6 bg-white/40 backdrop-blur-sm border border-white/30 shadow-xl rounded-xl max-w-2xl mx-auto",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        {/* Glass effect background for desktop */}
        {!isMobile && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 via-purple-100/40 to-indigo-100/30 rounded-xl -z-10"></div>
        )}
        
        {/* Glow effect for mobile */}
        {isMobile && (
          <div className="absolute inset-x-0 -top-4 h-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/20 to-indigo-500/10 rounded-full blur-xl -z-10"></div>
        )}
        
        <WaitlistCTA 
          className={cn(isMobile ? "mb-0" : "mb-4 sm:mb-6")} 
          buttonText={isMobile ? "JOIN WAITLIST" : "RESERVE EARLY ACCESS"} // Different text for mobile
          showSocialProof={true}
        />
      </div>

      {/* Enhanced mobile scroll indicator */}
      {isMobile && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-indigo-700 font-medium mb-1 opacity-80">Scroll</span>
            <div className="p-1 bg-white/70 backdrop-blur-sm rounded-full shadow-md">
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L10 9L19 1" stroke="#8A64FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
