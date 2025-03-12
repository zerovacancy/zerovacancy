import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotateCss } from "../ui/text-rotate";

// Constants
const TITLES = ["REIMAGINED", "ELEVATED", "TRANSFORMED"];

// Sub-components for better organization
const HeroTitle = ({ isMobile }: { isMobile: boolean }) => (
  <span 
    className={cn(
      "text-primary inline-block font-medium",
      "text-3xl sm:text-5xl lg:text-6xl",
      "tracking-[-0.02em]", 
      "text-brand-purple-dark",
      "block sm:inline-block mb-[-0.2em] sm:mb-0 font-jakarta",
      // Better accessibility for mobile
      isMobile ? "font-bold" : "font-medium" 
    )}
  >
    PROPERTY MARKETING
  </span>
);

const HeroDescription = ({ isMobile }: { isMobile: boolean }) => (
  <div 
    className={cn(
      "text-base leading-relaxed",
      "text-brand-text-primary", 
      "text-center", 
      "max-w-[90%] sm:max-w-[500px]",
      "mx-auto", 
      "font-inter",
      isMobile ? "-mt-3 mb-2 text-sm" : "mb-3"
    )}
  >
    {isMobile ? (
      "Connect with elite content creators who transform your spaces into compelling visual stories."
    ) : (
      "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that showcases your property's potential."
    )}
  </div>
);

/**
 * Optimized Hero component with CSS-only animations and improved accessibility
 */
export function OptimizedHero() {
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
        isMobile ? "py-4 my-2 pt-8" : "py-6 sm:py-12 lg:py-16 my-2 sm:my-6 lg:my-8",
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-3 sm:gap-6", 
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
      aria-labelledby="hero-title"
    >
      {/* Background Pattern with improved performance */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-1 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 
            id="hero-title"
            className={cn(
              "tracking-tight leading-[1.15] text-center font-bold font-jakarta",
              isMobile ? "mb-0 mt-4" : "mb-2 sm:mb-6"
            )}
          >
            <HeroTitle isMobile={isMobile} />

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                isMobile 
                  ? "h-[2.8em] mt-0" 
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-1 sm:mt-1",
                "overflow-visible"
              )}
            >
              <TextRotateCss
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                rotationInterval={3500}
                elementLevelClassName={cn(
                  "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.02em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "overflow-visible"
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
          "w-full", 
          isMobile ? "mt-1" : "mt-5 sm:mt-6",
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA 
          className={cn(isMobile ? "mb-1" : "mb-4 sm:mb-6")} 
          buttonText="RESERVE EARLY ACCESS" 
          showSocialProof={true} 
        />
      </div>
    </section>
  );
}

export default OptimizedHero;