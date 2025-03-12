
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
    <div className={cn("flex items-center justify-center mx-auto mt-2 sm:mt-3", className)}>
      {/* More compact social proof pill */}
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5",
        "bg-gradient-to-r from-indigo-50 to-purple-50",
        "border border-indigo-100/80",
        "rounded-full shadow-sm",
        "animate-fade-in",
        "max-w-fit", // Keep container only as wide as content
        isMobile ? "text-xs" : "text-sm" // Smaller text overall
      )}>
        <div className="flex -space-x-1 items-center">
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-5 h-5" : "w-6 h-6" // Smaller avatars
          )}>JT</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-5 h-5" : "w-6 h-6"
          )}>MI</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-5 h-5" : "w-6 h-6"
          )}>AS</div>
        </div>
        
        <div className={cn(
          "flex items-center whitespace-nowrap",
          isMobile ? "text-xs" : "text-sm"
        )}>
          <Users className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-indigo-600 mr-1")} />
          <span className="font-bold text-indigo-700">2,165+</span>
          {/* Removed "people joined" text */}
          <span className="text-gray-400 mx-1.5">•</span>
          <span className="text-gray-800">Queue: </span>
          <span className="text-indigo-700 font-bold">{isMobile ? "1-2 days" : "2-3 weeks"}</span>
        </div>
      </div>
    </div>
  );
}
