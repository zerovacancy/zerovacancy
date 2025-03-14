
"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SocialProofProps {
  className?: string;
}

export function SocialProof({ className }: SocialProofProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("flex items-center justify-center mt-2", className)}> 
      {/* Elegant social proof pill with refined design */}
      <div className={cn(
        "flex flex-col items-center", // Changed to column layout for vertical centering
        "bg-gradient-to-r from-[#F5F0FF]/95 to-[#F0F5FF]/95",
        "rounded-[18px]", // Exact match to other rounded elements
        "shadow-[0_2px_6px_rgba(124,58,237,0.15)]", // Refined shadow matching site style
        "border border-[#8A64FF]/20",
        "animate-fade-in",
        isMobile ? "w-auto max-w-[220px]" : "w-auto max-w-[260px]", // Width adjusted for device
        "mx-auto", // Center alignment
        "transition-all duration-300",
        "hover:shadow-[0_3px_10px_rgba(124,58,237,0.18)]",
        isMobile ? "px-3 py-2" : "px-4 py-2.5"
      )}>
        {/* Top row with avatars and counter */}
        <div className="flex items-center justify-center mb-1">
          {/* Overlapping avatars with refined overlap */}
          <div className="flex -space-x-1.5 items-center mr-2">
            <div className={cn(
              "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
              "flex items-center justify-center text-[6px] text-white font-bold",
              "border-[1.5px] border-white shadow-sm",
              isMobile ? "w-4 h-4" : "w-5 h-5"
            )}>JT</div>
            <div className={cn(
              "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
              "flex items-center justify-center text-[6px] text-white font-bold",
              "border-[1.5px] border-white shadow-sm", 
              isMobile ? "w-4 h-4" : "w-5 h-5"
            )}>MI</div>
            <div className={cn(
              "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
              "flex items-center justify-center text-[6px] text-white font-bold",
              "border-[1.5px] border-white shadow-sm",
              isMobile ? "w-4 h-4" : "w-5 h-5"
            )}>AS</div>
          </div>
          
          {/* Counter with extra bold weight for more impact */}
          <span className={cn(
            "font-jakarta font-bold tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600",
            isMobile ? "text-sm" : "text-[15px]"
          )}>
            2,165+
          </span>
        </div>
        
        {/* Bottom row with descriptive text, centered */}
        <div className="text-center w-full">
          <span className={cn(
            "font-inter whitespace-nowrap",
            "text-[#5A5A72]", // Exact match to bodySecondary from color-theme.ts
            "tracking-[0.02em] leading-tight", // Consistent letter spacing
            isMobile ? "text-[8px]" : "text-[9px]"
          )}>
            PROPERTY OWNERS & CREATORS JOINED
          </span>
        </div>
      </div>
    </div>
  );
}
