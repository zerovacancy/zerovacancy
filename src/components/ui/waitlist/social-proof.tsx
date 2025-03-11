
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
    <div className={cn("flex items-center justify-center mt-2 sm:mt-3", className)}> {/* Reduced from mt-4 sm:mt-6 */}
      {/* Social proof pill */}
      <div className={cn(
        "flex items-center gap-2 sm:gap-3 px-4 py-2",
        "bg-gradient-to-r from-indigo-50 to-purple-50",
        "border border-indigo-100/80",
        "rounded-full shadow-sm",
        "animate-fade-in",
        isMobile && "text-xs" // Ensure text size is consistent on mobile
      )}>
        <div className="flex -space-x-1 items-center">
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>JT</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>MI</div>
          <div className={cn(
            "rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
            "flex items-center justify-center text-[8px] text-white font-bold",
            "border-2 border-white shadow-sm",
            isMobile ? "w-6 h-6" : "w-7 h-7"
          )}>AS</div>
        </div>
        
        <div className={cn(
          "flex items-center whitespace-nowrap",
          isMobile && "text-xs"
        )}>
          <Users className="h-4 w-4 text-indigo-600 mr-1.5" />
          <span className="font-bold text-indigo-700">2,165+</span>
          <span className="text-gray-800"> people joined</span>
          <span className="text-gray-400 mx-1.5">•</span>
          <span className="text-gray-800">Queue: </span>
          <span className="text-indigo-700 font-bold">{isMobile ? "1-2 days" : "2-3 weeks"}</span>
        </div>
      </div>
    </div>
  );
}
