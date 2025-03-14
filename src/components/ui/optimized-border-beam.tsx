
"use client";

import { cn } from "@/lib/utils";

export interface OptimizedBorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function OptimizedBorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: OptimizedBorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-[calc(var(--border-width)*1px)] border-transparent",
        "overflow-hidden",
        className,
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 rounded-[inherit]",
          "after:absolute after:top-0 after:left-0 after:h-full after:w-[calc(var(--size)*1px)]",
          "after:animate-border-beam-simple after:animation-delay-[var(--delay)]",
          "after:bg-gradient-to-r after:from-[var(--color-from)] after:via-[var(--color-to)] after:to-transparent",
          "overflow-hidden"
        )}
      />
    </div>
  )
}

// Add to index.css:
// @keyframes border-beam-simple {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(calc(100% + var(--size) * 1px)); }
// }
