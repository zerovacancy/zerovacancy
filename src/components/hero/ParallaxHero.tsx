"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist-cta";
import { WaitlistCreatorCTA } from "../ui/waitlist-creator-cta";
import { TextRotate } from "../ui/text-rotate";
import { SocialProof } from "../ui/waitlist/social-proof";

const radialGradientStyle = `
  .bg-radial-gradient {
    background: radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
  }
  
  .frosted-glass {
    background: linear-gradient(to bottom, rgba(245, 240, 255, 0.9), rgba(255, 255, 255, 0.85));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid;
    border-image: linear-gradient(to right, rgba(138, 92, 249, 0.3), rgba(102, 51, 255, 0.2)) 1;
    box-shadow: 0 10px 30px rgba(102, 51, 255, 0.12), inset 0 0 40px rgba(102, 51, 255, 0.05);
  }
  
  .premium-container-mobile {
    background: linear-gradient(to bottom, rgba(245, 240, 255, 0.9), rgba(255, 255, 255, 0.85));
    box-shadow: 0 10px 25px rgba(102, 51, 255, 0.2), inset 0 0 20px rgba(102, 51, 255, 0.03);
  }
  
  .gradient-border-bottom {
    position: relative;
  }
  
  .gradient-border-bottom:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 15%;
    width: 70%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(102, 51, 255, 0.3), transparent);
  }
  
  .text-glow {
    text-shadow: 0 0 10px rgba(102, 51, 255, 0.2);
  }
  
  .creator-button-hover {
    transition: all 0.3s ease;
  }
  
  .creator-button-hover:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 5px 15px rgba(102, 51, 255, 0.15);
    border-width: 2.5px;
  }
`;

const TITLES = ["CONVERTS", "CAPTIVATES", "CLOSES"];
const PARALLAX_IMAGES = [
  "/heroparallax/heroparallax1.jpg",
  "/heroparallax/heroparallax2.jpg",
  "/heroparallax/heroparallax3.jpg",
  "/heroparallax/heroparallax4.jpg",
  "/heroparallax/heroparallax5.jpg",
  "/heroparallax/heroparallax6.jpg",
  "/heroparallax/heroparallax7.jpg",
  "/heroparallax/heroparallax8.jpg",
];

export function ParallaxHero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    setMousePosition({ x: 5, y: 5 });

    if (isMobile || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || {};
      const x = (e.clientX - (left || 0) - (width || 0) / 2) / 25;
      const y = (e.clientY - (top || 0) - (height || 0) / 2) / 25;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, prefersReducedMotion]);

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
          "bg-purple-100" : 
          "bg-gradient-to-b from-[#f0e6ff] via-[#f8f5ff] to-[#e6f0ff]",
        "shadow-[inset_0_5px_15px_rgba(138,92,249,0.07),inset_0_-5px_15px_rgba(102,153,255,0.07)]",
        isInView ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className={cn(
        "absolute inset-0 z-0 mix-blend-overlay",
        isMobile ? "opacity-[0.03]" : "opacity-[0.04]"
      )} 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236633FF' fill-opacity='0.3'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
             backgroundSize: isMobile ? '16px 16px' : '20px 20px',
             width: '100%',
             height: '100%'
           }}
      ></div>
      
      <div className="absolute inset-0 z-0 bg-radial-gradient opacity-80 pointer-events-none"></div>
      
      <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vh] rounded-full bg-[#6633FF]/[0.06] blur-[80px] z-0"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[25vw] h-[25vh] rounded-full bg-[#4169E1]/[0.05] blur-[60px] z-0"></div>
      <div className="absolute top-[40%] right-[8%] w-[15vw] h-[20vh] rounded-full bg-[#8A5CF9]/[0.06] blur-[70px] z-0"></div>

      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden z-1 pointer-events-none"
      >
        {isMobile && (
          <div className="absolute top-2 right-2 z-30 text-[10px] flex items-center text-purple-700/70" aria-hidden="true">
            <input type="checkbox" id="reduced-motion" className="mr-1 h-3 w-3" checked={prefersReducedMotion} onChange={() => setPrefersReducedMotion(!prefersReducedMotion)} />
            <label htmlFor="reduced-motion" className="text-[9px] uppercase font-medium">Reduce motion</label>
          </div>
        )}
        <motion.div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className={cn(
              "absolute",
              isMobile 
                ? "top-[5%] left-[5%] z-10" 
                : "top-[25%] left-[10%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[2]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(102,51,255,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[130px] h-[100px] opacity-90 rotate-[-4deg]" 
                  : "w-32 h-24"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px, 0) 
                     rotate(-3deg) rotateX(${mousePosition.y * 0.02}deg) rotateY(${-mousePosition.x * 0.02}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0005})` 
                  : "rotate(-4deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 80 && Math.abs(mousePosition.y) < 80 ? 0.8 : 0.95) 
                  : 0.9
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "top-[5%] right-[5%] z-10" 
                : "top-[10%] left-[24%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[6]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(138,92,249,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[130px] h-[100px] opacity-90 rotate-[4deg]" 
                  : "w-56 h-44"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px, 0) 
                     rotate(-12deg) rotateX(${mousePosition.y * 0.03}deg) rotateY(${-mousePosition.x * 0.03}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0008})` 
                  : "rotate(4deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95) 
                  : 0.9
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "top-[28%] left-[3%] z-10" 
                : "top-[40%] left-[3%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[5]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(102,51,255,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[120px] h-[90px] opacity-80 rotate-[-5deg]" 
                  : "w-48 h-36"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 1.2}px, ${-mousePosition.y * 1.2}px, 0) 
                     rotate(-4deg) rotateX(${mousePosition.y * 0.02}deg) rotateY(${-mousePosition.x * 0.02}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0006})` 
                  : "rotate(-5deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95) 
                  : 0.8
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "top-[28%] right-[3%] z-10" 
                : "top-[40%] right-[3%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[7]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(65,105,225,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[120px] h-[90px] opacity-80 rotate-[5deg]" 
                  : "w-48 h-36"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 1.2}px, ${-mousePosition.y * 1.2}px, 0) 
                     rotate(4deg) rotateX(${mousePosition.y * 0.02}deg) rotateY(${-mousePosition.x * 0.02}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0006})` 
                  : "rotate(5deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95) 
                  : 0.8
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "bottom-[5%] left-[5%] z-10" 
                : "bottom-[18%] left-[15%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[1]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(138,92,249,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[120px] h-[90px] opacity-90 rotate-[-6deg]" 
                  : "w-60 h-60"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 4}px, ${-mousePosition.y * 4}px, 0) 
                     rotate(-4deg) rotateX(${mousePosition.y * 0.04}deg) rotateY(${-mousePosition.x * 0.04}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.001})` 
                  : "rotate(-6deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 150 && Math.abs(mousePosition.y) < 150 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 0.8 : 0.95) 
                  : 0.9
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "bottom-[5%] right-[5%] z-10" 
                : "top-[8%] right-[15%]",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[3]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(65,105,225,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[120px] h-[90px] opacity-90 rotate-[6deg]" 
                  : "w-60 h-52"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px, 0) 
                     rotate(6deg) rotateX(${mousePosition.y * 0.02}deg) rotateY(${-mousePosition.x * 0.02}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0006})` 
                  : "rotate(6deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95) 
                  : 0.9
              }}
            />
          </motion.div>

          <motion.div
            className={cn(
              "absolute",
              isMobile 
                ? "bottom-[12%] left-1/2 -translate-x-1/2 z-10" 
                : "bottom-[15%] left-[50%] -translate-x-1/2",
              "transform-style-3d perspective-[800px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 1.0 }}
          >
            <motion.img
              src={PARALLAX_IMAGES[0]}
              alt="Property content"
              className={cn(
                "object-cover rounded-xl",
                "shadow-[0_10px_25px_rgba(102,51,255,0.3)_,_inset_0_0_0_1px_rgba(255,255,255,0.6)]",
                isMobile 
                  ? "w-[120px] h-[90px] opacity-90 rotate-[0deg]" 
                  : "w-48 h-36"
              )}
              style={{ 
                transform: (!isMobile && !prefersReducedMotion) 
                  ? `translate3d(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px, 0) 
                     rotate(-3deg) rotateX(${mousePosition.y * 0.02}deg) rotateY(${-mousePosition.x * 0.02}deg)
                     scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0006})` 
                  : "rotate(0deg)",
                filter: (!isMobile && !prefersReducedMotion) 
                  ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)` 
                  : "contrast(1.05) saturate(1.05)",
                opacity: (!isMobile && !prefersReducedMotion) 
                  ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95) 
                  : 0.9
              }}
            />
          </motion.div>

          {!isMobile && (
            <>
              <motion.div
                className="absolute bottom-[8%] right-[10%] transform-style-3d perspective-[800px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ delay: 1.1 }}
              >
                <motion.img
                  src={PARALLAX_IMAGES[4]}
                  alt="Property content"
                  className="object-cover rounded-xl shadow-[0_15px_45px_rgba(138,92,249,0.18)] w-72 h-72"
                  style={{ 
                    transform: !prefersReducedMotion
                      ? `translate3d(${-mousePosition.x * 1}px, ${-mousePosition.y * 1}px, 0) 
                         rotate(12deg) rotateX(${mousePosition.y * 0.01}deg) rotateY(${-mousePosition.x * 0.01}deg)
                         scale(${1 + Math.min(Math.abs(mousePosition.x), Math.abs(mousePosition.y)) * 0.0004})`
                      : "rotate(12deg)",
                    filter: !prefersReducedMotion
                      ? `blur(${Math.abs(mousePosition.x) < 120 && Math.abs(mousePosition.y) < 120 ? 1 : 0}px)`
                      : "contrast(1.05) saturate(1.05)",
                    opacity: !prefersReducedMotion
                      ? (Math.abs(mousePosition.x) < 100 && Math.abs(mousePosition.y) < 100 ? 0.8 : 0.95)
                      : 1
                  }}
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <div className={cn(
        "absolute inset-0 z-5 pointer-events-none",
        isMobile 
          ? "bg-gradient-to-t from-white/30 via-white/10 to-transparent" 
          : "bg-gradient-to-t from-white/20 to-transparent"
      )}></div>
      
      <div className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto text-center relative px-4">
        <motion.div 
          className={cn(
            "relative overflow-hidden transform-gpu",
            isMobile ? 
              "premium-container-mobile backdrop-blur-[8px] rounded-[1.3rem] p-5 pt-5 pb-6 border border-white/80 shadow-[0_15px_35px_rgba(102,51,255,0.25),_0_3px_5px_rgba(102,51,255,0.15)]" : 
              "frosted-glass backdrop-blur-[10px] rounded-2xl p-7 pt-8 pb-10 sm:p-12"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ duration: 0.6 }}
          style={{ 
            transform: "translateY(-2px) translateZ(0)" 
          }}
        >
          {isMobile && (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/90 to-purple-50/70"></div>
          )}
          
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#6633FF]/5 to-[#8A5CF9]/3 blur-3xl z-0"></div>
          
          <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-0">
            <div className={cn(
              "absolute top-0 left-0 h-10",
              isMobile ? 
                "w-[1.5px] bg-gradient-to-b from-[#6633FF]/40 to-transparent" : 
                "w-[1.5px] bg-gradient-to-b from-[#6633FF]/30 to-transparent"
            )}></div>
            <div className={cn(
              "absolute top-0 left-0 w-10",
              isMobile ? 
                "h-[1.5px] bg-gradient-to-r from-[#6633FF]/40 to-transparent" : 
                "h-[1.5px] bg-gradient-to-r from-[#6633FF]/30 to-transparent"
            )}></div>
          </div>
          
          <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none z-0">
            <div className={cn(
              "absolute bottom-0 right-0 h-10",
              isMobile ? 
                "w-[1.5px] bg-gradient-to-t from-[#6633FF]/40 to-transparent" :
                "w-[1.5px] bg-gradient-to-t from-[#6633FF]/30 to-transparent"
            )}></div>
            <div className={cn(
              "absolute bottom-0 right-0 w-10",
              isMobile ? 
                "h-[1.5px] bg-gradient-to-l from-[#6633FF]/40 to-transparent" :
                "h-[1.5px] bg-gradient-to-l from-[#6633FF]/30 to-transparent"
            )}></div>
          </div>

          {!isMobile && (
            <>
              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none z-0">
                <div className="absolute top-0 right-0 h-10 w-[1.5px] bg-gradient-to-b from-[#6633FF]/30 to-transparent"></div>
                <div className="absolute top-0 right-0 w-10 h-[1.5px] bg-gradient-to-l from-[#6633FF]/30 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none z-0">
                <div className="absolute bottom-0 left-0 h-10 w-[1.5px] bg-gradient-to-t from-[#6633FF]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-10 h-[1.5px] bg-gradient-to-r from-[#6633FF]/30 to-transparent"></div>
              </div>
            </>
          )}
          
          <motion.h1 
            className={cn(
              "tracking-tight leading-tight font-bold font-jakarta relative z-10",
              isMobile ? "text-xl" : "text-4xl sm:text-5xl lg:text-6xl",
              isMobile ? "w-full mb-3" : "w-full mb-6 sm:mb-8"
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
                  "block mb-[0.25rem] text-[1rem] drop-shadow-[0_2px_2px_rgba(102,51,255,0.25)]" : 
                  "block mb-2 sm:mb-5 text-3xl sm:text-4xl lg:text-5xl drop-shadow-[0_2px_2px_rgba(102,51,255,0.25)]",
                "font-jakarta font-semibold"
              )}
            >
              PROPERTY CONTENT THAT
            </span>

            <div 
              className={cn(
                "relative flex w-full justify-center",
                isMobile ? "h-[3.5em]" : "h-[2.5em]",
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
                  isMobile ? "text-[2.2rem] leading-tight pb-1" : "text-5xl sm:text-6xl lg:text-7xl",
                  "font-bold font-jakarta tracking-tight text-glow",
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#6633FF] to-[#8A5CF9]",
                  "drop-shadow-[0_2px_1px_rgba(102,51,255,0.35)]",
                  isMobile ? 
                    "border-b-[1.5px] border-[#6633FF]/30 pb-1 gradient-border-bottom" : 
                    "border-b-2 border-[#6633FF]/20 pb-1 gradient-border-bottom"
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

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#6633FF]/15 to-transparent my-2"></div>

          <motion.p
            className={cn(
              "text-[#3D3A5A] font-inter relative z-10",
              "max-w-[95%] sm:max-w-[600px] mx-auto",
              "font-medium",
              isMobile ? 
                "text-[0.85rem] leading-[1.6] tracking-[0.01em] mb-4" : 
                "text-base sm:text-lg leading-relaxed tracking-wide mb-12"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {isMobile ? (
              "Connect with top creators who transform your spaces into compelling visual stories."
            ) : (
              "Connect with elite content creators who transform your spaces into compelling visual stories. Our curated network of real estate specialists delivers photography, video, and 3D content that doesn't just show your property—it showcases its potential."
            )}
          </motion.p>

          <motion.div
            className="w-full relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {!isMobile && (
              <div className="w-full max-w-4xl mx-auto relative">
                <div className="flex flex-row justify-center gap-[12%] mb-8 relative items-start">
                  <div className="flex flex-col w-[44%] max-w-[280px]">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-[0.5px] w-6 bg-purple-300/80 mr-2"></div>
                      <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Property Owners</span>
                      <div className="h-[0.5px] w-6 bg-purple-300/80 ml-2"></div>
                    </div>
                    <WaitlistCTA 
                      buttonText="RESERVE EARLY ACCESS" 
                      showSocialProof={false}
                      className="[&_button]:shadow-lg [&_button]:shadow-purple-500/25 [&_button]:hover:shadow-purple-500/35 [&_button]:hover:translate-y-[-2px] [&_button]:hover:scale-[1.01] [&_button]:transition-all [&_button]:duration-300"
                    />
                  </div>
                  
                  <div className="flex flex-col w-[44%] max-w-[280px] relative">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-[0.5px] w-6 bg-purple-300/80 mr-2"></div>
                      <span className="text-sm font-bold text-purple-700 tracking-wide font-jakarta">For Content Creators</span>
                      <div className="h-[0.5px] w-6 bg-purple-300/80 ml-2"></div>
                    </div>
                    <div className="relative">
                      <WaitlistCreatorCTA 
                        buttonText="JOIN AS CREATOR" 
                        showSocialProof={false}
                        className="[&_button]:border-[3px] [&_button]:border-purple-600 [&_button]:creator-button-hover [&_button]:transition-all [&_button]:duration-300"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="w-full flex justify-center mt-2">
                  <SocialProof className="mt-3" />
                </div>
              </div>
            )}
            
            {isMobile && (
              <>
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[280px] mx-auto flex flex-col">
                    <div className="flex flex-col mb-5">
                      <WaitlistCTA 
                        className="mb-0 [&_button]:py-[0.6rem] [&_button]:h-[38px] [&_button]:transition-all [&_button]:duration-300 [&_button]:active:scale-[1.02] [&_button]:active:brightness-110 [&_button]:shadow-md [&_button]:shadow-purple-500/30 [&_button]:text-[0.7rem] [&_button]:font-bold [&_button]:tracking-wider [&_input]:bg-white/90" 
                        buttonText="RESERVE ACCESS" 
                        showSocialProof={false}
                      />
                      
                      <div className="w-full flex flex-col items-center mt-[12px] relative">
                        <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#F5F0FF] z-10"></div>
                        <SocialProof 
                          className="mt-0 transform-gpu animate-fade-in scale-75 origin-top"
                        />
                      </div>
                    </div>
                    
                    <WaitlistCreatorCTA 
                      buttonText="JOIN AS CREATOR" 
                      showSocialProof={false}
                      className="[&_button]:py-[0.6rem] [&_button]:h-[38px] [&_button]:transition-all [&_button]:duration-300 [&_button]:active:scale-[1.02] [&_button]:active:brightness-105 [&_button]:bg-transparent [&_button]:shadow-md [&_button]:shadow-purple-500/15 [&_button]:text-[0.7rem] [&_button]:font-bold [&_button]:tracking-wider [&_button]:border-purple-700/80 [&_button]:text-purple-700 [&_button]:border-[2px]"
                    />
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
