import React from "react";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";
import { GlowingEffect } from "../ui/glowing-effect";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function Hero() {
  const rotatingWords = ["CONVERTS", "ENGAGES", "CAPTIVATES", "DRIVES LEADS"];
  const isMobile = useIsMobile();
  
  return (
    <section className={cn(
      "flex flex-col items-center justify-center",
      "px-4 sm:px-6",
      "py-12 sm:py-16 md:py-20",
      "min-h-[40vh]",
      "relative z-10",
      isMobile && "py-8 min-h-0"
    )}>
      <div className={cn(
        "max-w-5xl w-full mx-auto flex flex-col gap-8 sm:gap-10",
        isMobile && "gap-6"
      )}>
        <h1 className={cn(
          "text-center flex flex-col items-center gap-3 sm:gap-4",
          isMobile && "gap-2"
        )}>
          <motion.span 
            className={cn(
              "text-display px-0 mx-0 relative",
              isMobile && "text-3xl sm:text-4xl"
            )}
            style={{ color: "#4A2DD9" }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: isMobile ? 0.5 : 1, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            PROPERTY CONTENT THAT
            <GlowingEffect
              blur={isMobile ? 5 : 10}
              spread={isMobile ? 8 : 15}
              glow={!isMobile}
              variant="default"
              disabled={false}
              movementDuration={isMobile ? 1 : 2}
              borderWidth={1}
            />
          </motion.span>
          <TextRotate 
            texts={rotatingWords}
            mainClassName={cn(
              "text-display inline-block",
              isMobile && "text-3xl sm:text-4xl"
            )}
            style={{ color: "#4A2DD9" }}
            rotationInterval={2000}
            exit={{ y: "-120%", opacity: 0 }}
          />
        </h1>

        <p className={cn(
          "paragraph-base text-center max-w-2xl mx-auto px-2",
          isMobile && "text-sm px-0"
        )}>
          Connect with creators who see beyond square footage to capture the soul of your spaces. Our curated network transforms properties into visual narratives that intrigue, inspire, and ultimately convert.
        </p>
      </div>
      
      <div className={cn(
        "w-full max-w-xl mx-auto mt-10 sm:mt-12 relative overflow-visible",
        isMobile && "mt-6"
      )}>
        <WaitlistCTA />
      </div>
    </section>
  );
}

export default Hero;
