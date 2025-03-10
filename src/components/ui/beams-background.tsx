
import React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div 
      id={id}
      className={cn("relative overflow-hidden bg-white", className)}
    >
      <div className="absolute inset-0 bg-[#e6e3ff]/15"></div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

export default BeamsBackground;
