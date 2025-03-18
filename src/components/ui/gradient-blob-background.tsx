
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedSpotlight } from './optimized-spotlight';

interface GradientBlobBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  dotOpacity?: number;
  pattern?: 'dots' | 'grid' | 'none';
  withSpotlight?: boolean;
  spotlightClassName?: string;
  spotlightSize?: number;
  blobColors?: {
    first?: string;
    second?: string;
    third?: string;
  };
  blobOpacity?: number;
  blobSize?: 'small' | 'medium' | 'large';
  baseColor?: string;
  animationSpeed?: 'slow' | 'medium' | 'fast';
  interactive?: boolean;
}

export const GradientBlobBackground: React.FC<GradientBlobBackgroundProps> = ({
  className = '',
  children,
  dotOpacity = 0.4,
  pattern = 'dots',
  withSpotlight = false,
  spotlightClassName = 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
  spotlightSize = 350,
  blobColors = {
    first: 'bg-purple-100',
    second: 'bg-indigo-100',
    third: 'bg-blue-100'
  },
  blobOpacity = 0.15,
  blobSize = 'medium',
  baseColor = 'bg-white/80',
  animationSpeed = 'medium',
  interactive = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isReducedMotion = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Check if mobile and for reduced motion preference
  useEffect(() => {
    setIsMounted(true);
    try {
      isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect();
          setDimensions({ width, height });
        }
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    } catch (err) {
      console.error("Error setting up motion preferences:", err);
      return () => {}; // Empty cleanup if error
    }
  }, []);
  
  // Track mouse position for interactive mode
  useEffect(() => {
    if (!interactive || isMobile || !containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - left,
        y: e.clientY - top
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, isMobile]);
  
  // Don't render animations for users with reduced motion preference or mobile
  const shouldAnimate = isMounted && !isReducedMotion.current && !isMobile;

  // For mobile, render simplified background without animations
  if (isMobile) {
    return <div ref={containerRef} className={cn(`relative w-full overflow-hidden ${baseColor}`, className)}>
        {/* Simple gradient background for mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-gray-100/80"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>;
  }

  // Determine blob sizes based on the blobSize prop
  const getBlobSizeClass = (position: 'first' | 'second' | 'third') => {
    const sizes = {
      small: {
        first: 'w-64 h-64',
        second: 'w-64 h-64',
        third: 'w-64 h-64'
      },
      medium: {
        first: 'w-96 h-96',
        second: 'w-96 h-96',
        third: 'w-96 h-96'
      },
      large: {
        first: 'w-[45rem] h-[45rem]',
        second: 'w-[42rem] h-[42rem]',
        third: 'w-[48rem] h-[48rem]'
      }
    };
    return sizes[blobSize][position];
  };

  // Animation duration based on speed or disabled for reduced motion
  const getAnimationDuration = (base: number) => {
    if (!shouldAnimate) return '0s';
    const multipliers = {
      fast: 0.7,
      medium: 1,
      slow: 2.2
    };
    return `${base * multipliers[animationSpeed]}s`;
  };
  
  // Calculate interactive blob transformations
  const getInteractiveStyles = (index: number) => {
    if (!interactive || !dimensions.width || !dimensions.height) return {};
    
    // Create subtle movement based on mouse position
    const xPercent = mousePosition.x / dimensions.width;
    const yPercent = mousePosition.y / dimensions.height;
    
    const offsets = [
      { x: -15 * xPercent, y: -15 * yPercent },
      { x: 15 * xPercent, y: -10 * yPercent },
      { x: -10 * xPercent, y: 15 * yPercent }
    ];
    
    return {
      transform: `translate(${offsets[index].x}px, ${offsets[index].y}px)`,
      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };
  };
  
  // Only render dot/grid patterns if specified
  const renderPattern = () => {
    if (pattern === 'dots') {
      return <div className={`absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-${Math.round(dotOpacity * 100)}`}></div>;
    }
    
    if (pattern === 'grid') {
      return <div className={`absolute inset-0 opacity-${Math.round(dotOpacity * 10)}`}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>;
    }
    
    return null;
  };
  
  return <div ref={containerRef} className={cn(`relative w-full overflow-hidden ${baseColor}`, className)}>
      {/* Pattern background - only if pattern is not 'none' */}
      {renderPattern()}
      
      {/* Render main blobs (always visible) */}
      <div 
        className={cn(`absolute -top-10 -left-20 ${getBlobSizeClass('first')} ${blobColors.first} rounded-full mix-blend-multiply filter blur-3xl opacity-${Math.round(blobOpacity * 100)}`)} 
        style={{
          ...(shouldAnimate ? {
            animation: `blob ${getAnimationDuration(45)} infinite`
          } : {}),
          ...getInteractiveStyles(0)
        }}
      ></div>
      <div 
        className={cn(`absolute top-[40%] -right-20 ${getBlobSizeClass('second')} ${blobColors.second} rounded-full mix-blend-multiply filter blur-3xl opacity-${Math.round(blobOpacity * 100)}`)} 
        style={{
          ...(shouldAnimate ? {
            animation: `blob ${getAnimationDuration(50)} infinite`,
            animationDelay: `${getAnimationDuration(8)}`
          } : {}),
          ...getInteractiveStyles(1)
        }}
      ></div>
      <div 
        className={cn(`absolute -bottom-40 left-[20%] ${getBlobSizeClass('third')} ${blobColors.third} rounded-full mix-blend-multiply filter blur-3xl opacity-${Math.round(blobOpacity * 100)}`)} 
        style={{
          ...(shouldAnimate ? {
            animation: `blob ${getAnimationDuration(40)} infinite`,
            animationDelay: `${getAnimationDuration(15)}`
          } : {}),
          ...getInteractiveStyles(2)
        }}
      ></div>
      
      {/* Spotlight effect - only if withSpotlight is true */}
      {withSpotlight && <OptimizedSpotlight className={spotlightClassName} size={spotlightSize} />}
      
      {/* Content */}
      <div className="relative z-10 bg-neutral-50">
        {children}
      </div>
    </div>;
};
