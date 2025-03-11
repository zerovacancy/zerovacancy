
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";

const TITLES = ["INTRIGUE", "INSPIRE", "CONVERT"];

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
        // Standardized horizontal padding
        "px-4 sm:px-6", 
        // Increased vertical spacing
        "py-8 sm:py-12 lg:py-16",
        "my-4 sm:my-6 lg:my-8",
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        // Increased vertical gap
        "gap-6 sm:gap-6",
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
      )} 
    >
      <div 
        className={cn(
          "flex flex-col max-w-6xl mx-auto w-full",
          // Increased gap between content blocks
          "gap-6 sm:gap-6", 
          isInView ? "animate-fade-in delay-100" : "opacity-0"
        )}
      >
        <div className="relative">
          <h1 className={cn(
            "tracking-tight leading-[1.1] text-center font-bold font-jakarta",
            // Increased bottom margin
            "mb-6 sm:mb-6"
          )}>
            {isMobile ? (
              <span className="flex flex-col items-center">
                <span 
                  className={cn(
                    "text-primary inline-block font-medium",
                    "text-2xl sm:text-5xl lg:text-6xl",
                    "tracking-[-0.02em]", 
                    "text-brand-purple-dark mb-2"
                  )}
                >
                  THE VISION COLLECTIVE
                </span>
                <span 
                  className={cn(
                    "text-3xl sm:text-5xl lg:text-7xl",
                    "font-bold font-jakarta tracking-[-0.02em]",
                    "bg-clip-text text-transparent", 
                    "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]"
                  )}
                >
                  VISIONARIES
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
                  THE VISION COLLECTIVE
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
            isMobile ? "text-sm" : "text-base lg:text-lg", 
            "leading-relaxed", 
            "text-brand-text-primary", 
            "text-center", 
            "max-w-[500px]",
            "mx-auto", 
            "font-inter"
          )}
        >
          Property spaces deserve visionaries, not vendors. Connect with creators who see beyond square footage to capture the soul of your spaces. Our curated network transforms properties into visual narratives that intrigue, inspire, and ultimately convert.
        </div>
      </div>
      
      <div 
        className={cn(
          "w-full", 
          // Increased top margin
          "mt-6 sm:mt-6",
          // Consistent padding
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA className="mb-6 sm:mb-6" buttonText="RESERVE YOUR SPOT" />
      </div>
    </section>
  );
}

export default Hero;
