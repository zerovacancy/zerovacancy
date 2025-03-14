"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";
import { prefersReducedMotion } from "@/lib/mobile";

export interface AnimatedGridProps {
  className?: string;
  colors?: string[];
  optimized?: boolean;
  delay?: number;
}

export const AnimatedGrid = memo(({
  className,
  colors = ["#dd7bbb", "#d79f1e", "#5a922c", "#4c7894"],
  optimized = false,
  delay = optimized ? 30000 : 1000,
}: AnimatedGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const isActiveRef = useRef(false);
  const currentAngleRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if reduced motion is preferred
  const reducedMotion = prefersReducedMotion();
  
  // Determine whether to use optimized version
  const useOptimized = optimized || reducedMotion || isMobile;
  
  // Check if mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Only load after initial render to improve page load performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [delay]);

  // Set up intersection observer for better performance
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (!isIntersecting && isActiveRef.current) {
          // Element no longer visible, disable animations
          if (containerRef.current) {
            containerRef.current.style.setProperty("--active", "0");
            isActiveRef.current = false;
          }
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [isVisible]);

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (useOptimized || !containerRef.current || !isVisible) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smoother performance
      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const center = [left + width * 0.5, top + height * 0.5];
        const distanceFromCenter = Math.hypot(
          mouseX - center[0],
          mouseY - center[1]
        );
        const inactiveRadius = 0.5 * Math.min(width, height) * 0.7;

        if (distanceFromCenter < inactiveRadius) {
          if (isActiveRef.current) {
            element.style.setProperty("--active", "0");
            isActiveRef.current = false;
          }
          return;
        }

        const isActive =
          mouseX > left - 100 &&
          mouseX < left + width + 100 &&
          mouseY > top - 100 &&
          mouseY < top + height + 100;

        if (isActive !== isActiveRef.current) {
          element.style.setProperty("--active", isActive ? "1" : "0");
          isActiveRef.current = isActive;
        }

        if (!isActive) return;

        const currentAngle = currentAngleRef.current;
        let targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

        // Ensure angles are properly normalized to avoid NaN%
        targetAngle = isNaN(targetAngle) ? 0 : targetAngle;
        
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + (isNaN(angleDiff) ? 0 : angleDiff);

        // Only animate if the angle change is significant and values are valid
        if (Math.abs(angleDiff) > 1 && !isNaN(newAngle)) {
          animate(currentAngle, newAngle, {
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              if (element && !isNaN(value)) {
                element.style.setProperty("--start", String(value));
                currentAngleRef.current = value;
              }
            },
          });
        }
      });
    },
    [isVisible, useOptimized]
  );

  useEffect(() => {
    if (!isVisible || useOptimized) return;

    // Optimize event listeners with passive flag
    const handleScroll = () => {
      // Skip animation during scroll for better performance
      if (containerRef.current && isActiveRef.current) {
        containerRef.current.style.setProperty("--active", "0");
        isActiveRef.current = false;
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => handleMove(e);

    // Use passive: true for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handleMove, isVisible, useOptimized]);

  if (!isVisible) return null;

  // Render optimized version
  if (useOptimized) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden", className)}>
        <div
          className={cn(
            "absolute inset-0 bg-grid-pattern animate-grid-rotate",
            "opacity-0 transition-opacity duration-1000",
            isVisible && "opacity-100"
          )}
          style={{
            backgroundImage: `
              radial-gradient(circle, ${colors[0]} 10%, ${colors[0]}00 20%),
              radial-gradient(circle at 40% 40%, ${colors[1]} 5%, ${colors[1]}00 15%),
              radial-gradient(circle at 60% 60%, ${colors[2]} 10%, ${colors[2]}00 20%), 
              radial-gradient(circle at 40% 60%, ${colors[3]} 10%, ${colors[3]}00 20%),
              conic-gradient(
                from 0deg at 50% 50%,
                ${colors[0]} 0%,
                ${colors[1]} 25%,
                ${colors[2]} 50%, 
                ${colors[3]} 75%,
                ${colors[0]} 100%
              )
            `,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            backgroundSize: '200% 200%',
            backgroundPosition: 'center',
            animation: 'grid-rotate 15s linear infinite',
          }}
        />
      </div>
    );
  }

  // Render standard interactive version
  return (
    <div className={cn("relative will-change-transform promote-layer hidden sm:block", className)}>
      <div
        ref={containerRef}
        style={{
          "--spread": "40",
          "--start": "0",
          "--active": "0",
          "--glowingeffect-border-width": "2px",
          "--repeating-conic-gradient-times": "5",
          "--gradient": `radial-gradient(circle, ${colors[0]} 10%, ${colors[0]}00 20%),
            radial-gradient(circle at 40% 40%, ${colors[1]} 5%, ${colors[1]}00 15%),
            radial-gradient(circle at 60% 60%, ${colors[2]} 10%, ${colors[2]}00 20%), 
            radial-gradient(circle at 40% 60%, ${colors[3]} 10%, ${colors[3]}00 20%),
            repeating-conic-gradient(
              from var(--start) at 50% 50%,
              ${colors[0]} 0%,
              ${colors[1]} calc(25% / var(--repeating-conic-gradient-times)),
              ${colors[2]} calc(50% / var(--repeating-conic-gradient-times)), 
              ${colors[3]} calc(75% / var(--repeating-conic-gradient-times)),
              ${colors[0]} calc(100% / var(--repeating-conic-gradient-times))
            )`,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        } as React.CSSProperties}
        className={cn(
          "pointer-events-auto absolute inset-0 rounded-[inherit] promote-layer"
        )}
      >
        <div
          className={cn(
            "glow",
            "rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
            "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*1deg))]",
            "promote-layer"
          )}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  );
});

AnimatedGrid.displayName = "AnimatedGrid";

export default AnimatedGrid;