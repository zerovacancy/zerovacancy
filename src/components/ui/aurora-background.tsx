
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode, useRef, useEffect, useState } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  intensity = 'medium',
  interactive = false,
  ...props
}: AuroraBackgroundProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  
  // Set intensity factor based on prop
  const getIntensityFactor = () => {
    switch(intensity) {
      case 'low': return 0.7;
      case 'high': return 1.3;
      default: return 1;
    }
  };
  
  const intensityFactor = getIntensityFactor();
  
  // Handle intersection observation for animation trigger
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            // Only hide if scrolled past (not if scrolled to)
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Handle interactive mouse movement
  useEffect(() => {
    if (!interactive || !ref.current || !auroraRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      // Calculate normalized position relative to the element (0-1)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
      
      // Update CSS variables for interactive effect
      if (auroraRef.current) {
        auroraRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
        auroraRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
      }
    };
    
    const resetPosition = () => {
      if (auroraRef.current) {
        auroraRef.current.style.setProperty('--mouse-x', '50%');
        auroraRef.current.style.setProperty('--mouse-y', '50%');
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', resetPosition);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (ref.current) {
        ref.current.removeEventListener('mouseleave', resetPosition);
      }
    };
  }, [interactive]);
  
  const getInteractiveStyles = () => {
    if (!interactive) return {};
    
    return {
      "--mouse-x": "50%",
      "--mouse-y": "50%",
      "--intensity": intensityFactor.toString()
    } as React.CSSProperties;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col min-h-[50vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
        className
      )}
      {...props}
    >
      {isVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            ref={auroraRef}
            style={getInteractiveStyles()}
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            ${interactive ? 
              '[background-position:calc(var(--mouse-x,50%)*0.5 + 25%)_calc(var(--mouse-y,50%)*0.5 + 25%),var(--mouse-x,50%)_var(--mouse-y,50%)]' : 
              '[background-position:50%_50%,50%_50%]'}
            filter blur-[calc(10px*var(--intensity,1))] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            ${interactive ? 
              'after:[background-position:calc(100% - var(--mouse-x, 50%))_calc(100% - var(--mouse-y, 50%)),var(--mouse-x, 50%)_var(--mouse-y, 50%)]' : 
              'after:animate-aurora after:[background-attachment:fixed]'} 
            after:mix-blend-difference
            absolute -inset-[10px] opacity-[calc(0.4*var(--intensity,1))] will-change-transform transition-all duration-700`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_${interactive ? 'var(--mouse-x, 100%)_var(--mouse-y, 0%)' : '100% 0%'},black_${interactive ? '20%' : '10%'},var(--transparent)_${interactive ? '80%' : '70%'})]`
            )}
          ></div>
        </div>
      )}
      {children}
    </div>
  );
};

export default AuroraBackground;
