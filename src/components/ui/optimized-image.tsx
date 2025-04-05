import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImageAlt } from '@/utils/seo-utils';

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
}

export function OptimizedImage({
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
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const placeholderColor = useRef(`hsl(${Math.floor(Math.random() * 360)}, 20%, 95%)`);

  // Determine if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // For LCP images or priority images, always load immediately
    if (priority || lcpCandidate) {
      setIsVisible(true);
      return;
    }
    
    // Set up intersection observer for better performance
    if (imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        {
          // Larger rootMargin for above-the-fold images for faster loading
          rootMargin: '300px', // Start loading when image is 300px from viewport
          threshold: 0.01
        }
      );
      
      observerRef.current.observe(imgRef.current);
      return () => observerRef.current?.disconnect();
    } else {
      setIsVisible(true);
    }
  }, [priority, lcpCandidate]);

  // Simplified WebP conversion - only use WebP for paths that already end in .webp
  const getWebPPath = (originalPath: string) => {
    // Only use paths that already end with .webp - no conversion
    // This ensures we only use WebP where it definitely exists
    if (originalPath.endsWith('.webp')) {
      return originalPath;
    }
    
    // For all other paths, don't try to convert to WebP
    return null;
  };

  // Extremely simplified srcSet - don't use srcSet at all for now
  const getSrcSet = (imagePath: string) => {
    // For development mode, don't use srcSet at all to ensure images load properly
    return undefined;
  };

  const webpSrc = getWebPPath(src);
  const srcSet = getSrcSet(src);
  const webpSrcSet = webpSrc ? getSrcSet(webpSrc) : undefined;
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
  };

  // Pre-load the image if it has priority
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
    }
  }, [priority, src]);

  // Fixed placeholder styles to show immediately without causing layout shifts
  const aspectRatioStyle = width && height 
    ? { aspectRatio: `${width} / ${height}` }
    : { aspectRatio: 'auto' };

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        ...aspectRatioStyle,
        backgroundColor: placeholderColor.current,
      }}
      ref={imgRef}
    >
      {/* Placeholder/skeleton shown while image is loading */}
      {!isLoaded && !error && blurPlaceholder && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" 
          style={{ 
            width: '100%', 
            height: '100%',
          }}
        />
      )}
      
      {/* Only load the actual image when it's near the viewport */}
      {isVisible && (
        webpSrc ? (
          <picture>
            {webpSrcSet && <source srcSet={webpSrcSet} type="image/webp" sizes={sizes || '100vw'} />}
            {srcSet && <source srcSet={srcSet} sizes={sizes || '100vw'} />}
            <img
              src={src}
              alt={seoKeywords ? optimizeImageAlt(alt, seoKeywords) : alt}
              width={width}
              height={height}
              loading={loading}
              decoding="async"
              fetchPriority={(priority || lcpCandidate) ? "high" : "auto"}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'max-w-full h-auto object-cover will-change-[opacity] transition-opacity duration-300',
                'opacity-100', // Always show images
                error ? 'opacity-0' : ''
              )}
              sizes={sizes || '100vw'}
              {...props}
            />
          </picture>
        ) : (
          <img
            src={src}
            alt={seoKeywords ? optimizeImageAlt(alt, seoKeywords) : alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={(priority || lcpCandidate) ? "high" : "auto"}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'max-w-full h-auto object-cover will-change-[opacity] transition-opacity duration-300',
              'opacity-100', // Always show images
              error ? 'opacity-0' : ''
            )}
            sizes={sizes || '100vw'}
            srcSet={srcSet}
            {...props}
          />
        )
      )}
      
      {/* Show error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span>Failed to load</span>
        </div>
      )}
    </div>
  );
}