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
  // Primary CTA with precise gradient and inner highlight
  primaryCta: {
    base: '#8A4FFF',  // Proper purple from reference
    dark: '#6D30C9',  // Darker purple for bottom edge section
    light: '#9F65FF', // Slightly lighter for better contrast
    text: '#FFFFFF',  // White text
    iconBackground: 'rgba(255,255,255,0.15)', // Refined icon background
    iconBorder: 'transparent', // Removed icon border
    border: 'transparent', // Removed button border
    // Perfect gradient with top-to-bottom treatment and subtle light from top-left
    gradient: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%),
      linear-gradient(to bottom, 
        rgba(158,101,255,1) 0%, 
        rgba(146,90,255,1) 70%,
        rgba(119,51,219,1) 100%
      )
    `,
    // Hover gradient with enhanced lighting
    hoverGradient: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%),
      linear-gradient(to bottom, 
        rgba(163,115,255,1) 0%, 
        rgba(151,100,255,1) 70%,
        rgba(127,70,230,1) 100%
      )
    `, 
    highlightTop: 'rgba(255,255,255,0.8)', // Inner highlight (this is now applied via box-shadow)
    highlightBottom: 'rgba(0,0,0,0.4)', // Bottom edge (this is now applied via box-shadow)
  },
  // Secondary CTA with precise gradient and inner highlight
  secondaryCta: {
    base: '#F5F5F7',  // Very light gray base from reference
    dark: '#E5E5E7',  // Specific darker gray for bottom edge section
    light: '#FFFFFF',
    text: '#222222',  // Dark gray/black text as specified
    iconBackground: 'rgba(245,245,250,0.9)', // Very light background with slight tint
    iconBorder: 'transparent', // Removed icon border
    border: 'transparent', // Removed button border
    // Perfect light gray gradient with top-to-bottom treatment
    buttonBackground: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%),
      linear-gradient(to bottom, 
        rgba(252,252,254,1) 0%, 
        rgba(245,245,247,1) 70%,
        rgba(233,233,238,1) 100%
      ),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E")
    `, 
    gradient: 'transparent', // No additional gradient initially
    // Hover gradient with enhanced lighting
    hoverGradient: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%),
      linear-gradient(to bottom, 
        rgba(253,253,255,1) 0%, 
        rgba(248,248,250,1) 70%,
        rgba(238,238,243,1) 100%
      ),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.01'/%3E%3C/svg%3E")
    `,
    highlightTop: 'rgba(255,255,255,0.7)', // Inner highlight (this is now applied via box-shadow)
    highlightBottom: 'rgba(0,0,0,0.1)', // Bottom edge (this is now applied via box-shadow)
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
  
  // Primary CTA shadow with precise inner highlight and separated shadow
  primaryCTA: [
    '0px 4px 0px rgba(0,0,0,0.3)',   // Distinct bottom edge shadow with clear separation
    '0px 8px 15px rgba(0,0,0,0.15)', // Broader drop shadow with clear gap between button
    '0px 15px 30px rgba(118,51,220,0.15)', // Distant purple glow
    // Removed outer border/glow completely
    'inset 0px -2px 0px rgba(0,0,0,0.2)', // Darker bottom section for depth/thickness
    'inset 0px 0px 0px 1px rgba(0,0,0,0.1)', // Very subtle inner edge definition
    'inset 0px 1px 2px rgba(0,0,0,0.08)', // Subtle inner shadow overall
    'inset 0 -3px 6px rgba(0,0,0,0.1)', // Inner bottom shadow for 3D volume
    // Inner top highlight that follows the curve
    'inset 0 2px 1px -1px rgba(255,255,255,0.5)' // White highlight on inner top curve
  ].join(', '),
  
  // Primary CTA hover shadow with enhanced separation and inner highlight
  primaryCTAHover: [
    '0px 6px 0px rgba(0,0,0,0.3)',   // Elevated bottom edge for hover (more height)
    '0px 10px 20px rgba(0,0,0,0.15)', // Elevated broader shadow
    '0px 20px 35px rgba(118,51,220,0.15)', // Elevated distant glow
    // Removed outer border/glow completely
    'inset 0px -2px 0px rgba(0,0,0,0.18)', // Slightly lighter bottom section for hover
    'inset 0px 0px 0px 1px rgba(0,0,0,0.08)', // Subtler inner edge on hover
    'inset 0px 1px 2px rgba(0,0,0,0.05)', // Reduced inner shadow on hover
    'inset 0 -3px 6px rgba(0,0,0,0.08)', // Reduced inner bottom shadow on hover
    // Enhanced inner top highlight
    'inset 0 2px 1px -1px rgba(255,255,255,0.6)' // Slightly brighter highlight on hover
  ].join(', '),
  
  // Secondary CTA shadow with inner highlight and clear shadow separation
  secondaryCTA: [
    // Removed outer border completely
    '0px 4px 0px rgba(0,0,0,0.2)',    // Distinct bottom edge shadow with clear separation
    '0px 8px 15px rgba(0,0,0,0.1)',   // Broader shadow with clear gap
    '0px 12px 25px rgba(0,0,0,0.05)', // Distant soft shadow
    'inset 0px -2px 0px rgba(0,0,0,0.03)', // Subtle darker bottom section (#E5E5E7) for thickness
    'inset 0px 0px 0px 1px rgba(0,0,0,0.04)', // Very subtle inner edge definition
    'inset 0px 1px 2px rgba(0,0,0,0.03)', // Subtle inner shadow
    'inset 0 -3px 6px rgba(0,0,0,0.02)', // Inner bottom shadow for 3D volume
    // Inner top highlight that follows the curve
    'inset 0 2px 1px -1px rgba(255,255,255,0.5)' // White highlight on inner top curve
  ].join(', '),
  
  // Secondary CTA hover shadow with enhanced separation and inner highlight
  secondaryCTAHover: [
    // Removed outer border completely
    '0px 6px 0px rgba(0,0,0,0.2)',    // Elevated bottom edge for hover (more height)
    '0px 10px 20px rgba(0,0,0,0.1)',  // Elevated broader shadow
    '0px 16px 30px rgba(0,0,0,0.05)', // Elevated distant shadow
    'inset 0px -2px 0px rgba(0,0,0,0.02)', // Slightly lighter bottom section for hover
    'inset 0px 0px 0px 1px rgba(0,0,0,0.03)', // Subtler inner edge on hover
    'inset 0px 1px 2px rgba(0,0,0,0.02)', // Reduced inner shadow on hover
    'inset 0 -3px 6px rgba(0,0,0,0.01)', // Reduced inner bottom shadow on hover
    // Enhanced inner top highlight
    'inset 0 2px 1px -1px rgba(255,255,255,0.6)' // Slightly brighter highlight on hover
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