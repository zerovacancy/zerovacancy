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
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false,
    skipSnaps: false,
    inViewThreshold: 0.85,
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

    const timer = setTimeout(() => {
      emblaApi.reInit();
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
    <div className="w-full relative pb-8 px-0 mx-0 bg-[#F5F0FF]/60">
      {isFirstVisit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-[0_8px_12px_-3px_rgba(138,79,255,0.2),_0_4px_6px_-4px_rgba(138,79,255,0.25)]">
          <Grip className="w-4 h-4" />
          <span>Swipe to explore</span>
        </div>
      )}
      
      <div className="w-full overflow-hidden rounded-xl bg-[#F5F0FF]/60" ref={emblaRef}>
        <div className="flex flex-nowrap">
          {creators.map((creator) => (
            <div 
              key={creator.name} 
              style={{ touchAction: 'pan-y' }} 
              className="min-w-[82%] w-[82%] py-0 px-2 flex-shrink-0 flex-grow-0 bg-[#F5F0FF]/60"
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
      
      <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pb-1 mt-3">
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
          "absolute left-1 top-[40%] -translate-y-1/2 z-10 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[36px] w-[36px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.25),_0_3px_4px_-2px_rgba(138,79,255,0.3)] transition-opacity duration-300", 
          !prevBtnEnabled && "opacity-25 cursor-not-allowed"
        )} 
        disabled={!prevBtnEnabled}
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-4 top-[40%] -translate-y-1/2 z-10 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[36px] w-[36px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.25),_0_3px_4px_-2px_rgba(138,79,255,0.3)] transition-opacity duration-300", 
          !nextBtnEnabled && "opacity-0 pointer-events-none"
        )} 
        disabled={!nextBtnEnabled}
        aria-label="Next creator"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
