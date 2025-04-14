import * as React from 'react';
import { useRef, useState, useEffect, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewContent } from './PreviewContent';
import { useIsMobile } from '@/hooks/use-mobile';

// Replacing motion animation with CSS to prevent jitter
// Static title component with CSS-based animation that's more efficient
const SectionTitle = memo(({ isVisible, isMobile }: { isVisible: boolean; isMobile: boolean }) => {
  // Pre-compute classes to avoid recalculation during render
  const titleClass = useMemo(() => cn(
    isMobile 
      ? "mobile-text-2xl mobile-heading" 
      : "text-2xl sm:text-3xl font-bold text-gray-900",
    "tracking-tight mb-space-sm",
    // Use CSS classes for animation instead of JS-based motion
    "transition-all duration-500 gpu-accelerated", 
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
    // Add padding for mobile to prevent text overflow
    isMobile ? "px-space-xs w-full mt-space-xs" : ""
  ), [isVisible, isMobile]);

  const subtitleClass = useMemo(() => cn(
    isMobile 
      ? "mobile-text-sm mobile-body" 
      : "text-sm sm:text-base text-gray-600",
    "max-w-md mx-auto",
    "transition-all duration-500 delay-200 gpu-accelerated",
    isVisible ? "opacity-100" : "opacity-0",
    // Add padding for mobile to prevent text overflow
    isMobile ? "px-space-sm w-full" : ""
  ), [isVisible, isMobile]);

  // Fixed content that won't change to reduce rerender overhead
  return (
    <div className={cn(
      "flex-1",
      isMobile && "mb-space-sm"
    )}>
      <h2 
        id="creators-title" 
        className={cn(titleClass, "headingLarge")}
        style={{ 
          background: 'linear-gradient(to right, #7633DC, #A367E7)', // Gradient text for better visibility
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        {isMobile ? (
          <>
            FIND YOUR<br />
            CREATIVE COLLABORATOR
          </>
        ) : (
          'FIND YOUR CREATIVE COLLABORATOR'
        )}
      </h2>
      
      <p 
        className={cn(subtitleClass, "bodyText tagline")}
        style={{ 
          transitionDelay: '0.2s'
        }}
      >
        {isMobile ? 
          "Extraordinary spaces deserve extraordinary storytellers" : 
          "Because extraordinary spaces deserve extraordinary storytellers"
        }
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
    "w-full",
    // Use our mobile spacing system
    isMobile ? "py-space-md pb-space-lg" : "py-6 sm:py-6 md:py-8",
    isMobile ? "relative mt-space-sm" : "",
    "gpu-accelerated"
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

  return (
    <section 
      id="find-creators"
      aria-labelledby="creators-title"
      className={containerClasses}
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: '#EBE3FF', // Consistent lavender background for both mobile and desktop
        paddingTop: isMobile ? 'var(--section-spacing-mobile)' : '40px',
        borderTop: isMobile ? 'none' : '1px solid rgba(138, 66, 245, 0.1)',
        marginTop: isMobile ? '30px' : 0
      }}
    >
      {/* Section header */}
      <div className={cn(
        "text-center relative z-30",
        isMobile ? "pb-space-md mb-space-md px-container-padding-mobile" : "pb-6 mb-6",
        "gpu-accelerated"
      )}>
        {/* Enhanced section label for better visual distinction */}
        {isMobile ? (
          <div className="mb-space-md flex flex-col items-center justify-center gpu-accelerated mt-space-xs">
            <div className="bg-purple-100 px-4 py-1.5 rounded-full mb-2 shadow-sm">
              <span className="mobile-text-xs uppercase tracking-wider text-purple-700 font-semibold">Creator Network</span>
            </div>
            <div className="h-px w-16 bg-purple-200/70"></div>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center gpu-accelerated mt-space-xs">
            <div className="h-px w-16 bg-purple-200/60 mr-3"></div>
            <span className="text-sm uppercase tracking-wider text-purple-700 font-semibold px-4 py-1 bg-purple-100/80 rounded-full">Creator Network</span>
            <div className="h-px w-16 bg-purple-200/60 ml-3"></div>
          </div>
        )}
        
        <div className={cn(
          "flex gpu-accelerated",
          isMobile ? "flex-col" : "items-center justify-between"
        )}>
          {/* Optimized title component with CSS animations instead of JS */}
          <SectionTitle isVisible={isVisible} isMobile={isMobile} />
        </div>
      </div>

      {/* Main content wrapper */}
      <div className={cn(
        "mx-auto relative group",
        isMobile ? "px-container-padding-mobile" : "px-5",
        "max-w-7xl gpu-accelerated"
      )}>
        {/* Main content card with optimized visibility prop */}
        <PreviewCard isVisible={isVisible || hasBeenSeen.current}>
          <PreviewContent />
        </PreviewCard>
      </div>
    </section>
  );
}

// Direct export
export default PreviewSearch;
