
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  id?: string;
}

export function BeamsBackground({
  className,
  children,
  id
}: AnimatedGradientBackgroundProps) {
  const isMobile = useIsMobile();

  return (
    <div 
      id={id}
      className={cn("relative overflow-hidden", isMobile ? "bg-white" : "bg-white", className)}
    >
      {/* Only show background on desktop */}
      {!isMobile && <div className="absolute inset-0 bg-[#e6e3ff]/15"></div>}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

export default BeamsBackground;
