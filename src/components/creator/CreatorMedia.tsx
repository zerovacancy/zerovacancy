
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

// Pre-calculate media mapping to avoid recalculation during renders
const MEDIA_MAPPING = {
  'Emily Johnson': { type: 'image', src: '/emilyprofilephoto.webp' },
  'Jane Cooper': { type: 'image', src: '/janeprofile.png' },
  'Michael Brown': { 
    type: 'image', // Changed to image on mobile to prevent jittering
    src: '/creatorcontent/michael-brown/work-1.webp',
    videoSrc: '/michaelprofile.mov',
    fallback: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
  }
};

export const getMedia = (creator: Creator, isMobile: boolean) => {
  // Use the pre-defined mapping
  const mediaConfig = MEDIA_MAPPING[creator.name as keyof typeof MEDIA_MAPPING];
  
  // Always return image for mobile to prevent jitter
  if (isMobile && creator.name === 'Michael Brown') {
    return { 
      type: 'image', 
      src: mediaConfig.src
    };
  }
  
  // Return the mapping or a default
  return mediaConfig || { type: 'image', src: creator.image };
};

// Direct export with arrow function syntax
export const CreatorMedia = ({ 
  creator, 
  onImageLoad,
  onVideoLoad
}: CreatorMediaProps) => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  
  // Get media with isMobile parameter to make correct decisions
  const media = getMedia(creator, isMobile);
  
  // Set fixed image dimensions to prevent layout shifts
  const [dimensions] = useState({
    width: 400,
    height: 300
  });
  
  useEffect(() => {
    // If image type media, trigger onImageLoad immediately
    // This avoids waiting for actual image load which can cause jitters
    if (media.type === 'image' && onImageLoad) {
      // Use a short timeout to batch with other UI updates
      const timeoutId = setTimeout(() => {
        onImageLoad(creator.image);
      }, 10);
      
      return () => clearTimeout(timeoutId);
    }
  }, [media.type, creator.image, onImageLoad]);
  
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onImageLoad) {
      onImageLoad(creator.image);
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (onVideoLoad) {
      onVideoLoad();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div 
      className={cn(
        "relative", 
        "overflow-hidden",
        "flex items-center justify-center",
        "h-full w-full", // Fill container
        "aspect-[4/3]", // Consistent aspect ratio
        // Reserve space with fixed dimensions to prevent layout shifts
        `min-h-[${dimensions.height}px]`,
        // Hardware acceleration
        "transform-gpu"
      )}
      ref={mediaRef}
      style={{
        // Set explicit dimensions for reliability
        aspectRatio: '4/3',
        minHeight: '300px',
        contain: 'paint', // Removed layout constraint
        position: 'relative'
      }}
    >
      {/* Always render the image immediately with explicit dimensions */}
      <img 
        src={media.type === 'image' ? media.src : (media as any).fallback}
        alt={`${creator.name} profile`}
        className="w-full h-full object-cover object-center transform-gpu"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Changed to eager for critical above-the-fold content
        decoding="async"
        fetchpriority="high" // Lower case for HTML attribute compatibility
        width={dimensions.width}
        height={dimensions.height}
        style={{
          // Fixed size with explicit dimensions
          width: '100%',
          height: '100%',
          // Ensure hardware acceleration
          transform: 'translateZ(0)',
          objectFit: 'cover',
          display: 'block',
          border: '0'
        }}
      />
      
      {/* Only load video on desktop and only after a delay to prevent jitter */}
      {!isMobile && media.type === 'video' && (media as any).videoSrc && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <video
            src={(media as any).videoSrc}
            className="w-full h-full object-cover object-center transform-gpu"
            onError={() => setImageError(true)}
            onLoadedData={handleVideoLoad}
            autoPlay
            muted
            loop
            playsInline
            preload="none" // Only load on demand
            style={{
              transform: 'translateZ(0)',
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </div>
      )}
    </div>
  );
}

// Component is exported directly above
