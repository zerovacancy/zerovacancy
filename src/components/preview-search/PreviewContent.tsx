
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
      {/* SearchBar container with enhanced styling */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        isMobile ? "py-3.5" : "py-3 sm:py-4 md:py-6", // Increased padding on mobile
        // Adding subtle background tint for section differentiation
        "bg-white/90"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SearchBar onLocationSelect={() => {}} />
        </motion.div>
      </div>
      
      {/* Enhanced separator - more visible on mobile */}
      <div className={cn(
        "h-px w-full mx-auto",
        isMobile 
          ? "bg-indigo-200/50 max-w-[95%]" // More visible on mobile
          : "bg-gradient-to-r from-transparent via-purple-200/50 to-transparent max-w-[90%]"
      )}></div>
    
      {/* CreatorsList container with enhanced background gradient */}
      <div className={cn(
        "w-full px-3 sm:px-6 md:px-8 lg:px-10",
        "bg-gradient-to-b from-transparent",
        isMobile 
          ? "via-purple-50/40 to-purple-50/60 pb-6 pt-4" // More pronounced gradient on mobile
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
