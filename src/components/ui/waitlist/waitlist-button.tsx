
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WaitlistButtonProps {
  isLoading: boolean;
}

export function WaitlistButton({ isLoading }: WaitlistButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      type="submit" 
      className={cn(
        "flex items-center justify-center",
        "whitespace-nowrap",
        !isMobile && "shadow-lg hover:shadow-xl",
        !isMobile && "transition-all duration-300",
        "relative overflow-hidden",
        !isMobile && "group",
        "w-full sm:w-[210px]",
        "rounded-xl",
        "h-[50px] sm:h-[52px]",
        "bg-gradient-to-r from-[#6A3DE8] to-[#4361EE]",
        !isMobile && "hover:from-[#5A2DD8] hover:to-[#3351DE]", 
        !isMobile && "hover:scale-[1.02] sm:hover:scale-[1.05]",
        "text-white",
        "font-medium",
        "px-4 sm:px-5",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        !isMobile && "after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-500/20 after:to-blue-500/20 after:opacity-0 after:animate-pulse after:pointer-events-none group-hover:after:opacity-100"
      )} 
      style={{
        gap: '6px'
      }}
      disabled={isLoading}
      aria-label="Join the waitlist"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : (
        <>
          <span className={cn(
            "flex-shrink-0",
            "leading-none",
            "text-sm"
          )}>
            Join Waitlist Now
          </span>
          <ArrowRight className={cn(
            "h-4 w-4 flex-shrink-0 inline-block",
            !isMobile && "transition-transform group-hover:translate-x-1"
          )} aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
