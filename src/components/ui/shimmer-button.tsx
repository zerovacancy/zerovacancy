
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
      shimmerColor = "white",
      shimmerSize = "0.1em",
      borderRadius = "9999px",
      shimmerDuration = "2s",
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
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div
            className="h-full w-5 z-5 absolute top-0 overflow-hidden blur-[10px]"
            style={{
              animation: `shimmer ${shimmerDuration} infinite linear`,
              background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
              transform: "skewX(-20deg)",
              animationTimeline: "auto",
            }}
          />
          <div
            className="h-full w-5 z-5 absolute top-0 overflow-hidden"
            style={{
              animation: `shimmer ${shimmerDuration} infinite linear`,
              background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
              transform: "skewX(-20deg)",
              animationTimeline: "auto",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
          {children}
        </div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

const shimmerAnimation = `
@keyframes shimmer {
  0% {
    left: -50%;
  }
  100% {
    left: 150%;
  }
}
`;

// Inject the shimmer animation into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = shimmerAnimation;
  document.head.appendChild(style);
}
