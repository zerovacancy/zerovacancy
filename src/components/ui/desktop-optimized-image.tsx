import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Desktop-optimized image component that implements:
 * - Modern formats (WebP, AVIF) with fallbacks
 * - Explicit dimensions to prevent layout shift
 * - Aspect ratio containers for responsive sizing
 * - Intersection Observer for progressive loading
 * - Hardware acceleration for animations
 */
interface DesktopOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
}

export function DesktopOptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio = '16:9',
  className = '',
  containerClassName = '',
  priority = false,
  loading = 'lazy',
  onLoad,
}: DesktopOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate aspect ratio padding
  const getAspectRatioPadding = (): string => {
    if (width && height) {
      return `${(height / width) * 100}%`;
    }
    
    // Parse from string like '16:9'
    if (aspectRatio.includes(':')) {
      const [w, h] = aspectRatio.split(':').map(Number);
      return `${(h / w) * 100}%`;
    }
    
    // Default to 16:9
    return '56.25%';
  };
  
  // Generate modern format URLs
  const getImageUrls = (originalSrc: string) => {
    // Don't process data URLs
    if (originalSrc.startsWith('data:')) {
      return { original: originalSrc };
    }
    
    // Extract file extension and base path
    const extension = originalSrc.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      return { original: originalSrc };
    }
    
    const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
    
    return {
      original: originalSrc,
      webp: `${basePath}.webp`,
      avif: `${basePath}.avif`
    };
  };
  
  // Set up intersection observer for progressive loading
  useEffect(() => {
    // Skip for priority images or if already visible
    if (priority || isVisible) {
      setIsVisible(true);
      return;
    }
    
    // Create and configure intersection observer
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading before visible
        threshold: 0.01
      }
    );
    
    // Observe the container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [priority, isVisible]);
  
  // Handle image loading
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const imageUrls = getImageUrls(src);
  const aspectRatioPadding = getAspectRatioPadding();
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'img-container overflow-hidden relative',
        containerClassName
      )}
      style={{
        paddingBottom: aspectRatioPadding,
        width: width ? `${width}px` : '100%',
      }}
      data-loaded={isLoaded ? 'true' : 'false'}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Progressive image loading */}
      {isVisible && (
        <picture>
          {imageUrls.avif && <source srcSet={imageUrls.avif} type="image/avif" />}
          {imageUrls.webp && <source srcSet={imageUrls.webp} type="image/webp" />}
          <img
            ref={imgRef}
            src={imageUrls.original}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={handleLoad}
            className={cn(
              'w-full h-full object-cover transform-gpu',
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
          />
        </picture>
      )}
    </div>
  );
}