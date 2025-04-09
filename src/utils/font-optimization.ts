/**
 * Font optimization utilities for improved Core Web Vitals
 * Focuses on mobile-first performance optimization
 */

import { isMobileDevice } from './mobile-optimization';

// Font loading strategies
export enum FontLoadStrategy {
  CRITICAL = 'critical',  // For essential fonts
  EARLY = 'early',        // Important but not critical
  INTERACTIVE = 'interactive', // After page becomes interactive
  LAZY = 'lazy',          // Load when scrolled into view
  ON_DEMAND = 'on-demand' // Only when explicitly needed
}

// Font display values
export enum FontDisplay {
  SWAP = 'swap',          // Immediately shows fallback, then swaps
  OPTIONAL = 'optional',  // Shows fallback, only swaps if cached
  FALLBACK = 'fallback',  // Brief invisible, then fallback, limited swap
  BLOCK = 'block'         // Short blocking period for custom font
}

// Subsetting strategies
export enum SubsetStrategy {
  LATIN = 'latin',
  LATIN_EXTENDED = 'latin-extended',
  ALPHANUMERIC = 'alphanumeric',
  NUMERIC = 'numeric',
  CUSTOM = 'custom'
}

// Font definition interface
export interface FontVariant {
  weight?: number;
  style?: 'normal' | 'italic';
}

export interface FontDefinition {
  family: string;
  url: string;
  strategy: FontLoadStrategy;
  display: FontDisplay;
  subset: SubsetStrategy;
  fallbacks: string[];
  variants: FontVariant[];
  customSubset?: string; // For custom character set
}

// Default font definitions for the application
export const ZEROVACANCY_FONTS: FontDefinition[] = [
  {
    family: 'Plus Jakarta Sans',
    url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
    strategy: FontLoadStrategy.CRITICAL,
    display: FontDisplay.SWAP,
    subset: SubsetStrategy.LATIN,
    fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    variants: [
      { weight: 700 },
      { weight: 800 }
    ]
  },
  {
    family: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    strategy: FontLoadStrategy.EARLY,
    display: FontDisplay.SWAP,
    subset: SubsetStrategy.LATIN,
    fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    variants: [
      { weight: 400 },
      { weight: 500 },
      { weight: 600 },
      { weight: 700 }
    ]
  },
  {
    family: 'Space Grotesk',
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
    strategy: FontLoadStrategy.LAZY,
    display: FontDisplay.SWAP,
    subset: SubsetStrategy.LATIN,
    fallbacks: ['SF Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
    variants: [
      { weight: 400 },
      { weight: 500 },
      { weight: 700 }
    ]
  }
];

// Mobile-optimized subsets to reduce font file size
const createMobileSubset = (font: FontDefinition): FontDefinition => {
  // For mobile, use only the necessary weights to reduce download size
  const mobileVariants = font.strategy === FontLoadStrategy.CRITICAL 
    ? font.variants // Keep all weights for critical fonts
    : font.variants.filter(v => v.weight === 400 || v.weight === 700); // Only regular and bold for others
  
  return {
    ...font,
    variants: mobileVariants
  };
};

// Generate font face styles with appropriate size adjustments
const generateFontFaceStyles = (fonts: FontDefinition[], isMobile: boolean): string => {
  return fonts.map(font => {
    const sizeAdjust = font.family === 'Inter' ? '0.5' : 
                      font.family === 'Plus Jakarta Sans' ? '0.56' : '1.0';
    
    return `
      @font-face {
        font-family: '${font.family}';
        font-display: ${font.display};
        size-adjust: ${sizeAdjust};
        src: local('${font.family}');
        ${isMobile ? 'font-weight: 400 700;' : ''}
      }
    `;
  }).join('\n');
};

// Generate font stack styles
const generateFontStackStyles = (fonts: FontDefinition[]): string => {
  return `
    .fonts-loaded h1, 
    .fonts-loaded h2, 
    .fonts-loaded h3, 
    .fonts-loaded h4, 
    .fonts-loaded h5, 
    .fonts-loaded h6 {
      font-family: "${fonts[0].family}", ${fonts[0].fallbacks.join(', ')};
    }
    
    .fonts-loaded p, 
    .fonts-loaded span, 
    .fonts-loaded a, 
    .fonts-loaded button,
    .fonts-loaded input,
    .fonts-loaded textarea,
    .fonts-loaded select {
      font-family: "${fonts[1].family}", ${fonts[1].fallbacks.join(', ')};
    }
    
    .fonts-loaded code, 
    .fonts-loaded pre, 
    .fonts-loaded .monospace {
      font-family: "${fonts[2].family}", ${fonts[2].fallbacks.join(', ')};
    }
  `;
};

// Generate font loading URLs with appropriate subsets
const generateFontUrls = (fonts: FontDefinition[], isMobile: boolean): string[] => {
  return fonts.map(font => {
    let url = font.url;
    
    // Add subset parameter
    if (font.subset === SubsetStrategy.LATIN) {
      url += url.includes('?') ? '&subset=latin' : '?subset=latin';
    } else if (font.subset === SubsetStrategy.LATIN_EXTENDED) {
      url += url.includes('?') ? '&subset=latin,latin-ext' : '?subset=latin,latin-ext';
    }
    
    // Add display parameter
    url += url.includes('?') ? '&display=' + font.display : '?display=' + font.display;
    
    // For mobile, use text parameter to only include needed characters
    if (isMobile && font.strategy !== FontLoadStrategy.CRITICAL) {
      // Define basic character set for mobile
      const basicChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?@#$%&*()-_=+[]{}|<>/\\\'"`~';
      url += url.includes('?') ? '&text=' + encodeURIComponent(basicChars) : '?text=' + encodeURIComponent(basicChars);
    }
    
    return url;
  });
};

// Generate preload links for critical fonts
const generatePreloadLinks = (fonts: FontDefinition[], isMobile: boolean): HTMLLinkElement[] => {
  const criticalFonts = fonts.filter(f => f.strategy === FontLoadStrategy.CRITICAL);
  
  return criticalFonts.flatMap(font => {
    return font.variants
      // For mobile, only preload regular and bold weights
      .filter(v => !isMobile || v.weight === 400 || v.weight === 700)
      .map(variant => {
        // Create the correct Google Fonts URL for specific weight
        const weight = variant.weight || 400;
        const style = variant.style || 'normal';
        
        // Approximate URL for Google Fonts file - in production you'd use a more precise mapping
        const fontUrl = `https://fonts.gstatic.com/s/${font.family.toLowerCase().replace(/\s+/g, '')}/${
          font.subset === SubsetStrategy.LATIN ? 'v13' : 'v8'
        }/${
          weight === 400 && style === 'normal' ? 'regular' : weight + (style === 'italic' ? 'i' : '')
        }.woff2`;
        
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.href = fontUrl;
        preload.as = 'font';
        preload.type = 'font/woff2';
        preload.crossOrigin = 'anonymous';
        
        return preload;
      });
  });
};

// Initialize font optimization
export const initOptimizedFonts = (options: {
  fonts?: FontDefinition[];
  useSwap?: boolean;
  preloadCritical?: boolean;
  useSubsetting?: boolean;
  useFallbackStrategy?: boolean;
  monitorPerformance?: boolean;
} = {}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Merge options with defaults
  const {
    fonts = ZEROVACANCY_FONTS,
    useSwap = true,
    preloadCritical = true,
    useSubsetting = true,
    useFallbackStrategy = true,
    monitorPerformance = false
  } = options;
  
  // Determine if we're on mobile
  const isMobile = isMobileDevice();
  
  // For mobile, optimize font definitions
  const optimizedFonts = isMobile 
    ? fonts.map(createMobileSubset)
    : fonts;
  
  // Track performance if needed
  const startTime = monitorPerformance ? performance.now() : 0;
  const fontEntries: {name: string, duration: number, size: number}[] = [];
  
  // 1. Apply system font fallbacks first to prevent layout shifts
  const fallbackStyle = document.createElement('style');
  fallbackStyle.textContent = `
    /* Font fallbacks with size-adjust to closely match web fonts */
    h1, h2, h3, h4, h5, h6 {
      font-family: ${fonts[0].fallbacks.join(', ')};
      /* Adjusted to match heading font metrics */
      font-size-adjust: 0.56;
      font-weight: bold;
      letter-spacing: -0.02em;
    }
    
    p, span, a, button, input, textarea, select {
      font-family: ${fonts[1].fallbacks.join(', ')};
      /* Adjusted to match body font metrics */
      font-size-adjust: 0.5;
      letter-spacing: -0.01em;
    }
    
    code, pre, .monospace {
      font-family: ${fonts[2].fallbacks.join(', ')};
    }
    
    /* Font loading classes */
    .fonts-loaded {
      /* Specific overrides when fonts are fully loaded */
      transition: color 0.2s ease-out;
    }
  `;
  document.head.appendChild(fallbackStyle);
  
  // 2. Preload critical font files if enabled
  if (preloadCritical) {
    const preloadLinks = generatePreloadLinks(optimizedFonts, isMobile);
    preloadLinks.forEach(link => document.head.appendChild(link));
  }
  
  // 3. Add font-face declarations with font-display strategy
  if (useSwap) {
    const fontDisplayStyle = document.createElement('style');
    fontDisplayStyle.textContent = generateFontFaceStyles(optimizedFonts, isMobile);
    document.head.appendChild(fontDisplayStyle);
  }
  
  // 4. Load font stylesheets with appropriate display and subset parameters
  const fontUrls = generateFontUrls(optimizedFonts, isMobile);
  
  fontUrls.forEach((url, index) => {
    const font = optimizedFonts[index];
    
    // Only load critical fonts immediately on mobile
    if (isMobile && font.strategy !== FontLoadStrategy.CRITICAL && font.strategy !== FontLoadStrategy.EARLY) {
      // On mobile, defer loading non-critical fonts until idle or visible
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          loadFont(url, font, fontEntries);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          loadFont(url, font, fontEntries);
        }, 1000);
      }
    } else {
      // Load normally
      loadFont(url, font, fontEntries);
    }
  });
  
  // 5. Add the final font stack once fonts are loaded
  if (useFallbackStrategy) {
    const loadedFontsStyle = document.createElement('style');
    loadedFontsStyle.textContent = generateFontStackStyles(optimizedFonts);
    
    // Use font loading API
    if ('fonts' in document) {
      // Use Promise.all to track when critical fonts are loaded
      Promise.all([
        document.fonts.load(`700 1em "${optimizedFonts[0].family}"`),
        document.fonts.load(`400 1em "${optimizedFonts[1].family}"`)
      ]).then(() => {
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
        
        if (monitorPerformance) {
          logPerformance(startTime, fontEntries);
        }
      }).catch(error => {
        console.warn('Error loading fonts:', error);
        // Add the fonts-loaded class anyway to ensure styles are applied
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Fallback for browsers without font loading API
      // Add fonts-loaded class after a reasonable timeout
      setTimeout(() => {
        document.head.appendChild(loadedFontsStyle);
        document.documentElement.classList.add('fonts-loaded');
      }, isMobile ? 2000 : 1000); // Longer timeout for mobile
    }
  }
};

// Helper to load a font and track performance
function loadFont(url: string, font: FontDefinition, entries: any[]) {
  if (typeof document === 'undefined') return;
  
  const startTime = performance.now();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  
  // For non-critical fonts, use async loading
  if (font.strategy !== FontLoadStrategy.CRITICAL) {
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
      const duration = performance.now() - startTime;
      entries.push({ name: url, duration, size: 0 }); // Can't get size easily
    };
  } else {
    link.onload = () => {
      const duration = performance.now() - startTime;
      entries.push({ name: url, duration, size: 0 });
    };
  }
  
  document.head.appendChild(link);
}

// Log performance metrics
function logPerformance(startTime: number, fontEntries: any[]) {
  if (!startTime) return;
  
  const endTime = performance.now();
  const fontLoadTime = endTime - startTime;
  const totalFontSize = fontEntries.reduce((sum, entry) => sum + entry.size, 0);
  
  // Detect font format support
  const formatSupport = {
    woff2: CSS.supports('(font-technology: woff2)') || 'FontFace' in window,
    woff: CSS.supports('(font-technology: woff)') || 'FontFace' in window,
    ttf: CSS.supports('(font-technology: truetype)') || 'FontFace' in window,
    variableFonts: CSS.supports('(font-variation-settings: normal)') || false
  };
  
  console.log('Font Performance Report:', {
    fontsLoaded: document.documentElement.classList.contains('fonts-loaded'),
    formatSupport,
    fontEntries,
    totalFontSize,
    fontLoadTime
  });
}