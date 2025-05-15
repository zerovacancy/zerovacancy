import React, { useEffect } from 'react';
import { initOptimizedFonts, FontLoadStrategy, FontDisplay, SubsetStrategy } from '@/utils/font-optimization';
import { isMobileDevice } from '@/utils/mobile-optimization';

/**
 * Enhanced font loader component with mobile-first optimizations
 * Implements aggressive font optimization strategies specifically for mobile devices
 */
const FontLoader: React.FC = () => {
  useEffect(() => {
    // Skip font loading on server side
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Detect if we're on mobile
    const isMobile = isMobileDevice();
    
    // Configure fonts differently for mobile vs desktop
    if (isMobile) {
      // Mobile-optimized font loading strategy
      initOptimizedFonts({
        useSwap: true,
        preloadCritical: true,
        useSubsetting: true,
        useFallbackStrategy: true,
        monitorPerformance: false,
        // Override default font definitions for more aggressive mobile optimization
        fonts: [
          {
            family: 'Plus Jakarta Sans',
            // Using Google Fonts with weights 400 and 700
            url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap',
            strategy: FontLoadStrategy.CRITICAL,
            display: FontDisplay.SWAP,
            subset: SubsetStrategy.LATIN,
            fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            variants: [
              { weight: 400 },
              { weight: 700 }
            ]
          },
          {
            family: 'Inter',
            // Load only regular weight for body text on mobile
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap',
            strategy: FontLoadStrategy.EARLY,
            display: FontDisplay.SWAP,
            subset: SubsetStrategy.LATIN,
            fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            variants: [{ weight: 400 }] // Only regular
          },
          {
            family: 'Space Grotesk',
            url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap',
            strategy: FontLoadStrategy.LAZY, // Load only when needed
            display: FontDisplay.SWAP,
            subset: SubsetStrategy.LATIN,
            fallbacks: ['SF Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
            variants: [{ weight: 400 }] // Only regular
          }
        ]
      });
    } else {
      // Desktop can load more font variants
      initOptimizedFonts(); // Use defaults
    }
    
    // Add mobile-specific text adjustments
    if (isMobile) {
      const mobileTextOptimizations = document.createElement('style');
      mobileTextOptimizations.textContent = `
        /* Mobile-specific text size optimizations */
        html {
          font-size: 16px; /* Ensure base font size is readable */
        }
        
        /* Adjust heading sizes on mobile */
        h1 { font-size: 1.75rem !important; line-height: 1.2 !important; }
        h2 { font-size: 1.5rem !important; line-height: 1.25 !important; }
        h3 { font-size: 1.25rem !important; line-height: 1.3 !important; }
        
        /* Optimize paragraph spacing */
        p { font-size: 1rem !important; line-height: 1.5 !important; margin-bottom: 1rem !important; }
        
        /* Ensure buttons and inputs are large enough for touch */
        button, 
        .button, 
        [role="button"],
        input, 
        select,
        textarea {
          font-size: 1rem !important;
          min-height: 44px !important; /* Touch friendly */
        }
        
        /* Force 16px font size for inputs to prevent iOS zoom */
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        input[type="password"],
        textarea {
          font-size: 16px !important;
        }
        
        /* Reduce layout shifts from web fonts */
        .fonts-loading * {
          transition: none !important;
        }
      `;
      document.head.appendChild(mobileTextOptimizations);
      
      // Add fonts-loading class immediately, will be replaced with fonts-loaded when complete
      document.documentElement.classList.add('fonts-loading');
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default FontLoader;