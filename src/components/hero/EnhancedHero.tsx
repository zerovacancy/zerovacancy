
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotateCss } from "../ui/text-rotate";

// Constants
const TITLES = ["REIMAGINED", "ELEVATED", "TRANSFORMED"];

// Sub-components with enhanced styling
const HeroDescription = ({ isMobile }: { isMobile: boolean }) => (
  <div 
    className={cn(
      "text-base leading-relaxed",
      "text-center", 
      "max-w-[90%] sm:max-w-[500px]",
      "mx-auto",
      "font-inter",
      "text-zinc-700",
      "relative z-10",
      "bg-white/90 py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm",
      "border border-indigo-100/50",
      isMobile ? "text-sm" : ""
    )}
  >
    {isMobile ? (
      "Connect with elite content creators who transform your spaces into compelling visual stories."
    ) : (
      "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that showcases your property's potential."
    )}
  </div>
);

const BackgroundBlobs = () => (
  <>
    <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-400/30 blur-3xl animate-blob"></div>
    <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-300/20 to-cyan-400/30 blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-violet-300/20 to-fuchsia-400/30 blur-3xl animate-blob animation-delay-4000"></div>
  </>
);

/**
 * Enhanced Hero component with visual improvements and better background
 */
export function EnhancedHero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Skip if the ref doesn't exist
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
        isMobile ? "py-8 my-0" : "py-12 sm:py-16 lg:py-20 my-0",
        "min-h-[50vh] sm:min-h-[60vh]",
        "relative z-10 overflow-hidden", 
        "gap-6 sm:gap-8", 
        "touch-manipulation",
        "bg-gradient-to-b from-white via-white to-slate-50",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
      aria-labelledby="hero-title"
    >
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiPjxwYXRoIGQ9Ik0wIDBMNjAgNjAiLz48cGF0aCBkPSJNNjAgMEwwIDYwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        {/* Top gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/80 to-transparent"></div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-purple-50/80 to-transparent"></div>
        
        {/* Animated background blobs */}
        <BackgroundBlobs />
      </div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full items-center",
          "gap-4 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative text-center">
          <h1 
            id="hero-title"
            className={cn(
              "tracking-tight text-center font-bold",
              "flex flex-col items-center justify-center"
            )}
          >
            {/* Decorative line above the main title */}
            <div 
              className={cn(
                "w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full",
                "mb-4 sm:mb-6"
              )}
              aria-hidden="true"
            ></div>

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                isMobile 
                  ? "h-[2.8em] mt-1" 
                  : "h-[3em] sm:h-[2.8em] md:h-[2.5em] lg:h-[2.5em]",
                "overflow-visible"
              )}
            >
              <TextRotateCss
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                rotationInterval={3500}
                elementLevelClassName={cn(
                  "text-5xl sm:text-6xl lg:text-7xl",
                  "font-black font-jakarta tracking-tight",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "px-4 py-1",
                  "shadow-inner",
                  "overflow-visible",
                  "hover:scale-[1.01] transition-transform duration-300"
                )}
                auto={true}
              />
            </div>
          </h1>
        </div>

        <HeroDescription isMobile={isMobile} />
      </div>

      <div 
        className={cn(
          "w-full relative z-10", 
          isMobile ? "mt-4" : "mt-6 sm:mt-8",
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA 
          className={cn(isMobile ? "mb-2" : "mb-4 sm:mb-6")} 
          buttonText="RESERVE EARLY ACCESS" 
          showSocialProof={true} 
        />
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-600/5 to-purple-600/10 transform rotate-45 translate-x-8 -translate-y-8 rounded-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-600/5 to-cyan-600/10 transform rotate-45 -translate-x-8 translate-y-8 rounded-xl"></div>
    </section>
  );
}

export default EnhancedHero;
