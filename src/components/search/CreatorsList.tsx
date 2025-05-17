import React, { useState, useRef, useEffect } from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Creator } from '../creator/types';
import { MobileCreatorCarousel } from './MobileCreatorCarousel';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../ErrorFallback';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStableViewportHeight } from '@/utils/web-vitals';

export const CreatorsList: React.FC = () => {
  const isMobile = useIsMobile();
  // Initialize stable viewport height to prevent CLS
  const { isStabilized, windowHeight } = useStableViewportHeight();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  const creators: Creator[] = [
    {
      name: "Emily Johnson",
      services: ["TikTok", "POV Tour", "Content"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "Chicago, IL",
      image: "/emilyprofilephoto.webp",
      workExamples: [
        "/creatorcontent/recent-work/emily-johnson/work-1.webp",
        "/creatorcontent/recent-work/emily-johnson/work-2.webp",
        "/creatorcontent/recent-work/emily-johnson/work-3.webp"
      ],
      availabilityStatus: "available-now"
    }, 
    {
      name: "Jane Cooper",
      services: ["Photography", "Interior Design", "Staging"],
      price: 200,
      rating: 4.8,
      reviews: 98,
      location: "Los Angeles, CA",
      image: "/janeprofile.png",
      workExamples: [
        "/creatorcontent/recent-work/jane-cooper/work-1.webp",
        "/creatorcontent/recent-work/jane-cooper/work-2.webp",
        "/creatorcontent/recent-work/jane-cooper/work-3.webp"
      ],
      availabilityStatus: "available-tomorrow"
    }, 
    {
      name: "Michael Brown",
      services: ["3D Tours", "Floor Plans", "Interactive"],
      price: 175,
      rating: 4.7,
      reviews: 82,
      location: "New York, NY",
      image: "/michaelprofile.mov",
      workExamples: [
        "/creatorcontent/recent-work/michael-brown/work-1.webp",
        "/creatorcontent/recent-work/michael-brown/work-2.webp",
        "/creatorcontent/recent-work/michael-brown/work-3.webp"
      ],
      availabilityStatus: "premium-only"
    }
  ];

  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  
  // Use ResizeObserver to monitor container dimensions and prevent CLS
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Only update if dimensions changed significantly to prevent render thrashing
        if (Math.abs(width - containerDimensions.width) > 5 || 
            Math.abs(height - containerDimensions.height) > 5) {
          setContainerDimensions({ width, height });
        }
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerDimensions]);
  
  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set([...prev, imageSrc]));
  };
  
  const imageRef = (el: HTMLImageElement | null) => {
    if (el) {
      const src = el.getAttribute('data-src');
      if (src) {
        el.onload = () => handleImageLoad(src);
        el.src = src;
      }
    }
  };

  const { improvedShadowMobile, coloredBorderMobile } = mobileOptimizationClasses;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full creators-list-container",
          isStabilized ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300 ease-in-out"
        )}
        style={{
          // Use stable viewport height to prevent layout shifts
          minHeight: isMobile ? `calc(var(--vh, 1vh) * 100 * 0.7)` : 'auto',
          // Hardware acceleration for smoother rendering
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Prevent content from affecting layout during load
          contain: 'layout paint style',
          // Set explicit height when dimensions are known
          ...(containerDimensions.height > 0 && {
            height: `${containerDimensions.height}px`,
            minHeight: `${containerDimensions.height}px`
          })
        }}
        data-stabilized={isStabilized ? 'true' : 'false'}
        data-viewport-height={windowHeight}
      >
        {!isMobile && (
          <div
            className="px-4 py-6 grid gap-12"
            style={{
              // Use CSS Grid with auto-fill for responsive layout
              display: 'grid',
              // Use minmax with auto-fill to create responsive columns based on available space
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              // Gap is now set via Tailwind className="gap-12"
              // Ensure proper spacing around grid
              padding: '24px',
              // Hardware acceleration
              transform: 'translateZ(0)',
              // Prevent interaction causing reflows
              touchAction: 'manipulation',
              // Prevent overflowing content from causing layout shifts
              overflowX: 'hidden'
              // Removed: width: '100%' - redundant with grid display
              // Removed: contain: 'layout' - was preventing proper grid layout spacing
            }}
          >
            {creators.map((creator) => (
              <div
                key={creator.name}
                className="flex items-center justify-center"
                style={{
                  // Pre-allocate minimal space for cards
                  minHeight: '580px',
                  // Force consistent aspect ratio
                  aspectRatio: '5/7',
                  // Center card in its grid cell
                  margin: '0 auto',
                  // Allow card to take up to 380px but not more
                  maxWidth: '380px',
                  // Hardware acceleration
                  transform: 'translateZ(0)'
                  // Removed: contain: 'layout' - was preventing proper grid control
                }}
              >
                <CreatorCard
                  creator={creator}
                  onImageLoad={handleImageLoad}
                  loadedImages={loadedImages}
                  imageRef={imageRef}
                  onPreviewClick={setSelectedPreviewImage}
                />
              </div>
            ))}
          </div>
        )}

        {isMobile && (
          <MobileCreatorCarousel
            creators={creators}
            onImageLoad={handleImageLoad}
            loadedImages={loadedImages}
            imageRef={imageRef}
            onPreviewClick={setSelectedPreviewImage}
          />
        )}
      </div>
      
      <Dialog open={!!selectedPreviewImage} onOpenChange={() => setSelectedPreviewImage(null)}>
        <DialogContent 
          className={cn(
            isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-[80vw]", 
            "p-0 bg-transparent border-0"
          )}
          style={{
            // Pre-allocate space for the dialog content
            aspectRatio: '4/3',
            // Hardware acceleration
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Contain content to prevent external impact
            contain: 'layout paint style'
          }}
        >
          <DialogTitle className="sr-only">Portfolio Image Preview</DialogTitle>
          <button
            onClick={() => setSelectedPreviewImage(null)}
            className={cn(
              "absolute z-50 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors",
              isMobile ? "right-2 top-2 p-1.5" : "right-4 top-4 p-2"
            )}
            aria-label="Close preview"
          >
            <X className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
          </button>
          {selectedPreviewImage && (
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
                src={selectedPreviewImage}
                alt="Property photography - enlarged portfolio view"
                className="w-full h-full object-contain rounded-lg"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  maxHeight: isMobile ? '85vh' : '80vh',
                  // Hardware acceleration
                  transform: 'translateZ(0)'
                }}
                width={800}
                height={600}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};
