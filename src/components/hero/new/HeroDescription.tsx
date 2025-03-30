import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * HeroDescription Component
 * 
 * This component displays different text for mobile and desktop views.
 * Key layout improvements:
 * 1. Uses 'auto-height-container' class instead of inline styles for height control
 * 2. Relies on CSS in hero-section.css and mobile-hero.css for height behavior
 * 3. Avoids JavaScript manipulation of heights that could cause layout shifts
 * 4. Properly responds to device width changes through the useIsMobile hook
 */
interface HeroDescriptionProps {
  mobileText: string;
  desktopText: string;
  className?: string;
}

export const HeroDescription: React.FC<HeroDescriptionProps> = ({
  mobileText,
  desktopText,
  className
}) => {
  // Detect device type using the useIsMobile hook
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        // Base container class targeted by CSS
        "hero-description-container",
        // Special class with high-specificity selectors in hero-section.css
        "auto-height-container",
        // Add this new class for higher specificity to override any inline styles
        "content-driven-height",
        // Any additional classes passed as props
        className
      )}
      // Note: We're using className-based styling instead of inline styles
      // This ensures our CSS rules in hero-section.css and mobile-hero.css 
      // have precedence and won't be overridden by React's style attribute
    >
      {/* Text paragraph with responsive sizing */}
      <p className={cn(
        "text-gray-700 text-center font-inter w-full",
        "text-[0.9rem] md:text-base",
        "leading-[1.4] md:leading-[1.5]",
        // 'px-1' adds slight horizontal padding to improve text readability
        "px-1"
      )}>
        {/* Show different text based on device type */}
        {isMobile ? mobileText : desktopText}
      </p>
    </div>
  );
};

/**
 * LAYOUT IMPROVEMENT DETAILS:
 * 
 * 1. REMOVED PROBLEMATIC CODE:
 *    - Removed useRef and useEffect hooks that were manipulating DOM directly
 *    - Eliminated MutationObserver that was watching for style changes
 *    - Removed all inline styles (especially problematic min-height)
 * 
 * 2. PURE CSS APPROACH:
 *    - Now using class-based styling from hero-section.css and mobile-hero.css
 *    - The 'auto-height-container' class has high-specificity selectors that ensure:
 *      → min-height: auto
 *      → height: auto
 *      → max-height: none
 * 
 * 3. CONTENT-DRIVEN HEIGHT:
 *    - Container height is now purely determined by its content
 *    - No JavaScript functions can reapply 500px height after render
 *    - Clean separation between content structure and styling
 */