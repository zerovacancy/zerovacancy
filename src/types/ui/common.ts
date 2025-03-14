/**
 * Common UI types shared across multiple components
 */

// Basic shared UI types
export interface BaseProps {
  className?: string;
}

// Common size options
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common color variants
export type ColorVariant = 
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

// Common status types
export type StatusType = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

// Common position options
export type Position = 'top' | 'right' | 'bottom' | 'left';

// Animation speed options
export type AnimationSpeed = 'slow' | 'normal' | 'fast';