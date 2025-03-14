
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
        "relative z-10", 
        "gap-2 sm:gap-6", 
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      {/* Enhanced background with subtle pattern and gradient */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      {/* Desktop background decorative elements */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-200/20 rounded-full filter blur-3xl"></div>
        </div>
      )}

      {/* Mobile enhanced background */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 via-indigo-50/60 to-blue-50/40 opacity-90"></div>
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
              {/* Enhanced background highlight for the text rotation */}
              <div 
                className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "bg-[#F5F0FF]/40 rounded-lg z-[-1] shadow-sm", // Added shadow
                  isMobile 
                    ? "w-[105%] h-[85%] px-3" 
                    : "w-[110%] h-[80%] px-6 sm:px-8 lg:px-10"
                )}
                aria-hidden="true"
              ></div>
              
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

      {/* Enhanced CTA area with background highlight for desktop */}
      <div 
        className={cn(
          "w-full relative", 
          isMobile ? "mt-4" : "mt-8 sm:mt-10", // Increased spacing
          "px-4 sm:px-4",
          !isMobile && "py-4 bg-gradient-to-r from-indigo-50/30 via-purple-50/40 to-indigo-50/30 rounded-xl max-w-2xl mx-auto",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA 
          className={cn(isMobile ? "mb-0" : "mb-4 sm:mb-6")} 
          buttonText={isMobile ? "JOIN WAITLIST" : "RESERVE EARLY ACCESS"} // Different text for mobile
          showSocialProof={true}
        />
      </div>

      {/* Mobile scroll indicator */}
      {isMobile && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L10 9L19 1" stroke="#8A64FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </section>
  );
}

export default Hero;
