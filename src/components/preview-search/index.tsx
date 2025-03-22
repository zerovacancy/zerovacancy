import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewContent } from './PreviewContent';
import { useIsMobile } from '@/hooks/use-mobile';

// Replacing motion animation with CSS to prevent jitter
// Static title component with CSS-based animation that's more efficient
const SectionTitle = memo(({ isVisible, isMobile }: { isVisible: boolean; isMobile: boolean }) => {
  // Pre-compute classes to avoid recalculation during render
  const titleClass = useMemo(() => cn(
    "text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2",
    // Use CSS classes for animation instead of JS-based motion
    "transition-all duration-500 transform-gpu", 
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  ), [isVisible]);

  const subtitleClass = useMemo(() => cn(
    "text-sm sm:text-base text-gray-600 max-w-md mx-auto",
    "transition-all duration-500 delay-200 transform-gpu",
    isVisible ? "opacity-100" : "opacity-0"
  ), [isVisible]);

  // Fixed content that won't change to reduce rerender overhead
  return (
    <div className={cn(
      "flex-1",
      isMobile && "mb-3"
    )}>
      <h2 
        className={titleClass}
        style={{ 
          willChange: 'opacity, transform',
          transform: isVisible ? 'translateZ(0)' : 'translateZ(0) translateY(10px)'
        }}
      >
        FIND YOUR CREATIVE COLLABORATOR
      </h2>
      
      <p 
        className={subtitleClass}
        style={{ 
          willChange: 'opacity',
          transitionDelay: '0.2s'
        }}
      >
        Because extraordinary spaces deserve extraordinary storytellers
      </p>
    </div>
  );
});

// Direct export with arrow function
const PreviewSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  // Track if component has been seen to avoid reanimation
  const hasBeenSeen = useRef(false);
  
  // Precalculate container styles to avoid recalculation
  const containerClasses = useMemo(() => cn(
    "w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10",
    // Remove content-visibility-auto which can cause jitter when combined with IntersectionObserver
    isMobile ? "py-6 pb-8" : "py-6 sm:py-6 md:py-8",
    isMobile ? "relative mt-3 rounded-2xl border border-purple-100/70 bg-[#F9F7FF] shadow-[0_8px_15px_-3px_rgba(138,79,255,0.1),_0_4px_6px_-4px_rgba(138,79,255,0.15)]" : "bg-[#F5F0FF]/60"
  ), [isMobile]);
  
  // Optimize the Intersection Observer to use only when needed
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Use a more conservative threshold and smaller rootMargin to trigger earlier
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Once section becomes visible, set visible state and mark as seen
          setIsVisible(true);
          hasBeenSeen.current = true;
          
          // Add class for CSS transitions if needed
          containerRef.current?.classList.add('content-visible');
          
          // Once we've seen it once, disconnect the observer to save resources
          observer.disconnect();
        }
      },
      // More generous margins to start loading earlier
      { threshold: 0.05, rootMargin: '250px' }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Pre-compute card style properties
  const cardGlowStyle = useMemo(() => ({
    opacity: isVisible ? 0.8 : 0,
    transform: 'translateZ(0)', // Hardware acceleration
    transition: 'opacity 0.5s ease, blur 0.5s ease',
    willChange: 'opacity, filter', // Optimization hint
  }), [isVisible]);

  return (
    <div 
      className={containerClasses}
      ref={containerRef}
      style={{
        contain: 'layout paint style', // Optimization for layout calculation
        contentVisibility: 'auto', // More efficient than content-visibility CSS class
        position: 'relative',
        transform: 'translateZ(0)', // Hardware acceleration
      }}
    >
      {/* Section header with optimized rendering */}
      <div className={cn(
        "text-center relative z-20",
        "pb-4 mb-4 transform-gpu", // Force GPU rendering
        isMobile && "border-b border-purple-100"
      )}
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        willChange: 'transform', // Optimization hint
      }}>
        {/* Section label for better organization - static element */}
        {isMobile && (
          <div 
            className="mb-3 flex items-center justify-center transform-gpu"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="h-px w-5 bg-gray-200 mr-2"></div>
            <span className="text-xs uppercase tracking-wider text-gray-700 font-semibold">Creator Network</span>
            <div className="h-px w-5 bg-gray-200 ml-2"></div>
          </div>
        )}
        
        <div className={cn(
          "flex transform-gpu",
          isMobile ? "flex-col" : "items-center justify-between"
        )}
        style={{ transform: 'translateZ(0)' }}
        >
          {/* Optimized title component with CSS animations instead of JS */}
          <SectionTitle isVisible={isVisible} isMobile={isMobile} />
        </div>

        {/* Visual separator for mobile - static element */}
        {isMobile && (
          <div 
            className="w-12 h-1 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded-full mx-auto mt-4 opacity-60 transform-gpu"
            style={{ transform: 'translateZ(0)' }}
          ></div>
        )}
      </div>

      {/* Main content wrapper with optimized animations */}
      <div 
        className="mx-auto relative group max-w-7xl transform-gpu"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Removed desktop glow effect for a cleaner look */}

        {/* Main content card with optimized visibility prop */}
        <PreviewCard isVisible={isVisible || hasBeenSeen.current}>
          <PreviewContent />
        </PreviewCard>
      </div>
      
      {/* Mobile-only divider - static element */}
      {isMobile && (
        <div 
          className="mobile-section-divider mt-6 mb-1 transform-gpu"
          style={{ transform: 'translateZ(0)' }}
        ></div>
      )}
    </div>
  );
}

// Direct export
export default PreviewSearch;
