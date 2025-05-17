"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);
    const [isMobile, setIsMobile] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Check if mobile on mount and set up resize observer
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkMobile();
      
      // Set up event listeners
      window.addEventListener('resize', checkMobile, { passive: true });
      
      // Set up ResizeObserver to monitor size changes
      if (containerRef.current) {
        const resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            // Get the new dimensions
            const width = entry.contentRect.width;
            const height = entry.contentRect.height;
            
            // Only update if there's a significant change (prevents thrashing)
            if (
              Math.abs(dimensions.width - width) > 1 || 
              Math.abs(dimensions.height - height) > 1
            ) {
              setDimensions({ width, height });
            }
          }
        });
        
        // Start observing
        resizeObserver.observe(containerRef.current);
        
        // Mark as initialized after first measurements
        setIsInitialized(true);
        
        // Clean up
        return () => {
          window.removeEventListener('resize', checkMobile);
          resizeObserver.disconnect();
        };
      }
      
      // Fallback cleanup if no containerRef
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, [dimensions.width, dimensions.height]);
    
    // If on mobile, don't process any animations
    if (isMobile) {
      disabled = true;
    }

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current || disabled || !isInitialized) return;

        // Cancel any existing animation frame to prevent jank
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Use requestAnimationFrame for smooth animation
        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          // Get element bounds with cached values if available
          const elementWidth = dimensions.width || element.offsetWidth;
          const elementHeight = dimensions.height || element.offsetHeight;
          const { left, top } = element.getBoundingClientRect();
          
          // Get mouse position
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          // Update last position if new coords provided
          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          // Calculate center point
          const center = [left + elementWidth * 0.5, top + elementHeight * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(elementWidth, elementHeight) * inactiveZone;

          // Disable glow effect if mouse is in the inactive zone
          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          // Check if mouse is within proximity of the element
          const isActive =
            mouseX > left - proximity &&
            mouseX < left + elementWidth + proximity &&
            mouseY > top - proximity &&
            mouseY < top + elementHeight + proximity;

          // Set active state
          element.style.setProperty("--active", isActive ? "1" : "0");

          // Exit if not active
          if (!isActive) return;

          // Calculate glow angle
          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          const targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          // Find the shortest angle path
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          // Animate the glow effect using transform only (CLS-safe)
          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration, disabled, isInitialized, dimensions]
    );

    // Set up and clean up event listeners
    useEffect(() => {
      if (disabled || !isInitialized) return;

      // Create a throttled scroll handler for better performance
      const handleScroll = () => {
        if (animationFrameRef.current) return; // Skip if animation frame is pending
        
        // Queue frame for next available slot
        animationFrameRef.current = requestAnimationFrame(() => {
          handleMove();
          animationFrameRef.current = 0;
        });
      };
      
      // Pointer movement handler
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      // Add event listeners with passive flag for better performance
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      // Cleanup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = 0;
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled, isInitialized]);

    return (
      <>
        {/* Glow border container - appears when 'glow' is true */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity duration-300",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block",
            isMobile && "hidden" // Hide on mobile
          )}
          style={{
            // CLS prevention - ensure GPU acceleration and containment
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            contain: "paint style"
          }}
          aria-hidden="true" // Decorative element
        />
        
        {/* Main effect container */}
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
                radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
                  #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )`,
              // CLS prevention - hardware acceleration
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              // Ensure transitions only affect opacity, not layout
              transition: "opacity 0.3s ease-in-out",
              // Prevent any layout shifts from animations
              willChange: "opacity, transform"
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden",
            isMobile && "hidden", // Hide on mobile
            "gpu-accelerated" // Add our utility class for hardware acceleration
          )}
          aria-hidden="true" // Decorative element
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              // CLS-safe animation that only affects opacity
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
              // Hardware acceleration for the pseudo-element
              "after:transform-gpu after:backface-hidden"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };