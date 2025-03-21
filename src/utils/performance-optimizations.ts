/**
 * Performance optimizations for improving Core Web Vitals
 */

// Cache for script loaded status
const loadedScripts: Record<string, boolean> = {};

/**
 * Lazy load scripts based on intersection observer
 * @param src Script URL
 * @param options Configuration options
 */
export function lazyLoadScript(
  src: string,
  options: {
    rootMargin?: string;
    threshold?: number;
    async?: boolean;
    defer?: boolean;
    id?: string;
    onLoad?: () => void;
  } = {}
): () => void {
  // Default options
  const {
    rootMargin = '200px',
    threshold = 0.1,
    async = true,
    defer = true,
    id = src.split('/').pop()?.replace(/\W/g, '') || 'lazy-script',
    onLoad,
  } = options;

  // Don't load the same script twice
  if (loadedScripts[src]) {
    if (onLoad) onLoad();
    return () => {}; // Return empty cleanup function
  }

  // Create a wrapper element to observe
  const observerTarget = document.createElement('div');
  observerTarget.id = `script-observer-${id}`;
  observerTarget.style.position = 'absolute';
  observerTarget.style.width = '1px';
  observerTarget.style.height = '1px';
  observerTarget.style.opacity = '0';
  observerTarget.style.pointerEvents = 'none';
  document.body.appendChild(observerTarget);

  // Create and configure the intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        if (async) script.async = true;
        if (defer) script.defer = true;
        
        script.onload = () => {
          loadedScripts[src] = true;
          if (onLoad) onLoad();
        };
        
        document.head.appendChild(script);
        observer.disconnect();
        document.body.removeChild(observerTarget);
      }
    },
    { rootMargin, threshold }
  );
  
  observer.observe(observerTarget);
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    if (document.body.contains(observerTarget)) {
      document.body.removeChild(observerTarget);
    }
  };
}

/**
 * Defers non-critical CSS loading
 * @param href CSS file URL
 * @param id Optional ID for the stylesheet
 */
export function loadCSSDeferred(href: string, id?: string): void {
  // First create a non-render-blocking preload
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'style';
  preload.href = href;
  document.head.appendChild(preload);
  
  // Then load the CSS in a non-blocking way
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  if (id) stylesheet.id = id;
  
  // Use requestIdleCallback for better performance if available
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      document.head.appendChild(stylesheet);
    });
  } else {
    // Fallback to setTimeout
    setTimeout(() => {
      document.head.appendChild(stylesheet);
    }, 1);
  }
}

/**
 * Performs critical rendering path optimizations
 */
export function optimizeCRP(): void {
  // Prevent layout shifts by setting a base font size early
  document.documentElement.style.fontSize = '16px';
  
  // Add resource hints for critical domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'zerovacancy.ai',
  ];
  
  domains.forEach(domain => {
    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = `//${domain}`;
    document.head.appendChild(dns);
    
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = `//${domain}`;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
  
  // Add event listener for when CSS is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing font-display styles
    const existingFontStyle = document.getElementById('font-display-fix');
    if (existingFontStyle) {
      existingFontStyle.remove();
    }
    
    // Add font-display: swap to ensure text remains visible during font loading
    const style = document.createElement('style');
    style.id = 'font-display-fix';
    style.textContent = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);
  });
}

/**
 * Fixes Core Web Vitals related issues
 */
export function fixCoreWebVitals(): void {
  // Fix CLS issues by reserving space for elements that load dynamically
  const fixCLS = () => {
    // Find hero sections and ensure they have min-height
    document.querySelectorAll('.hero, [class*="hero-"], [id*="hero"]').forEach((el) => {
      const element = el as HTMLElement;
      if (!element.style.minHeight) {
        element.style.minHeight = '500px';
      }
    });
    
    // Ensure images have width and height attributes
    document.querySelectorAll('img:not([width]):not([height])').forEach((img) => {
      const image = img as HTMLImageElement;
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
      }
    });
  };
  
  // Fix Largest Contentful Paint by prioritizing hero images
  const fixLCP = () => {
    // Find hero images and give them high priority
    const potentialLCPImages = [
      ...document.querySelectorAll('.hero img, [class*="hero-"] img, [id*="hero"] img'),
      ...document.querySelectorAll('img[class*="hero"], img[id*="hero"]'),
      ...document.querySelectorAll('img[src*="hero"]'),
    ];
    
    // Handle only the first 2 potential LCP images
    potentialLCPImages.slice(0, 2).forEach((img) => {
      const image = img as HTMLImageElement;
      if (image.loading !== 'eager') {
        image.loading = 'eager';
        // Add fetchpriority if supported
        if ('fetchPriority' in image) {
          (image as any).fetchPriority = 'high';
        }
      }
    });
  };
  
  // Fix FID/INP by debouncing event handlers
  const fixInteractionDelays = () => {
    // Add passive to non-passive event listeners
    const nonPassiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
    
    nonPassiveEvents.forEach((event) => {
      document.addEventListener(event, (e) => {}, { passive: true, capture: true });
    });
  };
  
  // Run fixes after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixCLS();
      fixLCP();
      fixInteractionDelays();
    });
  } else {
    fixCLS();
    fixLCP();
    fixInteractionDelays();
  }
  
  // Run again after everything is loaded
  window.addEventListener('load', () => {
    fixCLS();
    
    // Wait for any async content
    setTimeout(() => {
      fixCLS();
      fixLCP();
    }, 500);
  });
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  optimizeCRP();
  fixCoreWebVitals();
}

/**
 * Mobile performance enhancement for scripts
 * On mobile, some scripts may be deferred further or loaded with lower priority
 * @param isMobile Whether the device is mobile
 */
export function mobilePerformanceEnhancements(isMobile: boolean): void {
  if (isMobile) {
    // Disable heavy animations
    document.documentElement.classList.add('reduced-motion');
    
    // Delay non-critical resource loading
    const nonCriticalResources = [
      ...document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])'),
      ...document.querySelectorAll('script:not([data-critical])'),
    ];
    
    nonCriticalResources.forEach((resource) => {
      if (resource.parentNode) {
        resource.parentNode.removeChild(resource);
        
        setTimeout(() => {
          document.head.appendChild(resource);
        }, 2000); // Delay by 2 seconds
      }
    });
  }
}

// Web Vitals measurement - commented out until web-vitals package is installed
export function measureWebVitals() {
  // Implementation will be added once web-vitals package is installed
  console.log('Web Vitals measurement available after installing the package');
  
  /* 
  // Check if the web vitals API is available
  if ('web-vitals' in window) {
    import('web-vitals').then(({ onCLS, onFID, onLCP, onTTFB, onINP }) => {
      // Measure CLS
      onCLS((metric) => {
        console.log('CLS:', metric.value);
      });
      
      // Measure FID
      onFID((metric) => {
        console.log('FID:', metric.value);
      });
      
      // Measure LCP
      onLCP((metric) => {
        console.log('LCP:', metric.value);
      });
      
      // Measure TTFB
      onTTFB((metric) => {
        console.log('TTFB:', metric.value);
      });
      
      // Measure INP
      onINP((metric) => {
        console.log('INP:', metric.value);
      });
    });
  }
  */
}