import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorCard } from '../creator/CreatorCard';
import { MobileCreatorCarousel } from '../search/MobileCreatorCarousel';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import { X } from 'lucide-react';
import { CreatorCardSkeleton } from './CreatorCardSkeleton';

// Creator data is static, so memoize it outside the component
const CREATOR_DATA = [
  {
    name: "Emily Johnson",
    services: ["TikTok", "POV Tour", "Content"],
    servicesTruncated: ["TikTok", "Tour", "Content"],
    location: "Los Angeles, CA",
    price: 85,
    rating: 4.7,
    reviews: 72,
    image: "/emilyprofilephoto.webp",
    availability: true,
    availabilityStatus: "available-now",
    workExamples: [
      "/creatorcontent/recent-work/emily-johnson/work-1.webp",
      "/creatorcontent/recent-work/emily-johnson/work-2.webp",
      "/creatorcontent/recent-work/emily-johnson/work-3.webp"
    ]
  },
  {
    name: "Jane Cooper",
    services: ["Instagram", "Real Estate", "Photo"],
    servicesTruncated: ["Instagram", "Real Estate", "Photo"],
    location: "New York, NY",
    price: 120,
    rating: 4.9,
    reviews: 143,
    image: "/janeprofile.png",
    availability: true,
    availabilityStatus: "available-tomorrow",
    workExamples: [
      "/creatorcontent/recent-work/jane-cooper/work-1.webp",
      "/creatorcontent/recent-work/jane-cooper/work-2.webp",
      "/creatorcontent/recent-work/jane-cooper/work-3.webp"
    ]
  },
  {
    name: "Michael Brown",
    services: ["YouTube", "Drone", "Video"],
    servicesTruncated: ["YouTube", "Drone", "Video"],
    location: "San Francisco, CA",
    price: 150,
    rating: 5.0,
    reviews: 95,
    image: "/michaelprofile.mov",
    availability: true,
    availabilityStatus: "premium-only",
    workExamples: [
      "/creatorcontent/recent-work/michael-brown/work-1.webp",
      "/creatorcontent/recent-work/michael-brown/work-2.webp",
      "/creatorcontent/recent-work/michael-brown/work-3.webp"
    ]
  }
];

// Memoized component with stable props to preserve render identity
const MemoizedCreatorCard = memo(CreatorCard);

interface PreviewContentProps {
  className?: string;
  searchTerm?: string;
  isLoading?: boolean;
  showSkeletons?: boolean;
  loadingCount?: number;
}

export const PreviewContent: React.FC<PreviewContentProps> = ({
  className,
  searchTerm = '',
  isLoading = false,
  showSkeletons = false,
  loadingCount = 3
}) => {
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Create refs for all creator cards up front
  const creatorRefs = useMemo(() => 
    CREATOR_DATA.map(() => React.createRef<HTMLDivElement>()),
    []
  );
  
  // Simulate a filter operation based on search term
  const filteredCreators = useMemo(() => {
    if (!searchTerm) return CREATOR_DATA;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return CREATOR_DATA.filter(creator => {
      return (
        creator.name.toLowerCase().includes(lowerSearchTerm) ||
        creator.location.toLowerCase().includes(lowerSearchTerm) ||
        creator.services.some(s => s.toLowerCase().includes(lowerSearchTerm))
      );
    });
  }, [searchTerm]);
  
  // Add an image to the loaded set when it loads
  const handleImageLoad = useCallback((imageSrc: string) => {
    setLoadedImages(prev => {
      // If image is already in the set, don't trigger an update
      if (prev.has(imageSrc)) return prev;

      const updated = new Set(prev);
      updated.add(imageSrc);
      return updated;
    });
  }, []);
  
  // Handle thumbnail clicks
  const handlePreviewClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  
  // Render different views based on mobile status
  return (
    <div className={cn(
      "w-full transform-gpu will-change-transform", 
      className
    )} 
      ref={contentRef}
    >
      {/* Skeleton loader states */}
      {(isLoading || showSkeletons) && (
        <div className="w-full">
          {/* Mobile skeleton - Only visible on small screens */}
          <div className="md:hidden snap-x px-4 overflow-x-auto flex relative gap-4"
               style={{ opacity: isLoading ? 0.8 : 1, paddingBottom: '12px' }}>
            {Array.from({ length: loadingCount }, (_, index) => (
              <CreatorCardSkeleton key={`mobile-skeleton-${index}`} />
            ))}
          </div>

          {/* Desktop skeleton grid - Hidden on mobile, 3-column grid on desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-12 px-6 w-full"
               style={{ opacity: isLoading ? 0.8 : 1 }}>
            {Array.from({ length: loadingCount }, (_, index) => (
              <div className="flex justify-center" key={`desktop-skeleton-${index}`}>
                <CreatorCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actual content */}
      {!isLoading && !showSkeletons && (
        <div className="w-full">
          {/* Mobile view - Only visible on small screens */}
          <div className="md:hidden">
            <MobileCreatorCarousel
              creators={filteredCreators}
              onImageLoad={handleImageLoad}
              loadedImages={loadedImages}
              onPreviewClick={handlePreviewClick}
            />
          </div>

          {/* Desktop grid - Hidden on mobile, 3-column grid on desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-12 px-6 w-full">
            {filteredCreators.map((creator, index) => (
              <div className="flex justify-center" key={`${creator.name}-${index}`}>
                <MemoizedCreatorCard
                  creator={creator}
                  onImageLoad={handleImageLoad}
                  loadedImages={loadedImages}
                  imageRef={creatorRefs[index]}
                  onPreviewClick={handlePreviewClick}
                  isSelected={false}
                />
              </div>
            ))}
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
            <DialogTitle>
              <VisuallyHidden>Image Preview</VisuallyHidden>
            </DialogTitle>
            <div className="relative p-1 rounded-lg transform-gpu">
              <img
                src={selectedImage}
                alt="Portfolio work"
                className="w-full object-contain max-h-[80vh] rounded-lg transform-gpu"
                style={{
                  transform: 'translateZ(0)', // Hardware acceleration
                  contain: 'layout paint',
                }}
              />
              <button 
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}