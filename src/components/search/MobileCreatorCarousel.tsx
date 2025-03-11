
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
          <span className="font-medium">Swipe to explore</span>
        </div>
      )}

      {/* Simplified visual search results connector */}
      <div className="relative py-4">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md border border-indigo-200/50">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Search Results
          </div>
        </div>
      </div>

      {/* Simplified carousel container for better performance */}
      <div className="w-full overflow-hidden pb-8 embla-container relative" ref={emblaRef}>
        {/* Simplified background for container */}
        <div className="absolute inset-0 bg-indigo-50/30 rounded-xl border border-indigo-100/30"></div>

        <div className="flex embla-slide-container relative z-10 py-2">
          {creators.map((creator) => (
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

      {/* Simplified Navigation Arrows - Large touch targets with reduced visual complexity */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-3 bg-indigo-600 text-white", 
          "active:scale-95 duration-200 touch-manipulation", 
          "shadow-md",
          !prevBtnEnabled && "opacity-0 pointer-events-none",
          "min-h-[44px] min-w-[44px] flex items-center justify-center" // Adequate touch size
        )} 
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-3 bg-indigo-600 text-white", 
          "active:scale-95 duration-200 touch-manipulation", 
          "shadow-md",
          !nextBtnEnabled && "opacity-0 pointer-events-none",
          "min-h-[44px] min-w-[44px] flex items-center justify-center" // Adequate touch size
        )} 
        aria-label="Next creator"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Simplified Dots indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {creators.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === selectedIndex
                ? "bg-indigo-600 w-3" // Active dot is wider
                : "bg-gray-300"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
