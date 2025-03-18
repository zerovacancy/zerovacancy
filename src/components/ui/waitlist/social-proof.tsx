
"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SocialProofProps {
  className?: string;
}

export function SocialProof({ className }: SocialProofProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("flex items-center justify-center", className)}> 
      {/* Enhanced social proof pill with refined design */}
      <div className={cn(
        "flex flex-col items-center", // Column layout for vertical centering
        "bg-gradient-to-r from-[#F5F0FF]/95 to-[#F0F5FF]/95", // Increased opacity for better readability
        "rounded-[18px]", // Match other rounded elements
        "shadow-[0_2px_8px_rgba(124,58,237,0.15)]", // Slightly enhanced shadow for badge-like appearance
        "border border-[#8A64FF]/30", // More visible border for distinction
        isMobile && "shadow-[inset_0_0_6px_rgba(124,58,237,0.08)]", // Subtle inner glow on mobile
        "animate-fade-in",
        isMobile ? "w-auto max-w-[220px]" : "w-auto max-w-[260px]", // Narrower on mobile to differentiate from buttons
        "mx-auto", // Center alignment
        "transition-all duration-300",
        "hover:shadow-[0_2px_6px_rgba(124,58,237,0.15)]", // Subtle hover effect
        isMobile ? "px-3 py-1.5" : "px-4 py-2.5" // Reduced height on mobile
      )}>
        {/* Top row with avatars and counter - perfectly centered */}
        <div className="flex flex-col items-center w-full">
          {/* Row 1: Avatars and number, perfectly centered */}
          <div className="flex items-center justify-center mb-1">
            {/* Enhanced avatars */}
            <div 
              className="flex -space-x-1.5 items-center mr-2 animate-pulse"
              style={isMobile ? {animationDuration: "3s"} : {}}
            >
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-700 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[2px] border-white", // Thicker white border for better contrast
                "shadow-[0_1px_4px_rgba(138,43,226,0.4)]", // Enhanced shadow for better pop
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>JT</div>
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-700 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[2px] border-white", // Thicker white border for better contrast
                "shadow-[0_1px_4px_rgba(138,43,226,0.4)]", // Enhanced shadow for better pop
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>MI</div>
              <div className={cn(
                "rounded-full bg-gradient-to-r from-purple-700 to-blue-600",
                "flex items-center justify-center text-[7px] text-white font-bold", // Larger text
                "border-[2px] border-white", // Thicker white border for better contrast
                "shadow-[0_1px_4px_rgba(138,43,226,0.4)]", // Enhanced shadow for better pop
                isMobile ? "w-[18px] h-[18px]" : "w-5 h-5" // Larger on mobile
              )}>AS</div>
            </div>
            
            {/* Counter with enhanced gradient and scale-pulse animation */}
            <span 
              className={cn(
                "font-jakarta font-extrabold tracking-tight",
                "bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-600",
                "drop-shadow-[0_0px_2px_rgba(124,58,237,0.25)]", // Enhanced text shadow for better contrast
                "animate-counter-pulse", // Special animation just for the counter
                "inline-block", // Needed for transform to work properly
                isMobile ? "text-[19px]" : "text-[15px]", // Even larger on mobile for emphasis
                isMobile && "animate-pulse-subtle" // Add subtle pulse animation for mobile
              )}
              style={isMobile ? {
                animationDuration: "4s",
                // Add custom animation for pulsing effect
                animation: "pulse 3s infinite ease-in-out"
              } : {}}
            >
              2,165+
            </span>
          </div>
          
          {/* Row 2: Descriptive text with improved contrast */}
          <span className={cn(
            "font-inter whitespace-nowrap text-center",
            "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600", // Match counter color
            "tracking-[0.01em] leading-tight", 
            "uppercase",
            isMobile ? "text-[8px]" : "text-[9px]" // Smaller on mobile for better contrast with number
          )}>
            {isMobile ? "Members Joined" : "Property Owners & Creators Joined"}
          </span>
        </div>
      </div>
    </div>
  );
}
