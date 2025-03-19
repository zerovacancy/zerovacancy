import React, { ButtonHTMLAttributes, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { shadowStyles } from "@/styles/button-style-guide";

interface Button3DPhysicalProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  iconContainerStyle?: React.CSSProperties;
}

/**
 * Clean 3D Button with simple, unified shadow approach
 */
export function Button3DPhysical({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  className,
  iconContainerStyle,
  ...props
}: Button3DPhysicalProps) {
  // Refs for icon elements to apply container styles
  const leftIconRef = useRef<HTMLDivElement>(null);
  const rightIconRef = useRef<HTMLDivElement>(null);
  
  // State for hover and pressed states to apply refined color transitions
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Effect to apply custom icon container styles from data-container-style attribute
  useEffect(() => {
    if (!icon) return;
    
    // Process icon children to find any data-container-style attributes
    const iconElement = icon as React.ReactElement;
    if (iconElement?.props?.['data-container-style']) {
      try {
        const customStyles = JSON.parse(iconElement.props['data-container-style']);
        if (customStyles && typeof customStyles === 'object') {
          // Apply styles to the appropriate container based on icon position
          const container = iconPosition === 'left' ? leftIconRef.current : rightIconRef.current;
          if (container) {
            Object.keys(customStyles).forEach(key => {
              container.style[key as any] = customStyles[key];
            });
          }
        }
      } catch (err) {
        console.error('Error parsing icon container styles:', err);
      }
    }
  }, [icon, iconPosition]);
  
  // Size variations with more subtle border radius to match icon container
  // Adjust border radius to match icon container styling
  const sizeStyles = {
    sm: "h-9 text-sm rounded-[9px] overflow-hidden",
    md: "h-11 text-base rounded-[12px] overflow-hidden",
    lg: "h-14 text-[15px] rounded-[15px] font-semibold overflow-hidden", // Reduced font size, softer radius
  };

  // Enhanced variant styles for premium physical button appearance
  const variantStyles = {
    primary: "text-white border border-[rgba(134,65,245,0.5)]",
    secondary: "text-[#8345E6] border border-[rgba(118,51,220,0.12)]", // Match secondary color spec
    outline: "text-purple-700 border border-purple-300",
    white: "text-[#7633DC] font-medium", // Updated to match refined color spec
  };

  // Refined button styles with precise interaction physics
  const baseStyles = cn(
    "relative",
    "inline-flex items-center justify-center", // Removed gap as we'll handle spacing differently
    "font-medium select-none",
    "transition-all duration-150 ease-out", 
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2",
    fullWidth ? "w-full" : "w-auto",
    "disabled:opacity-70 disabled:pointer-events-none",
    
    // Improved horizontal padding for better text space
    icon ? (iconPosition === "left" ? "pl-6 pr-10" : "pl-10 pr-6") : "px-10",
    
    // Enhanced hover state with premium 3D elevation effect
    "hover:-translate-y-[3px] hover:scale-[1.01]", 
    // Refined color enhancement on hover for physical look
    variant === 'primary' || variant === 'secondary' 
      ? "hover:brightness-[1.07]" 
      : "hover:brightness-[1.03]",
    
    // Precise active state with realistic depression effect
    "active:translate-y-[1px] active:scale-[0.99]", 
    "active:shadow-[0_1px_2px_rgba(0,0,0,0.15)]", // Compressed shadow when pressed
    "active:brightness-95", // Subtle darkening when pressed
    
    // Hardware acceleration for smoother transitions
    "will-change-transform transform-gpu"
  );

  // Combining the styles
  const buttonStyles = cn(
    baseStyles,
    sizeStyles[size || "md"],
    variantStyles[variant],
    className
  );

  // Enhanced 3D shadow implementation with precise exponential falloff
  const getShadowStyle = () => {
    const isDark = variant === 'primary';
    const isWhite = variant === 'white';
    const isSecondary = variant === 'secondary';
    
    // Exact shadow values from example - creates perfect exponential falloff
    const commonShadow = shadowStyles.standard;
    
    // Enhanced edge treatment with light source from above
    // This creates the impression of a physical surface with proper edge highlights
    const insetEffect = isWhite ? 
      // Exactly match the icon container inset shadow
      'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)' : 
      isSecondary ?
        'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04)' :
        'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)';
    
    // Combine all shadows
    const fullShadow = `${commonShadow}, ${insetEffect}`;
    
    // Match the icon container's exact styling for the entire button with refined colors
    const backgroundStyle = isDark ? {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
      border: '1px solid rgba(255,255,255,0.2)'
    } : isWhite ? {
      // Primary button with purple tint gradient
      background: isHovered ?
        'linear-gradient(180deg, rgba(118,51,220,0.13) 0%, rgba(118,51,220,0.17) 100%), linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)' :
        'linear-gradient(180deg, rgba(118,51,220,0.08) 0%, rgba(118,51,220,0.12) 100%), linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)',
      border: '1px solid rgba(118,51,220,0.18)', // Subtle purple border
      borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px" // Match icon container border radius
    } : {
      // Secondary button with refined styling
      background: isHovered ?
        'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(243,240,255,0.5) 100%)' : // Subtle purple tint on hover
        'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,248,250,1) 100%)',     // Minimal purple tint
      border: '1px solid rgba(118,51,220,0.12)', // Lightened border
      borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px" // Match icon container border radius
    };
    
    // Enhanced styles for premium 3D effect
    return {
      boxShadow: isPressed ? shadowStyles.pressed : fullShadow,
      transition: 'all 0.15s ease-out', // Refined timing for better interaction physics
      ...backgroundStyle
    };
  };

  return (
    <button 
      className={buttonStyles}
      style={{
        ...getShadowStyle(),
        ...(props.style || {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...props}
    >
      {/* Icon container that matches the example button - left position */}
      {icon && iconPosition === "left" && (
        <div className={cn(
          "absolute left-0 top-0 bottom-0 flex items-center z-10"
        )}>
          {/* Container with border-radius matching button's left side */}
          <div 
            ref={leftIconRef}
            className={cn(
              "flex items-center justify-center overflow-hidden relative",
              // Smaller heights for the container to create breathing room from top/bottom edges
              size === "sm" ? "w-8 h-[22px] ml-4 mr-3.5 my-auto" : 
              size === "md" ? "w-10 h-[28px] ml-5 mr-5 my-auto" : 
              "w-[40px] h-[40px] ml-6 mr-5 my-auto", // Keep original size for large buttons
              "after:content-[''] after:absolute after:right-[-8px] after:top-[25%] after:h-[50%] after:w-[1px] after:opacity-15",
              variant === 'primary' ? "after:bg-white" : "after:bg-black"
            )}
            style={{
              borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px",
              // Enhanced border and shadow for premium 3D effect with refined colors
              border: variant === 'primary' 
                ? '1px solid rgba(255,255,255,0.2)' 
                : variant === 'white'
                  ? '1px solid rgba(118,51,220,0.18)' // Matching primary button border
                  : '1px solid rgba(118,51,220,0.12)', // Matching secondary button border
              // Very subtle background differentiation for depth with refined colors
              background: variant === 'primary' 
                ? 'rgba(255,255,255,0.05)' 
                : variant === 'white'
                  ? 'rgba(118,51,220,0.05)' // Slightly more saturated with purple (2-3% more)
                  : 'rgba(118,51,220,0.03)', // Lighter background for secondary
              // Enhanced inner shadow for refined 3D appearance
              boxShadow: variant === 'primary' 
                ? 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)' 
                : variant === 'white'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04)',
              // Apply custom iconContainerStyle if provided via props
              ...iconContainerStyle
            }}
          >
            <span className={cn(
              variant === 'primary' 
                ? "text-white" 
                : variant === 'white' 
                  ? "text-[#7633DC]" // Exactly match primary button text color 
                  : "text-[#8345E6]", // Exactly match secondary button text color
              "flex items-center justify-center w-full h-full",
              "opacity-95" // Better visibility while maintaining integration
            )}>
              <span className="transform-gpu scale-[0.9]"> {/* Slight scale down for better proportions */}
                {icon}
              </span>
            </span>
          </div>
        </div>
      )}
      
      {/* Button text - adjusted positioning to accommodate icon containers */}
      <span className={cn(
        "relative z-10 font-medium whitespace-nowrap",
        size === "lg" ? "tracking-wide" : "tracking-normal", // Adjust tracking based on size
        // Add proper left padding when icon is present
        icon && iconPosition === "left" ? cn(
          size === "sm" ? "ml-12" : 
          size === "md" ? "ml-14" : 
          "ml-16"
        ) : "",
        // Add proper right padding when icon is present 
        icon && iconPosition === "right" ? cn(
          size === "sm" ? "mr-12" : 
          size === "md" ? "mr-14" : 
          "mr-16"
        ) : ""
      )}>
        {children}
      </span>
      
      {/* Icon container that matches the example button - right position */}
      {icon && iconPosition === "right" && (
        <div className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center z-10"
        )}>
          {/* Container with border-radius matching button's right side */}
          <div 
            ref={rightIconRef}
            className={cn(
              "flex items-center justify-center overflow-hidden relative",
              // Smaller heights for the container to create breathing room from top/bottom edges
              size === "sm" ? "w-8 h-[22px] mr-4 ml-3.5 my-auto" : 
              size === "md" ? "w-10 h-[28px] mr-5 ml-5 my-auto" : 
              "w-[40px] h-[40px] mr-6 ml-5 my-auto", // Keep original size for large buttons
              "after:content-[''] after:absolute after:left-[-8px] after:top-[25%] after:h-[50%] after:w-[1px] after:opacity-15",
              variant === 'primary' ? "after:bg-white" : "after:bg-black"
            )}
            style={{
              borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px",
              // Enhanced border and shadow for premium 3D effect with refined colors
              border: variant === 'primary' 
                ? '1px solid rgba(255,255,255,0.2)' 
                : variant === 'white'
                  ? '1px solid rgba(118,51,220,0.18)' // Matching primary button border
                  : '1px solid rgba(118,51,220,0.12)', // Matching secondary button border
              // Very subtle background differentiation for depth with refined colors
              background: variant === 'primary' 
                ? 'rgba(255,255,255,0.05)' 
                : variant === 'white'
                  ? 'rgba(118,51,220,0.05)' // Slightly more saturated with purple (2-3% more)
                  : 'rgba(118,51,220,0.03)', // Lighter background for secondary
              // Enhanced inner shadow for refined 3D appearance
              boxShadow: variant === 'primary' 
                ? 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)'
                : variant === 'white'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04)',
              // Apply custom iconContainerStyle if provided via props
              ...iconContainerStyle
            }}
          >
            <span className={cn(
              variant === 'primary' 
                ? "text-white" 
                : variant === 'white' 
                  ? "text-[#7633DC]" // Exactly match primary button text color 
                  : "text-[#8345E6]", // Exactly match secondary button text color
              "flex items-center justify-center w-full h-full",
              "opacity-95" // Better visibility while maintaining integration
            )}>
              <span className="transform-gpu scale-[0.9]"> {/* Slight scale down for better proportions */}
                {icon}
              </span>
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
