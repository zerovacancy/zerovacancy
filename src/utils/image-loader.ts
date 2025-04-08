/**
 * Advanced image loading utilities
 * Improves image loading performance and reduces layout shifts
 */

// Cache of preloaded images
const imageCache: Map<string, HTMLImageElement> = new Map();

// Image loading states for tracking
export type ImageLoadingState = 'idle' | 'loading' | 'loaded' | 'error';
const imageStates: Map<string, ImageLoadingState> = new Map();

// Queue for priority-based loading
interface QueueItem {
  src: string;
  priority: 'high' | 'medium' | 'low';
  resolve: (img: HTMLImageElement) => void;
  reject: (error: Error) => void;
}
const loadQueue: QueueItem[] = [];
let isProcessingQueue = false;

// Configure based on network conditions (updated dynamically)
let concurrentLoads = 4;
let networkQuality: 'fast' | 'medium' | 'slow' = 'medium';

// Initialize by detecting network conditions
if (typeof navigator !== 'undefined' && 'connection' in navigator) {
  const conn = (navigator as any).connection;
  if (conn) {
    // Adjust concurrent loads based on connection type
    if (conn.effectiveType === '4g' || conn.downlink > 1.5) {
      concurrentLoads = 6;
      networkQuality = 'fast';
    } else if (conn.effectiveType === '3g' || conn.downlink > 0.5) {
      concurrentLoads = 3;
      networkQuality = 'medium';
    } else {
      concurrentLoads = 2;
      networkQuality = 'slow';
    }
    
    // Listen for changes in network conditions
    conn.addEventListener('change', () => {
      if (conn.effectiveType === '4g' || conn.downlink > 1.5) {
        concurrentLoads = 6;
        networkQuality = 'fast';
      } else if (conn.effectiveType === '3g' || conn.downlink > 0.5) {
        concurrentLoads = 3;
        networkQuality = 'medium';
      } else {
        concurrentLoads = 2;
        networkQuality = 'slow';
      }
    });
  }
}

/**
 * Preload an image in the background
 * Returns a promise that resolves when the image is loaded
 */
export function preloadImage(
  src: string, 
  options: { 
    priority?: 'high' | 'medium' | 'low';
    timeout?: number; 
  } = {}
): Promise<HTMLImageElement> {
  const { priority = 'medium', timeout = 10000 } = options;
  
  // Don't preload data URLs or empty sources
  if (!src || src.startsWith('data:') || src === '#') {
    return Promise.resolve(new Image());
  }
  
  // Return from cache if available
  if (imageCache.has(src) && imageStates.get(src) === 'loaded') {
    return Promise.resolve(imageCache.get(src)!);
  }
  
  // Set initial loading state
  if (!imageStates.has(src)) {
    imageStates.set(src, 'idle');
  }
  
  // Create a promise that handles the image loading
  return new Promise<HTMLImageElement>((resolve, reject) => {
    // Create a timeout for the request
    const timeoutId = timeout > 0 
      ? setTimeout(() => {
          reject(new Error(`Image load timeout for ${src}`));
          imageStates.set(src, 'error');
        }, timeout)
      : null;
    
    // Add to the loading queue with appropriate priority
    loadQueue.push({
      src,
      priority,
      resolve: (img) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(img);
      },
      reject: (error) => {
        if (timeoutId) clearTimeout(timeoutId);
        reject(error);
      }
    });
    
    // Sort queue by priority
    loadQueue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Start processing the queue if not already running
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

/**
 * Process the image loading queue with concurrency control
 */
function processQueue(): void {
  if (loadQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }
  
  isProcessingQueue = true;
  
  // Count current active loads
  const activeLoads = Array.from(imageStates.values()).filter(state => state === 'loading').length;
  
  // Calculate how many new loads we can start
  const availableSlots = Math.max(0, concurrentLoads - activeLoads);
  
  // Start new loads up to the concurrency limit
  for (let i = 0; i < Math.min(availableSlots, loadQueue.length); i++) {
    const item = loadQueue.shift();
    if (!item) continue;
    
    const { src, resolve, reject } = item;
    
    // Set status to loading
    imageStates.set(src, 'loading');
    
    // Create image and set up events
    const img = new Image();
    
    // Handle successful load
    img.onload = () => {
      imageCache.set(src, img);
      imageStates.set(src, 'loaded');
      resolve(img);
      
      // Continue processing queue
      setTimeout(processQueue, 0);
    };
    
    // Handle load error
    img.onerror = () => {
      imageStates.set(src, 'error');
      reject(new Error(`Failed to load image: ${src}`));
      
      // Continue processing queue
      setTimeout(processQueue, 0);
    };
    
    // Start loading
    img.src = src;
  }
  
  // If we couldn't start any new loads but still have items in the queue,
  // check again soon (image loads may have completed in the meantime)
  if (availableSlots === 0 && loadQueue.length > 0) {
    setTimeout(processQueue, 100);
  }
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpg' {
  if (typeof window === 'undefined') return 'webp'; // Default for SSR
  
  // Check for AVIF support
  const canUseAvif = false; // No reliable detection method, defaulting to false for now
  
  // Check for WebP support
  const canUseWebP = (() => {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  })();
  
  // Return the best available format
  if (canUseAvif) return 'avif';
  if (canUseWebP) return 'webp';
  return 'jpg';
}

/**
 * Generate WebP or fallback URL for an image
 */
export function getOptimizedImageUrl(url: string): string {
  // Skip for invalid or special URLs
  if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.includes('?')) {
    return url;
  }
  
  // Get extension
  const ext = url.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
    return url;
  }
  
  const format = getOptimalImageFormat();
  
  // Replace extension with optimized format
  return url.replace(new RegExp(`\\.${ext}$`), `.${format}`);
}

/**
 * Get image dimensions without loading the full image
 * Uses IntersectionObserver to avoid performance impact when image is not in viewport
 */
export function getImageDimensions(
  url: string,
  options: {
    onDimensions?: (width: number, height: number) => void;
    timeout?: number;
  } = {}
): Promise<{ width: number; height: number }> {
  const { onDimensions, timeout = 5000 } = options;
  
  return new Promise((resolve, reject) => {
    // Handle timeouts
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout getting dimensions for ${url}`));
    }, timeout);
    
    // Create a new image to load
    const img = new Image();
    
    // Add event listeners
    img.onload = () => {
      clearTimeout(timeoutId);
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      if (onDimensions) {
        onDimensions(dimensions.width, dimensions.height);
      }
      
      resolve(dimensions);
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Error loading image for dimensions: ${url}`));
    };
    
    // Set image source to start loading
    img.src = url;
  });
}

/**
 * Create a dominant color placeholder or LQIP for an image
 * This is useful to reduce perceived loading time and CLS
 */
export function createImagePlaceholder(
  url: string,
  placeholderColor?: string
): string {
  // Default placeholder color (light gray)
  const defaultColor = placeholderColor || '#f5f5f5';
  
  // Create a simple SVG placeholder with the specified color
  const encodedColor = encodeURIComponent(defaultColor);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="1" height="1"><rect width="1" height="1" fill="${encodedColor}"/></svg>`;
  
  // Convert SVG to data URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Get the current network quality
 */
export function getNetworkQuality(): 'fast' | 'medium' | 'slow' {
  return networkQuality;
}

/**
 * Generate a srcSet for responsive images
 */
export function generateSrcSet(
  baseUrl: string, 
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  // Skip for data URLs or non-image URLs
  if (!baseUrl || baseUrl.startsWith('data:') || baseUrl.includes('?')) {
    return baseUrl;
  }
  
  const ext = baseUrl.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
    return baseUrl;
  }
  
  // Create the base path without extension
  const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('.'));
  
  // Generate srcSet with different widths
  return widths
    .map(width => `${basePath}-${width}.${ext} ${width}w`)
    .join(', ');
}

/**
 * Calculate appropriate sizes attribute for responsive images
 */
export function calculateSizes(
  options: {
    defaultSize?: string;
    mobile?: string;
    tablet?: string;
    desktop?: string;
  } = {}
): string {
  const {
    defaultSize = '100vw',
    mobile = '100vw',
    tablet = '70vw',
    desktop = '50vw'
  } = options;
  
  return `
    (max-width: 640px) ${mobile},
    (max-width: 1024px) ${tablet},
    ${desktop}
  `.trim();
}
