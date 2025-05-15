
import React, { useState, useEffect, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";
import { cn } from '@/lib/utils';
import { useStableViewportHeight } from '@/utils/web-vitals';

// Standard thumbnail dimensions for consistent rendering
const THUMBNAIL_DIMENSIONS = {
  width: 300,
  height: 300,
  aspectRatio: '1/1',
  // Mobile-specific dimensions
  mobile: {
    width: 120,
    height: 120,
    aspectRatio: '1/1'
  }
};

interface PortfolioGalleryProps {
  images: string[];
  creatorName: string;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  isMobile: boolean;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  images,
  creatorName,
  loadedImages,
  imageRef,
  isMobile
}) => {
  // Use stable viewport height hook to sync with Hero component strategy
  const { isStabilized: viewportStabilized, windowHeight } = useStableViewportHeight();
  
  // Thumbnail placeholder color - matching the overall system
  const placeholderColor = '#f5f5f7';
  
  // Pre-compute dimensions for all thumbnails
  const dimensions = isMobile ? THUMBNAIL_DIMENSIONS.mobile : THUMBNAIL_DIMENSIONS;
  
  // Track container dimensions for precise layout calculations
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isStabilized, setIsStabilized] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Sync with viewport stabilization status
  useEffect(() => {
    if (viewportStabilized && !isStabilized) {
      // Short delay to ensure viewport measurements are applied
      const timeoutId = setTimeout(() => {
        setIsStabilized(true);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [viewportStabilized, isStabilized]);
  
  // Enhanced container size tracking with ResizeObserver
  useEffect(() => {
    if (!galleryRef.current) return;
    
    // Track animation frame and timeout IDs for proper cleanup
    let rafId: number | null = null;
    let stabilityTimeoutId: number | null = null;
    
    // Initialize container measurement immediately to reduce layout shifts
    const initialWidth = galleryRef.current.offsetWidth;
    const initialHeight = galleryRef.current.offsetHeight;
    
    if (initialWidth > 0 && initialHeight > 0) {
      setContainerSize({ width: initialWidth, height: initialHeight });
      
      // Initialize CSS variables immediately to prevent CLS
      galleryRef.current.style.setProperty('--gallery-width', `${initialWidth}px`);
      galleryRef.current.style.setProperty('--gallery-height', `${initialHeight}px`);
      galleryRef.current.style.setProperty('--thumbnail-width', 
        `${Math.floor((initialWidth - 24) / 3)}px`);
        
      // Store viewport height as CSS variable for consistent calculations
      galleryRef.current.style.setProperty('--vh', `${windowHeight * 0.01}px`);
    }
    
    // Set up ResizeObserver for dynamic size tracking
    const resizeObserver = new ResizeObserver(entries => {
      // Cancel any existing animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame to batch size updates with render cycle
      rafId = requestAnimationFrame(() => {
        // Process all entries (typically just one for our gallery)
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          
          // Only update dimensions if there's a significant change to prevent render thrashing
          if (
            Math.abs(containerSize.width - width) > 2 || 
            Math.abs(containerSize.height - height) > 2
          ) {
            setContainerSize({ width, height });
            
            // Set CSS custom properties for thumbnail calculations
            if (galleryRef.current) {
              galleryRef.current.style.setProperty('--gallery-width', `${width}px`);
              galleryRef.current.style.setProperty('--gallery-height', `${height}px`);
              galleryRef.current.style.setProperty('--thumbnail-width', 
                `${Math.floor((width - 24) / 3)}px`); // Accounting for gaps (2 × 12px)
            }
          }
        }
        
        // Clear animation frame reference
        rafId = null;
      });
      
      // Mark gallery as stabilized after initial measurement and a short delay
      if (!isStabilized) {
        // Clear any existing timeout
        if (stabilityTimeoutId !== null) {
          clearTimeout(stabilityTimeoutId);
        }
        
        // Set a short timeout to ensure we've stabilized
        stabilityTimeoutId = window.setTimeout(() => {
          setIsStabilized(true);
          stabilityTimeoutId = null;
        }, 100);
      }
    });
    
    // Start observing the container
    resizeObserver.observe(galleryRef.current);
    
    // Clean up resources on unmount
    return () => {
      resizeObserver.disconnect();
      
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      if (stabilityTimeoutId !== null) {
        clearTimeout(stabilityTimeoutId);
      }
    };
  }, [containerSize.width, containerSize.height, isStabilized, windowHeight]);
  
  return (
    <div 
      ref={galleryRef}
      className={cn(
        "grid grid-cols-3 gap-3 portfolio-gallery-container hardware-accelerated",
        !isStabilized && "opacity-0 pre-stabilized", // Hide until fully stabilized to prevent layout shifts
        isStabilized && "opacity-100 stabilized" // Full opacity once stable
      )}
      style={{
        // Explicitly set container dimensions to prevent shifts
        display: 'grid',
        // Use precise grid template with CSS variables to prevent shifts
        gridTemplateColumns: containerSize.width ? 
          `repeat(3, ${Math.floor((containerSize.width - 24) / 3)}px)` : 
          'repeat(3, 1fr)',
        // Fixed gap to prevent shifts
        gap: '12px',
        // Hardware acceleration with translate3d for better performance
        transform: `translate3d(0, 0, 0)`,
        // Improve rendering with backface visibility
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Only hint for transform changes - better battery performance
        willChange: isStabilized ? 'transform' : 'transform, opacity',
        // Container sizing with explicit custom properties
        width: '100%',
        // Pre-allocate height based on calculated dimensions to prevent CLS
        minHeight: isStabilized ? 'auto' : `${Math.ceil(images.length / 3) * (dimensions.height + 12)}px`,
        // Set CSS variables for child calculations
        '--gallery-width': `${containerSize.width}px`,
        '--gallery-height': `${containerSize.height}px`,
        '--vh': `${windowHeight * 0.01}px`,
        '--thumbnail-width': containerSize.width ? 
          `${Math.floor((containerSize.width - 24) / 3)}px` : // Accounting for gaps
          `${(dimensions.width / 3) - 8}px`, // Fallback calculation
        // Prevent forced recalculations
        contain: 'layout paint style',
        // Ensure consistent box sizing
        boxSizing: 'border-box',
        // Only transition opacity, not layout properties
        transition: 'opacity 300ms ease-in-out',
        // Prevents margin collapse
        margin: 0,
        // Appropriate padding for alignment
        padding: 0
      }}
      data-stabilized={isStabilized ? 'true' : 'false'}
      data-viewport-stabilized={viewportStabilized ? 'true' : 'false'}
      data-container-width={containerSize.width}
      data-container-height={containerSize.height}
      data-thumbnail-count={images.length}
    >
      {images.map((image, i) => (
        <Dialog key={i}>
          <DialogTrigger asChild>
            <div 
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg group hardware-accelerated portfolio-thumbnail-container",
                !isStabilized && "pre-stabilized", // For targeted styling before stable
                isStabilized && "stabilized" // For targeted styling after stable
              )}
              style={{
                // Explicit aspect ratio container for stability
                position: 'relative',
                aspectRatio: dimensions.aspectRatio,
                // Use calculated width from container if available
                width: containerSize.width ? 
                  `var(--thumbnail-width, ${Math.floor((containerSize.width - 24) / 3)}px)` : 
                  '100%',
                // Fixed height to prevent CLS
                height: 0,
                paddingBottom: '100%',
                // Hardware acceleration with translate3d
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                // Only use will-change sparingly on properties that will actually change
                willChange: isStabilized ? 'transform' : 'opacity, transform',
                // Only animate non-layout-affecting properties
                transition: 'opacity 300ms ease, transform 300ms ease',
                // Prevent content from affecting layout
                overflow: 'hidden',
                // Add fixed border radius
                borderRadius: '0.5rem',
                // Prevent any pointer events from affecting layout
                touchAction: 'manipulation',
                // Background color while loading
                backgroundColor: placeholderColor,
                // Prevent margin collapse
                margin: 0,
                // Box sizing
                boxSizing: 'border-box',
                // Ensure thumbnails always have predictable size
                minWidth: `${dimensions.width / 4}px`,
                minHeight: `${dimensions.height / 4}px`,
                // Stacking context
                zIndex: 1,
                // Add precise size calculation
                ...(containerSize.width && {
                  // Fix exact dimensions when container size is known
                  width: `calc((${containerSize.width}px - 24px) / 3)`,
                  maxWidth: `calc((${containerSize.width}px - 24px) / 3)`,
                  height: 0, // Height controlled by padding-bottom for aspect ratio
                }),
                // Apply subtle animation for stabilized state
                opacity: isStabilized ? 1 : 0.95
              }}
              data-index={i}
              data-dimensions={`${dimensions.width}x${dimensions.height}`}
            >
              {/* Empty div placeholder with explicit dimensions */}
              <div 
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: placeholderColor,
                  zIndex: 1
                }}
              />
              
              {/* Enhanced image with explicit dimensions */}
              <img 
                ref={imageRef}
                src={loadedImages.has(image) ? image : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                data-src={image}
                alt={`${creatorName}'s work ${i + 1}`} 
                className={cn(
                  "object-cover transform-gpu",
                  // Only transition opacity, not positioning properties
                  "transition-opacity duration-300 ease-in-out",
                  !loadedImages.has(image) && "opacity-0",
                  "portfolio-thumbnail-image"
                )}
                loading="lazy"
                // Explicit dimensions to prevent CLS
                width={dimensions.width}
                height={dimensions.height}
                // Device-specific sizes
                sizes={`(max-width: 768px) ${dimensions.mobile.width}px, ${dimensions.width}px`}
                // Proper loading priority
                fetchpriority={i < 3 ? "high" : "auto"}
                style={{
                  // Positioned absolutely to prevent layout shifts
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  // Fill container precisely
                  width: '100%',
                  height: '100%',
                  // Object fit ensures proper thumbnail display
                  objectFit: 'cover',
                  objectPosition: 'center',
                  // Hardware acceleration
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  // Prevent any transitions that affect layout
                  transitionProperty: 'opacity',
                  // Ensure stacking context
                  zIndex: 2
                }}
                data-index={i}
              />
              
              {/* Enhanced overlay with hardware acceleration */}
              <div 
                className="absolute inset-0 flex items-center justify-center hardware-accelerated"
                style={{
                  // Background with fixed opacity
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  // Only transition opacity
                  transition: 'opacity 300ms ease',
                  // Hardware acceleration
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  // Ensure stacking context
                  zIndex: 3
                }}
              >
                <Image className="w-5 h-5 text-white hardware-accelerated" style={{
                  // Prevent icon from causing layout shifts
                  width: '20px',
                  height: '20px',
                  // Hardware acceleration
                  transform: 'translateZ(0)'
                }} />
              </div>
            </div>
          </DialogTrigger>
          
          {/* Image preview dialog */}
          <DialogContent 
            className="p-0 bg-transparent border-0 max-w-4xl w-[95vw]"
            style={{
              // Pre-allocate space for dialog content
              aspectRatio: '4/3',
              // Hardware acceleration
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              // Prevent content from affecting layout
              contain: 'layout paint style'
            }}
          >
            <DialogTitle className="sr-only">Portfolio Image Preview</DialogTitle>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute z-50 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors right-4 top-4 p-2"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            <div 
              className="aspect-ratio-container" 
              style={{
                // Pre-defined space with aspect ratio to prevent layout shifts
                position: 'relative',
                width: '100%',
                height: 0,
                paddingBottom: '75%', // 4:3 aspect ratio
                overflow: 'hidden'
              }}
            >
              <img 
                src={image}
                alt={`${creatorName}'s work ${i + 1} (enlarged)`}
                className="w-full h-full object-contain rounded-lg shadow-xl hardware-accelerated"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  maxHeight: isMobile ? 
                    `calc(var(--vh, 1vh) * 85)` : // Use viewport height variable
                    '80vh',
                  // Hardware acceleration
                  transform: 'translateZ(0)',
                  // Explicit object fit mode
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                // Optimize loading
                loading="eager"
                // High priority for modal content
                fetchpriority="high"
                // Explicit dimensions to prevent CLS
                width={800}
                height={600}
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
