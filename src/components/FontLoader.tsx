import { useEffect } from 'react';

/**
 * Simple font loader component that preloads the necessary fonts
 */
const FontLoader = () => {
  useEffect(() => {
    // Preload fonts with system font fallbacks to prevent layout shifts
    const style = document.createElement('style');
    style.textContent = `
      /* Font fallbacks */
      h1, h2, h3, h4, h5, h6 {
        font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
      }
      
      p, span, a, button {
        font-family: "Inter", system-ui, -apple-system, sans-serif;
      }
      
      code, pre, .monospace {
        font-family: "Space Grotesk", monospace;
      }
      
      /* Font loading classes */
      .fonts-loaded {
        /* Styles for when fonts are loaded */
      }
    `;
    document.head.appendChild(style);
    
    // Load Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap';
    document.head.appendChild(link);
    
    // Mark as loaded after a delay
    const timeout = setTimeout(() => {
      document.documentElement.classList.add('fonts-loaded');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // This component doesn't render anything
  return null;
};

export default FontLoader;