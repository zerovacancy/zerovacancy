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
  // Enhanced Primary CTA variant (RESERVE EARLY ACCESS) - precisely matching 3D reference
  primaryCta: {
    base: '#8A4FFF',  // Proper purple from reference
    dark: '#7837DB',
    light: '#9953FF', 
    text: '#FFFFFF',  // White text
    iconBackground: 'rgba(255,255,255,0.15)', // Light icon background for 3D effect
    iconBorder: 'rgba(255,255,255,0.3)',
    border: 'rgba(255,255,255,0.4)', // White border like reference image
    // Subtle gradient with light top-left to enhance 3D effect
    gradient: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, #9966FF 0%, #7540D8 100%)',
    // Slightly lighter on hover with enhanced top-left light source
    hoverGradient: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, #A373FF 0%, #7F46E6 100%)', 
    highlightTop: 'rgba(255,255,255,0.6)', // Stronger light highlight on top edge
    highlightBottom: 'rgba(0,0,0,0.4)', // Stronger shadow at bottom edge for 3D
  },
  // Enhanced Secondary CTA variant (JOIN AS CREATOR) - precisely matching 3D reference
  secondaryCta: {
    base: '#F5F5F7',  // Light gray base from reference
    dark: '#E8E8EC',
    light: '#FFFFFF',
    text: '#7837DB',  // Purple text like reference
    iconBackground: 'rgba(134,65,245,0.07)', // Light purple tint for 3D icon effect
    iconBorder: 'rgba(118,51,220,0.2)', // More visible border for icon
    border: 'rgba(118,51,220,0.3)', // Substantial border as specified
    // Subtle lavender gradient as specified
    buttonBackground: 'linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.03) 100%), linear-gradient(180deg, #F9F7FF 0%, #F0F0F7 100%)', 
    gradient: 'transparent', // No additional gradient initially
    // Enhanced hover effect with stronger purple tint
    hoverGradient: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(0,0,0,0.03) 100%), linear-gradient(180deg, #FAF8FF 0%, #F3EFF9 100%)',
    highlightTop: 'rgba(255,255,255,1)', // Strong light highlight at top edge
    highlightBottom: 'rgba(0,0,0,0.15)', // More visible shadow at bottom edge for 3D depth
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
  
  // Primary CTA shadow precisely matching 3D reference
  primaryCTA: [
    '0px 3px 0px rgba(0,0,0,0.2)',   // Bottom edge shadow for 3D depth
    '0px 5px 12px rgba(0,0,0,0.15)', // Soft drop shadow for elevation
    '0px 10px 20px rgba(118,51,220,0.15)', // Outer glow
    '0px 0px 0px 2px rgba(146,96,255,0.9)', // Inner button border
    '0px 0px 0px 4px rgba(255,255,255,0.2)', // White outer border glow
    'inset 0px 1px 2px rgba(255,255,255,0.5)' // Top inner highlight
  ].join(', '),
  
  // Primary CTA hover shadow with enhanced 3D effect
  primaryCTAHover: [
    '0px 4px 0px rgba(0,0,0,0.2)',   // Enhanced bottom edge for hover
    '0px 7px 15px rgba(0,0,0,0.15)', // Expanded drop shadow on hover
    '0px 12px 25px rgba(118,51,220,0.2)', // Expanded outer glow
    '0px 0px 0px 2px rgba(146,96,255,0.9)', // Inner button border
    '0px 0px 0px 4px rgba(255,255,255,0.25)', // Enhanced white outer border glow
    'inset 0px 1px 2px rgba(255,255,255,0.6)' // Stronger top inner highlight
  ].join(', '),
  
  // Secondary CTA shadow precisely matching 3D reference
  secondaryCTA: [
    '0px 3px 0px rgba(0,0,0,0.07)',   // Bottom edge shadow for 3D depth
    '0px 5px 12px rgba(0,0,0,0.05)',  // Soft drop shadow for elevation
    '0px 8px 15px rgba(118,51,220,0.05)', // Subtle purple outer glow
    '0px 0px 0px 3px rgba(118,51,220,0.25)', // Purple border
    'inset 0px 1px 2px rgba(255,255,255,0.8)' // Top inner highlight
  ].join(', '),
  
  // Secondary CTA hover shadow with enhanced 3D effect
  secondaryCTAHover: [
    '0px 4px 0px rgba(0,0,0,0.07)',   // Enhanced bottom edge for hover
    '0px 6px 15px rgba(0,0,0,0.05)',  // Expanded drop shadow on hover
    '0px 10px 20px rgba(118,51,220,0.07)', // Enhanced outer glow
    '0px 0px 0px 3px rgba(118,51,220,0.3)', // Enhanced purple border
    'inset 0px 1px 3px rgba(255,255,255,0.9)' // Stronger top inner highlight
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