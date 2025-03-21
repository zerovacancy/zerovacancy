import React, { useCallback, useEffect, useState, memo, useMemo } from 'react';
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

// Straightforward component definition with arrow function
export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  // Use useRef to track if we've already initialized to prevent duplicate initialization
  const hasInitialized = React.useRef(false);
  
  // Memoize carousel options to prevent re-creating the object on every render
  const carouselOptions = useMemo(() => ({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false,
    skipSnaps: false,
    inViewThreshold: 0.9,
    startIndex: 0,
    watchDrag: false
  }), []);

  // Initialize the carousel with stable options
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Memoize scroll handlers
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);
  
  // Memoize select handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  // Initialize once and prevent reinitializing when scrolling back
  useEffect(() => {
    if (!emblaApi || hasInitialized.current) return;
    
    // Mark as initialized to prevent re-initialization
    hasInitialized.current = true;
    
    // Setup listeners
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    // Clean up
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Cache dom references
  const carouselWrapperStyle = useMemo(() => ({
    boxShadow: 'none',
    border: 'none',
    willChange: 'transform', // Hint for browser that transform will change
    transform: 'translateZ(0)' // Hardware acceleration
  }), []);

  // Pre-render carousel slides to prevent jitter
  const carouselSlides = useMemo(() => (
    creators.map((creator, index) => (
      <div 
        key={creator.name} 
        style={{ 
          touchAction: 'pan-y',
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'transform', // Optimization hint
          // Consistent box shadow that won't cause reflow
          boxShadow: index < creators.length - 1 ? '8px 0 12px -6px rgba(118, 51, 220, 0.08)' : 'none'
        }} 
        className={cn(
          "min-w-[85vw] w-[85vw] py-0 flex-shrink-0",
          "mr-4", // Consistent margin between cards
          "transform-gpu" // Force GPU rendering
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
    ))
  ), [creators, onImageLoad, loadedImages, imageRef, onPreviewClick]);

  // Pre-render pagination dots to prevent jitter
  const paginationDots = useMemo(() => (
    creators.map((_, index) => (
      <div 
        key={index} 
        className={cn(
          "h-1.5 rounded-full",
          // Use fixed width to prevent layout shifts during transitions
          selectedIndex === index 
            ? "w-4 bg-purple-600" 
            : "w-1.5 bg-purple-300/50"
        )}
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          transition: 'none' // Remove transitions that cause jitter
        }}
      />
    ))
  ), [creators, selectedIndex]);

  return (
    <div 
      className="w-full relative pb-6 pt-2 px-0 overflow-visible bg-[#F9F7FF]"
      style={{
        boxShadow: 'none',
        border: 'none',
        transform: 'translateZ(0)'
      }}
    >
      {/* Main carousel container with hardware acceleration */}
      <div 
        className="w-full overflow-visible rounded-lg relative transform-gpu"
        ref={emblaRef}
        style={{
          contain: 'paint', // Removed layout and size constraints
          width: '100%',
          minHeight: '450px' // Set minimum height
        }}
      >
        <div className="flex flex-nowrap pl-1 transform-gpu">
          {carouselSlides}
        </div>
      </div>
      
      {/* Fixed-layout pagination to prevent jitter */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1.5 z-10 pt-1 pb-0"
        style={{
          height: '10px', // Fixed height
          transform: 'translateZ(0)', // Hardware acceleration
          contain: 'layout paint' // Prevent layout calculations
        }}
      >
        {paginationDots}
      </div>

      {/* Navigation buttons with hardware acceleration */}
      <button 
        onClick={scrollPrev} 
        className={cn(
          "absolute left-0 top-[36%] -translate-y-1/2 z-20 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.3),_0_3px_4px_-2px_rgba(138,79,255,0.4)] opacity-90 hover:opacity-70 transform-gpu", 
          !prevBtnEnabled && "pointer-events-none opacity-0"
        )} 
        disabled={!prevBtnEnabled}
        aria-label="Previous creator"
        style={{
          transform: 'translate3d(0, -50%, 0)', // Hardware-accelerated transform
          visibility: prevBtnEnabled ? 'visible' : 'hidden'
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={scrollNext} 
        className={cn(
          "absolute right-1 top-[36%] -translate-y-1/2 z-20 rounded-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white", 
          "touch-manipulation h-[40px] w-[40px] flex items-center justify-center shadow-[0_6px_10px_-2px_rgba(138,79,255,0.3),_0_3px_4px_-2px_rgba(138,79,255,0.4)] opacity-90 hover:opacity-70 transform-gpu", 
          !nextBtnEnabled && "pointer-events-none opacity-0"
        )} 
        disabled={!nextBtnEnabled}
        aria-label="Next creator"
        style={{
          transform: 'translate3d(0, -50%, 0)', // Hardware-accelerated transform
          visibility: nextBtnEnabled ? 'visible' : 'hidden'
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Component is exported directly above
