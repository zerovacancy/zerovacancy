import React, { useEffect } from 'react';

/**
 * Optimized font loader component that prevents layout shifts and
 * implements performance best practices for web font loading
 */
const FontLoader: React.FC = () => {
  useEffect(() => {
    // Skip font loading on server side
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // 1. Apply system font fallbacks first to prevent layout shifts
    const fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = `
      /* Font fallbacks with size-adjust to closely match web fonts */
      h1, h2, h3, h4, h5, h6 {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        /* Adjusted to match Plus Jakarta Sans metrics */
        font-size-adjust: 0.5;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      
      p, span, a, button, input, textarea, select {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        /* Adjusted to match Inter metrics */
        font-size-adjust: 0.5;
        letter-spacing: -0.01em;
      }
      
      code, pre, .monospace {
        font-family: "SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      }
      
      /* Font loading classes */
      .fonts-loaded {
        /* Specific overrides when fonts are fully loaded */
        transition: color 0.2s ease-out;
      }
    `;
    document.head.appendChild(fallbackStyle);
    
    // 2. Preload the critical font files
    // Updated font URLs to the current versions
    const criticalFonts = [
      'https://fonts.gstatic.com/s/plusjakartasans/v13/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA.woff2', // Plus Jakarta Sans Bold
      'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2' // Inter Regular
    ];
    
    criticalFonts.forEach(fontUrl => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = fontUrl;
      preloadLink.as = 'font';
      preloadLink.type = 'font/woff2';
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    });
    
    // 3. Add the font-display style to ensure text remains visible during font loading
    const fontDisplayStyle = document.createElement('style');
    fontDisplayStyle.textContent = `
      /* Ensure text remains visible during webfont load */
      @font-face {
        font-family: 'Plus Jakarta Sans';
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Space Grotesk';
        font-display: swap;
      }
    `;
    document.head.appendChild(fontDisplayStyle);
    
    // 4. Load Google Fonts with display=swap parameter
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap';
    document.head.appendChild(link);
    
    // 5. Add the final font stack after fonts are loaded
    const loadedFontsStyle = document.createElement('style');
    loadedFontsStyle.textContent = `
      /* Final font stacks when web fonts are loaded */
      .fonts-loaded h1, 
      .fonts-loaded h2, 
      .fonts-loaded h3, 
      .fonts-loaded h4, 
      .fonts-loaded h5, 
      .fonts-loaded h6 {
        font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
      }
      
      .fonts-loaded p, 
      .fonts-loaded span, 
      .fonts-loaded a, 
      .fonts-loaded button,
      .fonts-loaded input,
      .fonts-loaded textarea,
      .fonts-loaded select {
        font-family: "Inter", system-ui, -apple-system, sans-serif;
      }
      
      .fonts-loaded code, 
      .fonts-loaded pre, 
      .fonts-loaded .monospace {
        font-family: "Space Grotesk", "SF Mono", SFMono-Regular, Consolas, monospace;
      }
    `;
    
    // 6. Use font loading API with a simpler approach
    if ('fonts' in document) {
      // Use Promise.all to track when all fonts are loaded
      Promise.all([
        document.fonts.load('700 1em "Plus Jakarta Sans"'),
        document.fonts.load('400 1em "Inter"')
      ]).then(() => {
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
      }).catch(error => {
        console.warn('Error loading fonts:', error);
        // Add the fonts-loaded class anyway to ensure styles are applied
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Fallback for browsers without font loading API
      // Add fonts-loaded class after a reasonable timeout
      const timeout = setTimeout(() => {
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default FontLoader;