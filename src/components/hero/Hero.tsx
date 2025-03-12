
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
        "px-5 sm:px-6", 
        "py-6 sm:py-12 lg:py-16",
        "my-2 sm:my-6 lg:my-8",
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-4 sm:gap-6",
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-4 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.15] text-center font-bold font-jakarta",
            "mb-2 sm:mb-6" // Reduced bottom margin on mobile from mb-4 to mb-2
          )}>
            <span 
              className={cn(
                "text-primary inline-block font-medium",
                "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]", 
                "text-brand-purple-dark",
                "block sm:inline-block mb-0 sm:mb-0 font-jakarta" // Changed mb-1 to mb-0 on mobile
              )}
            >
              PROPERTY MARKETING
            </span>

            <div 
              role="text" 
              aria-label="Property Content animation"
              className={cn(
                "relative flex w-full justify-center",
                isMobile 
                  ? "h-[3.5em] mt-0" // Reduced height and top margin on mobile
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-1 sm:mt-1",
                "overflow-visible"
              )}
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
            isMobile ? "mt-0" : "" // Remove top margin on mobile
          )}
        >
          Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate
  specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential.
        </div>
      </div>

      <div 
        className={cn(
          "w-full", 
          isMobile ? "mt-3" : "mt-5 sm:mt-6", // Reduced top margin on mobile from mt-5 to mt-3
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA className={cn(isMobile ? "mb-2" : "mb-4 sm:mb-6")} buttonText="RESERVE EARLY ACCESS" showSocialProof={true} />
      </div>

      {isMobile && isInView && (
        <div className="w-full flex justify-center mt-1 animate-bounce-subtle"> {/* Reduced top margin from mt-2 to mt-1 */}
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
