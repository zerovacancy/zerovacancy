
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'interactive' | 'static';
  intensity?: number;
}

export function RainbowButton({
  children,
  className,
  variant = 'default',
  intensity = 1,
  ...props
}: RainbowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const buttonRef = useRef<HTMLButtonElement>(null);
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
  
  // Handle interactive mouse events
  useEffect(() => {
    if (variant !== 'interactive' || !buttonRef.current || isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      // Calculate normalized position relative to the element (0-1)
      const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [variant, isMobile]);
  
  // Interactive mode styles
  const getInteractiveStyles = () => {
    if (variant !== 'interactive' || isMobile) return {};
    
    return {
      '--mouse-x': `${mousePosition.x * 100}%`,
      '--mouse-y': `${mousePosition.y * 100}%`,
      '--glow-opacity': isHovered ? `${0.6 * intensity}` : '0',
      '--glow-spread': isHovered ? `${70 + (intensity * 30)}px` : '0px',
      '--glow-blur': isHovered ? `${15 + (intensity * 10)}px` : '0px'
    } as React.CSSProperties;
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

        // before styles for glow
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",

        // light mode colors
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",

        // dark mode colors
        "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
        
        // Interactive variant additions
        variant === 'interactive' && "after:absolute after:inset-[-4px] after:-z-10 after:rounded-xl after:opacity-[var(--glow-opacity,0)] after:blur-[var(--glow-blur,0px)] after:transition-all after:duration-300 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),transparent_var(--glow-spread,0px))]",
        
        // Static variant (no animations)
        variant === 'static' && "animate-none before:animate-none",
        
        // Apply any custom classes
        className,
      )}
      style={getInteractiveStyles()}
      {...props}
    >
      {children}
    </button>
  );
}
