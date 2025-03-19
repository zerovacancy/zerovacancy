/**
 * ZERO VACANCY BUTTON STYLE GUIDE
 * 
 * This file contains reusable button styles and rules for creating consistent
 * 3D physical buttons throughout the site. It provides a system for different
 * colors, sizes, and variants while maintaining the same high-quality appearance.
 */

import { CSSProperties } from 'react';

// Color palette for button variants
export const buttonColors = {
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
  // White variant with refined styling - Primary "RESERVE EARLY ACCESS" button
  white: {
    base: '#F5F5F7',
    dark: '#F0F0F2',
    light: '#FFFFFF',
    text: '#7633DC',
    iconBackground: 'rgba(118,51,220,0.05)',
    iconBorder: 'rgba(118,51,220,0.18)',
    border: 'rgba(118,51,220,0.18)',
    highlightTop: 'rgba(255,255,255,0.8)',
    highlightBottom: 'rgba(0,0,0,0.05)',
    gradient: 'linear-gradient(180deg, rgba(118,51,220,0.08) 0%, rgba(118,51,220,0.12) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(118,51,220,0.13) 0%, rgba(118,51,220,0.17) 100%)',
  },
  // Secondary "JOIN AS CREATOR" button with reduced purple tint
  secondary: {
    base: '#F8F8FA',
    dark: '#F3F3F5',
    light: '#FFFFFF',
    text: '#8345E6',
    iconBackground: 'rgba(118,51,220,0.03)',
    iconBorder: 'rgba(118,51,220,0.12)',
    border: 'rgba(118,51,220,0.12)',
    highlightTop: 'rgba(255,255,255,0.85)',
    highlightBottom: 'rgba(0,0,0,0.04)',
    gradient: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,248,250,1) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(243,240,255,0.5) 100%)',
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
      width: 24,
      height: 22,
    },
    iconSize: {
      width: 16,
      height: 16,
    },
    spacing: {
      iconMargin: 10,
      iconOffset: 9,
    },
  },
  md: {
    height: '44px',
    fontSize: '15px',
    borderRadius: '12px',
    padding: '0 20px',
    iconContainerSize: {
      width: 28,
      height: 28,
    },
    iconSize: {
      width: 18,
      height: 18,
    },
    spacing: {
      iconMargin: 12,
      iconOffset: 12,
    },
  },
  lg: {
    height: '56px',
    fontSize: '16px',
    borderRadius: '15px',
    padding: '0 24px',
    iconContainerSize: {
      width: 40,
      height: 40,
    },
    iconSize: {
      width: 20,
      height: 20,
    },
    spacing: {
      iconMargin: 14,
      iconOffset: 14,
    },
  },
  mobile: {
    height: '50px',
    fontSize: '14px',
    borderRadius: '12px',
    padding: '0 20px',
    iconContainerSize: {
      width: 32,
      height: 32,
    },
    iconSize: {
      width: 18,
      height: 18,
    },
    spacing: {
      iconMargin: 12,
      iconOffset: 12,
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
  
  // Gradient background based on color variant and hover state
  let background: string;
  if (colorVariant === 'white') {
    // Primary button with purple tint gradient
    background = options?.isHovered 
      ? `${colors.hoverGradient}, linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`
      : `${colors.gradient}, linear-gradient(180deg, ${colors.light} 0%, ${colors.dark} 100%)`;
  } else if (colorVariant === 'secondary') {
    // Secondary button with subtle gradient
    background = options?.isHovered 
      ? colors.hoverGradient
      : colors.gradient;
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
  };
}

/**
 * Helper function to create complete button styles with icon
 */
export function getCompleteButtonStyles(
  colorVariant: keyof typeof buttonColors = 'purple',
  size: keyof typeof buttonSizes = 'lg',
  options?: {
    iconPosition?: 'left' | 'right';
    isPressed?: boolean;
    isHovered?: boolean;
    customShadow?: string;
    customBorder?: string;
  }
) {
  const position = options?.iconPosition || 'left';
  const sizeData = buttonSizes[size];
  
  return {
    button: createButtonStyle(colorVariant, size, options),
    iconContainer: createIconContainerStyle(colorVariant, size, position),
    icon: createIconStyle(colorVariant, size),
    textPadding: position === 'left'
      ? { 
          paddingLeft: `calc(${sizeData.iconContainerSize.width}px + ${sizeData.spacing.iconMargin * 2}px)` 
        }
      : { 
          paddingRight: `calc(${sizeData.iconContainerSize.width}px + ${sizeData.spacing.iconMargin * 2}px)` 
        }
  };
}

// Helper functions for specific button styles used in the hero section

// "RESERVE EARLY ACCESS" button style (primary with refined styling)
export const reserveEarlyAccessStyle = () => getCompleteButtonStyles('white', 'lg', { iconPosition: 'left' });

// "JOIN AS CREATOR" button style (secondary variant with refined styling)
export const joinAsCreatorStyle = () => getCompleteButtonStyles('secondary', 'lg', { iconPosition: 'left' });

// Mobile-optimized button styles
export const mobileReserveEarlyAccessStyle = () => getCompleteButtonStyles('white', 'mobile', { iconPosition: 'left' });
export const mobileJoinAsCreatorStyle = () => getCompleteButtonStyles('secondary', 'mobile', { iconPosition: 'left' });
