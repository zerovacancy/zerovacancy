
import { useEffect } from 'react';

/**
 * Optimized font loader component that:
 * 1. Prioritizes critical fonts
 * 2. Defers non-critical fonts
 * 3. Uses font-display: swap
 * 4. Minimizes layout shifts
 */
const FontLoader = () => {
  useEffect(() => {
    // Skip in SSR
    if (typeof window === 'undefined') return;
    
    // Check if we're on a mobile device for different optimization strategies
    const isMobile = window.innerWidth < 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // For mobile, we'll only load the most important font initially
    // Others will be loaded later to improve LCP
    const criticalFonts = isMobile ? 
      [
        // Only the main font with limited weights
        'https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@500;700&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:%20'
      ] :
      [
        // Main font
        'https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;500;600;700&display=swap'
      ];
      
    // Non-critical fonts to load after page content is visible
    const nonCriticalFonts = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap'
      }
    ];

    // Track elements to clean up
    const elements: HTMLLinkElement[] = [];

    // Add font-display: swap to ensure text is visible during font loading
    const style = document.createElement('style');
    style.textContent = `
      /* Apply font-display: swap to all font-face declarations */
      @font-face {
        font-display: swap !important;
      }
      
      /* Prevent layout shifts by setting explicit font metrics */
      body {
        font-family: 'Anek Devanagari', system-ui, -apple-system, sans-serif;
      }
      
      /* Make sure key elements have proper fallbacks */
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Anek Devanagari', system-ui, -apple-system, sans-serif;
      }
    `;
    document.head.appendChild(style);
    
    // Load critical fonts immediately
    criticalFonts.forEach(fontUrl => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = fontUrl;
      preloadLink.crossOrigin = 'anonymous';
      
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = fontUrl;
      stylesheet.setAttribute('data-critical', 'true');
      
      document.head.appendChild(preloadLink);
      document.head.appendChild(stylesheet);
      
      elements.push(preloadLink, stylesheet);
    });

    // Load non-critical fonts after a delay or when the page is idle
    const loadNonCriticalFonts = () => {
      nonCriticalFonts.forEach(link => {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = link.href;
        
        document.head.appendChild(stylesheet);
        elements.push(stylesheet);
      });
    };
    
    // Use requestIdleCallback for non-critical fonts if available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        loadNonCriticalFonts();
      });
    } else {
      // Fallback to setTimeout with a reasonable delay
      setTimeout(loadNonCriticalFonts, isMobile ? 2000 : 1000);
    }

    // Mark document as font-loaded when fonts are ready
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
    
    return () => {
      // No need to clean up in production as this component is mounted once
      if (process.env.NODE_ENV === 'development') {
        elements.forEach(element => {
          if (document.head.contains(element)) {
            document.head.removeChild(element);
          }
        });
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }
    };
  }, []);

  return null;
};

export default FontLoader;
