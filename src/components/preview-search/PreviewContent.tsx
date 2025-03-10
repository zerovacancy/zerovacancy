
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '../search/SearchBar';
import { CreatorsList } from '../search/CreatorsList';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Creator } from '../creator/types';

interface PreviewContentProps {
  isVisible: boolean;
  loadedImages: Set<string>;
  handleImageLoad: (imagePath: string) => void;
  creatorData: Creator[];
  locationValue?: string;
  onLocationSelect: (location: string) => void;
}

export const PreviewContent: React.FC<PreviewContentProps> = ({
  isVisible,
  loadedImages,
  handleImageLoad,
  creatorData,
  locationValue = '',
  onLocationSelect
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col w-full relative z-10 scroll-container-optimized">
      {/* SearchBar container */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        isMobile ? "py-1.5" : "py-3 sm:py-4 md:py-6"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SearchBar 
            value={locationValue} 
            onLocationSelect={onLocationSelect} 
          />
        </motion.div>
      </div>
      
      {/* Subtle separator - Hidden on mobile */}
      {!isMobile && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-200/50 to-transparent mx-auto max-w-[90%]"></div>
      )}
    
      {/* CreatorsList container - simple background on mobile */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        isMobile ? "pb-4 pt-2" : "pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8",
        !isMobile && "bg-gradient-to-b from-transparent via-purple-50/20 to-purple-50/40"
      )}>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <CreatorsList 
                creators={creatorData} 
                sortBy="rating" 
                onSort={() => {}} 
                onImageLoad={handleImageLoad} 
                loadedImages={loadedImages}
                imageRef={(el) => el}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
