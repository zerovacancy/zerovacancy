/**
 * FOUCPrevention.tsx
 * 
 * This component prevents Flash of Unstyled Content (FOUC) on page load, particularly
 * focusing on preventing old images appearing briefly during mobile page load.
 */
import { useEffect } from 'react';

export function FOUCPrevention() {
  useEffect(() => {
    // Detect mobile devices
    const isMobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 1. Add a class to the HTML element to indicate loading state
    document.documentElement.classList.add('loading');

    // 2. Create the style element with FOUC-prevention CSS
    const style = document.createElement('style');
    style.id = 'fouc-prevention-styles';
    style.textContent = `
      /* Hide all images during loading to prevent flashes */
      html.loading img {
        opacity: 0 !important;
        transition: none !important;
      }

      /* Apply once loaded */
      html.content-loaded img {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }

      /* Hide anything with "heroparallax" in the name */
      [src*="heroparallax"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        width: 0 !important;
        height: 0 !important;
        top: -9999px !important;
        left: -9999px !important;
      }

      /* Target any potential background fallbacks */
      [style*="heroparallax"] {
        background-image: none !important;
      }

      /* Fix for Firefox and Safari */
      .content-loaded {
        content-visibility: auto;
      }
      
      /* Create placeholder colors for image containers */
      .image-container:not(:has(img.loaded)) {
        background-color: #f5f5f5;
      }
    `;
    document.head.appendChild(style);

    // 3. Wait for content to be ready before removing the loading class
    const markAsLoaded = () => {
      // Wait 2 frames to ensure CSS has been properly applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Remove loading class and add loaded class
          document.documentElement.classList.remove('loading');
          document.documentElement.classList.add('content-loaded');
          console.log('✅ Content marked as loaded - FOUC prevention active');
        });
      });
    };

    // 4. Set up various events to try to catch when content is ready
    if (document.readyState === 'complete') {
      markAsLoaded();
    } else {
      window.addEventListener('load', markAsLoaded);
      // Fallback timeout in case 'load' doesn't fire
      setTimeout(markAsLoaded, isMobile ? 1000 : 500);
    }

    // 5. Ensure any images with "heroparallax" in their URL are completely removed
    const removeHeroparallaxImages = () => {
      document.querySelectorAll('img').forEach(img => {
        if (img.src && img.src.includes('heroparallax')) {
          console.log('🗑️ Removing heroparallax image:', img.src);
          
          // First set to transparent
          img.style.opacity = '0';
          img.style.visibility = 'hidden';
          
          // Then actually remove from DOM after a small delay
          setTimeout(() => {
            if (img.parentNode) {
              img.parentNode.removeChild(img);
            }
          }, 100);
        }
      });
    };

    // Run image removal immediately and again after DOM is loaded
    removeHeroparallaxImages();
    document.addEventListener('DOMContentLoaded', removeHeroparallaxImages);
    
    // And once more after everything is loaded (belt and suspenders)
    const delayedCleanup = () => setTimeout(removeHeroparallaxImages, 100);
    window.addEventListener('load', delayedCleanup);

    // 6. Monitor and handle any dynamically added images
    const observer = new MutationObserver((mutations) => {
      let heroImageFound = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            // Check if it's an element and then look for heroparallax images
            if (node.nodeType === 1) { // ELEMENT_NODE
              const element = node as Element;
              
              // Check if it's a heroparallax image
              if (element.tagName === 'IMG' && 
                  element.getAttribute('src')?.includes('heroparallax')) {
                heroImageFound = true;
                
                // Hide it immediately
                (element as HTMLElement).style.opacity = '0';
                (element as HTMLElement).style.display = 'none';
                
                // Remove it from the DOM
                if (element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              }
              
              // Also check for background images in style attribute
              if (element instanceof HTMLElement && 
                  element.style.backgroundImage &&
                  element.style.backgroundImage.includes('heroparallax')) {
                heroImageFound = true;
                element.style.backgroundImage = 'none';
              }
            }
          });
        }
      }
      
      if (heroImageFound) {
        console.warn('🚨 Detected dynamically added heroparallax image - blocked it');
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style']
    });

    // 7. Add debug info for development
    if (process.env.NODE_ENV === 'development') {
      const debugInfo = document.createElement('div');
      debugInfo.style.cssText = 'position:fixed;top:auto;bottom:0;right:0;background:rgba(0,0,0,0.7);color:white;padding:10px;z-index:9999;font-size:12px;transform:translateZ(0);contain:none;';
      debugInfo.setAttribute('data-contain-force', 'false');
      debugInfo.textContent = 'FOUC Prevention Active';
      document.body.appendChild(debugInfo);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('load', markAsLoaded);
      document.removeEventListener('DOMContentLoaded', removeHeroparallaxImages);
      window.removeEventListener('load', delayedCleanup);
      observer.disconnect();
      
      // Remove the style element
      const styleElement = document.getElementById('fouc-prevention-styles');
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
      
      // Remove debug element
      if (process.env.NODE_ENV === 'development') {
        const debugElement = document.querySelector('div[style*="FOUC Prevention Active"]');
        if (debugElement && debugElement.parentNode) {
          debugElement.parentNode.removeChild(debugElement);
        }
      }
    };
  }, []);

  return null;
}

export default FOUCPrevention;