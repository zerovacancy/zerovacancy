
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
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "relative overflow-hidden",
        "group",
        isMobile 
          ? [
              "w-full",
              "rounded-xl",
              "h-[50px]",
              "bg-gradient-to-r from-[#6A3DE8] to-[#4361EE]",
              "hover:from-[#5A2DD8] hover:to-[#3351DE]", 
              "hover:scale-[1.02]",
              "text-white",
              "font-medium",
              "px-4"
            ] 
          : [
              "h-[52px]",
              "rounded-xl w-[210px] px-5",
              "bg-gradient-to-r from-[#6A3DE8] to-[#4361EE]",
              "hover:from-[#5A2DD8] hover:to-[#3351DE]",
              "hover:scale-[1.05]",
              "text-white font-medium",
              "after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-500/20 after:to-blue-500/20 after:opacity-0 after:animate-pulse after:pointer-events-none group-hover:after:opacity-100"
            ]
      )} 
      style={{
        gap: '6px'
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <>
          <span className={cn(
            "flex-shrink-0",
            "leading-none",
            isMobile ? "text-sm" : "text-sm"
          )}>
            Join Waitlist Now
          </span>
          <ArrowRight className="h-4 w-4 flex-shrink-0 inline-block transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Button>
  );
}
