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
    
    // Calculate the exact position to scroll to, ensure consistent padding offset
    // Hardcode the left padding value to match the container style (18px padding + 4px border)
    const paddingOffset = 22; 
    const scrollPosition = currentScrollLeft + (slideLeft - containerLeft) - paddingOffset;
    
    // Force scroll to the exact computed position
    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    // Store the exact scroll position to enforce after animation completes
    const finalTargetPosition = scrollPosition;
    
    // Set a timeout to check and correct position after the smooth scroll animation finishes
    setTimeout(() => {
      if (scrollContainerRef.current && Math.abs(scrollContainerRef.current.scrollLeft - finalTargetPosition) > 2) {
        // If position drifted, force it back (without animation)
        scrollContainerRef.current.scrollTo({
          left: finalTargetPosition,
          behavior: 'auto'
        });
      }
    }, 500); // 500ms should cover the smooth scroll duration
    
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
      
      // Special case for first slide - ensure it stays in position
      if (index === 0) {
        const firstSlideOffset = slideRect.left - containerVisible.left - 22; // 18px padding + 4px border
        
        // If first slide is more than 20px from its expected position, force correction
        // But only do this when the first slide is not the currently selected one
        // This prevents fighting with user scroll input
        if (Math.abs(firstSlideOffset) > 20 && maxVisibleIndex !== 0) {
          requestAnimationFrame(() => {
            // Only correct if we're not actively transitioning to a new slide
            // This prevents jumpy behavior during normal navigation
            const isTransitioning = container.style.scrollBehavior === 'smooth';
            if (!isTransitioning) {
              // Use a less noticeable correction to not disrupt user experience
              const currentScrollLeft = container.scrollLeft;
              container.scrollTo({
                left: currentScrollLeft - firstSlideOffset,
                behavior: 'auto'
              });
            }
          });
        }
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
  
  // Initialize carousel with simplified positioning logic for better reliability
  useEffect(() => {
    // Wait until DOM is fully rendered
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && scrollContainerRef.current.children.length > 0) {
        // Force the scroll position to show the first card properly
        if (scrollContainerRef.current) {
          // First reset scroll position to start
          scrollContainerRef.current.scrollLeft = 0;
          
          // Force a brief layout calculation
          scrollContainerRef.current.offsetHeight;
          
          // Then immediately position to the intended position (with no animation)
          const slideElements = scrollContainerRef.current.querySelectorAll('[data-slide]');
          if (slideElements?.[0]) {
            const slideElement = slideElements[0] as HTMLElement;
            // Position slide directly with exact calculation
            const cardWidth = slideElement.offsetWidth;
            const containerWidth = scrollContainerRef.current.offsetWidth;
            
            // Calculate position to center the card
            const position = 0; // Start at 0 for 'center' scrollSnapAlign to work
            
            // Apply position without animation
            scrollContainerRef.current.scrollLeft = position;
            
            // Apply final position with animation after a delay
            setTimeout(() => {
              if (scrollContainerRef.current) {
                scrollToSlide(0);
              }
            }, 100);
          }
        }
        
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
    <div className="relative w-full py-space-sm px-space-xs">
      {/* Native scroll-snap container with mobile spacing */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-space-sm hide-scrollbar mobile-contain-scroll gpu-accelerated"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          paddingLeft: 'var(--spacing-sm)',
          paddingRight: 'var(--spacing-sm)',
          paddingTop: 'var(--spacing-xs)', 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        {creators.map((creator, index) => (
          <div 
            key={creator.name}
            data-slide={`slide-${index}`}
            className={`flex-none w-[88%] mr-[var(--spacing-sm)] gpu-accelerated mobile-active-state`}
            style={{
              scrollSnapAlign: 'center',
              scrollSnapStop: 'normal',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'pan-x',
              transition: 'transform 180ms ease-out, opacity 180ms ease-out',
              transform: selectedIndex === index ? 'scale(1)' : 'scale(0.975)',
              opacity: 1,
              boxShadow: selectedIndex === index ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.03)',
              minWidth: 'calc(88% - var(--spacing-sm))',
              WebkitFlexBasis: '88%',
              flexBasis: '88%',
              maxHeight: '80vh',
              position: 'relative',
              zIndex: selectedIndex === index ? 2 : 1
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
      
      {/* Navigation buttons with mobile touch target */}
      <button
        onClick={scrollPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-space-xs text-white z-10 transition-all shadow-md mobile-touch-target ${
          !canScrollPrev ? 'opacity-0 pointer-events-none translate-x-[-10px]' : 'opacity-100 translate-x-0'
        }`}
        aria-label="Previous"
        style={{ 
          backgroundColor: 'rgba(100, 100, 100, 0.9)'
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={scrollNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-space-xs text-white z-10 transition-all shadow-md mobile-touch-target ${
          !canScrollNext ? 'opacity-0 pointer-events-none translate-x-[10px]' : 'opacity-100 translate-x-0'
        }`}
        aria-label="Next"
        style={{ 
          backgroundColor: 'rgba(100, 100, 100, 0.9)'
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Indicator dots with mobile touch target */}
      <div className="flex justify-center mt-space-md space-x-space-xs">
        {creators.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`transition-all rounded-full mobile-touch-target ${
              idx === selectedIndex 
                ? 'w-6 h-2.5 bg-[#EFEFEC]' 
                : 'w-2.5 h-2.5 bg-[rgba(239,240,236,0.7)]'
            }`}
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
      
      {/* CSS for hiding scrollbars, touch feedback, and positioning fixes */}
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

          /* Mobile card spacing adjustment */
          [data-slide] {
            transform-origin: center center !important;
            transition: transform 150ms ease-out !important;
          }
          
          /* Safari-specific overrides for scroll snap behavior */
          @supports (-webkit-touch-callout: none) {
            /* Target iOS Safari specifically */
            .hide-scrollbar {
              /* Use a different approach for iOS Safari scroll snap */
              scroll-snap-type: x mandatory !important;
              -webkit-scroll-snap-type: x mandatory !important;
            }
            
            [data-slide] {
              /* Ensure cards are positioned precisely in iOS Safari */
              scroll-snap-align: center !important;
              -webkit-scroll-snap-align: center !important;
              /* Force card positioning to overcome Safari bugs */
              transform: translateZ(0) !important;
            }
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