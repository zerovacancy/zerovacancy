import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Button3DBorderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

/**
 * Modern 3D Button with Border Effect
 * 
 * This button implements a raised 3D effect with distinct borders
 * similar to the reference: https://pbs.twimg.com/media/GlT98LwaEAANh6a.jpg
 */
export function Button3DBorder({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  className,
  ...props
}: Button3DBorderProps) {
  // Base styles applied to all button variants
  const baseStyles = cn(
    // Basic layout
    "relative group",
    "inline-flex items-center justify-center gap-2",
    "font-semibold rounded-full", // Fully rounded corners for pill shape
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
    
    // 3D effect structure - all buttons share this structure
    "before:absolute before:inset-0 before:rounded-full before:content-[''] before:z-[-1]",
    "before:transition-transform before:duration-200",
    "after:absolute after:inset-0 after:rounded-full after:content-[''] after:z-[-2]",
    
    // Interactive states (shared across variants)
    "hover:translate-y-[-1px] active:translate-y-[1px] transform-gpu",
    "hover:before:translate-y-[1px] active:before:translate-y-[-1px]",
    
    // Width handling
    fullWidth ? "w-full" : "w-auto",
    
    // Disabled state
    "disabled:opacity-70 disabled:pointer-events-none",
  );

  // Size variations for buttons
  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  // Variant specific styles with 3D border effects matching the reference
  const variantStyles = {
    // Primary - Purple with 3D border effect
    primary: cn(
      // Button face color
      "bg-gradient-to-b from-purple-600 to-purple-700 text-white",
      
      // Back face (3D layer)
      "before:bg-purple-800",
      
      // Bottom face/edge (deepest 3D layer)
      "after:bg-purple-900",
      
      // 3D offset amounts
      "before:translate-y-[2px]",
      "after:translate-y-[4px]",
      
      // Interactive states
      "hover:bg-gradient-to-b hover:from-purple-500 hover:to-purple-600",
      "active:bg-gradient-to-b active:from-purple-700 active:to-purple-800",
    ),

    // Secondary - Lighter purple with 3D effect
    secondary: cn(
      // Button face color
      "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white",
      
      // Back face (3D layer)
      "before:bg-indigo-700",
      
      // Bottom face/edge (deepest 3D layer)
      "after:bg-indigo-800",
      
      // 3D offset amounts
      "before:translate-y-[2px]",
      "after:translate-y-[4px]",
      
      // Interactive states
      "hover:bg-gradient-to-b hover:from-indigo-400 hover:to-indigo-500",
      "active:bg-gradient-to-b active:from-indigo-600 active:to-indigo-700",
    ),

    // Outline - White with purple border and 3D effect
    outline: cn(
      // Button face color
      "bg-white text-purple-700 border-2 border-purple-300",
      
      // Back face (3D layer)
      "before:bg-purple-200",
      
      // Bottom face/edge (deepest 3D layer)
      "after:bg-purple-300",
      
      // 3D offset amounts
      "before:translate-y-[2px]",
      "after:translate-y-[4px]",
      
      // Interactive states
      "hover:bg-purple-50",
      "active:bg-purple-100",
    ),

    // White button with subtle 3D effect
    white: cn(
      // Button face color
      "bg-white text-gray-800 border border-gray-200",
      
      // Back face (3D layer)
      "before:bg-gray-100",
      
      // Bottom face/edge (deepest 3D layer)
      "after:bg-gray-200",
      
      // 3D offset amounts
      "before:translate-y-[2px]",
      "after:translate-y-[4px]",
      
      // Interactive states
      "hover:bg-gray-50",
      "active:bg-gray-100",
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