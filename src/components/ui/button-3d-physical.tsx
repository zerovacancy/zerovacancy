import React, { ButtonHTMLAttributes, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonColors } from "@/styles/button-style-guide";

interface Button3DPhysicalProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white" | "primaryCta" | "secondaryCta";
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
  // State for hover tracking
  const [isHovered, setIsHovered] = useState(false);
  
  // Refs for icon elements to apply container styles
  const leftIconRef = useRef<HTMLDivElement>(null);
  const rightIconRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
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
  
  // Effect to apply hover gradient for CTA buttons
  useEffect(() => {
    if (!buttonRef.current) return;
    
    // Only apply hover effects for our CTA buttons
    if (variant !== 'primaryCta' && variant !== 'secondaryCta') return;
    
    // Get the gradient for the current state
    const colors = buttonColors[variant as 'primaryCta' | 'secondaryCta'];
    if (!colors) return;
    
    // Get current gradient based on hover state
    const gradient = isHovered ? colors.hoverGradient : colors.gradient;
    
    // Apply the gradient to the button background
    if (variant === 'secondaryCta') {
      // For the secondary CTA, we need special handling:
      // - Use buttonBackground when not hovered
      // - Apply hover gradient when hovered
      const secondaryCTAColors = colors as typeof buttonColors.secondaryCta;
      buttonRef.current.style.background = isHovered 
        ? `${secondaryCTAColors.hoverGradient}, ${secondaryCTAColors.buttonBackground}`
        : secondaryCTAColors.buttonBackground;
    } else if (gradient !== 'transparent') {
      buttonRef.current.style.background = `${gradient}, linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
    } else {
      buttonRef.current.style.background = `linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
    }
  }, [isHovered, variant]);
  
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
    secondary: "text-white border border-[rgba(134,65,245,0.5)]",
    outline: "text-purple-700 border border-purple-300",
    // White button with enhanced styling for more sophisticated appearance
    white: "text-purple-700 font-medium", // Border will be handled by the style
    // New styled variants
    primaryCta: `text-[${buttonColors.primaryCta.text}] font-medium`, // Border will be handled by the style
    secondaryCta: `text-[${buttonColors.secondaryCta.text}] font-medium`, // Border will be handled by the style
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
    const isDark = variant === 'primary' || variant === 'secondary';
    const isWhite = variant === 'white';
    
    // Exact shadow values from example - creates perfect exponential falloff
    const commonShadow = [
      '0 1px 2px rgba(0,0,0,0.07)', 
      '0 2px 4px rgba(0,0,0,0.07)', 
      '0 4px 8px rgba(0,0,0,0.07)', 
      '0 8px 16px rgba(0,0,0,0.05)', 
      '0 16px 32px rgba(0,0,0,0.03)'
    ].join(', ');
    
    // Enhanced edge treatment with light source from above
    // This creates the impression of a physical surface with proper edge highlights
    const insetEffect = isWhite ? 
      // Exactly match the icon container inset shadow
      'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)' : 
      'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)';
    
    // Combine all shadows
    const fullShadow = `${commonShadow}, ${insetEffect}`;
    
    // Match the icon container's exact styling for the entire button
    const backgroundStyle = isDark ? {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
      border: '1px solid rgba(255,255,255,0.2)'
    } : isWhite ? {
      // Pure white gradient for white variant
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8FA 100%)',
      border: '1px solid rgba(0,0,0,0.08)', // Same subtle border
      borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px" // Match icon container border radius
    } : {};
    
    // Enhanced styles for premium 3D effect
    return {
      boxShadow: fullShadow,
      transition: 'all 0.15s ease-out', // Refined timing for better interaction physics
      ...backgroundStyle
    };
  };

  return (
    <button 
      ref={buttonRef}
      className={buttonStyles}
      style={{
        ...getShadowStyle(),
        ...(props.style || {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              variant === 'primary' || variant === 'secondary' 
                ? "after:bg-white" 
                : "after:bg-black"
            )}
            style={{
              borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px",
              // Enhanced border and shadow for premium 3D effect
              border: variant === 'primary' || variant === 'secondary' 
                ? '1px solid rgba(255,255,255,0.2)' 
                : '1px solid rgba(0,0,0,0.08)',
              // Very subtle background differentiation for depth
              background: variant === 'primary' || variant === 'secondary' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(134,65,245,0.02)',
              // Enhanced inner shadow for refined 3D appearance
              boxShadow: variant === 'primary' || variant === 'secondary' 
                ? 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)' 
                : 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)',
              // Apply custom iconContainerStyle if provided via props
              ...iconContainerStyle
            }}
          >
            <span className={cn(
              variant === 'primary' || variant === 'secondary' ? "text-white" : "text-[#7837DB]",
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
              variant === 'primary' || variant === 'secondary' 
                ? "after:bg-white" 
                : "after:bg-black"
            )}
            style={{
              borderRadius: size === "sm" ? "9px" : size === "md" ? "12px" : "15px",
              // Enhanced border and shadow for premium 3D effect
              border: variant === 'primary' || variant === 'secondary' 
                ? '1px solid rgba(255,255,255,0.2)' 
                : '1px solid rgba(0,0,0,0.08)',
              // Very subtle background differentiation for depth
              background: variant === 'primary' || variant === 'secondary' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(134,65,245,0.02)',
              // Enhanced inner shadow for refined 3D appearance
              boxShadow: variant === 'primary' || variant === 'secondary' 
                ? 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)' 
                : 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)',
              // Apply custom iconContainerStyle if provided via props
              ...iconContainerStyle
            }}
          >
            <span className={cn(
              variant === 'primary' || variant === 'secondary' ? "text-white" : "text-[#7837DB]",
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