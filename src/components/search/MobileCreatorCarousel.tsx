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
  onPreviewClick?: (imageSrc: string) => void;
}

export const MobileCreatorCarousel: React.FC<MobileCreatorCarouselProps> = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}) => {
  // No longer need first visit state since we removed the indicator

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false,
    skipSnaps: false,
    inViewThreshold: 0.9,
    startIndex: 0,
    watchDrag: false
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

    // Just reinit the carousel after a short delay
    const timer = setTimeout(() => {
      emblaApi.reInit();
    }, 500);

    return () => {
      clearTimeout(timer);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full relative pb-6 pt-2 px-0 overflow-visible bg-[#F9F7FF]"
      style={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <div className="w-full overflow-visible rounded-lg relative" ref={emblaRef}>
        <div className="flex flex-nowrap pl-1">
          {creators.map((creator, index) => (
            <div 
              key={creator.name} 
              style={{ 
                touchAction: 'pan-y',
                // Add gradient shadow to right edge for visual separation
                boxShadow: index < creators.length - 1 ? '8px 0 12px -6px rgba(118, 51, 220, 0.08)' : 'none'
              }} 
              className={cn(
                "min-w-[85vw] w-[85vw] py-0 flex-shrink-0",
                "mr-4", // Consistent margin between cards
                index === 0 ? "ml-0" : "ml-0" // No left margin on first card
              )}
            >
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
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1.5 z-10 pt-1 pb-0">
        {creators.map((_, index) => (
          <div 
            key={index} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              selectedIndex === index 
                ? "w-4 bg-purple-600" 
                : "w-1.5 bg-purple-300/50"
            )}
          />
        ))}
      </div>

      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-0 top-[36%] -translate-y-1/2 z-20 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.3),_0_3px_4px_-2px_rgba(138,79,255,0.4)] transition-all duration-300 opacity-90 hover:opacity-70", 
          !prevBtnEnabled && "pointer-events-none"
        )} 
        disabled={!prevBtnEnabled}
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[36%] -translate-y-1/2 z-20 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.3),_0_3px_4px_-2px_rgba(138,79,255,0.4)] transition-all duration-300 opacity-90 hover:opacity-70", 
          !nextBtnEnabled && "pointer-events-none"
        )} 
        disabled={!nextBtnEnabled}
        aria-label="Next creator"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
