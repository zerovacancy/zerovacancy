
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
}

export const PreviewContent: React.FC<PreviewContentProps> = ({
  isVisible,
  loadedImages,
  handleImageLoad,
  creatorData
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col w-full relative z-10 scroll-container-optimized">
      {/* SearchBar container */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        isMobile ? "py-2.5" : "py-3 sm:py-4 md:py-6"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SearchBar onLocationSelect={() => {}} />
        </motion.div>
      </div>
      
      {/* Enhanced separator - visible on mobile */}
      <div className={cn(
        "h-px w-full mx-auto",
        isMobile 
          ? "bg-indigo-200/30 max-w-[95%]" 
          : "bg-gradient-to-r from-transparent via-purple-200/50 to-transparent max-w-[90%]"
      )}></div>
    
      {/* CreatorsList container with enhanced background */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        "bg-gradient-to-b from-transparent",
        isMobile 
          ? "via-purple-50/30 to-purple-50/50 pb-5 pt-3" 
          : "via-purple-50/20 to-purple-50/40 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8"
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
