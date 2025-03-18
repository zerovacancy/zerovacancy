
'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?: 'rotate' | 'pulse' | 'breathe' | 'colorShift' | 'flowHorizontal' | 'static' | 'interactive';
  blur?: number | 'softest' | 'soft' | 'medium' | 'strong' | 'stronger' | 'strongest' | 'none';
  transition?: any;
  scale?: number;
  duration?: number;
  intensity?: number;
  children?: React.ReactNode;
  wrapperClassName?: string;
  disableOnMobile?: boolean;
};

export function GlowEffect({
  className,
  style,
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
  mode = 'rotate',
  blur = 'medium',
  transition,
  scale = 1,
  duration = 5,
  intensity = 1,
  children,
  wrapperClassName,
  disableOnMobile = true,
}: GlowEffectProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);
  
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
  
  // Check for reduced motion preference
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleReducedMotionChange = () => {
        setShouldRender(!mediaQuery.matches);
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
  
  // Handle interactive mode mouse movement
  useEffect(() => {
    if (mode !== 'interactive' || !containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized position relative to the element (0-1)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);
  
  // Don't render effects on mobile if disabled
  if (isMobile && disableOnMobile) return <>{children}</>;
  
  // Don't render effects for users with reduced motion preference
  if (!shouldRender) return <>{children}</>;

  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: {
        ...(transition ?? BASE_TRANSITION),
      },
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale * intensity, 1 * scale],
      opacity: [0.5, 0.8 * intensity, 0.5],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    breathe: {
      background: [
        ...colors.map(
          (color) =>
            `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
        ),
      ],
      scale: [1 * scale, (1.05 * scale * intensity), 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
    interactive: {
      background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, transparent 100%)`,
      scale: 1 * scale,
      opacity: 0.7 * intensity,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
      }
    }
  };

  const getBlurClass = (blur: GlowEffectProps['blur']) => {
    if (typeof blur === 'number') {
      return `blur-[${blur}px]`;
    }

    const presets = {
      softest: 'blur-sm',
      soft: 'blur',
      medium: 'blur-md',
      strong: 'blur-lg',
      stronger: 'blur-xl',
      strongest: 'blur-2xl',
      none: 'blur-none',
    };

    return presets[blur as keyof typeof presets];
  };

  if (children) {
    // If children are provided, wrap them with the glow effect
    return (
      <div 
        ref={containerRef}
        className={cn("relative", wrapperClassName)}
      >
        <motion.div
          style={
            {
              ...style,
              '--scale': scale,
              '--intensity': intensity,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            } as React.CSSProperties
          }
          animate={animations[mode]}
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 h-full w-full',
            'scale-[var(--scale)] transform-gpu',
            getBlurClass(blur),
            className
          )}
        />
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      style={
        {
          ...style,
          '--scale': scale,
          '--intensity': intensity,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
      animate={animations[mode]}
      className={cn(
        'pointer-events-none h-full w-full',
        'scale-[var(--scale)] transform-gpu',
        getBlurClass(blur),
        className
      )}
    />
  );
}
