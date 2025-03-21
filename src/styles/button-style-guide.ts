/**
 * ZERO VACANCY BUTTON STYLE GUIDE
 * 
 * This file contains reusable button styles and rules for creating consistent
 * 3D physical buttons throughout the site. It provides a system for different
 * colors, sizes, and variants while maintaining the same high-quality appearance.
 */

import { CSSProperties } from 'react';

// Define common button color properties
interface BaseButtonColors {
  base: string;
  dark: string;
  light: string;
  text: string;
  iconBackground: string;
  iconBorder: string;
  border: string;
  highlightTop: string;
  highlightBottom: string;
}

// Define additional properties for CTA buttons
interface CTAButtonColors extends BaseButtonColors {
  gradient: string;
  hoverGradient: string;
}

// Define secondary CTA specific properties
interface SecondaryCTAButtonColors extends CTAButtonColors {
  buttonBackground: string;
}

// Color palette for button variants
export const buttonColors: {
  purple: BaseButtonColors;
  white: BaseButtonColors;
  blue: BaseButtonColors;
  gray: BaseButtonColors;
  primaryCta: CTAButtonColors;
  secondaryCta: SecondaryCTAButtonColors;
} = {
  // Primary purple variant
  purple: {
    base: '#8A42F5',
    dark: '#7837DB',
    light: '#9953FF',
    text: '#FFFFFF',
    iconBackground: 'rgba(255,255,255,0.12)',
    iconBorder: 'rgba(255,255,255,0.2)',
    border: 'rgba(134,65,245,0.5)',
    highlightTop: 'rgba(255,255,255,0.35)',
    highlightBottom: 'rgba(0,0,0,0.15)',
  },
  // White variant (used for both buttons, but with different overlays)
  white: {
    base: '#FFFFFF',
    dark: '#F8F8FA',
    light: '#FFFFFF',
    text: '#7837DB',
    iconBackground: 'rgba(134,65,245,0.02)',
    iconBorder: 'rgba(0,0,0,0.08)',
    border: 'rgba(0,0,0,0.08)',
    highlightTop: 'rgba(255,255,255,0.8)',
    highlightBottom: 'rgba(0,0,0,0.05)',
  },
  // Enhanced Primary CTA variant (RESERVE EARLY ACCESS) - matching reference image
  primaryCta: {
    base: '#8A42F5',  // Proper purple from reference
    dark: '#7837DB',
    light: '#9953FF', 
    text: '#FFFFFF',  // White text
    iconBackground: 'rgba(255,255,255,0.1)', // Light icon background
    iconBorder: 'rgba(255,255,255,0.2)',
    border: 'rgba(255,255,255,0.3)', // White border like reference image
    gradient: 'linear-gradient(180deg, #9953FF 0%, #7837DB 100%)', // Purple gradient like ref
    hoverGradient: 'linear-gradient(180deg, #A165FF 0%, #8843F1 100%)', // Slightly lighter on hover
    highlightTop: 'rgba(255,255,255,0.3)', // Light highlight on top edge
    highlightBottom: 'rgba(0,0,0,0.2)', // Shadow at bottom edge
  },
  // Enhanced Secondary CTA variant (JOIN AS CREATOR) - matching reference image
  secondaryCta: {
    base: '#FFFFFF',
    dark: '#F0F0F4',
    light: '#FFFFFF',
    text: '#7837DB',  // Purple text like reference
    iconBackground: 'rgba(134,65,245,0.05)', // Very light purple tint
    iconBorder: 'rgba(118,51,220,0.15)', // More visible border
    border: 'rgba(118,51,220,0.25)', // Border similar to reference
    // White background with slight gradient
    buttonBackground: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F9 100%)', 
    gradient: 'transparent', // No gradient initially
    hoverGradient: 'linear-gradient(180deg, #F9F6FF 0%, #F3EDFF 100%)', // Purple tint on hover
    highlightTop: 'rgba(255,255,255,1)', // Strong light highlight at top edge
    highlightBottom: 'rgba(0,0,0,0.1)', // More visible shadow at bottom edge
  },
  // Blue variant
  blue: {
    base: '#4169E1',
    dark: '#3A5FD9',
    light: '#5276F5',
    text: '#FFFFFF',
    iconBackground: 'rgba(255,255,255,0.12)',
    iconBorder: 'rgba(255,255,255,0.2)',
    border: 'rgba(65,105,225,0.5)',
    highlightTop: 'rgba(255,255,255,0.35)',
    highlightBottom: 'rgba(0,0,0,0.15)',
  },
  // Neutral gray variant
  gray: {
    base: '#6B7280',
    dark: '#4B5563',
    light: '#9CA3AF',
    text: '#FFFFFF',
    iconBackground: 'rgba(255,255,255,0.12)',
    iconBorder: 'rgba(255,255,255,0.2)',
    border: 'rgba(107,114,128,0.5)',
    highlightTop: 'rgba(255,255,255,0.35)',
    highlightBottom: 'rgba(0,0,0,0.15)',
  },
};

// Size variations
export const buttonSizes = {
  sm: {
    height: '36px',
    fontSize: '14px',
    borderRadius: '9px',
    padding: '0 16px',
    iconContainerSize: {
      width: '24px',
      height: '22px',
    },
    iconSize: {
      width: '16px',
      height: '16px',
    },
    spacing: {
      iconMargin: '10px',
      iconOffset: '9px',
    },
  },
  md: {
    height: '44px',
    fontSize: '15px',
    borderRadius: '12px',
    padding: '0 20px',
    iconContainerSize: {
      width: '28px',
      height: '28px',
    },
    iconSize: {
      width: '18px',
      height: '18px',
    },
    spacing: {
      iconMargin: '12px',
      iconOffset: '12px',
    },
  },
  lg: {
    height: '56px',
    fontSize: '16px',
    borderRadius: '15px',
    padding: '0 24px',
    iconContainerSize: {
      width: '40px',
      height: '40px',
    },
    iconSize: {
      width: '20px',
      height: '20px',
    },
    spacing: {
      iconMargin: '14px',
      iconOffset: '14px',
    },
  },
  // Special mobile optimized size
  mobile: {
    height: '50px',
    fontSize: '14px',
    borderRadius: '12px',
    padding: '0 20px',
    iconContainerSize: {
      width: '32px',
      height: '32px',
    },
    iconSize: {
      width: '18px',
      height: '18px',
    },
    spacing: {
      iconMargin: '12px',
      iconOffset: '12px',
    },
  },
};

// Shadow styles with exponential falloff
export const shadowStyles = {
  // Standard shadow with 5-layer exponential falloff
  standard: [
    '0 1px 2px rgba(0,0,0,0.07)',
    '0 2px 4px rgba(0,0,0,0.07)',
    '0 4px 8px rgba(0,0,0,0.07)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 16px 32px rgba(0,0,0,0.03)',
  ].join(', '),
  
  // Lighter shadow for subtle elements
  light: [
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.04)',
    '0 8px 16px rgba(0,0,0,0.03)',
    '0 16px 32px rgba(0,0,0,0.02)',
  ].join(', '),
  
  // Deeper shadow for more prominent elements
  deep: [
    '0 1px 2px rgba(0,0,0,0.09)',
    '0 2px 4px rgba(0,0,0,0.09)',
    '0 4px 8px rgba(0,0,0,0.09)',
    '0 8px 16px rgba(0,0,0,0.07)',
    '0 16px 32px rgba(0,0,0,0.05)',
  ].join(', '),
  
  // Pressed state shadow (compressed)
  pressed: '0 1px 2px rgba(0,0,0,0.15)',
  
  // Primary CTA shadow matching reference image
  primaryCTA: [
    '0px 2px 0px rgba(0,0,0,0.1)',   // Bottom edge shadow
    '0px 3px 0px rgba(0,0,0,0.1)',   // Stronger bottom shadow for 3D effect
    '0px 8px 15px rgba(0,0,0,0.1)',  // Soft drop shadow like reference
    '0px 0px 0px 3px rgba(255,255,255,0.3)', // White border outline like reference
  ].join(', '),
  
  // Primary CTA hover shadow matching reference image
  primaryCTAHover: [
    '0px 2px 0px rgba(0,0,0,0.1)',   // Bottom edge shadow 
    '0px 4px 0px rgba(0,0,0,0.1)',   // Stronger bottom shadow for hover
    '0px 10px 20px rgba(0,0,0,0.15)', // Enhanced drop shadow on hover
    '0px 0px 0px 3px rgba(255,255,255,0.4)', // Brighter white border on hover
  ].join(', '),
  
  // Secondary CTA shadow matching reference image
  secondaryCTA: [
    '0px 2px 0px rgba(0,0,0,0.05)',  // Light bottom edge shadow
    '0px 3px 0px rgba(0,0,0,0.03)',  // Subtle 3D bottom shadow
    '0px 8px 15px rgba(0,0,0,0.05)', // Soft drop shadow
    '0px 0px 0px 2px rgba(118,51,220,0.2)', // Purple border outline like reference
  ].join(', '),
  
  // Secondary CTA hover shadow matching reference image
  secondaryCTAHover: [
    '0px 2px 0px rgba(0,0,0,0.05)',  // Light bottom edge shadow
    '0px 4px 0px rgba(0,0,0,0.03)',  // Stronger bottom shadow on hover
    '0px 10px 20px rgba(0,0,0,0.1)', // Enhanced drop shadow on hover
    '0px 0px 0px 2px rgba(118,51,220,0.25)', // More vivid purple border on hover
  ].join(', '),
};

/**
 * Creates button styles based on color variant and size
 */
export function createButtonStyle(
  colorVariant: keyof typeof buttonColors = 'purple',
  size: keyof typeof buttonSizes = 'lg',
  options?: {
    customShadow?: string;
    customBorder?: string;
    isPressed?: boolean;
    isHovered?: boolean;
  }
): CSSProperties {
  const colors = buttonColors[colorVariant];
  const sizeData = buttonSizes[size];
  const shadow = options?.customShadow || shadowStyles.standard;
  
  // Create inset highlight effect based on color
  const insetHighlight = `inset 0 1px 0 ${colors.highlightTop}, inset 0 -1px 0 ${colors.highlightBottom}`;
  
  // Full shadow effect including inset highlights
  const fullShadow = options?.isPressed 
    ? shadowStyles.pressed
    : `${shadow}, ${insetHighlight}`;
  
  // Gradient background based on color variant
  let background: string;
  
  // Special handling for our new CTA variants
  if (colorVariant === 'primaryCta') {
    // For primary CTA, use the base color with gradient overlay
    const gradient = options?.isHovered ? colors.hoverGradient : colors.gradient;
    background = `${gradient}, linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
  } 
  else if (colorVariant === 'secondaryCta') {
    // For secondary CTA, use the base color with optional hover gradient
    const gradient = options?.isHovered ? colors.hoverGradient : colors.gradient;
    if (gradient !== 'transparent') {
      background = `${gradient}, linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
    } else {
      background = `linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
    }
  }
  else if (colorVariant === 'white') {
    background = `linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
  } else {
    background = `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, ${colors.base} 0%, ${colors.dark} 100%)`;
  }
  
  return {
    height: sizeData.height,
    borderRadius: sizeData.borderRadius,
    padding: sizeData.padding,
    background,
    color: colors.text,
    border: options?.customBorder || `1px solid ${colors.border}`,
    boxShadow: fullShadow,
    fontSize: sizeData.fontSize,
    fontWeight: 500,
    transition: 'all 0.15s ease-out',
  };
}

/**
 * Creates icon container styles based on button color and size
 */
export function createIconContainerStyle(
  colorVariant: keyof typeof buttonColors = 'purple',
  size: keyof typeof buttonSizes = 'lg',
  position: 'left' | 'right' = 'left'
): CSSProperties {
  const colors = buttonColors[colorVariant];
  const sizeData = buttonSizes[size];
  
  // Position based on left/right placement
  const positionStyle = position === 'left'
    ? { left: sizeData.spacing.iconOffset }
    : { right: sizeData.spacing.iconOffset };
  
  return {
    width: sizeData.iconContainerSize.width,
    height: sizeData.iconContainerSize.height,
    borderRadius: sizeData.borderRadius,
    background: colors.iconBackground,
    border: `1px solid ${colors.iconBorder}`,
    boxShadow: `inset 0 1px 0 ${colors.highlightTop}, inset 0 -1px 0 ${colors.highlightBottom}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    ...positionStyle,
    top: '50%',
    transform: 'translateY(-50%)',
  };
}

/**
 * Creates icon styles based on button color and size
 */
export function createIconStyle(
  colorVariant: keyof typeof buttonColors = 'purple',
  size: keyof typeof buttonSizes = 'lg'
): CSSProperties {
  const colors = buttonColors[colorVariant];
  const sizeData = buttonSizes[size];
  
  return {
    width: sizeData.iconSize.width,
    height: sizeData.iconSize.height,
    color: colors.text,
    // Ensure consistent stroke width and precise color matching
    stroke: colors.text,
    strokeWidth: 2,
  };
}

/**
 * Helper function to create complete button styles with icon
 */
// Interface for button style options
interface ButtonStyleOptions {
  iconPosition?: 'left' | 'right';
  isPressed?: boolean;
  isHovered?: boolean;
  customShadow?: string;
  customBorder?: string;
}

export function getCompleteButtonStyles(
  colorVariant: keyof typeof buttonColors = 'purple',
  size: keyof typeof buttonSizes = 'lg',
  options?: ButtonStyleOptions
) {
  const position = options?.iconPosition || 'left';
  
  return {
    button: createButtonStyle(colorVariant, size, options),
    iconContainer: createIconContainerStyle(colorVariant, size, position),
    icon: createIconStyle(colorVariant, size),
    textPadding: position === 'left'
      ? { paddingLeft: `calc(${buttonSizes[size].iconContainerSize.width}px + ${parseInt(buttonSizes[size].spacing.iconMargin) * 2}px)` }
      : { paddingRight: `calc(${buttonSizes[size].iconContainerSize.width}px + ${parseInt(buttonSizes[size].spacing.iconMargin) * 2}px)` }
  };
}

// Helper functions for specific button styles used in the hero section

// "RESERVE EARLY ACCESS" button style (primary CTA with purple tint)
export const reserveEarlyAccessStyle = () => getCompleteButtonStyles('primaryCta', 'lg', { iconPosition: 'left' });

// "JOIN AS CREATOR" button style (secondary CTA with subtle styling)
export const joinAsCreatorStyle = () => getCompleteButtonStyles('secondaryCta', 'lg', { iconPosition: 'left' });

// Mobile-optimized button styles
export const mobileReserveEarlyAccessStyle = () => getCompleteButtonStyles('primaryCta', 'mobile', { iconPosition: 'left' });
export const mobileJoinAsCreatorStyle = () => getCompleteButtonStyles('secondaryCta', 'mobile', { iconPosition: 'left' });

// Hover states for the buttons
export const reserveEarlyAccessHoverStyle = () => getCompleteButtonStyles('primaryCta', 'lg', { iconPosition: 'left', isHovered: true });
export const joinAsCreatorHoverStyle = () => getCompleteButtonStyles('secondaryCta', 'lg', { iconPosition: 'left', isHovered: true });

// Mobile hover states
export const mobileReserveEarlyAccessHoverStyle = () => getCompleteButtonStyles('primaryCta', 'mobile', { iconPosition: 'left', isHovered: true });
export const mobileJoinAsCreatorHoverStyle = () => getCompleteButtonStyles('secondaryCta', 'mobile', { iconPosition: 'left', isHovered: true });