import React, { useCallback, useEffect, useState, useMemo } from 'react';
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

// Simple, reliable implementation focused on mobile compatibility
export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  // Very basic, reliable embla configuration
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: false,
    containScroll: false 
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Handler for when slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  // Basic scroll handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  // Set up event listeners
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  // Simple pagination dots
  const dots = useMemo(() => (
    creators.map((_, index) => (
      <div 
        key={index} 
        className={selectedIndex === index 
          ? "h-1.5 w-4 rounded-full bg-purple-600" 
          : "h-1.5 w-1.5 rounded-full bg-purple-300/50"}
      />
    ))
  ), [creators, selectedIndex]);

  return (
    <div className="w-full relative pb-4 pt-2 px-0">
      {/* Simple container without fancy styles */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {creators.map((creator, index) => (
            <div 
              key={creator.name} 
              className="min-w-[75vw] w-[75vw] mr-4 flex-shrink-0"
            >
              <CreatorCard 
                creator={creator} 
                onImageLoad={onImageLoad} 
                loadedImages={loadedImages} 
                imageRef={(node) => imageRef && imageRef(node)}
                onPreviewClick={onPreviewClick}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1.5 pt-1 pb-0">
        {dots}
      </div>
      
      {/* Navigation buttons */}
      <button
        type="button"
        onClick={scrollPrev}
        className={cn(
          "absolute left-2 top-[50%] z-10 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg",
          !prevBtnEnabled && "opacity-0 pointer-events-none"
        )}
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        type="button"
        onClick={scrollNext}
        className={cn(
          "absolute right-2 top-[50%] z-10 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg",
          !nextBtnEnabled && "opacity-0 pointer-events-none"
        )}
        aria-label="Next creator"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}