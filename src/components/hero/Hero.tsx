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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInView) {
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
        isMobile 
          ? "bg-transparent" 
          : "bg-gradient-to-b from-purple-50/80 via-indigo-50/60 to-blue-50/30",
        isInView ? "animate-fade-in" : "opacity-0",
      )} 
    >
      {!isMobile && (
        <>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE2NGZmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiPjxwYXRoIGQ9Ik0wIDBMNDAgNDAiLz48cGF0aCBkPSJNNDAgMEwwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,99,255,0.04)_0%,rgba(255,255,255,0)_70%)]"></div>
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
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                staggerFrom="last"
                initial={isMobile ? { y: 30, opacity: 0 } : { y: "40%", opacity: 0, scale: 0.95 }}
                animate={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
                exit={isMobile ? { y: -30, opacity: 0 } : { y: "-40%", opacity: 0, scale: 0.95 }}
                staggerDuration={isMobile ? 0 : 0}
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
        {!isMobile && (
          <div className="w-full max-w-4xl mx-auto relative" id="hero-cta-section">
            <div className="flex flex-row justify-center gap-[8%] mb-8 relative items-start">
              <div className="flex flex-col w-[45%] max-w-[280px]">
                <WaitlistCTA 
                  buttonText="RESERVE EARLY ACCESS" 
                  showSocialProof={false}
                />
              </div>
              
              <div className="flex flex-col w-[45%] max-w-[280px] relative">
                <div className="relative">
                  <WaitlistCreatorCTA 
                    buttonText="JOIN AS CREATOR" 
                    showSocialProof={false}
                    className=""
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <SocialProof className="mt-3" />
            </div>
          </div>
        )}
        
        {isMobile && (
          <>
            <div className="w-full flex flex-col items-center animate-fade-in-up">
              <div className="w-[92%] max-w-[320px] mx-auto flex flex-col items-center gap-4">
                <div className="flex flex-col mb-0 w-full">
                  <div 
                    onClick={(e) => {
                      // Find the hidden button and click it
                      const hiddenButton = e.currentTarget.querySelector('.hidden button');
                      if (hiddenButton) {
                        (hiddenButton as HTMLButtonElement).click();
                      }
                    }}
                    className="w-full cursor-pointer"
                  >
                    <button
                      className="w-full min-w-full h-[56px] font-medium rounded-[12px] text-white relative flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
                        fontSize: '14px',
                        fontWeight: 600,
                        paddingLeft: '52px',
                      }}
                    >
                      {/* Icon container */}
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 ml-6 flex items-center justify-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                          <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
                        </svg>
                      </div>
                      RESERVE EARLY ACCESS
                    </button>
                    
                    {/* Hidden original component for functionality */}
                    <div className="hidden">
                      <WaitlistCTA 
                        buttonText="RESERVE EARLY ACCESS" 
                        showSocialProof={false}
                        className="w-full mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-center mt-2.5 mb-2.5 relative z-10">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-[1px] h-3 bg-gradient-to-b from-transparent via-purple-300/20 to-purple-300/40"></div>
                    <SocialProof 
                      className="mt-0 transform scale-[0.95]"
                      style={{
                        borderRadius: '12px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        background: '#F8F8FA',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
                      }}
                    />
                  </div>
                </div>
                
                <div 
                  onClick={(e) => {
                    // Find the hidden button and click it
                    const hiddenButton = e.currentTarget.querySelector('.hidden button');
                    if (hiddenButton) {
                      (hiddenButton as HTMLButtonElement).click();
                    }
                  }}
                  className="w-full cursor-pointer"
                >
                  <button
                    className="w-full min-w-full h-[56px] font-medium rounded-[12px] text-[#7633DC] relative flex items-center justify-center"
                    style={{
                      background: '#F5F5F7', // Light gray background
                      color: '#7633DC', // Purple text color
                      border: '1px solid rgba(0,0,0,0.08)', // Subtle light gray border
                      boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      fontWeight: 600,
                      paddingLeft: '52px',
                    }}
                  >
                    {/* Icon container */}
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 ml-6 flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: '#F8F8FA', // Very light gray for icon container
                        border: '1px solid rgba(118,51,220,0.1)', // Subtle purple-tinted border
                        borderRadius: '12px',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" x2="19" y1="8" y2="14"></line>
                        <line x1="22" x2="16" y1="11" y2="11"></line>
                      </svg>
                    </div>
                    JOIN AS CREATOR
                  </button>
                  
                  {/* Hidden original component for functionality */}
                  <div className="hidden">
                    <WaitlistCreatorCTA 
                      buttonText="JOIN AS CREATOR" 
                      showSocialProof={false}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full flex justify-center mt-7">
              <div className="flex flex-col items-center opacity-60">
                <div className="text-xs text-purple-600 mb-1 font-medium">Scroll to explore</div>
                <svg width="18" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
