
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

interface WaitlistButtonProps {
  isLoading: boolean;
}

export function WaitlistButton({ isLoading }: WaitlistButtonProps) {
  return (
    <Button 
      type="submit" 
      className={cn(
        "flex items-center justify-center",
        "whitespace-nowrap",
        "desktop-only-shadow-lg desktop-hover:shadow-xl",
        "desktop-transition",
        "relative overflow-hidden",
        "desktop-only-group",
        "w-full sm:w-[210px]",
        "rounded-xl",
        "h-[50px] sm:h-[52px]",
        "bg-gradient-to-r from-[#6A3DE8] to-[#4361EE]",
        "desktop-hover:from-[#5A2DD8] desktop-hover:to-[#3351DE]", 
        "desktop-hover:scale-[1.02] sm:desktop-hover:scale-[1.05]",
        "text-white",
        "font-medium",
        "px-4 sm:px-5",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "desktop-only-after:absolute desktop-only-after:inset-0 desktop-only-after:bg-gradient-to-r desktop-only-after:from-purple-500/20 desktop-only-after:to-blue-500/20 desktop-only-after:opacity-0 desktop-only-after:animate-pulse desktop-only-after:pointer-events-none desktop-only-group-hover:after:opacity-100"
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
            "desktop-transition desktop-group-hover:translate-x-1"
          )} aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
