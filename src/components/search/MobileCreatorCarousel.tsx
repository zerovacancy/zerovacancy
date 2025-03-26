import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
}

/**
 * Mobile-optimized carousel using native scroll snap
 */
export const MobileCreatorCarousel = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}: MobileCreatorCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Function to scroll to a specific slide
  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    // Calculate the scroll position
    const slideWidth = scrollContainerRef.current.offsetWidth * 0.85; // 85% of container width
    const scrollPosition = index * (slideWidth + 16); // 16px is the margin-right
    
    // Smooth scroll to the position
    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    // Update the selected index
    setSelectedIndex(index);
    
    // Update button states
    updateButtonStates(index);
  };
  
  // Update the button states based on the current index
  const updateButtonStates = (index: number) => {
    setCanScrollPrev(index > 0);
    setCanScrollNext(index < creators.length - 1);
  };
  
  // Handle scroll event to update the selected index
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    // Calculate which slide is most visible
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const slideWidth = scrollContainerRef.current.offsetWidth * 0.85; // 85% of container width
    const currentIndex = Math.round(scrollLeft / (slideWidth + 16)); // 16px is the margin-right
    
    // Update the selected index and button states
    if (currentIndex !== selectedIndex) {
      setSelectedIndex(currentIndex);
      updateButtonStates(currentIndex);
    }
  };
  
  // Scroll to the previous slide
  const scrollPrev = () => {
    if (selectedIndex > 0) {
      scrollToSlide(selectedIndex - 1);
    }
  };
  
  // Scroll to the next slide
  const scrollNext = () => {
    if (selectedIndex < creators.length - 1) {
      scrollToSlide(selectedIndex + 1);
    }
  };
  
  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    // Add passive scroll listener for better performance
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up the listener when component unmounts
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [selectedIndex]);
  
  // Update button states when creators change
  useEffect(() => {
    updateButtonStates(selectedIndex);
  }, [creators, selectedIndex]);

  return (
    <div className="relative w-full py-4 px-2">
      {/* Native scroll-snap container with extra padding to prevent touching viewport edge */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4 hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          paddingLeft: '12px', 
          paddingRight: '12px',
          // Hide scrollbar
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          borderLeft: '8px solid transparent', /* Add transparent border to create more edge space */
          borderRight: '8px solid transparent'
        }}
      >
        {creators.map((creator, index) => (
          <div 
            key={creator.name} 
            className="flex-none w-[94%] mr-3"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
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
      
      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className={`absolute left-3 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-2.5 text-white z-10 transition-opacity ${
          !canScrollPrev ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={scrollNext}
        className={`absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-2.5 text-white z-10 transition-opacity ${
          !canScrollNext ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {creators.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === selectedIndex ? 'w-4 bg-purple-600' : 'w-2 bg-purple-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* CSS for hiding scrollbars */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};