import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';

interface MobileCreatorCarouselProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef?: (node: HTMLImageElement | null) => void;
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

  // Function to scroll to a specific slide with more precise calculations
  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    // Get all slide elements
    const slideElements = scrollContainerRef.current.querySelectorAll('[data-slide]');
    if (slideElements.length === 0 || !slideElements[index]) return;
    
    // Use the actual position of the slide element for more accurate scrolling
    const slideElement = slideElements[index] as HTMLElement;
    const containerLeft = scrollContainerRef.current.getBoundingClientRect().left;
    const slideLeft = slideElement.getBoundingClientRect().left;
    const currentScrollLeft = scrollContainerRef.current.scrollLeft;
    
    // Calculate the exact position to scroll to
    const scrollPosition = currentScrollLeft + (slideLeft - containerLeft) - 16; // 16px is the left padding
    
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
  
  // Handle scroll event to update the selected index - uses a more accurate calculation
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerVisible = container.getBoundingClientRect();
    const slideElements = container.querySelectorAll('[data-slide]');
    if (slideElements.length === 0) return;
    
    // Find which slide has the most visible area within the viewport
    let maxVisibleArea = 0;
    let maxVisibleIndex = selectedIndex;
    
    slideElements.forEach((slideElement, index) => {
      const slideRect = slideElement.getBoundingClientRect();
      
      // Calculate the visible area of this slide
      const visibleLeft = Math.max(slideRect.left, containerVisible.left);
      const visibleRight = Math.min(slideRect.right, containerVisible.right);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      const visibleArea = visibleWidth * slideRect.height;
      
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        maxVisibleIndex = index;
      }
    });
    
    // Update the selected index and button states only if it changed
    if (maxVisibleIndex !== selectedIndex) {
      setSelectedIndex(maxVisibleIndex);
      updateButtonStates(maxVisibleIndex);
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
  
  // Set up scroll event listener with debouncing for better performance
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    // Debounce the scroll handler to improve performance
    let scrollTimeout: number | null = null;
    
    const debouncedScrollHandler = () => {
      // Clear any existing timeout
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout
      scrollTimeout = window.setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 50); // 50ms debounce time - short enough to feel responsive, long enough to avoid excessive calculations
    };
    
    // Add passive scroll listener for better performance
    scrollContainer.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    
    // Clean up the listener when component unmounts
    return () => {
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      scrollContainer.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [selectedIndex]);
  
  // Initialize by setting the selected card visible with a slight delay after mount
  useEffect(() => {
    // Wait until DOM is fully rendered
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && scrollContainerRef.current.children.length > 0) {
        // Select the first slide by default
        updateButtonStates(0);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update button states when creators change
  useEffect(() => {
    updateButtonStates(selectedIndex);
  }, [creators, selectedIndex]);

  return (
    <div className="relative w-full py-3 px-1">
      {/* Native scroll-snap container with optimized padding */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-3 hide-scrollbar"
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
          borderLeft: '4px solid transparent', /* Edge space - reduced to show more of adjacent cards */
          borderRight: '4px solid transparent',
          // Optimize GPU rendering
          transform: 'translateZ(0)',
          willChange: 'scroll-position',
          backfaceVisibility: 'hidden',
          // Safari-specific fixes
          WebkitBoxSizing: 'border-box',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        {creators.map((creator, index) => (
          <div 
            key={creator.name}
            data-slide={`slide-${index}`}
            className="flex-none w-[85%] mr-[12px]"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              // Optimize for touch interactions
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'pan-x',
              // Smooth transitions when elements change
              transition: 'transform 150ms ease-out, box-shadow 150ms ease',
              transform: selectedIndex === index ? 'scale(1)' : 'scale(0.97)',
              boxShadow: selectedIndex === index 
                ? '0 4px 20px rgba(124, 58, 237, 0.08)' 
                : '0 2px 10px rgba(0, 0, 0, 0.05)',
              // Safari fixes
              minWidth: 'calc(85% - 12px)',
              WebkitFlexBasis: '85%',
              flexBasis: '85%',
            }}
          >
            <CreatorCard 
              creator={creator} 
              onImageLoad={onImageLoad}
              loadedImages={loadedImages}
              imageRef={(node) => imageRef && imageRef(node)}
              onPreviewClick={onPreviewClick}
              isSelected={selectedIndex === index}
            />
          </div>
        ))}
      </div>
      
      {/* Enhanced navigation buttons with better touch targets */}
      <button
        onClick={scrollPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-3 text-white z-10 transition-all shadow-md ${
          !canScrollPrev ? 'opacity-0 pointer-events-none translate-x-[-10px]' : 'opacity-100 translate-x-0'
        }`}
        aria-label="Previous"
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          transform: 'translateZ(0) translateY(-50%)',
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={scrollNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-3 text-white z-10 transition-all shadow-md ${
          !canScrollNext ? 'opacity-0 pointer-events-none translate-x-[10px]' : 'opacity-100 translate-x-0'
        }`}
        aria-label="Next"
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          transform: 'translateZ(0) translateY(-50%)',
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Improved indicator dots with better touch targets */}
      <div className="flex justify-center mt-5 space-x-3">
        {creators.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`transition-all rounded-full ${
              idx === selectedIndex 
                ? 'w-6 h-2.5 bg-purple-600' 
                : 'w-2.5 h-2.5 bg-purple-300/70'
            }`}
            style={{
              // Improve touch target without changing visual size
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* Invisible touch target extender */}
            <span 
              className="absolute inset-0 -m-2"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      
      {/* CSS for hiding scrollbars and touch feedback */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          /* Add active state feedback for touch devices */
          button:active {
            transform: translateZ(0) scale(0.95);
            transition: transform 0.1s ease-out;
          }

          /* Touch feedback animation for card elements */
          @keyframes card-select-pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.2);
            }
            70% {
              box-shadow: 0 0 0 5px rgba(124, 58, 237, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
            }
          }
          
          /* Smooth slide-in animation for nav buttons */
          @keyframes slide-in-left {
            from { transform: translateX(-10px) translateY(-50%); opacity: 0; }
            to { transform: translateX(0) translateY(-50%); opacity: 1; }
          }
          
          @keyframes slide-in-right {
            from { transform: translateX(10px) translateY(-50%); opacity: 0; }
            to { transform: translateX(0) translateY(-50%); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};