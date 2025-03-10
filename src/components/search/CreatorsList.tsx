
import React, { useRef } from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Creator } from '../creator/types';

interface CreatorsListProps {
  creators: Creator[];
  sortBy: string;
  onSort: (value: string) => void;
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (el: HTMLImageElement | null) => void;
  activeCardIndex?: number;
}

export const CreatorsList: React.FC<CreatorsListProps> = ({
  creators,
  sortBy,
  onSort,
  onImageLoad,
  loadedImages,
  imageRef,
  activeCardIndex = 0
}) => {
  const isMobile = useIsMobile();
  const filterTagsRef = useRef<HTMLDivElement>(null);

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
          
          <div className="flex space-x-2 pb-1 min-w-max">
            {filterTags.map((tag, index) => (
              <button 
                key={index} 
                className={cn(
                  "transition-all whitespace-nowrap rounded-full border border-gray-200", 
                  "font-medium shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800", 
                  index === 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-gray-700", 
                  isMobile ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5" // Smaller on mobile
                )}
              >
                {index === 0 && <Filter className={cn("inline-block mr-1.5", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} />}
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile horizontal slider */}
      {isMobile ? (
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeCardIndex * 100}%)` }}
          >
            {creators.map((creator, index) => (
              <div 
                key={creator.name} 
                className="w-full flex-shrink-0 px-1.5"
              >
                <CreatorCard 
                  creator={creator} 
                  onImageLoad={onImageLoad} 
                  loadedImages={loadedImages} 
                  imageRef={imageRef} 
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Desktop grid layout - show all cards
        <div className={cn("grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {creators.map((creator, index) => (
            <motion.div 
              key={creator.name} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <CreatorCard 
                creator={creator} 
                onImageLoad={onImageLoad} 
                loadedImages={loadedImages} 
                imageRef={imageRef} 
              />
            </motion.div>
          ))}
          
          {creators.length === 0 && (
            <div className="col-span-full text-center py-10">
              <div className="text-gray-500">No creators found</div>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
      
      {/* Desktop "Show more" button - only visible on desktop if there are creators */}
      {!isMobile && creators.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            className={cn(
              "inline-flex items-center justify-center px-5 py-2.5 rounded-lg", // Changed from rounded-full to rounded-lg
              "relative overflow-hidden group",
              "text-white font-semibold shadow-md shadow-indigo-200/50", 
              "hover:shadow-lg hover:shadow-indigo-300/50 hover:-translate-y-0.5", 
              "transform active:scale-[0.98] transition-all duration-200",
              "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700"
            )}
          >
            <span className="relative z-10 flex items-center">
              Show more creators
              <ChevronDown className="ml-1.5 w-4 h-4" />
            </span>
            
            {/* Adding the shimmer effect to match other CTAs */}
            <span className="absolute inset-0 z-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>
      )}
    </div>
  );
};
