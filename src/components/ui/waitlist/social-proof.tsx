
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
      {/* Enhanced social proof pill with refined design */}
      <div className={cn(
        "flex flex-col items-center", // Column layout for vertical centering
        "bg-gradient-to-r from-[#F5F0FF]/95 to-[#F0F5FF]/95",
        "rounded-[18px]", // Match other rounded elements
        "shadow-[0_2px_8px_rgba(124,58,237,0.18)]", // Enhanced shadow
        "border border-[#8A64FF]/30", // More visible border
        "animate-fade-in",
        isMobile ? "w-auto max-w-[250px]" : "w-auto max-w-[260px]", // Wider on mobile
        "mx-auto", // Center alignment
        "transition-all duration-300",
        "hover:shadow-[0_3px_12px_rgba(124,58,237,0.25)]", // Enhanced hover
        isMobile ? "px-3 py-2" : "px-4 py-2.5"
      )}>
        {/* Top row with avatars and counter - perfectly centered */}
        <div className="flex flex-col items-center w-full">
          {/* Row 1: Avatars and number, perfectly centered */}
          <div className="flex items-center justify-center mb-1">
            {/* Enhanced avatars */}
            <div 
              className="flex -space-x-1.5 items-center mr-2 animate-float-subtle"
              style={isMobile ? {animationDuration: "4.5s"} : {}}
            >
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[1.5px] border-white",
                "shadow-[0_1px_3px_rgba(138,43,226,0.3)]", // Enhanced shadow
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>JT</div>
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[1.5px] border-white", 
                "shadow-[0_1px_3px_rgba(138,43,226,0.3)]", // Enhanced shadow
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>MI</div>
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[1.5px] border-white",
                "shadow-[0_1px_3px_rgba(138,43,226,0.3)]", // Enhanced shadow
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>AS</div>
            </div>
            
            {/* Counter with enhanced gradient and scale-pulse animation */}
            <span 
              className={cn(
                "font-jakarta font-bold tracking-tight",
                "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600",
                "drop-shadow-[0_0px_1px_rgba(124,58,237,0.1)]", // Subtle text shadow
                "animate-counter-pulse", // Special animation just for the counter
                "inline-block", // Needed for transform to work properly
                isMobile ? "text-base" : "text-[15px]" // Larger on mobile
              )}
              style={isMobile ? {animationDuration: "4s"} : {}}
            >
              2,100+
            </span>
          </div>
          
          {/* Row 2: Descriptive text with improved contrast */}
          <span className={cn(
            "font-inter whitespace-nowrap text-center",
            "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600", // Match counter color
            "tracking-[0.02em] leading-tight", 
            "uppercase",
            isMobile ? "text-[9px]" : "text-[9px]" // Slightly larger on mobile
          )}>
            Property Owners & Creators Joined
          </span>
        </div>
      </div>
    </div>
  );
}
