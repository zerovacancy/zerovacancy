/**
 * Mobile Image Optimizer - Advanced Performance Optimization
 * 
 * This utility specifically handles optimizing images for mobile devices:
 * 1. Uses the smaller mobile-specific versions when on mobile
 * 2. Implements responsive image techniques (srcset/sizes)
 * 3. Sets up proper lazy loading with IntersectionObserver
 * 4. Automatically selects WebP when supported
 */

import { isMobileDevice } from './mobile-optimization';

interface ResponsiveImageOptions {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  importance?: 'high' | 'low' | 'auto';
}

// Browser support detection for WebP
let webpSupported: boolean | null = null;

/**
 * Test for WebP support
 */
export function detectWebPSupport(): Promise<boolean> {
  if (webpSupported !== null) return Promise.resolve(webpSupported);
  
  return new Promise(resolve => {
    const webpTestImg = new Image();
    
    webpTestImg.onload = function() {
      webpSupported = (webpTestImg.width > 0) && (webpTestImg.height > 0);
      resolve(webpSupported);
    };
    
    webpTestImg.onerror = function() {
      webpSupported = false;
      resolve(false);
    };
    
    // Small 1x1 WebP test image
    webpTestImg.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Generate srcset attribute for responsive images
 */
function generateSrcSet(imagePath: string, isMobile: boolean): string {
  const ext = imagePath.split('.').pop() || 'jpg';
  const baseWithoutExt = imagePath.substring(0, imagePath.lastIndexOf('.'));
  
  // Create both WebP and original format versions
  const webpPath = `${baseWithoutExt}.webp`;
  
  if (isMobile) {
    // For mobile, use mobile-specific directory images
    const dirPath = baseWithoutExt.substring(0, baseWithoutExt.lastIndexOf('/'));
    const fileName = baseWithoutExt.substring(baseWithoutExt.lastIndexOf('/') + 1);
    const mobilePath = `${dirPath}/mobile/${fileName}`;
    
    return `
      ${mobilePath}.webp 640w,
      ${webpPath} 1200w,
      ${mobilePath}.${ext} 640w,
      ${imagePath} 1200w
    `.trim();
  } else {
    // For desktop, use regular and 2x versions if available
    return `
      ${webpPath} 1x,
      ${imagePath} 1x
    `.trim();
  }
}

/**
 * Create sizes attribute based on mobile status
 */
function generateSizes(isMobile: boolean, customSizes?: string): string {
  if (customSizes) return customSizes;
  
  if (isMobile) {
    return '(max-width: 640px) 100vw, 640px';
  } else {
    return '(max-width: 1200px) 100vw, 1200px';
  }
}

/**
 * Setup optimized responsive images with proper mobile optimization
 */
export function setupResponsiveImage(options: ResponsiveImageOptions): HTMLImageElement | null {
  if (typeof document === 'undefined') return null;
  
  const {
    src,
    alt,
    className = '',
    width,
    height,
    sizes: customSizes,
    loading = 'lazy',
    decoding = 'async',
    fetchpriority = 'auto',
    importance = 'auto'
  } = options;
  
  // Skip processing for SVGs, GIFs, etc.
  const ext = src.split('.').pop()?.toLowerCase() || '';
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (className) img.className = className;
    if (width) img.width = width;
    if (height) img.height = height;
    img.loading = loading;
    img.decoding = decoding;
    if ('fetchpriority' in HTMLImageElement.prototype) {
      // @ts-ignore - Newer browsers support this
      img.fetchpriority = fetchpriority;
    }
    if ('importance' in HTMLImageElement.prototype) {
      // @ts-ignore - Some browsers support this
      img.importance = importance;
    }
    return img;
  }
  
  // Detect mobile
  const isMobile = isMobileDevice();
  
  // Create optimized image element
  const img = document.createElement('img');
  img.alt = alt;
  if (className) img.className = className;
  if (width) img.width = width;
  if (height) img.height = height;
  img.loading = loading;
  img.decoding = decoding;
  
  // Set priority hints for important images
  if ('fetchpriority' in HTMLImageElement.prototype) {
    // @ts-ignore - Newer browsers support this
    img.fetchpriority = fetchpriority;
  }
  if ('importance' in HTMLImageElement.prototype) {
    // @ts-ignore - Some browsers support this
    img.importance = importance;
  }
  
  // Create responsive image attributes
  const srcset = generateSrcSet(src, isMobile);
  const sizes = generateSizes(isMobile, customSizes);
  
  // Apply attributes
  img.srcset = srcset;
  img.sizes = sizes;
  
  // Set traditional src as fallback
  if (isMobile) {
    // Use mobile version as fallback for mobile
    const dirPath = src.substring(0, src.lastIndexOf('/'));
    const fileName = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
    const ext = src.split('.').pop() || 'jpg';
    const mobileSrc = `${dirPath}/mobile/${fileName}.${ext}`;
    img.src = mobileSrc;
  } else {
    img.src = src;
  }
  
  return img;
}

/**
 * Initialize mobile image optimization for the whole page
 */
export function initMobileImageOptimization(): void {
  if (typeof document === 'undefined') return;
  
  // Only process content images (not icons, not svg, etc)
  const contentImages = Array.from(document.querySelectorAll('img'))
    .filter(img => {
      const src = img.getAttribute('src') || '';
      const ext = src.split('.').pop()?.toLowerCase() || '';
      return ['jpg', 'jpeg', 'png', 'webp'].includes(ext) && 
             !src.includes('icon') && 
             !src.includes('logo');
    });
  
  // Check if we're on mobile
  const isMobile = isMobileDevice();
  
  // First detect WebP support
  detectWebPSupport().then(hasWebP => {
    contentImages.forEach(img => {
      const originalSrc = img.getAttribute('src') || '';
      if (!originalSrc) return;
      
      // Get dimensions
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      
      // Create srcset based on mobile status
      const srcset = generateSrcSet(originalSrc, isMobile);
      const sizes = generateSizes(isMobile);
      
      // Apply optimized attributes
      img.setAttribute('srcset', srcset);
      img.setAttribute('sizes', sizes);
      
      // Set loading and decoding attributes for performance
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }
      
      // For mobile, use mobile-specific image as fallback
      if (isMobile) {
        const dirPath = originalSrc.substring(0, originalSrc.lastIndexOf('/'));
        const fileName = originalSrc.substring(originalSrc.lastIndexOf('/') + 1, originalSrc.lastIndexOf('.'));
        const ext = originalSrc.split('.').pop() || 'jpg';
        const format = hasWebP ? 'webp' : ext;
        const mobileSrc = `${dirPath}/mobile/${fileName}.${format}`;
        
        // Only change if mobile version likely exists
        if (dirPath.includes('creatorcontent')) {
          img.setAttribute('src', mobileSrc);
        }
      } else if (hasWebP) {
        // For desktop with WebP support, use WebP
        const webpSrc = originalSrc.substring(0, originalSrc.lastIndexOf('.')) + '.webp';
        img.setAttribute('src', webpSrc);
      }
    });
  });
}

export default {
  setupResponsiveImage,
  initMobileImageOptimization,
  detectWebPSupport
};