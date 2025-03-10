
import React from "react";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist/waitlist-cta";
import { TextRotate } from "../ui/text-rotate";

export function Hero() {
  const rotatingWords = ["Converts", "Engages", "Captivates", "Drives Leads"];
  
  return <section className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-[40vh] relative z-10">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-8 sm:gap-10">
        <h1 className="text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-inter tracking-tight leading-tight block text-[#4A2DD9] px-0 mx-0">
            PROPERTY CONTENT THAT{" "}
            <TextRotate 
              texts={rotatingWords}
              mainClassName="inline-block"
              rotationInterval={2000}
            />
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-center text-brand-text-primary max-w-2xl mx-auto px-2">
          Connect with creators who see beyond square footage to capture the soul of your spaces. Our curated network transforms properties into visual narratives that intrigue, inspire, and ultimately convert.
        </p>
      </div>
      
      <div className="w-full max-w-xl mx-auto mt-10 sm:mt-12">
        <WaitlistCTA />
      </div>
    </section>;
}
export default Hero;
