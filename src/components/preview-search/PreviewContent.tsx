
import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorCard } from '../creator/CreatorCard';
import { MobileCreatorCarousel } from '../search/MobileCreatorCarousel';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from "../ui/dialog";
import { X } from 'lucide-react';
import { CreatorCardSkeleton } from './CreatorCardSkeleton';

// Creator data is static, so memoize it outside the component
const CREATOR_DATA = [
  {
    name: "Emily Johnson",
    services: ["TikTok", "POV Tour", "Content"],
    price: 150,
    rating: 4.9,
    reviews: 127,
    location: "Chicago, IL",
    image: "/newemilyprofile.jpg",
    workExamples: ["/creatorcontent/emily-johnson/work-1.webp", "/creatorcontent/emily-johnson/work-2.jpg", "/creatorcontent/emily-johnson/work-3.jpg"],
    availabilityStatus: "available-now" as const
  }, 
  {
    name: "Jane Cooper",
    services: ["Interior", "Design", "Staging"],
    price: 200,
    rating: 4.8,
    reviews: 98,
    location: "Los Angeles, CA",
    image: "/janeprofile.png",
    workExamples: ["/creatorcontent/jane-cooper/work-1.jpg", "/creatorcontent/jane-cooper/work-2.jpg", "/creatorcontent/jane-cooper/work-3.jpg"],
    availabilityStatus: "available-tomorrow" as const
  }, 
  {
    name: "Michael Brown",
    services: ["3D Tours", "Floor Plans", "Interactive"],
    price: 175,
    rating: 4.7,
    reviews: 82,
    location: "Chicago, IL",
    image: "/michaelprofile.mov",
    workExamples: ["/creatorcontent/michael-brown/work-1.jpg", "/creatorcontent/michael-brown/work-2.jpg", "/creatorcontent/michael-brown/work-3.jpg"],
    availabilityStatus: "premium-only" as const
  }
];

// Predefine skeleton array outside to prevent recreation
const SKELETON_INDICES = [1, 2, 3];

// Direct export with arrow function
export const PreviewContent = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isMobile = useIsMobile();
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Create an IntersectionObserver to detect when section is visible
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Reduce loading time for better performance and less jitter
  useEffect(() => {
    // Short timeout for loading state to reduce jitter
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 800); // Reduced from 1200ms
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, []);

  // Memoized image load handler to prevent recreation on every render
  const handleImageLoad = useMemo(() => (imagePath: string) => {
    if (isMounted.current) {
      setLoadedImages(prev => {
        // Create a new set with the additional image
        const newSet = new Set(prev);
        newSet.add(imagePath);
        return newSet;
      });
    }
  }, []);

  // Pre-load creator images in a single batch before rendering
  useEffect(() => {
    // Preload all creator profile images
    CREATOR_DATA.forEach(creator => {
      const img = new Image();
      img.src = creator.image === '/michaelprofile.mov' 
        ? '/creatorcontent/michael-brown/work-1.webp' 
        : creator.image;
      
      img.onload = () => {
        if (isMounted.current) {
          handleImageLoad(creator.image);
        }
      };
    });
  }, [handleImageLoad]);

  // Setup container style with hardware acceleration but without restricting size
  const containerStyle = useMemo(() => ({
    minHeight: isMobile ? '450px' : 'auto', // Allow auto height on desktop
    transform: 'translateZ(0)', // Hardware acceleration
    willChange: 'transform', // Hint browser about transform changes
    contain: 'paint style', // Removed 'layout size' to allow natural sizing
  }), [isMobile]);

  // Create wrapper style
  const wrapperStyle = useMemo(() => ({
    transform: 'translateZ(0)', // Force hardware acceleration
    backfaceVisibility: 'hidden' as const,
    willChange: 'transform' // Hint for browser optimization
  }), []);

  return (
    <div 
      className={cn(
        "relative w-full transform-gpu", 
        isMobile && "pb-6 bg-[#F9F7FF]"
      )}
      style={{
        // Simple styles to ensure content displays properly
        width: '100%',
        position: 'relative'
      }}
      ref={sectionRef}
    >
      {isMobile ? (
        <div className="transform-gpu" style={wrapperStyle}>
          {isLoading ? (
            // Mobile loading skeleton with explicit dimensions
            <div 
              className="flex space-x-2 overflow-x-auto py-2 px-1 scrollbar-hide"
              style={{
                minHeight: '380px', // Fixed height to prevent layout shifts
                // Removed contain property that might cause content to be cut off
              }}
            >
              {SKELETON_INDICES.map((item) => (
                <div 
                  key={item} 
                  className="min-w-[90%] flex-shrink-0 px-1"
                  style={{
                    minHeight: '340px', // Fixed height to match content
                    transform: 'translateZ(0)' // Hardware acceleration
                  }}
                >
                  <CreatorCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            // Main carousel with hardware acceleration
            <>
              {/* Direct render without wrapping div */}
              <MobileCreatorCarousel 
                creators={CREATOR_DATA}
                onImageLoad={handleImageLoad}
                loadedImages={loadedImages}
                imageRef={(node) => { imageRef.current = node; }}
                onPreviewClick={setSelectedImage}
              />
            </>
          )}
        </div>
      ) : (
        // Desktop view
        <div 
          className="bg-white p-4 rounded-xl border border-purple-100/30 shadow-[0_10px_15px_-3px_rgba(138,79,255,0.1),_0_4px_6px_-4px_rgba(138,79,255,0.15),_inset_0_1px_3px_rgba(255,255,255,0.3)] transform-gpu"
          style={wrapperStyle}
        >
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 transform-gpu"
            style={{
              minHeight: 'auto', // Allow natural sizing
              contain: 'paint', // Removed size constraint
            }}
          >
            {isLoading ? (
              <>
                {SKELETON_INDICES.map((item) => (
                  <div key={item} className="transform-gpu">
                    <CreatorCardSkeleton />
                  </div>
                ))}
              </>
            ) : (
              CREATOR_DATA.map((creator, index) => (
                <div key={index} className="transform-gpu">
                  <CreatorCard 
                    creator={creator}
                    onImageLoad={handleImageLoad}
                    loadedImages={loadedImages}
                    imageRef={(node) => { imageRef.current = node; }}
                    onPreviewClick={setSelectedImage}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Image preview dialog - only render when needed */}
      {selectedImage && (
        <Dialog 
          open={!!selectedImage} 
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent 
            className="p-0 bg-black/90 border-0 max-w-[90vw] sm:max-w-[80vw]"
            style={{
              transform: 'translateZ(0)', // Hardware acceleration
              willChange: 'transform',
              contain: 'layout paint style' // Optimization
            }}
          >
            <div className="relative p-1 rounded-lg transform-gpu">
              <img
                src={selectedImage}
                alt="Portfolio work"
                className="w-full object-contain max-h-[80vh] rounded-lg transform-gpu"
                style={{
                  transform: 'translateZ(0)', // Hardware acceleration
                  contain: 'layout paint',
                  aspectRatio: '16/9'
                }}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 bg-black/80 rounded-full p-1.5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform-gpu"
                style={{ transform: 'translateZ(0)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Component is exported directly above
