
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const shimmer = {
  initial: {
    x: "-100%"
  },
  animate: {
    x: "100%"
  },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    duration: 2,
    ease: "linear"
  }
};

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(({
  children,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.2)",
  shimmerSize = "60%",
  shimmerDuration = "2s",
  disabled,
  variant = 'primary',
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          base: [
            "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600",
            "text-white",
            "shadow-[0_4px_12px_rgba(79,70,229,0.2)]",
            "hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)]",
            "hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700",
          ],
          shimmerColor: "rgba(255, 255, 255, 0.2)"
        };
      case 'secondary':
        return {
          base: [
            "bg-white",
            "text-gray-900",
            "border-2 border-gray-200",
            "hover:bg-gray-50 hover:border-gray-300",
            "shadow-sm hover:shadow"
          ],
          shimmerColor: "rgba(0, 0, 0, 0.05)"
        };
      case 'tertiary':
        return {
          base: [
            "bg-gray-50/50",
            "text-gray-700",
            "border border-gray-200",
            "hover:bg-gray-100/70 hover:text-gray-900"
          ],
          shimmerColor: "rgba(0, 0, 0, 0.03)"
        };
      default:
        return {
          base: [],
          shimmerColor: "rgba(255, 255, 255, 0.2)"
        };
    }
  };

  const variantStyles = getVariantStyles();
  
  return (
    <button 
      ref={ref}
      className={cn(
        // Base styles
        "relative group/btn overflow-hidden",
        "h-12 px-6", // Increased height for better desktop presence
        "inline-flex items-center justify-center gap-2",
        "rounded-lg",
        "font-medium text-base",
        "transition-all duration-200",
        
        // Interactive States
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
        
        // Variant styles
        ...variantStyles.base,
        
        className
      )} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      disabled={disabled} 
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      <AnimatePresence>
        {!disabled && (
          <motion.span 
            className="absolute inset-0 z-0" 
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${variantStyles.shimmerColor} ${shimmerSize}, transparent 100%)`
            }} 
            initial="initial" 
            animate="animate" 
            variants={shimmer} 
            transition={{
              duration: parseInt(shimmerDuration),
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }} 
          />
        )}
      </AnimatePresence>
    </button>
  );
});

ShimmerButton.displayName = "ShimmerButton";
