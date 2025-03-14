
"use client";

import { memo, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedGlowingEffectProps {
  blur?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  borderWidth?: number;
}

export const OptimizedGlowingEffect = memo(
  ({
    blur = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    borderWidth = 1,
    disabled = false,
  }: OptimizedGlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
      if (disabled) return;

      const container = containerRef.current;
      if (!container) return;

      let animationFrameId: number;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          // Only activate if mouse is outside the inactive zone
          const distance = Math.sqrt(x * x + y * y);
          const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * 0.7;
          
          if (distance < inactiveRadius) {
            setIsActive(false);
            return;
          }
          
          // Check if mouse is near the element
          const isNear = 
            e.clientX > rect.left - 100 &&
            e.clientX < rect.left + rect.width + 100 &&
            e.clientY > rect.top - 100 &&
            e.clientY < rect.top + rect.height + 100;
            
          setIsActive(isNear);
          
          if (isNear) {
            // Calculate angle for the gradient
            const angleRad = Math.atan2(y, x);
            const angleDeg = (angleRad * 180) / Math.PI + 90;
            setAngle(angleDeg);
          }
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }, [disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={{
            '--blur': `${blur}px`,
            '--spread': spread,
            '--angle': `${angle}deg`,
            '--active': isActive ? '1' : '0',
            '--border-width': `${borderWidth}px`,
          } as React.CSSProperties}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            "overflow-hidden",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--border-width))]',
              "after:border-[length:var(--border-width)] after:border-transparent",
              variant === "white" 
                ? "after:bg-white" 
                : "after:bg-gradient-to-r after:from-[#dd7bbb] after:via-[#d79f1e] after:to-[#4c7894]",
              "after:opacity-0 after:transition-opacity after:duration-300",
              "after:opacity-[var(--active)]",
              isActive && "after:animate-rotate-gradient"
            )}
          />
        </div>
      </>
    );
  }
);

OptimizedGlowingEffect.displayName = "OptimizedGlowingEffect";
