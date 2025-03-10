
import React from "react";
import { cn } from "@/lib/utils";
import { WaitlistCTA } from "../ui/waitlist/waitlist-cta";

export function Hero() {
  return (
    <section 
      className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-16 min-h-[30vh] relative z-10 bg-white"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 sm:gap-8">
        <h1 className="text-center">
          <span 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta tracking-tight leading-tight block text-[#4A2DD9]"
          >
            Property spaces deserve visionaries, not vendors.
          </span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-center text-brand-text-primary max-w-lg mx-auto px-2">
          Connect with creators who see beyond square footage to capture the soul of your spaces. Our curated network transforms properties into visual narratives that intrigue, inspire, and ultimately convert.
        </p>
      </div>
      
      <div className="w-full max-w-xl mx-auto mt-8">
        <WaitlistCTA />
      </div>
    </section>
  );
}

export default Hero;
