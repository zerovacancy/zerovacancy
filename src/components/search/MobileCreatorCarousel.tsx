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
  
  // Enhanced scroll handler with debouncing and CLS prevention
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerVisible = container.getBoundingClientRect();
    const slideElements = container.querySelectorAll('[data-slide]');
    if (slideElements.length === 0) return;
    
    // CLS Prevention: Set a CSS variable with container width for slide calculations
    // This ensures consistent dimensions without repeated layout calculations
    const containerWidth = containerVisible.width;
    container.style.setProperty('--container-width', `${containerWidth}px`);
    
    // Find which slide has the most visible area within the viewport
    let maxVisibleArea = 0;
    let maxVisibleIndex = selectedIndex;
    
    // Use Array.from for better performance with forEach
    Array.from(slideElements).forEach((slideElement, index) => {
      const slideRect = slideElement.getBoundingClientRect();
      
      // CLS Prevention: Use cached rect values to minimize layout thrashing
      const slideLeft = slideRect.left;
      const slideRight = slideRect.right;
      const slideHeight = slideRect.height;
      const containerLeft = containerVisible.left;
      const containerRight = containerVisible.right;
      
      // Calculate the visible area of this slide
      const visibleLeft = Math.max(slideLeft, containerLeft);
      const visibleRight = Math.min(slideRight, containerRight);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      const visibleArea = visibleWidth * slideHeight;
      
      // Record most visible slide
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        maxVisibleIndex = index;
      }
      
      // Enhanced first slide positioning to eliminate potential CLS
      if (index === 0) {
        // Use a constant value for padding to prevent layout shifts
        // 22px = 18px padding + 4px border
        const constantPadding = 22;
        const firstSlideOffset = slideLeft - containerLeft - constantPadding;
        
        // Only make corrections for significant offsets to avoid microjitters
        // Increased threshold to 25px to further reduce potential corrections
        if (Math.abs(firstSlideOffset) > 25 && maxVisibleIndex !== 0) {
          // Use requestAnimationFrame for smoother, more efficient updates
          requestAnimationFrame(() => {
            // Avoid fighting with intentional user scrolling or transitions
            const isTransitioning = 
              container.style.scrollBehavior === 'smooth' || 
              container.getAttribute('data-transitioning') === 'true';
              
            if (!isTransitioning) {
              // Mark container as currently making a correction to prevent multiple corrections
              container.setAttribute('data-correcting', 'true');
              
              // Calculate exact scroll position
              const currentScrollLeft = container.scrollLeft;
              const newScrollLeft = currentScrollLeft - firstSlideOffset;
              
              // Apply correction without animation to prevent visual jumps
              container.scrollTo({
                left: newScrollLeft,
                behavior: 'auto'
              });
              
              // Clear correction flag after animation frame
              requestAnimationFrame(() => {
                container.removeAttribute('data-correcting');
              });
            }
          });
        }
      }
    });
    
    // Update the selected index and button states only if it changed
    // This prevents unnecessary re-renders
    if (maxVisibleIndex !== selectedIndex) {
      // Set data attribute first for immediate visual feedback
      container.setAttribute('data-selected-index', maxVisibleIndex.toString());
      
      // Update state in the next animation frame to avoid blocking current frame
      requestAnimationFrame(() => {
        setSelectedIndex(maxVisibleIndex);
        updateButtonStates(maxVisibleIndex);
      });
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
  
  // Optimized scroll event handling with RAF and debouncing for improved performance and CLS reduction
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    // Track both timeout and animation frame IDs for proper cleanup
    let scrollTimeout: number | null = null;
    let rafId: number | null = null;
    let isScrolling = false;
    
    // Use both debouncing and requestAnimationFrame for optimal performance
    const enhancedScrollHandler = () => {
      // Mark that scrolling is happening to avoid conflicts
      isScrolling = true;
      
      // Clear existing timeout to only run after scrolling stops
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      
      // Cancel any existing animation frame request
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      
      // Use RAF to sync with browser rendering cycle - smoother visual updates
      rafId = window.requestAnimationFrame(() => {
        // During active scrolling, only use RAF + throttled updates
        // to avoid overwhelming the main thread and causing jank
        if (isScrolling) {
          handleScroll();
        }
        
        rafId = null;
      });
      
      // Debounce the end of scrolling to catch final position
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
        
        // Final position check after scrolling stops
        rafId = window.requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
        
        scrollTimeout = null;
      }, 100); // 100ms is a good balance for reliable position tracking without affecting responsiveness
    };
    
    // Add container class and data attributes for CLS prevention
    scrollContainer.classList.add('carousel-scroll-container');
    scrollContainer.setAttribute('data-scroll-optimized', 'true');
    scrollContainer.setAttribute('data-selected-index', selectedIndex.toString());
    
    // Add the passive flag for improved scrolling performance
    // The passive option indicates scrolling won't be prevented, allowing browser optimizations
    scrollContainer.addEventListener('scroll', enhancedScrollHandler, { passive: true });
    
    // Additional event for scroll end detection on touch devices
    scrollContainer.addEventListener('touchend', () => {
      // Small timeout to ensure scroll momentum has completed
      setTimeout(() => {
        if (!isScrolling) {
          handleScroll();
        }
      }, 50);
    }, { passive: true });
    
    // Clean up all resources when component unmounts
    return () => {
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      scrollContainer.removeEventListener('scroll', enhancedScrollHandler);
      scrollContainer.removeEventListener('touchend', enhancedScrollHandler);
    };
  }, [selectedIndex, handleScroll]);
  
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
      {/* Enhanced scroll-snap container with CLS prevention and hardware acceleration */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-space-sm hide-scrollbar mobile-contain-scroll gpu-accelerated mobile-creator-carousel-container"
        style={{
          // Scroll behavior optimizations
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          // Force hardware acceleration for smoother scroll
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Force a compositing layer
          willChange: 'transform',
          // Layout optimizations
          display: 'flex',
          // Precise spacing dimensions to prevent CLS
          paddingLeft: 'var(--spacing-sm, 16px)',
          paddingRight: 'var(--spacing-sm, 16px)',
          paddingTop: 'var(--spacing-xs, 8px)', 
          paddingBottom: 'var(--spacing-sm, 16px)',
          // Scrollbar hiding for different browsers
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          // Fixed borders to prevent layout shifts
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          // Fixed dimensions with aspect ratio to prevent CLS
          width: '100%',
          maxWidth: '100vw',
          // Prevent FOUT from affecting layout
          contentVisibility: 'auto',
          // Prevent overflowing content from causing CLS
          overflowY: 'hidden',
          // Prevents pull-to-refresh on iOS which can cause CLS
          overscrollBehavior: 'none',
          // Box sizing to ensure consistent dimensions
          boxSizing: 'border-box',
          // Fixed height to prevent outer container from shifting
          minHeight: '520px',
          // Contain layout to prevent shifts from children
          contain: 'layout paint'
        }}
        data-testid="mobile-carousel-container"
      >
        {creators.map((creator, index) => (
          <div 
            key={creator.name}
            data-slide={`slide-${index}`}
            data-index={index}
            data-selected={selectedIndex === index ? 'true' : 'false'}
            className={`flex-none w-[88%] mr-[var(--spacing-sm)] gpu-accelerated mobile-active-state carousel-slide`}
            style={{
              // Scroll snap behavior with immediate stop
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always', // Force immediate snap to prevent partial snapping
              
              // Mobile interaction optimizations
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'pan-x', // Only allow horizontal swiping
              pointerEvents: 'auto',
              
              // Transition only properties that don't cause layout shifts
              transitionProperty: 'transform, opacity, box-shadow',
              transitionDuration: '180ms',
              transitionTimingFunction: 'ease-out',
              
              // Scale transform using hardware acceleration
              // Only apply scale transform to selected item to prevent CLS
              transform: `translateZ(0) ${selectedIndex === index ? 'scale(1)' : 'scale(0.975)'}`,
              transformOrigin: 'center center',
              
              // Backface visibility to prevent flickering
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              
              // Fixed opacity to prevent fade transitions that might cause CLS
              opacity: 1,
              
              // Shadow only on non-selected items
              boxShadow: selectedIndex === index ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.03)',
              
              // Fixed width calculations to prevent CLS - explicit pixel values for width
              // Calculate width as percentage of container but with fixed values after calculation
              minWidth: 'calc(88% - var(--spacing-sm, 16px))',
              width: 'calc(88% - var(--spacing-sm, 16px))',
              maxWidth: 'calc(88% - var(--spacing-sm, 16px))',
              
              // Flexbox sizing to ensure consistent width
              WebkitFlexBasis: '88%',
              flexBasis: '88%',
              flexShrink: 0,
              flexGrow: 0,
              
              // Fixed height constraints to prevent vertical CLS
              height: 'auto',
              minHeight: '480px',
              maxHeight: '80vh',
              
              // Positioning for proper stacking
              position: 'relative',
              zIndex: selectedIndex === index ? 2 : 1,
              
              // Force hardware acceleration and compositing
              willChange: 'transform',
              
              // Box sizing to ensure consistent dimensions
              boxSizing: 'border-box',
              
              // Prevent margins from causing CLS
              margin: '0 var(--spacing-sm, 16px) 0 0',
              
              // Internal layout containment
              contain: 'layout style'
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