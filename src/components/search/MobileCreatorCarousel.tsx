
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Grip } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
}

export const MobileCreatorCarousel: React.FC<MobileCreatorCarouselProps> = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Optimized carousel settings for mobile with better snap alignment
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: true,
    skipSnaps: false
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Force a reInit after mount with increased delay for more reliable rendering
    const timer = setTimeout(() => {
      emblaApi.reInit();

      // Hide first-time swipe hint after 5 seconds
      setTimeout(() => {
        setIsFirstVisit(false);
      }, 5000);
    }, 500);

    return () => {
      clearTimeout(timer);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  return (
    <div className="w-full relative">
      {/* Simplified swipe instruction with better visibility */}
      {isFirstVisit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-md">
          <Grip className="w-4 h-4" />
          <span>Swipe to explore</span>
        </div>
      )}
    
      {/* Visual search results connector - simplified */}
      <div className="relative py-4">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full py-1 px-2 shadow-sm border border-gray-100">
          <div className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            Search Results
          </div>
        </div>
      </div>

      {/* Carousel container with simplified styling */}
      <div className="w-full overflow-hidden pb-8" ref={emblaRef}>
        <div className="flex">
          {creators.map((creator) => (
            <div 
              key={creator.name} 
              style={{ touchAction: 'pan-y' }} 
              className="min-w-[92%] w-[92%] pl-2 pr-2 my-[10px]"
            >
              <CreatorCard 
                creator={creator} 
                onImageLoad={onImageLoad} 
                loadedImages={loadedImages} 
                imageRef={imageRef} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Simplified */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-3 bg-black/50 text-white", 
          "touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center", 
          !prevBtnEnabled && "opacity-0 pointer-events-none"
        )} 
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-3 bg-black/50 text-white", 
          "touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center", 
          !nextBtnEnabled && "opacity-0 pointer-events-none"
        )} 
        aria-label="Next creator"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
