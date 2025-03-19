import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Button3DEnhancedProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

/**
 * Enhanced 3D Button with sophisticated depth effects
 * 
 * Features:
 * - Multiple shadow layers for natural depth
 * - Inner highlighting for light simulation
 * - Surface gradients for dimensional appearance
 * - Advanced hover and click effects
 * - Refined edge definition and pill shape
 */
export function Button3DEnhanced({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  className,
  ...props
}: Button3DEnhancedProps) {
  // Base styles applied to all button variants - enhanced with better 3D effects
  const baseStyles = cn(
    // Basic layout
    "relative overflow-hidden",
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
    
    // Enhanced depth through shadow layering
    "shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.025)]",
    
    // Common border styles for 3D effect
    "border-b border-b-[rgba(0,0,0,0.1)]", // Bottom border for edge definition
    
    // Hover and active transformations - improved interactive states
    "hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.05),0_16px_32px_rgba(0,0,0,0.025)]",
    "hover:-translate-y-[1px] hover:scale-[1.01]",
    "active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
    "active:translate-y-[1px] active:scale-[0.99]",
    "transform-gpu",
    
    // Width handling
    fullWidth ? "w-full" : "w-auto",
    
    // Disabled state
    "disabled:opacity-70 disabled:pointer-events-none",
    
    // All buttons have a subtle glow effect at rest
    "before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:shadow-[0_0_20px_rgba(255,255,255,0.2)_inset] before:pointer-events-none"
  );

  // Size variations - improved with bigger border radius for pill shape
  const sizeStyles = {
    sm: "h-9 px-6 text-sm rounded-[18px]",
    md: "h-11 px-8 text-base rounded-[22px]",
    lg: "h-14 px-10 text-lg rounded-[28px] font-semibold",
  };

  // Variant specific styles with enhanced 3D effects
  const variantStyles = {
    // Primary - Purple with enhanced 3D effect
    primary: cn(
      // Enhanced surface gradient for dimensional look
      "bg-gradient-to-b from-[#8A3FFC] to-[#7928CA] text-white",
      
      // Inner top highlight for light effect
      "border-t border-t-[rgba(255,255,255,0.25)]",
      
      // Light reflection effect
      "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/20 after:via-transparent after:to-transparent after:h-[60%] after:opacity-60 after:pointer-events-none",
      
      // Interactive state refinements
      "hover:bg-gradient-to-b hover:from-[#9452FF] hover:to-[#8A3FFC]",
      "active:bg-gradient-to-b active:from-[#7928CA] active:to-[#6923B5]"
    ),

    // Secondary - Lighter purple with enhanced 3D effect
    secondary: cn(
      // Enhanced surface gradient
      "bg-gradient-to-b from-[#A78BFA] to-[#8B5CF6] text-white",
      
      // Inner top highlight
      "border-t border-t-[rgba(255,255,255,0.35)]",
      
      // Light reflection effect
      "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/25 after:via-transparent after:to-transparent after:h-[60%] after:opacity-70 after:pointer-events-none",
      
      // Interactive state refinements
      "hover:bg-gradient-to-b hover:from-[#B79CFF] hover:to-[#9B6DFF]",
      "active:bg-gradient-to-b active:from-[#9B6DFF] active:to-[#8A4FFF]"
    ),

    // Outline - White with purple border and enhanced 3D effect
    outline: cn(
      // Enhanced surface look
      "bg-white text-purple-700",
      
      // Border effect with enhanced dimension
      "border border-purple-300 border-t-purple-200 border-b-purple-400",
      
      // Inner shadow for depth
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.025),inset_0_1px_2px_rgba(255,255,255,0.5)]",
      
      // Light reflection effect
      "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/40 after:via-white/10 after:to-transparent after:h-[70%] after:opacity-60 after:pointer-events-none",
      
      // Interactive state refinements
      "hover:border-purple-400 hover:bg-purple-50",
      "active:border-purple-500 active:bg-purple-100 active:shadow-[0_1px_1px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(0,0,0,0.03)]"
    ),

    // White button with enhanced 3D effect
    white: cn(
      // Enhanced surface look
      "bg-gradient-to-b from-white to-[#F9FAFB] text-gray-800",
      
      // Border effect with enhanced dimension
      "border border-gray-200 border-t-white border-b-gray-300",
      
      // Inner shadow for depth
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.025),inset_0_1px_1px_rgba(255,255,255,0.7)]",
      
      // Light reflection effect
      "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/50 after:via-white/20 after:to-transparent after:h-[70%] after:opacity-70 after:pointer-events-none",
      
      // Interactive state refinements
      "hover:border-gray-300 hover:bg-gradient-to-b hover:from-white hover:to-gray-50",
      "active:border-gray-400 active:bg-gray-100 active:shadow-[0_1px_1px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(0,0,0,0.03)]"
    ),
  };

  // Combine all styles
  const buttonStyles = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  return (
    <button className={buttonStyles} {...props}>
      {/* Outer glow effect for primary and secondary buttons */}
      {(variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 -z-10 blur-md rounded-[inherit] bg-inherit opacity-25 -bottom-1 scale-[0.98]" />
      )}
      
      {/* Icon (left position) */}
      {icon && iconPosition === "left" && (
        <span className="relative">{icon}</span>
      )}
      
      {/* Button text */}
      <span className="relative">{children}</span>
      
      {/* Icon (right position) */}
      {icon && iconPosition === "right" && (
        <span className="relative">{icon}</span>
      )}
    </button>
  );
}