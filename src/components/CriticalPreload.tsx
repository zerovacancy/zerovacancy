import React, { useEffect } from 'react';

/**
 * Optimized critical resource preloading and CSS management
 * 
 * This component:
 * 1. Inlines critical CSS for above-the-fold content
 * 2. Preloads critical fonts, images, and scripts
 * 3. Defers non-critical CSS loading
 * 4. Applies Mobile-specific optimizations
 */
export const CriticalPreload = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for mobile to apply different preloading strategy
    const isMobile = window.innerWidth < 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 1. Apply critical CSS inline to minimize render-blocking
    const criticalCSS = document.createElement('style');
    criticalCSS.id = 'critical-css';
    criticalCSS.textContent = `
      /* Critical reset styles */
      *, *::before, *::after { box-sizing: border-box; }
      body, h1, h2, h3, p { margin: 0; }
      html, body { height: 100%; }
      
      /* Critical layout styles */
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        background-color: #fff;
        overflow-x: hidden;
      }
      
      /* Prevent layout shifts for LCP elements */
      .hero, section[class*="hero"] {
        min-height: ${isMobile ? '100vh' : '90vh'};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      /* Prevent layout shift from button hover states */
      button, a { transition: transform 0.2s ease, opacity 0.2s ease; }
      
      /* High-contrast text */
      h1, h2, h3 { color: #1a1a1a; font-weight: 700; }
      
      /* Mobile-specific adjustments */
      @media (max-width: 640px) {
        h1 { font-size: 1.75rem; }
        h2 { font-size: 1.5rem; }
        p { font-size: 1rem; }
      }
      
      /* Container sizing for responsive layout */
      .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      
      /* Critical utility classes */
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .flex-col { flex-direction: column; }
      .gap-4 { gap: 1rem; }
      
      /* Critical component styles from components.css */
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .shadow-glow { box-shadow: 0 0 15px rgba(137, 87, 255, 0.15); }
    `;
    document.head.appendChild(criticalCSS);

    // 2. LCP optimizations - preload the logo with highest priority
    const criticalImages = [
      // Logo that appears in the initial viewport
      '/logo.png'
    ];

    // Preload critical images with high priority
    criticalImages.forEach(imageSrc => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = imageSrc;
      // Use fetchpriority for modern browsers
      preloadLink.setAttribute('fetchpriority', 'high');
      document.head.appendChild(preloadLink);
      
      // Also start loading the image in memory
      const img = new Image();
      img.src = imageSrc;
      // Set importance for older browsers
      img.setAttribute('importance', 'high');
    });

    // 3. Key webfonts - direct font file preloading is much faster than Google Fonts CSS
    const criticalFonts = [
      { 
        href: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NSg.woff2', 
        type: 'font/woff2'
      },
      { 
        href: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', 
        type: 'font/woff2' 
      }
    ];
    
    criticalFonts.forEach(font => {
      const fontPreload = document.createElement('link');
      fontPreload.rel = 'preload';
      fontPreload.href = font.href;
      fontPreload.as = 'font';
      fontPreload.type = font.type;
      fontPreload.crossOrigin = 'anonymous';
      document.head.appendChild(fontPreload);
    });

    // 4. Add preconnect for critical external domains
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://pozblfzhjqlsxkakhowp.supabase.co'
    ];

    criticalDomains.forEach(domain => {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);

      // Also add dns-prefetch as fallback for older browsers
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = domain;
      document.head.appendChild(dns);
    });
    
    // 5. Defer non-critical CSS loading
    // Don't try to directly load the component CSS file since it relies on Tailwind processing
    const deferredStyles = [
      '/src/styles/animations.css'
    ];
    
    deferredStyles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        // Once loaded, change from preload to stylesheet
        this.onload = null;
        this.rel = 'stylesheet';
      };
      document.head.appendChild(link);
      
      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const fallbackLink = document.createElement('link');
      fallbackLink.rel = 'stylesheet';
      fallbackLink.href = href;
      noscript.appendChild(fallbackLink);
      document.head.appendChild(noscript);
    });
    
    // 6. Apply mobile-specific optimizations
    if (isMobile) {
      // Add mobile class to document for conditional CSS
      document.documentElement.classList.add('mobile');
      
      // Disable expensive animations and effects
      document.documentElement.classList.add('reduce-animations');
      
      // Fix for 100vh on mobile
      const viewportHeight = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
      
      // Listen for resize/orientation changes
      window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }, { passive: true });
    }

  }, []);

  return null;
};

export default CriticalPreload;