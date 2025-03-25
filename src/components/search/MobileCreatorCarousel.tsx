import React, { useCallback, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
}

// Completely rebuilt component using the native carousel components
export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Handle button states when the carousel API changes
  const onCarouselApiChange = useCallback((newApi: any) => {
    if (!newApi) return;
    
    setApi(newApi);
    
    // Initial state check
    setPrevBtnEnabled(newApi.canScrollPrev());
    setNextBtnEnabled(newApi.canScrollNext());
    
    // Setup listeners for state changes
    const updateButtonStates = () => {
      setPrevBtnEnabled(newApi.canScrollPrev());
      setNextBtnEnabled(newApi.canScrollNext());
      setSelectedIndex(newApi.selectedScrollSnap());
    };
    
    newApi.on('select', updateButtonStates);
    newApi.on('reInit', updateButtonStates);
    
    // Initial update
    updateButtonStates();
  }, []);

  // Manual scroll handlers with improved error handling
  const scrollPrev = useCallback(() => {
    if (!api) return;
    try {
      api.scrollPrev();
    } catch (error) {
      console.error("Error scrolling carousel:", error);
    }
  }, [api]);
  
  const scrollNext = useCallback(() => {
    if (!api) return;
    try {
      api.scrollNext();
    } catch (error) {
      console.error("Error scrolling carousel:", error);
    }
  }, [api]);

  // Simplified carousel options with Safari focus
  const carouselOptions = useMemo(() => ({
    align: 'center',
    loop: false,
    dragFree: true, // Enable free dragging for smoother scrolling
    skipSnaps: false,
    containScroll: 'keepSnaps',
    dragThreshold: 10,
    slidesToScroll: 1,
    startIndex: 0,
    duration: 25, // Faster animation for better responsiveness
    speed: 5 // Adjust the speed setting
  }), []);

  // Simple memoized pagination dots
  const paginationDots = useMemo(() => (
    creators.map((_, index) => (
      <div 
        key={index} 
        className={
          selectedIndex === index 
            ? "h-1.5 w-4 rounded-full bg-purple-600" 
            : "h-1.5 w-1.5 rounded-full bg-purple-300/50"
        }
      />
    ))
  ), [creators, selectedIndex]);

  return (
    <div 
      className="relative w-full pb-6 pt-2 px-0"
      style={{
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Use the standard Carousel component with enhanced Safari support */}
      <Carousel
        opts={carouselOptions}
        setApi={onCarouselApiChange}
        className="w-full touch-pan-y"
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'pan-x'
        }}
      >
        <CarouselContent 
          className="py-2 -ml-2 touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            overscrollBehavior: 'contain'
          }}
        >
          {creators.map((creator, index) => (
            <CarouselItem 
              key={creator.name} 
              className="pl-2 basis-[75%] min-w-0 touch-pan-x"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-x',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)'
              }}
            >
              <CreatorCard 
                creator={creator} 
                onImageLoad={onImageLoad} 
                loadedImages={loadedImages} 
                imageRef={(node) => imageRef && imageRef(node)}
                onPreviewClick={onPreviewClick}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1.5 z-10 pt-1 pb-0 h-[10px]">
        {paginationDots}
      </div>

      {/* Custom navigation buttons */}
      <button
        type="button"
        onClick={scrollPrev}
        onTouchStart={scrollPrev} // Add touch event for better Safari response
        className={cn(
          "absolute left-2 top-[50%] z-50 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg active:shadow-md touch-manipulation",
          "active:scale-95 transition-transform active:bg-purple-700", // Add press effect
          !prevBtnEnabled && "opacity-0 pointer-events-none"
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitAppearance: 'none',
          transform: 'translateZ(0)'
        }}
        aria-label="Previous creator"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        type="button"
        onClick={scrollNext}
        onTouchStart={scrollNext} // Add touch event for better Safari response 
        className={cn(
          "absolute right-2 top-[50%] z-50 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg active:shadow-md touch-manipulation",
          "active:scale-95 transition-transform active:bg-purple-700", // Add press effect
          !nextBtnEnabled && "opacity-0 pointer-events-none"
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none', 
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitAppearance: 'none',
          transform: 'translateZ(0)'
        }}
        aria-label="Next creator"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}