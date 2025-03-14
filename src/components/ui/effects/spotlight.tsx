'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/mobile';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
  optimized?: boolean;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
  optimized = false,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // For non-optimized version only
  const mouseX = !optimized ? useSpring(0, springOptions) : undefined;
  const mouseY = !optimized ? useSpring(0, springOptions) : undefined;
  
  // For non-optimized version only
  const spotlightLeft = !optimized && mouseX 
    ? useTransform(mouseX, (x) => `${x - size / 2}px`) 
    : undefined;
    
  const spotlightTop = !optimized && mouseY 
    ? useTransform(mouseY, (y) => `${y - size / 2}px`) 
    : undefined;
  
  // State for optimized version
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Determine if reduced motion is preferred
  const reducedMotion = prefersReducedMotion();
  
  // If reduced motion is preferred, force optimized mode
  const useOptimized = optimized || reducedMotion;

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
        
        // Check if element is visible in viewport
        try {
          observerRef.current = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                setIsVisible(entry.isIntersecting);
              });
            },
            { 
              threshold: 0.1,
              rootMargin: '200px' // Larger preload area for smoother transitions
            }
          );
          
          observerRef.current.observe(parent);
        } catch (e) {
          console.error("Error setting up IntersectionObserver:", e);
          // Fallback: just show the component
          setIsVisible(true);
        }
        
        return () => {
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
          }
        };
      }
    }
    // Fallback if no ref
    return () => {};
  }, []);

  // Standard mouse move handler (non-optimized)
  const handleStandardMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement || !isVisible || !mouseX || !mouseY) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement, isVisible]
  );

  // Optimized mouse movement handler with debounced RAF
  const handleOptimizedMouseMove = useCallback((e: MouseEvent) => {
    // Update ref immediately to capture latest position
    positionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Only schedule animation frame if not already pending
    if (!frameRef.current && parentElement) {
      frameRef.current = requestAnimationFrame(() => {
        if (parentElement) {
          try {
            const { left, top } = parentElement.getBoundingClientRect();
            setPosition({
              x: positionRef.current.x - left - size / 2,
              y: positionRef.current.y - top - size / 2
            });
          } catch (err) {
            console.error("Error in animation frame:", err);
          }
        }
        frameRef.current = null;
      });
    }
  }, [parentElement, size]);

  // Choose the appropriate handler based on optimization setting
  const handleMouseMove = useOptimized ? handleOptimizedMouseMove : handleStandardMouseMove;

  useEffect(() => {
    if (!parentElement || !isVisible) return;

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    // Use passive event listeners for better performance
    try {
      parentElement.addEventListener('mousemove', handleMouseMove, { passive: true });
      parentElement.addEventListener('mouseenter', handleEnter, { passive: true });
      parentElement.addEventListener('mouseleave', handleLeave, { passive: true });
    } catch (err) {
      console.error("Error adding event listeners:", err);
    }

    return () => {
      try {
        parentElement.removeEventListener('mousemove', handleMouseMove);
        parentElement.removeEventListener('mouseenter', handleEnter);
        parentElement.removeEventListener('mouseleave', handleLeave);
      } catch (err) {
        console.error("Error removing event listeners:", err);
      }
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [parentElement, isVisible, handleMouseMove]);

  // Improve performance by not rendering when not visible or on mobile
  if (!isVisible) return null;

  if (useOptimized) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
          'from-zinc-50 via-zinc-100 to-zinc-200',
          isHovered ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          width: size,
          height: size,
          left: position.x,
          top: position.y,
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
          willChange: 'transform, opacity', // Hint to the browser about what will animate
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          perspective: '1000px',
          WebkitPerspective: '1000',
          WebkitFontSmoothing: 'antialiased',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
      />
    );
  }

  // Standard version with framer-motion
  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200 will-change-transform',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}

export default Spotlight;