import React, { useEffect } from 'react';

/**
 * Component for preloading critical resources
 * to improve Core Web Vitals metrics
 */
export const CriticalPreload = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for mobile to apply different preloading strategy
    const isMobile = window.innerWidth < 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // LCP optimizations - preload the hero image and logo
    const criticalImages = [
      // Logo and hero images that appear in the initial viewport
      '/logo.png',
      isMobile ? '/heroparallax/heroparallax1.jpg' : '/heroparallax/heroparallax2.jpg'
    ];

    // Preload critical images
    criticalImages.forEach(imageSrc => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = imageSrc;
      document.head.appendChild(preloadLink);
      
      // Also start loading the image in memory
      const img = new Image();
      img.src = imageSrc;
    });

    // Add preconnect for critical external domains
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

    // Preload critical CSS if needed
    const criticalCSS = document.createElement('style');
    criticalCSS.textContent = `
      /* Critical above-the-fold styles */
      body {
        margin: 0;
        padding: 0;
        background-color: #fff;
      }
      
      /* Prevent layout shifts for LCP elements */
      .hero, section[class*="hero"] {
        min-height: ${isMobile ? '70vh' : '90vh'};
      }
      
      /* Make sure text is visible during font loading */
      h1, h2, h3, p, span, a, button {
        font-family: system-ui, -apple-system, sans-serif;
      }
    `;
    document.head.appendChild(criticalCSS);

  }, []);

  return null;
};

export default CriticalPreload;