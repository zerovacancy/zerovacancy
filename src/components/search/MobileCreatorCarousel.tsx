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

      {/* Enhanced visual search results connector */}
      <div className="relative py-4">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-100 via-white to-indigo-100 rounded-full p-1.5 shadow-md border border-indigo-200/70">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-4 py-1.5 rounded-full">
            Search Results
          </div>
        </div>
      </div>

      {/* Enhanced carousel container with visual distinction */}
      <div className="w-full overflow-hidden pb-8 embla-container relative" ref={emblaRef}>
        {/* Background pattern for container */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-purple-50/50 rounded-xl border-2 border-indigo-100/40 opacity-80"></div>

        <div className="flex embla-slide-container relative z-10 py-2">
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

      {/* Enhanced Navigation Arrows - Significantly enlarged touch targets */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white backdrop-blur-sm transition-all", 
          "hover:bg-black/70 active:scale-95 duration-200 touch-manipulation", 
          "shadow-[0_4px_10px_rgba(79,70,229,0.3)]",
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
          "absolute right-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white backdrop-blur-sm transition-all", 
          "hover:bg-black/70 active:scale-95 duration-200 touch-manipulation", 
          "shadow-[0_4px_10px_rgba(79,70,229,0.3)]",
          !nextBtnEnabled && "opacity-0 pointer-events-none",
          "min-h-[48px] min-w-[48px] flex items-center justify-center" // Ensure adequate touch size
        )} 
        aria-label="Next creator"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator for carousel position */}
      <div className="flex justify-center gap-1.5 mt-2">
        {creators.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === selectedIndex
                ? "bg-indigo-600 w-4" // Active dot is wider
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
