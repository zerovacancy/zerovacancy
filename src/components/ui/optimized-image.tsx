import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImageAlt } from '@/utils/seo-utils';
import { 
  preloadImage, 
  getOptimizedImageUrl, 
  getOptimalImageFormat,
  createImagePlaceholder,
  generateSrcSet,
  calculateSizes
} from '@/utils/image-loader';
import { observeElement } from '@/utils/js-optimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  blurPlaceholder?: boolean;
  sizes?: string;
  quality?: 'low' | 'medium' | 'high';
  lcpCandidate?: boolean; // Flag for potential LCP image
  seoKeywords?: string[]; // SEO keywords for optimizing alt text
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholderColor?: string;
  withWebp?: boolean; // Automatically use WebP when available
  useSrcSet?: boolean; // Use srcSet for responsive images
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  blurPlaceholder = true,
  sizes,
  quality = 'medium',
  lcpCandidate = false,
  seoKeywords,
  objectFit = 'cover',
  placeholderColor,
  withWebp = true,
  useSrcSet = true,
  ...props
}: OptimizedImageProps) {
  // Manage image loading states
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority || lcpCandidate);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [placeholderSrc, setPlaceholderSrc] = useState<string>('');
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<() => void>(() => {});
  const generatedColor = useRef<string>(`hsl(${Math.floor(Math.random() * 360)}, 20%, 95%)`);

  // Calculate optimized image path with appropriate format
  const optimizedSrc = withWebp ? getOptimizedImageUrl(src) : src;
  const imageFormat = getOptimalImageFormat();
  
  // Get sizes for responsive image loading
  const responsiveSizes = sizes || calculateSizes({
    mobile: '100vw',
    tablet: '70vw', 
    desktop: '50vw'
  });
  
  // Get srcSet for responsive images if enabled
  const srcSet = useSrcSet ? generateSrcSet(optimizedSrc) : undefined;
  
  // Effect to create and set image placeholder
  useEffect(() => {
    const color = placeholderColor || generatedColor.current;
    const placeholder = createImagePlaceholder(src, color);
    setPlaceholderSrc(placeholder);
  }, [src, placeholderColor]);
  
  // Set up intersection observer for better performance
  useEffect(() => {
    // Don't observe if already visible or if it's a priority image
    if (isVisible || priority || lcpCandidate) return;
    
    // Define the loading strategy based on image importance
    const rootMargin = lcpCandidate ? '800px' : priority ? '500px' : '300px';
    
    if (containerRef.current) {
      // Use the shared intersection observer for performance
      const cleanup = observeElement(
        containerRef.current,
        (isIntersecting) => {
          if (isIntersecting) {
            setIsVisible(true);
          }
        },
        { rootMargin, threshold: 0.01 }
      );
      
      cleanupRef.current = cleanup;
      return cleanup;
    }
  }, [isVisible, priority, lcpCandidate]);
  
  // Load the image when visible
  useEffect(() => {
    if (!isVisible || !src) return;
    
    const loadImage = async () => {
      try {
        // Use our preloadImage utility to handle image loading
        await preloadImage(optimizedSrc, {
          priority: priority || lcpCandidate ? 'high' : 'medium',
          timeout: 10000
        });
        
        // Set the image source to trigger the actual image display
        setImageSrc(optimizedSrc);
        setIsLoaded(true);
      } catch (error) {
        console.warn(`Failed to load image: ${src}`, error);
        setError(true);
      }
    };
    
    loadImage();
  }, [src, optimizedSrc, isVisible, priority, lcpCandidate]);
  
  // Clear cleanup functions on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
  };

  // Fixed placeholder styles to show immediately without causing layout shifts
  const aspectRatioStyle = width && height 
    ? { aspectRatio: `${width} / ${height}` }
    : { aspectRatio: 'auto' };

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        ...aspectRatioStyle,
        backgroundColor: placeholderColor || generatedColor.current,
      }}
      ref={containerRef}
    >
      {/* Placeholder shown while image is loading */}
      {!isLoaded && !error && blurPlaceholder && (
        <div 
          className={cn(
            "absolute inset-0",
            isVisible ? "animate-pulse" : ""
          )}
          style={{ 
            width: '100%', 
            height: '100%',
            backgroundImage: `url(${placeholderSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Actual image - only loaded when visible */}
      {isVisible && imageSrc && (
        imageFormat === 'webp' || imageFormat === 'avif' ? (
          <picture>
            {/* Provide appropriate source for modern formats with fallbacks */}
            {imageFormat === 'avif' && (
              <source 
                type="image/avif" 
                srcSet={srcSet?.replace(/\.(jpe?g|png|webp)(\s+\d+w)/g, '.avif$2')} 
                sizes={responsiveSizes} 
              />
            )}
            {imageFormat === 'webp' && (
              <source 
                type="image/webp" 
                srcSet={srcSet?.replace(/\.(jpe?g|png)(\s+\d+w)/g, '.webp$2')} 
                sizes={responsiveSizes} 
              />
            )}
            <img
              src={imageSrc}
              alt={seoKeywords ? optimizeImageAlt(alt, seoKeywords) : alt}
              width={width}
              height={height}
              loading={loading}
              decoding="async"
              fetchPriority={(priority || lcpCandidate) ? "high" : "auto"}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'max-w-full h-auto w-full',
                `object-${objectFit}`,
                'transition-opacity duration-300 ease-in-out',
                isLoaded ? 'opacity-100' : 'opacity-0',
                error ? 'opacity-0' : ''
              )}
              sizes={responsiveSizes}
              srcSet={srcSet}
              {...props}
            />
          </picture>
        ) : (
          <img
            src={imageSrc}
            alt={seoKeywords ? optimizeImageAlt(alt, seoKeywords) : alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={(priority || lcpCandidate) ? "high" : "auto"}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'max-w-full h-auto w-full',
              `object-${objectFit}`,
              'transition-opacity duration-300 ease-in-out',
              isLoaded ? 'opacity-100' : 'opacity-0',
              error ? 'opacity-0' : ''
            )}
            sizes={responsiveSizes}
            srcSet={srcSet}
            {...props}
          />
        )
      )}
      
      {/* Show error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
});