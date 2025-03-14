
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.25)",
      shimmerSize = "0.1em",
      borderRadius = "9999px",
      shimmerDuration = "4s", // Slowed down from 2s to 4s
      background = "linear-gradient(110deg, #00AAEA 0%, #2F5BA9 40%, #932DD2 70%, #9B2C78 100%)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    
    return (
      <button
        ref={ref}
        className={cn(
          "relative h-12 w-full overflow-hidden px-4 py-2 group",
          "rounded-full transition-all duration-300 flex items-center justify-center",
          "touch-manipulation", // Add touch optimization class
          "-webkit-tap-highlight-color-transparent",
          "will-change-transform", // Adding performance optimization
          "active:scale-95",
          className
        )}
        style={{
          background,
          borderRadius,
          WebkitTapHighlightColor: 'transparent'
        }}
        {...props}
        data-mobile-optimized="true"
      >
        <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
          {children}
        </div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
