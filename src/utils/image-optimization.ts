/**
 * Image Optimization Utility - Core Performance Improvement
 * 
 * This utility focuses on optimizing images for better performance,
 * including lazy loading, format detection, and adaptive serving
 * based on device capabilities.
 */

interface ImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

/**
 * Check if browser supports modern image formats like WebP and AVIF
 */
export function detectImageSupport(): { webp: boolean; avif: boolean } {
  if (typeof document === 'undefined') {
    return { webp: false, avif: false };
  }

  // Default to false
  let webpSupport = false;
  let avifSupport = false;

  // Check for browser support of modern formats via feature detection
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Test WebP support
    webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // Test AVIF support - less reliable as canvas might not support it
    // We'll default to checking user agent for now
    const userAgent = navigator.userAgent.toLowerCase();
    avifSupport = /chrome/.test(userAgent) && parseInt((/chrome\/(\d+)/.exec(userAgent) || ['', '0'])[1]) >= 85;
  }

  return { webp: webpSupport, avif: avifSupport };
}

/**
 * Get optimized image URL based on browser capabilities
 * Assumes you have .webp and/or .avif versions of images
 */
export function getOptimizedImageUrl(imagePath: string): string {
  if (typeof window === 'undefined') return imagePath;
  
  const { webp, avif } = detectImageSupport();
  
  // Check if we already have a specific format
  if (imagePath.endsWith('.webp') || imagePath.endsWith('.avif')) {
    return imagePath;
  }
  
  // Get the base path without extension
  const lastDotIndex = imagePath.lastIndexOf('.');
  if (lastDotIndex === -1) return imagePath; // No extension found
  
  const basePath = imagePath.substring(0, lastDotIndex);
  
  // Check for avif first since it's generally smaller
  if (avif) {
    return `${basePath}.avif`;
  }
  
  // Fall back to webp if supported
  if (webp) {
    return `${basePath}.webp`;
  }
  
  // Return original if neither is supported
  return imagePath;
}

/**
 * Optimize image tag for performance
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw'
}: ImageOptions): HTMLImageElement {
  if (typeof document === 'undefined') return null as unknown as HTMLImageElement;
  
  const img = document.createElement('img');
  img.alt = alt;
  
  // Set width and height attributes to prevent layout shift
  if (width) img.width = width;
  if (height) img.height = height;
  
  // Add classes
  if (className) img.className = className;
  
  // Set lazy loading attribute for below-the-fold images
  img.loading = loading;
  
  // Add srcset for responsive images if we detect format support
  const { webp, avif } = detectImageSupport();
  
  // Get file extension and base name
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    const basePath = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex + 1);
    
    // Create srcset with multiple sizes if width is available
    if (width) {
      const sizesArray = [width, width * 2].map(w => 
        `${basePath}-${w}.${extension} ${w}w`
      ).join(', ');
      
      img.srcset = sizesArray;
      img.sizes = sizes;
    }
    
    // Use modern formats if available
    if (avif) {
      img.srcset = `${basePath}.avif`;
    } else if (webp) {
      img.srcset = `${basePath}.webp`;
    }
  }
  
  // Always set src as fallback
  img.src = src;
  
  // Return the optimized image element
  return img;
}

/**
 * Update all images on the page to use modern formats and lazy loading
 */
export function optimizePageImages(): void {
  if (typeof document === 'undefined') return;
  
  // Find all images without optimization attributes
  const images = document.querySelectorAll('img:not([loading])');
  
  // Get support info
  const { webp, avif } = detectImageSupport();
  
  images.forEach(img => {
    // Don't process images that already have loading set
    if (img.getAttribute('loading')) return;
    
    // Set width and height if missing to prevent layout shift
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      // If natural dimensions are available, use them
      if (img.naturalWidth && img.naturalHeight) {
        img.setAttribute('width', img.naturalWidth.toString());
        img.setAttribute('height', img.naturalHeight.toString());
      }
    }
    
    // Add lazy loading to images likely below the fold
    const rect = img.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      img.loading = 'lazy';
    }
    
    // Use better format if available
    const src = img.getAttribute('src') || '';
    if (src) {
      const optimizedSrc = getOptimizedImageUrl(src);
      if (optimizedSrc !== src) {
        img.setAttribute('src', optimizedSrc);
      }
    }
  });
}

/**
 * Initialize image optimization for the page
 */
export function initImageOptimization(): void {
  if (typeof window === 'undefined') return;
  
  // Run optimization on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizePageImages);
  } else {
    optimizePageImages();
  }
  
  // Also run after window load for any dynamically added images
  window.addEventListener('load', () => {
    optimizePageImages();
    
    // Add a mutation observer to catch dynamically added images
    const observer = new MutationObserver(mutations => {
      let hasNewImages = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'IMG' || 
               (node.nodeType === Node.ELEMENT_NODE && 
                (node as Element).querySelector('img'))) {
              hasNewImages = true;
            }
          });
        }
      });
      
      if (hasNewImages) {
        optimizePageImages();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });
}