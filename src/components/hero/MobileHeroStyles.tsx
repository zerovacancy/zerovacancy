import React from 'react';
import './mobile-hero.css';

/**
 * MobileHeroStyles - DISABLED COMPONENT
 * 
 * This component has been disabled to prevent style conflicts.
 * We now use mobile-hero.css directly for all mobile styles,
 * which provides a consistent, non-JavaScript dependent approach
 * to styling the mobile hero section.
 * 
 * The previous implementation caused issues by:
 * 1. Injecting high-specificity styles with !important flags
 * 2. Creating conflicting spacing rules that caused layout reversion
 * 3. Setting a 60px top value that pushed content out of view
 * 4. Adding extra margins that competed with gap properties
 */
export const MobileHeroStyles: React.FC = () => {
  // This component now does nothing - it's just a stub to prevent import errors
  // All mobile styles come directly from mobile-hero.css
  return null;
};