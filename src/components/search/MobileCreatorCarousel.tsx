import React, { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
}

export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  // Reset to default embla options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
      
      // Force update using requestAnimationFrame
      requestAnimationFrame(() => {
        if (emblaApi) {
          emblaApi.reInit();
          setSelectedIndex(emblaApi.selectedScrollSnap());
        }
      });
    }
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap());
      
      // Force update using requestAnimationFrame
      requestAnimationFrame(() => {
        if (emblaApi) {
          emblaApi.reInit();
          setSelectedIndex(emblaApi.selectedScrollSnap());
        }
      });
    }
  }, [emblaApi]);
  
  return (
    <div className="relative w-full py-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {creators.map((creator, index) => (
            <div key={creator.name} className="flex-none w-[85%] px-2">
              <CreatorCard 
                creator={creator} 
                onImageLoad={onImageLoad}
                loadedImages={loadedImages}
                imageRef={imageRef}
                onPreviewClick={onPreviewClick}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-3 text-white z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-3 text-white z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {creators.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full ${
              idx === selectedIndex ? 'w-4 bg-purple-600' : 'w-2 bg-purple-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};