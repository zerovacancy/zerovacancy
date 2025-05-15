import React, { useState, useEffect, useRef, memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Creator {
  name: string;
  image: string;
}

interface CreatorMediaProps {
  creator: Creator;
  onImageLoad?: (imageSrc: string) => void;
  onVideoLoad?: () => void;
}

// Enhanced pre-defined image dimensions for each creator to prevent CLS
// These are carefully set dimensions that match the actual image proportions
// while ensuring consistent layout across the application
const CREATOR_DIMENSIONS = {
  // Emily Johnson's dimensions with explicit device breakpoints
  'Emily Johnson': { 
    width: 400, 
    height: 300, 
    aspectRatio: '4/3',
    // Mobile-specific dimensions
    mobile: {
      width: 300,
      height: 225,
      aspectRatio: '4/3'
    },
    // Tablet-specific dimensions
    tablet: {
      width: 350,
      height: 262.5,
      aspectRatio: '4/3'
    },
    // Work examples dimensions
    workExamples: [
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' }
    ]
  },
  
  // Jane Cooper's dimensions with explicit device breakpoints
  'Jane Cooper': { 
    width: 400, 
    height: 300, 
    aspectRatio: '4/3',
    // Mobile-specific dimensions
    mobile: {
      width: 300,
      height: 225,
      aspectRatio: '4/3'
    },
    // Tablet-specific dimensions
    tablet: {
      width: 350,
      height: 262.5,
      aspectRatio: '4/3'
    },
    // Work examples dimensions
    workExamples: [
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' }
    ]
  },
  
  // Michael Brown's dimensions with explicit device breakpoints
  'Michael Brown': { 
    width: 400, 
    height: 300, 
    aspectRatio: '4/3',
    // Mobile-specific dimensions
    mobile: {
      width: 300,
      height: 225,
      aspectRatio: '4/3'
    },
    // Tablet-specific dimensions
    tablet: {
      width: 350,
      height: 262.5,
      aspectRatio: '4/3'
    },
    // Work examples dimensions
    workExamples: [
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' }
    ]
  },
  
  // Default dimensions as fallback - critical for preventing CLS with unexpected data
  'default': { 
    width: 400, 
    height: 300, 
    aspectRatio: '4/3',
    // Mobile-specific dimensions
    mobile: {
      width: 300,
      height: 225,
      aspectRatio: '4/3'
    },
    // Tablet-specific dimensions
    tablet: {
      width: 350,
      height: 262.5,
      aspectRatio: '4/3'
    },
    // Work examples dimensions - default to standard aspect ratio
    workExamples: [
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' },
      { width: 800, height: 600, aspectRatio: '4/3' }
    ]
  }
};

// Enhanced pre-calculate media mapping with explicit file sizes and dimensions
// This prevents layout shifts by ensuring correct precomputed dimensions
const MEDIA_MAPPING = {
  // Emily Johnson media details
  'Emily Johnson': { 
    type: 'image',
    // Primary sources with dimensions
    src: '/emilyprofilephoto.webp',
    mobileSrc: '/emilyprofilephoto.webp',
    width: CREATOR_DIMENSIONS['Emily Johnson'].width,
    height: CREATOR_DIMENSIONS['Emily Johnson'].height,
    // Size metadata to allow for better loading prioritization
    fileSize: 42560, // Size in bytes for webpack optimization hints
    mobileFileSize: 24320, // Size in bytes
    // Explicit srcSet dimensions to prevent recalculations
    srcSet: [
      { src: '/emilyprofilephoto.webp', width: 400, size: '400w' },
      { src: '/emilyprofilephoto.webp', width: 300, size: '300w' } // Use same image for mobile
    ],
    // Preloaded sizes attribute
    sizes: '(max-width: 768px) 300px, 400px',
    // Preload hint (true for above-the-fold content)
    preload: true,
    // Placeholder for faster rendering (simplified data URL)
    placeholderColor: '#f5f5f7'
  },
  
  // Jane Cooper media details
  'Jane Cooper': { 
    type: 'image',
    // Primary sources with dimensions
    src: '/janeprofile.png',
    mobileSrc: '/janeprofile.png',
    width: CREATOR_DIMENSIONS['Jane Cooper'].width,
    height: CREATOR_DIMENSIONS['Jane Cooper'].height,
    // Size metadata
    fileSize: 58880, // Size in bytes
    mobileFileSize: 34816, // Size in bytes
    // Explicit srcSet dimensions
    srcSet: [
      { src: '/janeprofile.png', width: 400, size: '400w' },
      { src: '/creatorcontent/jane-cooper/mobile/work-1.webp', width: 300, size: '300w' }
    ],
    // Preloaded sizes attribute
    sizes: '(max-width: 768px) 300px, 400px',
    // Preload hint
    preload: true,
    // Placeholder for faster rendering
    placeholderColor: '#f5f5f7'
  },
  
  // Michael Brown media details
  'Michael Brown': { 
    type: 'image', // Changed to image to fix missing profile
    // Primary sources with dimensions
    src: '/creatorcontent/michael-brown/work-1.webp', // Use a known good image
    mobileSrc: '/creatorcontent/michael-brown/mobile/work-1.webp',
    videoSrc: '/michaelprofile.mov',
    fallback: '/creatorcontent/michael-brown/work-1.jpg',
    width: CREATOR_DIMENSIONS['Michael Brown'].width,
    height: CREATOR_DIMENSIONS['Michael Brown'].height,
    // Size metadata
    fileSize: 51200, // Size in bytes
    mobileFileSize: 30720, // Size in bytes
    // Explicit srcSet dimensions
    srcSet: [
      { src: '/creatorcontent/michael-brown/work-1.webp', width: 400, size: '400w' },
      { src: '/creatorcontent/michael-brown/mobile/work-1.webp', width: 300, size: '300w' }
    ],
    // Preloaded sizes attribute
    sizes: '(max-width: 768px) 300px, 400px',
    // Preload hint
    preload: true,
    // Placeholder for faster rendering
    placeholderColor: '#f5f5f7'
  }
};

/**
 * Enhanced media getter that uses preloaded dimensions and device-specific optimizations
 * to prevent CLS (Cumulative Layout Shift)
 */
export const getMedia = (creator: Creator, isMobile: boolean) => {
  // Use the pre-defined mapping with comprehensive media information
  const mediaConfig = MEDIA_MAPPING[creator.name as keyof typeof MEDIA_MAPPING];
  
  // If no config is found, use a safe fallback with pre-computed dimensions 
  // This ensures even unknown creators won't cause layout shifts
  if (!mediaConfig) {
    const defaultDimensions = CREATOR_DIMENSIONS.default;
    
    // Comprehensive default object with all necessary properties
    return { 
      type: 'image', 
      src: creator.image,
      mobileSrc: creator.image,
      // Use device-specific dimensions to prevent CLS
      width: isMobile ? defaultDimensions.mobile.width : defaultDimensions.width,
      height: isMobile ? defaultDimensions.mobile.height : defaultDimensions.height,
      // Safe fallback values
      fileSize: 50000, // Average size estimate
      mobileFileSize: 30000,
      // Default sizes attribute
      sizes: '(max-width: 768px) 300px, 400px',
      // Default srcSet with image specified twice for different sizes
      srcSet: [
        { src: creator.image, width: defaultDimensions.width, size: `${defaultDimensions.width}w` },
        { src: creator.image, width: defaultDimensions.mobile.width, size: `${defaultDimensions.mobile.width}w` }
      ],
      // Don't preload by default to save bandwidth
      preload: false,
      // Default placeholder color
      placeholderColor: '#f5f5f7'
    };
  }
  
  // Special optimizations for mobile to prevent jitter and layout shifts
  if (isMobile) {
    // Create a mobile-optimized config that inherits from the base config
    return { 
      ...mediaConfig,
      // Always use image type on mobile, even if it's a video on desktop
      type: 'image', 
      // Use mobile-specific source if available
      src: mediaConfig.mobileSrc || mediaConfig.src,
      // Use mobile-specific dimensions if available
      width: CREATOR_DIMENSIONS[creator.name as keyof typeof CREATOR_DIMENSIONS]?.mobile?.width || mediaConfig.width,
      height: CREATOR_DIMENSIONS[creator.name as keyof typeof CREATOR_DIMENSIONS]?.mobile?.height || mediaConfig.height,
      // Use mobile-specific file size for optimization hints
      fileSize: mediaConfig.mobileFileSize || mediaConfig.fileSize,
      // Ensure correct srcSet filtering for mobile
      srcSet: mediaConfig.srcSet?.filter(item => 
        // Only include items appropriate for mobile
        item.width <= (CREATOR_DIMENSIONS[creator.name as keyof typeof CREATOR_DIMENSIONS]?.mobile?.width || 400)
      )
    };
  }
  
  // For desktop, return the full configuration with all media options
  return mediaConfig;
};

// Memoized component to prevent unnecessary rerenders
export const CreatorMedia = memo(({ 
  creator, 
  onImageLoad,
  onVideoLoad
}: CreatorMediaProps) => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isStable, setIsStable] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  
  // Get media with isMobile parameter to make correct decisions
  const media = getMedia(creator, isMobile);
  
  // Get dimensions from pre-defined values
  const dimensions = CREATOR_DIMENSIONS[creator.name as keyof typeof CREATOR_DIMENSIONS] || 
                     CREATOR_DIMENSIONS.default;
  
  // Enhanced ResizeObserver implementation with debouncing and stability improvements
  useEffect(() => {
    if (!mediaRef.current) return;
    
    let timeoutId: number | null = null;
    let animationFrameId: number | null = null;
    
    // Setup stable initial dimensions immediately to prevent CLS
    const initialWidth = mediaRef.current.offsetWidth;
    const initialHeight = Math.round(initialWidth * (dimensions.height / dimensions.width));
    
    // Apply initial dimensions immediately to reduce "wobble"
    if (initialWidth > 0 && initialHeight > 0 && 
        (containerSize.width === 0 || Math.abs(containerSize.width - initialWidth) > 2)) {
      setContainerSize({ width: initialWidth, height: initialHeight });
    }
    
    // Set as stable after initial render
    if (!isStable) {
      // Force a reflow to ensure dimensions are applied
      void mediaRef.current.offsetHeight;
      
      // Mark as stable almost immediately to prevent visible opacity transition
      // But with just enough delay to ensure the browser has applied styles
      requestAnimationFrame(() => {
        setIsStable(true);
      });
    }
    
    // Create the ResizeObserver instance with debouncing for better performance
    const resizeObserver = new ResizeObserver(entries => {
      // Cancel any existing timeout
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      
      // Cancel any existing animation frame
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      
      // Use requestAnimationFrame for better performance
      animationFrameId = window.requestAnimationFrame(() => {
        for (const entry of entries) {
          // Get new dimensions
          const newWidth = entry.contentRect.width;
          const newHeight = Math.round(newWidth * (dimensions.height / dimensions.width));
          
          // Only update if there's a significant change to prevent needless rerenders
          // The threshold is increased to 2px to further reduce updates
          if (
            Math.abs(containerSize.width - newWidth) > 2 || 
            Math.abs(containerSize.height - newHeight) > 2
          ) {
            // Use a short timeout to batch updates and reduce jank
            // But make it very short to ensure it happens quickly
            timeoutId = window.setTimeout(() => {
              setContainerSize({ width: newWidth, height: newHeight });
              timeoutId = null;
            }, 16); // ~1 frame at 60fps
          }
        }
        
        animationFrameId = null;
      });
    });
    
    // Start observing the container
    resizeObserver.observe(mediaRef.current);
    
    // Clean up all resources on unmount
    return () => {
      resizeObserver.disconnect();
      
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [containerSize.width, containerSize.height, dimensions.width, dimensions.height, isStable]);
  
  // Immediately notify about image in the effect to prevent CLS
  // This allows parent components to react before the actual load
  useEffect(() => {
    if (media.type === 'image' && onImageLoad) {
      // Notify immediately without timeout to further reduce CLS - timeout can cause render delay
      onImageLoad(isMobile ? (media.mobileSrc || media.src) : media.src);
    }
  }, [media.type, media.src, media.mobileSrc, isMobile, onImageLoad]);

  // Remove this effect as setMediaList and generateList don't exist in this component
  
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    if (onImageLoad) {
      onImageLoad(media.src);
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (onVideoLoad) {
      onVideoLoad();
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    // Try fallback if available
    if (media.fallback && !imageError) {
      const imgElement = event.target as HTMLImageElement;
      if (imgElement) {
        imgElement.src = media.fallback;
      }
    }
  };
  
  // Calculate aspect ratio padding percentage
  const aspectRatioPadding = `${(dimensions.height / dimensions.width) * 100}%`;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        "flex items-center justify-center",
        "h-full w-full transform-gpu",
        // Hardware acceleration classes
        "will-change-transform backface-hidden",
        // Only apply transition to opacity for CLS safety
        "transition-opacity duration-300",
        isStable ? "opacity-100" : "opacity-95", // Slight opacity change until stable
        // Add explicit class for easier debugging
        "creator-media-container"
      )}
      ref={mediaRef}
      data-testid="creator-media-container"
      data-creator-name={creator.name}
      data-dimensions={`${dimensions.width}x${dimensions.height}`}
      style={{
        // Explicitly set dimensions to prevent CLS - using aspect-ratio as fallback
        aspectRatio: dimensions.aspectRatio,
        // Calculate fixed height based on width-to-height ratio to prevent CLS
        // For mobile specifically, the 0 minHeight ensures proper parent container expansion
        minHeight: isMobile ? '0' : `${dimensions.height}px`,
        maxHeight: '100%',
        // Explicit width/height forced rendering can help prevent CLS
        width: '100%',
        height: 'auto',
        // Prevent parent animation/transition from affecting layout
        willChange: 'transform, opacity',
        // Create stacking context
        position: 'relative',
        zIndex: 1,
        // Force hardware acceleration for smoother rendering
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Use precise layout containment but avoid size containment (can cause CLS)
        contain: 'layout paint style',
        // Prevent overflows
        overflow: 'hidden',
        // Prevent any margin-based CLS
        margin: '0',
        padding: '0',
        // Set explicit box sizing
        boxSizing: 'border-box',
        // Ensure stable dimensions 
        maxWidth: '100%',
        // Add "content-visibility: auto" for better performance when off-screen
        contentVisibility: isStable ? 'auto' : 'visible',
        // Without this, some browsers can still have minor CLS during scroll
        overscrollBehavior: 'none'
      }}
      aria-label={`${creator.name} media container`}
    >
      {/* Enhanced placeholder div with exact dimensions to guarantee space reservation */}
      <div 
        aria-hidden="true"
        className="aspect-ratio-placeholder"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 0, // Height 0 with padding based on aspect ratio is more stable
          paddingBottom: aspectRatioPadding,
          backgroundColor: '#f7f7f7', // Light placeholder color
          zIndex: 1,
          // Add explicit containment to prevent the placeholder from causing CLS
          contain: 'strict',
          // Force hardware acceleration
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Prevent any margin collapse
          margin: 0,
          // Prevent any border expansion
          boxSizing: 'border-box',
          overflow: 'hidden',
          // Prevent animation or transition
          transition: 'none',
          animation: 'none'
        }}
        data-dimensions={`${dimensions.width}x${dimensions.height}`}
      />
      
      {/* Enhanced image rendering with strict CLS prevention - using preloaded dimensions */}
      <img 
        src={media.type === 'image' ? media.src : (media.fallback || '')}
        alt={`${creator.name} profile`}
        className={cn(
          "absolute inset-0 w-full h-full object-cover object-center",
          "transform-gpu backface-hidden will-change-transform",
          // Add transition for opacity but not for layout properties
          imageLoaded ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300 ease-in-out",
          // Add specific class for debugging
          "creator-media-image"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        // Force eager loading for above-the-fold images
        loading={media.preload ? "eager" : "lazy"} 
        // Async decoding for better performance
        decoding="async"
        // High priority for crucial images
        fetchpriority="high"
        // Explicit dimensions to prevent CLS
        width={isMobile ? dimensions.mobile?.width || dimensions.width : dimensions.width}
        height={isMobile ? dimensions.mobile?.height || dimensions.height : dimensions.height}
        // Use pre-defined sizes attribute for better browser size calculations
        sizes={media.sizes || "(max-width: 768px) 300px, 400px"}
        // Generate srcset from precomputed dimensions if available
        srcSet={media.srcSet ? 
          media.srcSet.map(item => `${item.src} ${item.size}`).join(', ') : 
          undefined
        }
        style={{
          // Position absolutely with explicit coordinates for maximum stability
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Explicit dimensions for stability - these dimensions are critical for CLS
          width: '100%',
          height: '100%',
          // Hardware acceleration for smoother rendering and to prevent layout recalculations
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Explicitly set objectFit and objectPosition to prevent browser defaults
          objectFit: 'cover',
          objectPosition: 'center',
          // Block display for more consistent rendering
          display: 'block',
          // No borders to ensure consistent sizing
          border: '0',
          // Stable z-index to ensure proper stacking
          zIndex: 2,
          // No margin or padding to interfere with positioning
          margin: 0,
          padding: 0,
          // Explicit box-sizing for consistent dimensions
          boxSizing: 'border-box',
          // Prevent overflowing content
          overflow: 'hidden',
          // Explicitly disable pointer events to ensure they don't interfere
          pointerEvents: 'none',
          // Remove transitions on layout properties
          transitionProperty: 'opacity',
          // Add background color while loading to reduce perceived CLS
          backgroundColor: media.placeholderColor || '#f5f5f7'
        }}
        data-testid="creator-media-image"
        data-dimensions={`${dimensions.width}x${dimensions.height}`}
        data-mobile-dimensions={`${dimensions.mobile?.width || dimensions.width}x${dimensions.mobile?.height || dimensions.height}`}
        data-aspect-ratio={dimensions.aspectRatio}
        data-creator={creator.name}
        data-preload={media.preload ? 'true' : 'false'}
      />
      
      {/* Only load video on desktop and only after a delay to prevent jitter */}
      {!isMobile && media.type === 'video' && media.videoSrc && imageLoaded && (
        <div 
          className="absolute inset-0 transform-gpu" 
          style={{ 
            zIndex: 3,
            // Prevent layout shifts from this container
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <video
            src={media.videoSrc}
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-center",
              "transform-gpu backface-hidden will-change-transform",
              // Only show when loaded
              isVideoLoaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-300 ease-in-out"
            )}
            onError={() => setImageError(true)}
            onLoadedData={handleVideoLoad}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata" // Lighter preload mode
            style={{
              // Hardware acceleration
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              // Ensure video doesn't affect layout
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            data-testid="creator-media-video"
          />
        </div>
      )}
      
      {/* Add debug size info only in development mode */}
      {process.env.NODE_ENV === 'development' && containerSize.width > 0 && (
        <div 
          className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded z-50 pointer-events-none"
          style={{
            fontSize: '8px',
            opacity: 0.7
          }}
        >
          {containerSize.width}×{containerSize.height}
        </div>
      )}
    </div>
  );
});

CreatorMedia.displayName = "CreatorMedia";