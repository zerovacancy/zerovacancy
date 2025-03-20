
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingCard } from "./PricingCard";
import { motion } from "framer-motion";

interface PricingCardListProps {
  cards: Array<{
    title: string;
    price: number;
    interval: string;
    description: string;
    features: string[];
    cta: string;
    color?: any;
    highlighted?: boolean;
    showPopularTag?: boolean;
    valueProposition?: string;
    footerText?: string;
  }>;
  subscription: any;
  isLoading: boolean;
}

export const PricingCardList = ({ 
  cards, 
  subscription, 
  isLoading 
}: PricingCardListProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(
    cards.findIndex(card => card.highlighted) !== -1 
      ? cards.findIndex(card => card.highlighted) 
      : 1
  );
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle navigation between cards on mobile
  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && activeIndex < cards.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  
  // Scroll to active card on mobile
  useEffect(() => {
    if (isMobile && containerRef.current) {
      const container = containerRef.current;
      const cardWidth = container.offsetWidth;
      const scrollPosition = activeIndex * cardWidth;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isMobile]);
  
  // Handle swipe gestures on mobile
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    
    let startX: number;
    let currentX: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      currentX = startX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const diff = startX - currentX;
      // Minimum swipe threshold (40px)
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          // Swipe left - go to next card
          handleNavigation('next');
        } else {
          // Swipe right - go to previous card
          handleNavigation('prev');
        }
      }
    };
    
    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, activeIndex]);

  // Remove this function as we now have an enhanced CTA button directly in the JSX

  return (
    <div className="relative animate-in fade-in">
      {/* Enhanced mobile pagination indicators with plan names */}
      {isMobile && (
        <div className="flex justify-center mb-6 space-x-3 overflow-x-auto py-2 px-1 no-scrollbar">
          {cards.map((card, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "transition-all duration-300 px-4 py-1.5 rounded-full text-sm font-medium touch-manipulation",
                index === activeIndex 
                  ? "bg-brand-purple text-white shadow-md ring-2 ring-purple-300 ring-offset-2" 
                  : "bg-white/90 text-slate-600 shadow-sm border border-slate-200"
              )}
              aria-label={`View ${card.title} plan`}
            >
              {card.title}
            </button>
          ))}
        </div>
      )}
      
      {/* Enhanced mobile navigation buttons with better positioning */}
      {isMobile && (
        <div className="absolute z-10 inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none mt-12">
          {activeIndex > 0 && (
            <button
              onClick={() => handleNavigation('prev')}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white rounded-full shadow-[0_4px_12px_rgba(139,92,246,0.3)] ml-2 pointer-events-auto touch-manipulation"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {activeIndex < cards.length - 1 && (
            <button
              onClick={() => handleNavigation('next')}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white rounded-full shadow-[0_4px_12px_rgba(139,92,246,0.3)] mr-2 pointer-events-auto touch-manipulation"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      
      {/* Enhanced vertical card layout for mobile */}
      <div
        ref={containerRef}
        className={cn(
          isMobile
            ? "flex overflow-x-hidden snap-x snap-mandatory scrollbar-hide"
            : "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10",
          "transition-opacity duration-500"
        )}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          ...(isMobile && { 
            paddingBottom: '24px',
            borderRadius: '16px'
          })
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.title}
            className={cn(
              isMobile 
                ? "min-w-full flex-shrink-0 snap-center px-5 py-2 transition-all duration-300"
                : "",
              isMobile && index === activeIndex
                ? "scale-[1.02] shadow-lg z-10"
                : "",
              !isMobile && card.highlighted 
                ? "md:z-10 md:shadow-xl"
                : ""
            )}
            style={{
              ...(isMobile && { 
                opacity: index === activeIndex ? 1 : 0.5,
                transform: `scale(${index === activeIndex ? 1.02 : 0.98})`,
                transformOrigin: 'center'
              })
            }}
          >
            <PricingCard
              {...card}
              isLoading={isLoading}
              isCurrentPlan={subscription?.plan === card.title}
              footerText={card.footerText}
            />
          </div>
        ))}
      </div>
      
      {/* Enhanced mobile swipe instruction with animated indicator */}
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-brand-purple-light/20 to-brand-purple/20 backdrop-blur-sm text-brand-purple font-medium text-sm px-4 py-2 rounded-full shadow-lg">
            <span className="animate-ping absolute h-2 w-2 rounded-full bg-brand-purple opacity-75 mx-1"></span>
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span>Compare Plans</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </div>
        </motion.div>
      )}
      
      {/* Enhanced global CTA button for mobile */}
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 px-4"
        >
          <button className={cn(
            "w-full py-4 rounded-xl font-bold text-white text-lg",
            "bg-gradient-to-r from-brand-purple to-indigo-600",
            "border border-brand-purple/30",
            "shadow-[0_4px_15px_rgba(118,51,220,0.25)]",
            "transition-all duration-200 touch-manipulation",
            "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
          )}>
            Get Started with {cards[activeIndex].title}
          </button>
          
          {/* Security badge */}
          <div className="flex items-center justify-center mt-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-slate-500 ml-1.5">Secure payment processing</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
