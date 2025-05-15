import { useEffect } from 'react';

/**
 * Hook to handle hero section height styles.
 * This hook creates style overrides for hero sections to ensure
 * consistent height behavior across devices and prevent layout shifts.
 */
export function useHeroHeight(): void {
  useEffect(() => {
    // Create style element
    const heroHeightOverride = document.createElement('style');
    heroHeightOverride.id = 'hero-height-override';
    
    // Add CSS overrides for hero elements
    heroHeightOverride.innerHTML = `
      /* Direct override for any Core Web Vitals setting min-height */
      @media (max-width: 768px) {
        #hero, div#hero, .hero-height-reset, [id="hero"] {
          min-height: 100vh !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          max-height: none !important;
          padding-top: 10px !important; /* Reduced spacing from header */
        }
      }
      
      @media (min-width: 769px) {
        #hero, div#hero, .hero-height-reset, [id="hero"] {
          min-height: auto !important;
          height: auto !important;
          max-height: none !important;
        }
      }
      
      /* Target for performance optimizations */
      .hero-height-reset * {
        min-height: auto !important;
      }
      
      /* Override for sections that might have explicit heights */
      @media (max-width: 768px) {
        section[id="hero"], section.hero, section[class*="hero"] {
          min-height: 100vh !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
        }
      }
      
      @media (min-width: 769px) {
        section[id="hero"], section.hero, section[class*="hero"] {
          min-height: auto !important;
          height: auto !important;
        }
      }
    `;
    
    // Add to document head
    document.head.appendChild(heroHeightOverride);
    
    // Cleanup function
    return () => {
      const heroHeightStyle = document.getElementById('hero-height-override');
      if (heroHeightStyle && heroHeightStyle.parentNode) {
        heroHeightStyle.parentNode.removeChild(heroHeightStyle);
      }
    };
  }, []);
}