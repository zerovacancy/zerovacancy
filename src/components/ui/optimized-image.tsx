import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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
    
    // Set up intersection observer for better performance
    if (imgRef.current && !priority) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '200px', // Start loading when image is 200px from viewport
          threshold: 0.01
        }
      );
      
      observerRef.current.observe(imgRef.current);
      return () => observerRef.current?.disconnect();
    } else {
      setIsVisible(true);
    }
  }, [priority]);

  // Create WebP version path from original
  const getWebPPath = (originalPath: string) => {
    // Don't process urls with query parameters
    if (originalPath.includes('?')) return null;
    
    const extension = originalPath.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      return null;
    }
    return originalPath.replace(new RegExp(`\\.${extension}$`), '.webp');
  };

  // Create responsive srcSet
  const getSrcSet = (imagePath: string) => {
    // Don't create srcset for SVGs or data URLs
    if (imagePath.endsWith('.svg') || imagePath.startsWith('data:')) {
      return undefined;
    }
    
    // Don't create srcset for external domains
    if (imagePath.startsWith('http') && !imagePath.includes('zerovacancy.ai')) {
      return undefined;
    }
    
    // For local images, we can generate srcset
    const qualityParam = isMobile ? 
      (quality === 'low' ? '?q=60' : quality === 'medium' ? '?q=70' : '?q=80') : 
      (quality === 'low' ? '?q=70' : quality === 'medium' ? '?q=80' : '?q=90');
    
    try {
      // Create a base path without extension
      const basePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
      const extension = imagePath.split('.').pop();
      
      // Generate srcSet with different widths
      return `${basePath}-480.${extension}${qualityParam} 480w,
              ${basePath}-768.${extension}${qualityParam} 768w,
              ${basePath}-1024.${extension}${qualityParam} 1024w,
              ${imagePath}${qualityParam} 1280w`;
    } catch (err) {
      // If there's any error in generating srcSet, return undefined
      return undefined;
    }
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
              alt={alt}
              width={width}
              height={height}
              loading={loading}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'max-w-full h-auto object-cover will-change-[opacity] transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                error ? 'opacity-0' : ''
              )}
              sizes={sizes || '100vw'}
              {...props}
            />
          </picture>
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'max-w-full h-auto object-cover will-change-[opacity] transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
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