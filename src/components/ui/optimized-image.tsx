import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Create WebP version path from original
  const getWebPPath = (originalPath: string) => {
    const extension = originalPath.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      return null;
    }
    return originalPath.replace(new RegExp(`\\.${extension}$`), '.webp');
  };

  const webpSrc = getWebPPath(src);
  
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

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width} / ${height}` : 'auto',
      }}
    >
      {/* Placeholder/skeleton shown while image is loading */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" 
          style={{ 
            width: '100%', 
            height: '100%' 
          }}
        />
      )}
      
      {webpSrc ? (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'max-w-full h-auto object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              error ? 'opacity-0' : ''
            )}
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
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'max-w-full h-auto object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            error ? 'opacity-0' : ''
          )}
          {...props}
        />
      )}
      
      {/* Show error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
}