
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
        isMobile ? "py-3 my-0" : "py-6 sm:py-12 lg:py-16 my-2 sm:my-6 lg:my-8", // Further reduced padding on mobile
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-2 sm:gap-6", // Further reduced gap on mobile
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          "gap-1 sm:gap-6", // Further reduced gap on mobile
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.15] text-center font-bold font-jakarta",
            isMobile ? "mb-0" : "mb-2 sm:mb-6" // Removed margin completely on mobile
          )}>
            <span 
              className={cn(
                "text-primary inline-block font-medium",
                "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]", 
                "text-brand-purple-dark",
                "block sm:inline-block mb-[-0.2em] sm:mb-0 font-jakarta" // Added negative margin to reduce space
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
                  ? "h-[2.8em] mt-0" // Further reduced height on mobile
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
                staggerDuration={0} // Removed stagger completely to avoid flashing
                rotationInterval={3500} // Increased interval to reduce flashing
                splitLevelClassName="overflow-visible"
                elementLevelClassName={cn(
                  "text-4xl sm:text-5xl lg:text-7xl",
                  "font-bold font-jakarta tracking-[-0.02em]",
                  "bg-clip-text text-transparent", 
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "overflow-visible"
                )}
                transition={{ 
                  type: "tween", // Changed to tween for smoother animation on mobile
                  duration: 0.5, // Fixed duration for more control
                  ease: "easeInOut" // Added easing for smoother animations
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
            isMobile ? "-mt-3" : "" // Increased negative margin on mobile to pull it up more
          )}
        >
          Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate
  specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential.
        </div>
      </div>

      <div 
        className={cn(
          "w-full", 
          isMobile ? "mt-1" : "mt-5 sm:mt-6", // Further reduced top margin on mobile
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA className={cn(isMobile ? "mb-0" : "mb-4 sm:mb-6")} buttonText="RESERVE EARLY ACCESS" showSocialProof={false} />
      </div>

      {/* Removed bounce arrow */}
    </section>
  );
}

export default Hero;
