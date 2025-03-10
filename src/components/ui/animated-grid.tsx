
"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AnimatedGridProps {
  className?: string;
}

export const AnimatedGrid = memo(({
  className,
}: AnimatedGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const isActiveRef = useRef(false);
  const currentAngleRef = useRef(0);
  const isMobile = useIsMobile();
  
  // Skip heavy effects on mobile devices
  const shouldRenderEffect = !isMobile || isVisible;
  
  // Only load after initial render to improve page load performance
  useEffect(() => {
    // Skip immediate loading on mobile to prioritize core content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, isMobile ? 2000 : 1000); // Longer delay on mobile

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

  // Set up intersection observer for better performance
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;
    
    // Skip intensive observation on mobile
    if (isMobile) {
      // Mobile devices just show the effect without animation
      setIsVisible(true);
      return;
    }
    
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
  }, [isVisible, isMobile]);

  // Optimized handleMove with throttling for better performance
  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      // Skip on mobile devices
      if (isMobile) return;
      
      if (!containerRef.current || !isVisible) return;

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

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        // Only animate if the angle change is significant for better performance
        if (Math.abs(angleDiff) > 3) { // Increased threshold to reduce animations
          animate(currentAngle, newAngle, {
            duration: 0.8, // Slightly slower for smoother animation
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              if (element) {
                element.style.setProperty("--start", String(value));
                currentAngleRef.current = value;
              }
            },
          });
        }
      });
    },
    [isVisible, isMobile]
  );

  // Set up event listeners with optimizations
  useEffect(() => {
    // Skip on mobile devices
    if (isMobile || !isVisible) return;

    // Throttle function to prevent excessive calls
    let lastCallTime = 0;
    const throttleTime = 1000 / 30; // Max 30 calls per second
    
    const throttledHandleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastCallTime >= throttleTime) {
        lastCallTime = now;
        handleMove(e);
      }
    };

    // Use passive event listeners for better performance
    document.body.addEventListener("pointermove", throttledHandleMove, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.removeEventListener("pointermove", throttledHandleMove);
    };
  }, [handleMove, isVisible, isMobile]);

  // Return simplified version for mobile
  if (isMobile) {
    return (
      <div className={cn("relative jitter-fix", className)}>
        <div
          className="pointer-events-auto absolute inset-0 rounded-[inherit]"
          style={{
            background: "linear-gradient(45deg, rgba(221,123,187,0.05), rgba(215,159,30,0.05), rgba(90,146,44,0.05), rgba(76,120,148,0.05))",
            borderRadius: "inherit",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="rounded-[inherit] h-full w-full" />
        </div>
      </div>
    );
  }

  // Only render full effect when visible and not on mobile
  if (!shouldRenderEffect) return null;

  return (
    <div className={cn("relative will-change-transform jitter-fix", className)}>
      <div
        ref={containerRef}
        style={{
          "--spread": "40",
          "--start": "0",
          "--active": "0",
          "--glowingeffect-border-width": "2px",
          "--repeating-conic-gradient-times": "5",
          "--gradient": `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
            radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
            radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
            radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
            repeating-conic-gradient(
              from var(--start) at 50% 50%,
              #dd7bbb 0%,
              #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
              #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
              #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
              #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
            )`,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        } as React.CSSProperties}
        className={cn(
          "pointer-events-auto absolute inset-0 rounded-[inherit] jitter-fix"
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
            "jitter-fix"
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
