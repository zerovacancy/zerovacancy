
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  children: React.ReactNode;
  size?: number;
  color?: string;
  fadeDuration?: number;
  disabled?: boolean;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className,
  children,
  size = 300,
  color = 'rgba(255, 255, 255, 0.08)',
  fadeDuration = 0.4,
  disabled = false
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile devices
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
  
  // Check for reduced motion preference
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleReducedMotionChange = () => {
        setIsReducedMotion(mediaQuery.matches);
      };
      
      handleReducedMotionChange();
      mediaQuery.addEventListener('change', handleReducedMotionChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      };
    } catch (err) {
      console.error("Error checking for reduced motion preference:", err);
    }
  }, []);
  
  // No spotlight on mobile or reduced motion
  if (isMobile || isReducedMotion || disabled) {
    return <div className={cn('relative', className)}>{children}</div>;
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseEnter = () => {
    setIsActive(true);
    setOpacity(1);
  };
  
  const handleMouseLeave = () => {
    setIsActive(false);
    setOpacity(0);
  };

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0"
        animate={{
          opacity,
          transition: { duration: fadeDuration }
        }}
      >
        <div
          className="absolute"
          style={{
            background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, ${color}, transparent)`,
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Spotlight;
