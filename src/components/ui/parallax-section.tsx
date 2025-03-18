
"use client";

import React, { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  bgImage?: string;
  speed?: number;
  direction?: 'up' | 'down';
  overflow?: 'visible' | 'hidden';
  disabled?: boolean;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  bgClassName = '',
  bgImage,
  speed = 0.2,
  direction = 'up',
  overflow = 'hidden',
  disabled = false
}) => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
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

  // Disable parallax effect if:
  // - User prefers reduced motion
  // - On mobile devices
  // - Explicitly disabled
  const isParallaxDisabled = prefersReducedMotion || isMobile || disabled;

  // Set up parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Calculate y-offset based on scroll progress
  const factor = direction === 'down' ? -1 : 1;
  const yRange = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, 100 * speed * factor]
  );
  
  // Apply spring physics for smoother transitions
  const y = useSpring(yRange, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  return (
    <div 
      ref={sectionRef}
      className={cn(
        'relative',
        overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden',
        className
      )}
    >
      {/* Background with parallax effect */}
      {bgImage && (
        <motion.div
          className={cn(
            'absolute inset-0 w-full h-full',
            bgClassName
          )}
          style={{ 
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: isParallaxDisabled ? 0 : y,
            willChange: 'transform',
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
