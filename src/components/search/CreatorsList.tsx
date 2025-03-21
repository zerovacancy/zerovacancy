import React, { useState } from 'react';
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

export const CreatorsList: React.FC = () => {
  const isMobile = useIsMobile();
  
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
        "/creatorcontent/emily-johnson/work-1.webp",
        "/creatorcontent/emily-johnson/work-2.jpg",
        "/creatorcontent/emily-johnson/work-3.jpg"
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
        "/creatorcontent/jane-cooper/work-1.jpg",
        "/creatorcontent/jane-cooper/work-2.jpg",
        "/creatorcontent/jane-cooper/work-3.jpg"
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
        "/creatorcontent/michael-brown/work-1.jpg",
        "/creatorcontent/michael-brown/work-2.jpg",
        "/creatorcontent/michael-brown/work-3.jpg"
      ],
      availabilityStatus: "premium-only"
    }
  ];

  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  
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
      {!isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6">
          {creators.map((creator) => (
            <div key={creator.name} className="h-full flex min-h-[500px]" style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <CreatorCard 
                creator={creator} 
                onImageLoad={handleImageLoad} 
                loadedImages={loadedImages} 
                imageRef={imageRef}
                onPreviewClick={setSelectedPreviewImage}
              />
              <div className="hidden md:hidden">
                <button className="bg-purple-600 text-white p-2 rounded w-full">
                  Get Priority Access (Fallback)
                </button>
              </div>
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
      
      <Dialog open={!!selectedPreviewImage} onOpenChange={() => setSelectedPreviewImage(null)}>
        <DialogContent className={cn(
          isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-[80vw]", 
          "p-0 bg-transparent border-0"
        )}>
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
            <img
              src={selectedPreviewImage}
              alt="Property photography - enlarged portfolio view"
              className="w-full h-full object-contain rounded-lg"
              style={{ maxHeight: isMobile ? '85vh' : '80vh' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};
