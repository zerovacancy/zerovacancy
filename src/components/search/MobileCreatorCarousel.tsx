import React, { useCallback, useEffect, useState, memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';
import { mobileOptimizationClasses as moc } from '@/utils/mobile-optimization';

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
}

// Component definition with improved mobile support
export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  // Use useRef to track if we've already initialized to prevent duplicate initialization
  const hasInitialized = React.useRef(false);
  
  // Memoize carousel options with improved mobile touch handling
  const carouselOptions = useMemo(() => ({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false, // Disable free drag for more consistent snapping
    skipSnaps: false,
    inViewThreshold: 0.6, // Adjusted threshold
    startIndex: 0,
    watchDrag: true, // Better touch response
    dragThreshold: 10, // Lower threshold for drag detection on mobile
    draggable: true,   // Explicitly enable dragging
    draggableClass: '', // Don't add any draggable classes that might interfere
    draggingClass: '', // Don't add any dragging classes that might interfere
    breakpoints: {
      '(max-width: 768px)': { dragFree: false, containScroll: 'keepSnaps' }
    }
  }), []);

  // Initialize the carousel with stable options
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Memoize select handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  // Memoize scroll handlers
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    try {
      emblaApi.scrollPrev();
      // Force reselect to update button state
      setTimeout(() => {
        if (emblaApi) {
          onSelect();
        }
      }, 50);
    } catch (error) {
      console.error("Error scrolling carousel:", error);
    }
  }, [emblaApi, onSelect]);
  
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    try {
      emblaApi.scrollNext();
      // Force reselect to update button state
      setTimeout(() => {
        if (emblaApi) {
          onSelect();
        }
      }, 50);
    } catch (error) {
      console.error("Error scrolling carousel:", error);
    }
  }, [emblaApi, onSelect]);
  
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

  // Pre-render carousel slides to prevent jitter
  const carouselSlides = useMemo(() => (
    creators.map((creator, index) => (
      <div 
        key={creator.name} 
        style={{ 
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'transform', // Optimization hint
          // Consistent box shadow that won't cause reflow
          boxShadow: index < creators.length - 1 ? '8px 0 12px -6px rgba(118, 51, 220, 0.08)' : 'none'
        }} 
        className={cn(
          "min-w-[75vw] w-[75vw] py-2 pb-4 flex-shrink-0", // Reduced width to show more of next card
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
      className={cn(
        "w-full relative pb-4 pt-2 px-0 overflow-visible bg-transparent",
        moc.carouselContainer
      )}
      style={{
        boxShadow: 'none',
        border: 'none',
        transform: 'translateZ(0)',
        paddingLeft: '1px', // Ensure proper alignment
        paddingRight: '1px', // Ensure proper alignment
        position: 'relative',
        touchAction: 'manipulation',
        zIndex: 10
      }}
    >
      {/* Main carousel container with hardware acceleration */}
      <div 
        className="w-full rounded-lg relative transform-gpu overflow-visible"
        ref={emblaRef}
        style={{
          width: '100%',
          minHeight: '480px', // Reduced height for mobile display
          WebkitOverflowScrolling: 'touch', // Better iOS scrolling
          touchAction: 'pan-y', // Allow vertical scroll but control horizontal
          overscrollBehavior: 'contain', // Prevent scroll chaining
          paddingLeft: '20px',  // Make room for left arrow
          paddingRight: '20px', // Make room for right arrow
          pointerEvents: 'auto'
        }}
      >
        <div className="flex flex-nowrap pl-2 transform-gpu">
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

      {/* Simplified navigation buttons with improved mobile touch handling */}
      <div 
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (prevBtnEnabled && emblaApi) emblaApi.scrollPrev();
        }}
        className={cn(
          "absolute left-0 top-[50%] z-50 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "touch-manipulation h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg opacity-95 active:opacity-100 transform-gpu",
          "cursor-pointer select-none",
          !prevBtnEnabled && "opacity-0 pointer-events-none",
          moc.carouselNavButton
        )}
        aria-label="Previous creator"
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 999,
          border: '2px solid rgba(255,255,255,0.5)',
          userSelect: 'none'
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </div>
      
      <div 
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (nextBtnEnabled && emblaApi) emblaApi.scrollNext();
        }}
        className={cn(
          "absolute right-0 top-[50%] z-50 -translate-y-1/2 rounded-full bg-purple-600 text-white",
          "touch-manipulation h-[60px] w-[60px] flex items-center justify-center",
          "shadow-lg opacity-95 active:opacity-100 transform-gpu",
          "cursor-pointer select-none",
          !nextBtnEnabled && "opacity-0 pointer-events-none",
          moc.carouselNavButton
        )}
        aria-label="Next creator"
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 999,
          border: '2px solid rgba(255,255,255,0.5)',
          userSelect: 'none'
        }}
      >
        <ChevronRight className="w-8 h-8" />
      </div>
    </div>
  );
}