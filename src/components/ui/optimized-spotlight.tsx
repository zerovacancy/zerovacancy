
'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type OptimizedSpotlightProps = {
  className?: string;
  size?: number;
};

export function OptimizedSpotlight({
  className,
  size = 200,
}: OptimizedSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useIsMobile();

  // Exit early on mobile
  if (isMobile) return null;

  // Performance optimization: Only set up intersection observer once on mount
  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
        
        // Use IntersectionObserver with high threshold for performance
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setIsVisible(entry.isIntersecting);
              // Disconnect observer when element becomes visible to reduce CPU load
              if (entry.isIntersecting && observerRef.current) {
                // Keep observer for when element leaves viewport again
              }
            });
          },
          { 
            threshold: 0.1,
            rootMargin: '200px' // Larger preload area for smoother transitions
          }
        );
        
        observerRef.current.observe(parent);
        
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
  }, []);

  // Optimized mouse movement handler with debounced RAF
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Update ref immediately to capture latest position
    positionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Only schedule animation frame if not already pending
    if (!frameRef.current && parentElement) {
      frameRef.current = requestAnimationFrame(() => {
        if (parentElement) {
          const { left, top } = parentElement.getBoundingClientRect();
          setPosition({
            x: positionRef.current.x - left - size / 2,
            y: positionRef.current.y - top - size / 2
          });
        }
        frameRef.current = null;
      });
    }
  }, [parentElement, size]);

  // Only set up event listeners if the element is visible
  useEffect(() => {
    if (!parentElement || !isVisible) return;

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    // Use passive event listeners for better performance
    parentElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    parentElement.addEventListener('mouseenter', handleEnter, { passive: true });
    parentElement.addEventListener('mouseleave', handleLeave, { passive: true });

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleEnter);
      parentElement.removeEventListener('mouseleave', handleLeave);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [parentElement, isVisible, handleMouseMove]);

  // Improve performance by not rendering when not visible or on mobile
  if (!isVisible) return null;

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

export default OptimizedSpotlight;
