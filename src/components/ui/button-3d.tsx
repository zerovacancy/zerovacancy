import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export function Button3D({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  className,
  ...props
}: Button3DProps) {
  // Base styles applied to all button variants
  const baseStyles = cn(
    // Basic layout
    "relative group overflow-hidden",
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded-full", // Fully rounded corners for pill shape
    "transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
    // 3D effect base
    "translate-y-0 active:translate-y-1",
    "transform-gpu",
    // Width handling
    fullWidth ? "w-full" : "w-auto",
    // Disabled state
    "disabled:opacity-70 disabled:pointer-events-none",
  );

  // Size variations
  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  // Variant styles with 3D effects
  const variantStyles = {
    // Primary - Purple gradient with 3D effect
    primary: cn(
      // Background & Text
      "bg-gradient-to-br from-indigo-600 to-purple-600 text-white",
      
      // 3D effect layers
      "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_0_#4c1d95]", // Top shadow + bottom extruded edge
      "active:shadow-[0_0px_0_#4c1d95]", // Pressed state (no bottom extrusion)
      
      // Edge highlight (subtle light reflections)
      "before:absolute before:left-0 before:top-0 before:h-[55%] before:w-full",
      "before:bg-gradient-to-b before:from-white/20 before:to-transparent",
      "before:rounded-t-full before:pointer-events-none",
      
      // Surface gradient
      "after:absolute after:inset-[1px] after:rounded-full after:bg-gradient-to-br",
      "after:from-indigo-500 after:to-purple-600 after:opacity-100 after:pointer-events-none",
      
      // Interactive states
      "hover:brightness-110 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_5px_0_#4c1d95]",
      "hover:-translate-y-0.5 active:translate-y-1 active:brightness-90",
    ),

    // Secondary - Lighter purple gradient
    secondary: cn(
      // Background & Text
      "bg-gradient-to-br from-indigo-300 to-purple-400 text-white",
      
      // 3D effect layers
      "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_0_#7e58c2]",
      "active:shadow-[0_0px_0_#7e58c2]",
      
      // Edge highlight
      "before:absolute before:left-0 before:top-0 before:h-[55%] before:w-full",
      "before:bg-gradient-to-b before:from-white/20 before:to-transparent",
      "before:rounded-t-full before:pointer-events-none",
      
      // Surface gradient
      "after:absolute after:inset-[1px] after:rounded-full after:bg-gradient-to-br",
      "after:from-indigo-200 after:to-purple-400 after:opacity-100 after:pointer-events-none",
      
      // Interactive states
      "hover:brightness-110 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_5px_0_#7e58c2]",
      "hover:-translate-y-0.5 active:translate-y-1 active:brightness-90",
    ),

    // Outline - White with purple border and 3D effect
    outline: cn(
      // Background & Text
      "bg-white text-purple-700",
      
      // 3D effect layers
      "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_0_#d8b4fe]",
      "active:shadow-[0_0px_0_#d8b4fe]",
      
      // Border
      "border border-purple-200",
      
      // Edge highlight
      "before:absolute before:left-0 before:top-0 before:h-[55%] before:w-full",
      "before:bg-gradient-to-b before:from-white/60 before:to-transparent",
      "before:rounded-t-full before:pointer-events-none",
      
      // Surface gradient
      "after:absolute after:inset-[1px] after:rounded-full after:bg-gradient-to-b",
      "after:from-white after:to-purple-50 after:opacity-80 after:pointer-events-none",
      
      // Interactive states
      "hover:bg-purple-50 hover:text-purple-800 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_5px_0_#d8b4fe]",
      "hover:-translate-y-0.5 active:translate-y-1 active:bg-purple-100",
    ),

    // Minimal - Subtle 3D effect for less prominent actions
    minimal: cn(
      // Background & Text
      "bg-gray-100 text-gray-700",
      
      // 3D effect layers
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_3px_0_#d1d5db]",
      "active:shadow-[0_0px_0_#d1d5db]",
      
      // Edge highlight
      "before:absolute before:left-0 before:top-0 before:h-[55%] before:w-full",
      "before:bg-gradient-to-b before:from-white/40 before:to-transparent",
      "before:rounded-t-full before:pointer-events-none",
      
      // Interactive states
      "hover:bg-gray-50 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_0_#d1d5db]",
      "hover:-translate-y-0.5 active:translate-y-1 active:bg-gray-200",
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
      {/* This z-index ensures content is above the pseudo-elements */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </span>
    </button>
  );
}