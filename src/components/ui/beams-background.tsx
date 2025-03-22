import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { sectionStyles, getSectionGradient, getBackgroundPattern } from '@/utils/performance-optimizations';

// New optimized background component
interface OptimizedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  sectionIndex?: number;
  pattern?: 'diagonal' | 'dots' | 'grid';
  patternOpacity?: number;
  withRadialGradient?: boolean;
  withTopHighlight?: boolean;
  id?: string;
}

export const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  children,
  className = '',
  sectionIndex = 0,
  pattern = 'diagonal',
  patternOpacity = 0.06,
  withRadialGradient = true,
  withTopHighlight = false,
  id,
}) => {
  return (
    <div 
      id={id}
      className={cn(
        "relative", 
        sectionStyles(sectionIndex),
        className
      )}
    >
      {/* Base background color and gradient */}
      <div className={cn("absolute inset-0", getSectionGradient(sectionIndex))}></div>
      
      {/* Pattern overlay */}
      <div className={cn(
        "absolute inset-0", 
        getBackgroundPattern(pattern, patternOpacity)
      )}></div>
      
      {/* Optional subtle radial gradient */}
      {withRadialGradient && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,99,255,0.04)_0%,rgba(255,255,255,0)_70%)]"></div>
      )}
      
      {/* Optional top highlight */}
      {withTopHighlight && (
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Original BeamsBackground for backward compatibility
interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  id?: string;
}

// For backward compatibility, BeamsBackground now uses the optimized version
export function BeamsBackground({
  className,
  children,
  intensity = "medium",
  id
}: AnimatedGradientBackgroundProps) {
  // Select the appropriate pattern and section index based on intensity
  const patternMap = {
    subtle: { pattern: 'diagonal' as const, index: 0, opacity: 0.04 },
    medium: { pattern: 'diagonal' as const, index: 1, opacity: 0.06 },
    strong: { pattern: 'diagonal' as const, index: 2, opacity: 0.08 }
  };
  
  const { pattern, index, opacity } = patternMap[intensity];
  
  return (
    <OptimizedBackground 
      id={id}
      className={className}
      sectionIndex={index}
      pattern={pattern}
      patternOpacity={opacity}
      withRadialGradient={true}
    >
      {children}
    </OptimizedBackground>
  );
}

export default BeamsBackground;
