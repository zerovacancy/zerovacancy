
/**
 * Animation component types
 */

export interface AnimationProps {
  variant?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
}
