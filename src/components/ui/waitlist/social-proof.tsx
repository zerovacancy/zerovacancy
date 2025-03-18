
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
        "flex items-center", // Horizontal layout
        "bg-white", // Clean white background
        "rounded-xl", // Slightly more pronounced corners
        "border border-purple-300/15", // Brand purple border with low opacity
        "animate-fade-in",
        "w-auto", // Auto width, not full width
        "mx-auto", // Center alignment
        "shadow-[0_2px_6px_rgba(124,58,237,0.08)]", // Subtle purple-tinted shadow
        "px-3.5 py-2", // Slightly larger padding for better visibility
        "backdrop-blur-sm", // Subtle blur effect
        "relative" // For positioning the accent element
      )}>
        
        {/* Avatar initials */}
        <div className="flex -space-x-1 items-center mr-2.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-[8px] text-white font-bold border border-white">JT</div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-[8px] text-white font-bold border border-white">MI</div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-[8px] text-white font-bold border border-white">AS</div>
        </div>
        
        {/* Counter and text */}
        <div className="flex items-center">
          <span className="font-jakarta font-bold text-purple-700 text-[15px] mr-1.5">
            2,165+
          </span>
          <span className="font-inter text-xs text-gray-700 whitespace-nowrap font-medium">
            members joined
          </span>
        </div>
      </div>
    </div>
  );
}
