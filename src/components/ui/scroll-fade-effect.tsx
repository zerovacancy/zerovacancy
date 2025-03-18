
"use client";

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollFadeEffectProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  staggerChildren?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export const ScrollFadeEffect: React.FC<ScrollFadeEffectProps> = ({
  children,
  className = '',
  threshold = 0.1,
  direction = 'up',
  distance = 30,
  duration = 0.7,
  delay = 0,
  stagger = 0.1,
  once = true,
  staggerChildren = false,
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1
  }
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [childCount, setChildCount] = useState(0);

  // Check how many direct children we have for staggering
  useEffect(() => {
    if (ref.current && staggerChildren) {
      setChildCount(React.Children.count(children));
    }
  }, [children, staggerChildren]);

  // Set up intersection observer
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once, prefersReducedMotion]);

  // Initial animation values based on direction
  const getInitialTransform = () => {
    if (prefersReducedMotion) return {};
    
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  // If staggering children is desired, wrap them with motion.div
  if (staggerChildren && childCount > 0 && !prefersReducedMotion) {
    return (
      <div ref={ref} className={cn('overflow-hidden', className)}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            initial={getInitialTransform()}
            animate={isVisible ? { x: 0, y: 0, opacity: 1 } : getInitialTransform()}
            transition={{
              duration,
              delay: delay + index * stagger,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: duration * 0.8 },
              ...springConfig
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  // Default animation for the whole container
  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={prefersReducedMotion ? { opacity: 1 } : getInitialTransform()}
      animate={isVisible || prefersReducedMotion ? { x: 0, y: 0, opacity: 1 } : getInitialTransform()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: duration * 0.8 },
        ...springConfig
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeEffect;
