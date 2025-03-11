
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";

const TITLES = ["REIMAGINED", "ELEVATED", "TRANSFORMED"];

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
        // Optimized padding for mobile
        "px-5 sm:px-6", 
        // Reduced vertical spacing on mobile
        "py-6 sm:py-12 lg:py-16",
        "my-2 sm:my-6 lg:my-8",
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        // Optimized vertical gap
        "gap-4 sm:gap-6",
        "touch-manipulation",
        // Enhanced gradient background
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      {/* Background pattern for visual interest - fixed SVG format */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          // Improved spacing
          "gap-4 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.15] text-center font-bold font-jakarta",
            // Improved spacing
            "mb-4 sm:mb-6"
          )}>
            {isMobile ? (
              <span className="flex flex-col items-center">
                <span 
                  className={cn(
                    "text-primary inline-block font-medium",
                    // Increased font size
                    "text-3xl sm:text-5xl lg:text-6xl",
                    "tracking-[-0.01em]", 
                    "text-brand-purple-dark mb-2"
                  )}
                >
                  PROPERTY MARKETING REIMAGINED
                </span>
              </span>
            ) : (
              <>
                <span 
                  className={cn(
                    "text-primary inline font-medium",
                    "text-3xl sm:text-5xl lg:text-6xl",
                    "tracking-[-0.02em]", 
                    "text-brand-purple-dark", 
                    "block sm:inline-block mb-1 sm:mb-0 font-jakarta"
                  )}
                >
                  PROPERTY MARKETING
                </span>

                <div 
                  role="text" 
                  aria-label="Property Content animation"
                  className="relative flex w-full justify-center h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] overflow-visible mt-1 sm:mt-1"
                >
                  <TextRotate
                    texts={TITLES}
                    mainClassName="flex justify-center items-center overflow-visible"
                    staggerFrom="last"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    staggerDuration={0.02}
                    splitLevelClassName="overflow-visible"
                    elementLevelClassName={cn(
                      "text-4xl sm:text-5xl lg:text-7xl",
                      "font-bold font-jakarta tracking-[-0.02em]",
                      "bg-clip-text text-transparent", 
                      "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                      "overflow-visible"
                    )}
                    transition={{ 
                      type: "spring", 
                      damping: 28, 
                      stiffness: 350
                    }}
                    rotationInterval={2200}
                  />
                </div>
              </>
            )}
          </h1>
        </div>

        <div 
          className={cn(
            // Improved text size and line height
            isMobile ? "text-base leading-relaxed" : "text-base lg:text-lg", 
            "text-brand-text-primary", 
            "text-center", 
            // Improved max width for mobile readability
            "max-w-[90%] sm:max-w-[500px]",
            "mx-auto", 
            "font-inter"
          )}
        >
          Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate
  specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential.
        </div>
      </div>

      <div 
        className={cn(
          "w-full", 
          // Improved spacing
          "mt-5 sm:mt-6",
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        {/* Enhanced WaitlistCTA */}
        <WaitlistCTA className="mb-4 sm:mb-6" buttonText="RESERVE EARLY ACCESS" />
      </div>

      {/* Mobile-only animated hint */}
      {isMobile && isInView && (
        <div className="w-full flex justify-center mt-2 animate-bounce-subtle">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-400"
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      )}
    </section>
  );
}

export default Hero;
