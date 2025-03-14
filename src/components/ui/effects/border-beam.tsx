"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/mobile";

// Add CSS property definition for offsetDistance
try {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @property --offset-distance {
        syntax: '<percentage>';
        initial-value: 0%;
        inherits: false;
      }
      
      @keyframes border-beam-simple {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(calc(100% + var(--size) * 1px)); }
      }
    `;
    document.head.appendChild(style);
  }
} catch (e) {
  console.warn('Could not add CSS property definition', e);
}

export interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
  optimized?: boolean
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
  optimized = false,
}: BorderBeamProps) {
  // Check if reduced motion is preferred
  const reducedMotion = prefersReducedMotion();
  
  // Force optimized mode if reduced motion is preferred
  const useOptimized = optimized || reducedMotion;
  
  if (useOptimized) {
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
    );
  }
  
  // Advanced version with more complex animation
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  );
}

export default BorderBeam;