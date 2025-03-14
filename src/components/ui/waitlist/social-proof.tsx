
"use client";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SocialProofProps {
  className?: string;
}

export function SocialProof({ className }: SocialProofProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex items-center justify-center", 
      isMobile ? "mt-3" : "mt-2 sm:mt-3", 
      className
    )}> 
      {/* Enhanced social proof pill */}
      <div className={cn(
        "flex items-center gap-2 sm:gap-3",
        "px-4 py-2",
        "bg-gradient-to-r from-indigo-50 to-purple-50",
        "border border-indigo-100/80",
        "rounded-full",
        "shadow-sm hover:shadow-md transition-all duration-300", // Added hover effect
        "animate-fade-in",
        "max-w-fit", // Adjusted width to fit content
        "mx-auto", // Center alignment
        isMobile && "text-xs px-3 py-1.5" // Smaller padding on mobile
      )}>
        <div className="flex -space-x-1.5 items-center"> {/* Adjusted spacing */}
          {/* Enhanced avatars with animation */}
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            "transition-transform hover:scale-110 duration-200", // Added hover effect
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>JT</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            "transition-transform hover:scale-110 duration-200", // Added hover effect
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>MI</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            "transition-transform hover:scale-110 duration-200", // Added hover effect
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>AS</div>
        </div>
        
        <div className={cn(
          "flex items-center",
          "bg-white/40 rounded-full px-2 py-0.5", // Added subtle background
          isMobile && "text-xs"
        )}>
          <Users className="h-4 w-4 text-indigo-600 mr-1.5" />
          <span className="font-bold text-indigo-700">2,165+</span>
        </div>
      </div>
    </div>
  );
}
