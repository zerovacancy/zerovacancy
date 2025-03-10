
import React, { useRef, useState } from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { ChevronDown, Filter, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Creator } from '../creator/types';

interface CreatorsListProps {
  creators: Creator[];
  sortBy: string;
  onSort: (value: string) => void;
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (el: HTMLImageElement | null) => void;
}

export const CreatorsList: React.FC<CreatorsListProps> = ({
  creators,
  sortBy,
  onSort,
  onImageLoad,
  loadedImages,
  imageRef
}) => {
  const isMobile = useIsMobile();
  const filterTagsRef = useRef<HTMLDivElement>(null);
  const [showAllCreators, setShowAllCreators] = useState(false);

  // Determine which creators to show based on mobile state and expanded state
  const visibleCreators = isMobile && !showAllCreators ? creators.slice(0, 1) : creators;

  // Filter tags with improved styling
  const filterTags = ["All Services", "Photography", "Video Tours", "Drone Footage", "3D Tours", "Floor Plans", "Virtual Staging"];
  
  return (
    <div className="relative">
      {/* Filters section with horizontal scrolling on mobile */}
      <div className="mb-4 sm:mb-6">
        {/* Horizontally scrollable filter tags for mobile */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative" ref={filterTagsRef}>
          {/* Gradient fade indicators for horizontal scroll */}
          {isMobile && <>
              <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            </>}
          
          <div className="flex space-x-2 pb-1 min-w-max" role="tablist">
            {filterTags.map((tag, index) => <button 
                key={index} 
                className={cn(
                  "transition-all whitespace-nowrap rounded-full border border-gray-200", 
                  "font-medium shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800", 
                  index === 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-gray-700", 
                  isMobile ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                )}
                role="tab"
                aria-selected={index === 0}
                aria-label={`Filter by ${tag}`}
              >
                {index === 0 && <Filter className={cn("inline-block mr-1.5", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} aria-hidden="true" />}
                {tag}
              </button>)}
          </div>
        </div>
      </div>
      
      {/* Creators grid with single column on mobile, multi-column on larger screens */}
      <div 
        className={cn(
          "grid gap-4 sm:gap-5 md:gap-6", 
          isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
        role="list"
        aria-label="Creators list"
      >
        {visibleCreators.map((creator, index) => <motion.div 
            key={creator.name} 
            initial={{
              opacity: 0,
              y: 20
            }} 
            animate={{
              opacity: 1,
              y: 0
            }} 
            transition={{
              duration: 0.5,
              delay: isMobile ? 0.1 * index : 0.1 + index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            role="listitem"
          >
            <CreatorCard 
              creator={creator} 
              onImageLoad={onImageLoad} 
              loadedImages={loadedImages} 
              imageRef={imageRef} 
            />
          </motion.div>)}
        
        {creators.length === 0 && <div className="col-span-full text-center py-10">
            <div className="text-gray-500">No creators found</div>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
          </div>}
      </div>
      
      {/* Mobile expand/collapse button - only visible if there are more than 1 creator */}
      {isMobile && creators.length > 1 && (
        <div className="mt-4 mb-6 text-center">
          <motion.button 
            className={cn(
              "inline-flex items-center justify-center px-6 py-3",
              "rounded-lg",
              "bg-gradient-to-r from-gray-50 to-indigo-50/30",
              "text-indigo-600/80 font-medium",
              "border border-indigo-100/50",
              "shadow-sm",
              "hover:shadow-md hover:bg-indigo-50/50 transition-all duration-200",
              "text-sm w-[85%] mx-auto",
              "relative overflow-hidden group",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={() => setShowAllCreators(!showAllCreators)}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.3
            }}
            whileTap={{
              scale: 0.98
            }}
            aria-expanded={showAllCreators}
            aria-label={showAllCreators ? "Show less creators" : `Show ${creators.length - 1} more creators`}
          >
            <span className="relative z-10 flex items-center">
              {showAllCreators ? "Show less creators" : `Show ${creators.length - 1} more creators`}
              {showAllCreators 
                ? <ChevronUp className="ml-1.5 w-3.5 h-3.5 text-indigo-500/70" aria-hidden="true" /> 
                : <ChevronDown className="ml-1.5 w-3.5 h-3.5 text-indigo-500/70" aria-hidden="true" />
              }
            </span>
            
            {/* Subtle shimmer effect with enhanced border/glow */}
            <span className="absolute inset-0 z-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent border border-indigo-200/30 shadow-[0_0_8px_rgba(129,140,248,0.15)]" aria-hidden="true" />
          </motion.button>
        </div>
      )}
      
      {/* Desktop "Show more" button - only visible on desktop */}
      {!isMobile && creators.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            className={cn(
              "inline-flex items-center justify-center px-5 py-2.5 rounded-lg",
              "relative overflow-hidden group",
              "text-white font-semibold shadow-md shadow-indigo-200/50", 
              "hover:shadow-lg hover:shadow-indigo-300/50 hover:-translate-y-0.5", 
              "transform active:scale-[0.98] transition-all duration-200",
              "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            aria-label="Show more creators"
          >
            <span className="relative z-10 flex items-center">
              Show more creators
              <ChevronDown className="ml-1.5 w-4 h-4" aria-hidden="true" />
            </span>
            
            {/* Adding the shimmer effect with enhanced border/glow to match other CTAs */}
            <span className="absolute inset-0 z-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-white/20 to-transparent border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.15)]" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
