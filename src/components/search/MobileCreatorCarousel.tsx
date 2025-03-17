
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Grip } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';

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

  // Optimized carousel settings for mobile with peek view of next card
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false,
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
  
  const { 
    gradientBgMobile, 
    improvedShadowMobile, 
    coloredBorderMobile, 
    cardBgMobile 
  } = mobileOptimizationClasses;

  return (
    <div className="w-full relative pb-6">
      {/* Swipe instruction */}
      {isFirstVisit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-md">
          <Grip className="w-4 h-4" />
          <span>Swipe to explore</span>
        </div>
      )}
      
      {/* Simplified carousel container */}
      <div className="w-full overflow-visible" ref={emblaRef}>
        <div className="flex">
          {creators.map((creator) => (
            <div 
              key={creator.name} 
              style={{ touchAction: 'pan-y' }} 
              className="min-w-[90%] w-[90%] px-2 py-1.5 flex h-full"
            >
              <div className="w-full h-full">
                <CreatorCard 
                  creator={creator} 
                  onImageLoad={onImageLoad} 
                  loadedImages={loadedImages} 
                  imageRef={imageRef}
                  onPreviewClick={onPreviewClick}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator - repositioned */}
      <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
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

      {/* Navigation Arrows - fixed positioning */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-md transition-opacity duration-300", 
          !prevBtnEnabled && "opacity-25 cursor-not-allowed"
        )} 
        disabled={!prevBtnEnabled}
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[45%] -translate-y-1/2 z-10 rounded-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-md transition-opacity duration-300", 
          !nextBtnEnabled && "opacity-0 pointer-events-none"
        )} 
        disabled={!nextBtnEnabled}
        aria-label="Next creator"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
