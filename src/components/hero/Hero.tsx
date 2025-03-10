
import React from "react";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";
import { GlowingEffect } from "../ui/glowing-effect";
import { motion } from "framer-motion";

export function Hero() {
  const rotatingWords = ["CONVERTS", "ENGAGES", "CAPTIVATES", "DRIVES LEADS"];
  
  return <section className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-[40vh] relative z-10">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-8 sm:gap-10">
        <h1 className="text-center flex flex-col items-center gap-3 sm:gap-4">
          <motion.span 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-inter tracking-tight leading-tight block text-[#4A2DD9] px-0 mx-0 relative"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            PROPERTY CONTENT THAT
            <GlowingEffect
              blur={10}
              spread={15}
              glow={true}
              variant="default"
              disabled={false}
              movementDuration={2}
              borderWidth={1}
            />
          </motion.span>
          <TextRotate 
            texts={rotatingWords}
            mainClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-inter text-[#4A2DD9] inline-block"
            rotationInterval={2000}
            exit={{ y: "-120%", opacity: 0 }}
          />
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-center text-brand-text-primary max-w-2xl mx-auto px-2 font-inter">
          Connect with creators who see beyond square footage to capture the soul of your spaces. Our curated network transforms properties into visual narratives that intrigue, inspire, and ultimately convert.
        </p>
      </div>
      
      <div className="w-full max-w-xl mx-auto mt-10 sm:mt-12 relative overflow-visible">
        <WaitlistCTA />
      </div>
    </section>;
}
export default Hero;
