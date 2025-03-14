
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";
import { GlowEffect } from "../ui/glow-effect";

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
        "min-h-fit sm:min-h-[36vh]",
        "relative z-10", 
        "gap-2 sm:gap-6", 
        "touch-manipulation",
        "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0"
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
                "text-3xl sm:text-5xl lg:text-6xl",
                "tracking-[-0.02em]",
                "block sm:inline-block mb-[-0.2em] sm:mb-0 font-jakarta",
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
                  : "h-[4.5em] sm:h-[3em] md:h-[2.5em] lg:h-[2.5em] mt-1 sm:mt-1",
                "overflow-visible",
                "gpu-accelerated",
                isMobile && "mobile-optimize"
              )}
            >
              {/* Enhanced highlight background with glow effect */}
              <div 
                className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "rounded-xl z-[-1]",
                  "overflow-hidden",
                  isMobile 
                    ? "w-[110%] h-[90%] px-3" 
                    : "w-[115%] h-[85%] px-6 sm:px-8 lg:px-10"
                )}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-[#F5F0FF]/40"></div>
                <GlowEffect 
                  colors={['rgba(138, 43, 226, 0.15)', 'rgba(65, 105, 225, 0.15)']} 
                  blur="soft" 
                  mode="breathe" 
                  scale={1.1}
                  duration={3.5}
                />
              </div>
              
              <div className="relative">
                <TextRotate
                  texts={TITLES}
                  mainClassName="flex justify-center items-center overflow-visible"
                  staggerFrom="last"
                  initial={{ y: "15%", opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: "-15%", opacity: 0, scale: 0.95 }}
                  staggerDuration={0.03}
                  rotationInterval={3500}
                  splitLevelClassName="overflow-visible"
                  elementLevelClassName={cn(
                    // Increased size compared to static text by using text-4xl+x rather than text-4xl
                    "text-[2.65rem] sm:text-[3.25rem] lg:text-[4.25rem]",
                    "font-bold font-jakarta tracking-[-0.02em]",
                    "bg-clip-text text-transparent", 
                    "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                    "relative overflow-visible"
                  )}
                  transition={{ 
                    type: isMobile ? "tween" : "spring",
                    damping: isMobile ? 25 : 16,
                    stiffness: isMobile ? 100 : 150,
                    mass: isMobile ? 0.6 : 0.8,
                    duration: isMobile ? 0.4 : 0.4,
                    ease: isMobile ? "circOut" : "easeOut"
                  }}
                  auto={true}
                />
                
                {/* Animated underline effect */}
                <div className={cn(
                  "absolute bottom-[-4px] sm:bottom-[-6px] left-1/2 transform -translate-x-1/2",
                  "h-[2px] sm:h-[3px]",
                  "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
                  "animate-pulse-subtle",
                  "w-[90%] sm:w-[80%]",
                  "rounded-full"
                )} />
              </div>
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

      <div 
        className={cn(
          "w-full", 
          isMobile ? "mt-1" : "mt-5 sm:mt-6",
          "px-4 sm:px-4",
          isInView ? "animate-fade-in delay-200" : "opacity-0" 
        )}
      >
        <WaitlistCTA 
          className={cn(isMobile ? "mb-0" : "mb-4 sm:mb-6")} 
          buttonText="RESERVE EARLY ACCESS" 
          showSocialProof={true}
        />
      </div>
    </section>
  );
}

export default Hero;
