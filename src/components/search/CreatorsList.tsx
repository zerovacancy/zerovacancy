
import React, { useRef } from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Creator } from '../creator/types';
import { MobileCreatorCarousel } from './MobileCreatorCarousel';

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

  // Filter tags with improved styling
  const filterTags = ["All Services", "Photography", "Video Tours", "Drone Footage", "3D Tours", "Floor Plans", "Virtual Staging"];

  return (
    <div className="relative">
      {/* Filters section with horizontal scrolling - only visible on desktop */}
      {!isMobile && (
        <div className="mb-4 sm:mb-6">
          {/* Horizontally scrollable filter tags */}
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative" ref={filterTagsRef}>
            <div className="flex space-x-2 pb-1 min-w-max">
              {filterTags.map((tag, index) => (
                <button 
                  key={index} 
                  className={cn(
                    "transition-all whitespace-nowrap rounded-full border border-gray-200",
                    "font-medium shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800",
                    index === 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-gray-700",
                    "text-sm px-3 py-1.5"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop creator grid */}
      {!isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard 
              key={creator.name} 
              creator={creator} 
              onImageLoad={onImageLoad} 
              loadedImages={loadedImages} 
              imageRef={imageRef} 
            />
          ))}
        </div>
      )}

      {/* Mobile creator carousel */}
      {isMobile && (
        <MobileCreatorCarousel
          creators={creators}
          onImageLoad={onImageLoad}
          loadedImages={loadedImages}
          imageRef={imageRef}
        />
      )}
    </div>
  );
};

export default CreatorsList;
