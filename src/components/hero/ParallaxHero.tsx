
"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { WaitlistCreatorCTA } from "../ui/waitlist-creator-cta";
import { TextRotate } from "../ui/text-rotate";
import { SocialProof } from "../ui/waitlist/social-proof";

// Add CSS for radial gradient only - no mobile overrides
const radialGradientStyle = `
  .bg-radial-gradient {
    background: radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 75%);
  }
`;

const TITLES = ["CONVERTS", "CAPTIVATES", "CLOSES"];

export function ParallaxHero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Track visibility
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
    <>
      <style dangerouslySetInnerHTML={{ __html: radialGradientStyle }} />
      <section 
        ref={sectionRef}
        className={cn(
        "w-full min-h-[90vh] relative overflow-hidden",
        "flex items-center justify-center",
        "py-12 px-4 sm:px-6",
        isMobile ? 
          "bg-gradient-to-br from-[#F0EBFF] via-[#ECE6FF] to-[#E8E2FF]" : 
          "bg-gradient-to-b from-[#F0EBFF] to-[#E8E2FF]",
        "shadow-[inset_0_5px_15px_rgba(138,92,249,0.09),inset_0_-5px_15px_rgba(102,153,255,0.09)]",
        isInView ? "animate-fade-in" : "opacity-0"
      )}
    >
      {/* Enhanced dot grid pattern for increased definition */}
      <div className={cn(
        "absolute inset-0 z-0 mix-blend-overlay",
        isMobile ? "opacity-[0.045]" : "opacity-[0.055]"
      )} 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236633FF' fill-opacity='0.35'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
             backgroundSize: isMobile ? '16px 16px' : '20px 20px',
             width: '100%',
             height: '100%'
           }}
      ></div>
      
      {/* Radial gradient for focal point */}
      <div className="absolute inset-0 z-0 bg-radial-gradient opacity-80 pointer-events-none"></div>
      
      {/* Enhanced soft color accents for darker background */}
      <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vh] rounded-full bg-[#6633FF]/[0.08] blur-[80px] z-0"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[25vw] h-[25vh] rounded-full bg-[#4169E1]/[0.07] blur-[60px] z-0"></div>
      <div className="absolute top-[40%] right-[8%] w-[15vw] h-[20vh] rounded-full bg-[#8A5CF9]/[0.08] blur-[70px] z-0"></div>

      {/* Clean minimal background overlay with a bit more opacity for depth */}
      <div className="absolute inset-0 z-5 bg-gradient-to-t from-white/25 to-transparent pointer-events-none"></div>
      
      {/* Content overlay */}
      <div className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto text-center relative px-4">
        {/* Text content container with premium card-like treatment */}
        <motion.div 
          className={cn(
            "relative overflow-hidden backdrop-blur-[2px] transform-gpu",
            "shadow-[0_15px_35px_rgba(102,51,255,0.18),_0_3px_5px_rgba(102,51,255,0.08)]", // Enhanced shadow
            "border border-white/30", // More visible border for better separation
            isMobile ? 
              "rounded-[1.3rem] p-5 pt-5 pb-6" : // Increased corner radius on mobile
              "rounded-2xl p-6 pt-7 pb-9 sm:p-10"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ duration: 0.6 }}
          style={{ 
            transform: "translateY(-2px) translateZ(0)" 
          }}
        >
          {/* Enhanced gradient background - updated for mobile */}
          <div className={cn(
            "absolute inset-0 z-0",
            isMobile ? 
              "bg-white bg-opacity-90" : 
              "bg-gradient-to-br from-white/70 via-white/60 to-[#f0e6ff]/40"
          )}></div>
          
          {/* Abstract shapes for decoration */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#6633FF]/5 to-[#8A5CF9]/3 blur-3xl z-0"></div>
          
          {/* Corner decorative elements - enhanced for mobile with gradient border */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-0">
            <div className={cn(
              "absolute top-0 left-0 h-8",
              isMobile ? "w-[1.5px] bg-gradient-to-b from-[#6633FF]/30 to-transparent" : 
                        "w-[1px] bg-gradient-to-b from-[#6633FF]/20 to-transparent"
            )}></div>
            <div className={cn(
              "absolute top-0 left-0 h-[1px]",
              isMobile ? "w-10 bg-gradient-to-r from-[#6633FF]/30 to-transparent" : 
                        "w-8 bg-gradient-to-r from-[#6633FF]/20 to-transparent"
            )}></div>
          </div>
          
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none z-0">
            <div className={cn(
              "absolute bottom-0 right-0 h-8",
              isMobile ? "w-[1.5px] bg-gradient-to-t from-[#6633FF]/30 to-transparent" :
                        "w-[1px] bg-gradient-to-t from-[#6633FF]/20 to-transparent"
            )}></div>
            <div className={cn(
              "absolute bottom-0 right-0 h-[1px]",
              isMobile ? "w-10 bg-gradient-to-l from-[#6633FF]/30 to-transparent" :
                        "w-8 bg-gradient-to-l from-[#6633FF]/20 to-transparent"
            )}></div>
          </div>
          
          {/* Main heading */}
          <motion.h1 
            className={cn(
              "tracking-tight leading-tight font-bold font-jakarta relative z-10",
              isMobile ? "text-2xl" : "text-4xl sm:text-5xl lg:text-6xl",
              isMobile ? "w-full mb-3" : "w-full mb-5 sm:mb-7"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span 
              className={cn(
                "relative z-10 inline-block",
                "bg-clip-text text-transparent bg-gradient-to-r from-[#6633FF] to-[#8A5CF9]",
                isMobile ? 
                  "block mb-[0.35rem] text-[1.4rem] drop-shadow-[0_2px_2px_rgba(102,51,255,0.25)]" : 
                  "block mb-1 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl drop-shadow-[0_2px_2px_rgba(102,51,255,0.2)]",
                "font-jakarta"
              )}
            >
              PROPERTY CONTENT THAT
            </span>

            <div 
              className={cn(
                "relative flex w-full justify-center",
                isMobile ? "h-[4.5em]" : "h-[2.5em]",
                "overflow-visible"
              )}
            >
              <TextRotate
                texts={TITLES}
                mainClassName="flex justify-center items-center overflow-visible"
                staggerFrom="last"
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.95 }}
                staggerDuration={0.03}
                rotationInterval={3500}
                elementLevelClassName={cn(
                  isMobile ? "text-[2.8rem] leading-tight pb-1" : "text-5xl sm:text-6xl lg:text-7xl",
                  "font-bold font-jakarta tracking-tight",
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#6633FF] to-[#8A5CF9]",
                  "drop-shadow-[0_2px_1px_rgba(102,51,255,0.3)]",
                  isMobile ? "border-b-[1px] border-[#6633FF]/10 pb-1" : "border-b-2 border-[#6633FF]/10 pb-1"
                )}
                transition={{ 
                  type: "spring",
                  damping: 24,
                  stiffness: 240,
                  mass: 0.8
                }}
                auto={true}
              />
            </div>
          </motion.h1>

          {/* Subtle divider line */}
          {isMobile && (
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#6633FF]/10 to-transparent my-1"></div>
          )}

          {/* Subheading with clean typography - improved for mobile */}
          <motion.p
            className={cn(
              "text-[#3D3A5A] font-inter relative z-10",
              "max-w-[95%] sm:max-w-[600px] mx-auto",
              "font-medium",
              isMobile ? "text-[0.95rem] leading-[1.65] mb-6" : "text-base sm:text-lg mb-10"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {isMobile ? (
              "Connect with elite content creators who transform your spaces into compelling visual stories."
            ) : (
              "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential."
            )}
          </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="w-full relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {/* Desktop CTA layout */}
          {!isMobile && (
            <div className="w-full max-w-4xl mx-auto relative">
              <div className="flex flex-row justify-center gap-[10%] mb-6 relative items-start">
                {/* Property Owner CTA */}
                <div className="flex flex-col w-[45%] max-w-[280px]">
                  <div className="flex items-center justify-center mb-3">
                    <div className="h-[0.5px] w-5 bg-purple-300/80 mr-2"></div>
                    <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Property Owners</span>
                    <div className="h-[0.5px] w-5 bg-purple-300/80 ml-2"></div>
                  </div>
                  <WaitlistCTA 
                    buttonText="RESERVE EARLY ACCESS" 
                    showSocialProof={false}
                  />
                </div>
                
                {/* Creator CTA */}
                <div className="flex flex-col w-[45%] max-w-[280px] relative">
                  <div className="flex items-center justify-center mb-3">
                    <div className="h-[0.5px] w-5 bg-purple-300/80 mr-2"></div>
                    <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Content Creators</span>
                    <div className="h-[0.5px] w-5 bg-purple-300/80 ml-2"></div>
                  </div>
                  <div className="relative">
                    <WaitlistCreatorCTA 
                      buttonText="JOIN AS CREATOR" 
                      showSocialProof={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Social proof centered below both buttons */}
              <div className="w-full flex justify-center">
                <SocialProof className="mt-2.5" />
              </div>
            </div>
          )}
          
          {/* Mobile CTA layout - improved with better spacing and touch areas */}
          {isMobile && (
            <>
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-[280px] mx-auto flex flex-col">
                  {/* Primary CTA with social proof grouped closely */}
                  <div className="flex flex-col mb-4">
                    {/* Main waitlist CTA with increased touch target */}
                    <WaitlistCTA 
                      className="mb-0 [&_button]:py-[1.1rem] [&_button]:h-[48px] [&_button]:transition-all [&_button]:duration-300 [&_button]:active:scale-[1.02] [&_button]:active:brightness-110" 
                      buttonText="RESERVE EARLY ACCESS" 
                      showSocialProof={false}
                    />
                    
                    {/* Social proof directly beneath primary CTA with tighter spacing and visual connection */}
                    <div className="w-full flex flex-col items-center mt-[10px] relative">
                      {/* Subtle connecting indicator */}
                      <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#F5F0FF] z-10"></div>
                      <SocialProof 
                        className="mt-0" 
                      />
                    </div>
                  </div>
                  
                  {/* Creator CTA hidden on mobile */}
                  {/* Removed JOIN AS CREATOR CTA for mobile view */}
                </div>
              </div>
            </>
          )}
        </motion.div>
        </motion.div>
      </div>
    </section>
    </>
  );
}

export default ParallaxHero;
