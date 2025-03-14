
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
    <div className={cn("flex items-center justify-center mt-4 sm:mt-6", className)}> 
      {/* Enhanced social proof pill with container */}
      <div className={cn(
        "flex flex-col items-center gap-1 sm:gap-2 px-5 py-3",
        "bg-gradient-to-r from-indigo-50/90 to-purple-50/80",
        "border border-indigo-100/80",
        "rounded-xl shadow-sm",
        "animate-pulse-subtle", // Subtle pulsing animation
        "max-w-fit", // Adjusted width to fit content
        "mx-auto", // Center alignment
        isMobile ? "text-xs" : "text-sm" // Responsive text size
      )}>
        <div className="flex -space-x-2 items-center mb-2"> {/* Increased negative space for overlapping */}
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[9px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-7 h-7" : "w-8 h-8" // Increased avatar size
          )}>JT</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[9px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-7 h-7" : "w-8 h-8" // Increased avatar size
          )}>MI</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[9px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-7 h-7" : "w-8 h-8" // Increased avatar size
          )}>AS</div>
        </div>
        
        <div className={cn(
          "flex flex-col items-center",
          "text-center"
        )}>
          <div className="flex items-center mb-1">
            <Users className="h-4 w-4 text-indigo-600 mr-1.5" />
            <span className="font-bold text-indigo-700">2,165+</span>
            <span className="ml-1 text-indigo-600 font-medium">JOINED</span>
          </div>
          <span className="text-xs text-indigo-500">Property Owners & Content Creators</span>
        </div>
      </div>
    </div>
  );
}
