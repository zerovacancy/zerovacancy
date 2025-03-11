
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
    }, 500); // Increased delay for more reliable initialization

    return () => {
      clearTimeout(timer);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  return (
    <div className="w-full relative">
      {/* Enhanced swipe instruction with better visibility */}
      {isFirstVisit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/80 text-white px-4 py-3 rounded-full text-sm flex items-center gap-2.5 backdrop-blur-sm animate-pulse-subtle shadow-lg">
          <Grip className="w-4.5 h-4.5" />
          <span className="font-medium">Swipe to explore</span>
        </div>
      )}
    
      {/* Visual search results connector */}
      <div className="relative py-4">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
          <div className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
            Search Results
          </div>
        </div>
      </div>

      {/* Carousel container with fixed padding */}
      <div className="w-full overflow-hidden pb-8 embla-container" ref={emblaRef}>
        <div className="flex embla-slide-container">
          {creators.map((creator, index) => (
            <div 
              key={creator.name} 
              style={{ touchAction: 'pan-y' }} 
              className="min-w-[92%] w-[92%] pl-2 pr-2 embla-slide my-[10px]"
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

      {/* Navigation Arrows - Significantly enlarged touch targets */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-4 bg-black/60 text-white backdrop-blur-sm transition-all", 
          "hover:bg-black/70 active:scale-95 duration-200 touch-manipulation", 
          !prevBtnEnabled && "opacity-0 pointer-events-none",
          "min-h-[48px] min-w-[48px] flex items-center justify-center" // Ensure adequate touch size
        )} 
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-4 bg-black/60 text-white backdrop-blur-sm transition-all", 
          "hover:bg-black/70 active:scale-95 duration-200 touch-manipulation", 
          !nextBtnEnabled && "opacity-0 pointer-events-none",
          "min-h-[48px] min-w-[48px] flex items-center justify-center" // Ensure adequate touch size
        )} 
        aria-label="Next creator"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
