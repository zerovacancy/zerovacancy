
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
        "bg-gray-50/60 border border-gray-100 rounded-lg overflow-hidden shadow-sm",
        "sticky top-0 z-20",
        isMobile ? "p-4" : "p-6"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SearchBar onLocationSelect={() => {}} />
        </motion.div>
      </div>
    
      {/* CreatorsList container with enhanced background gradient */}
      <div className={cn(
        isMobile ? "px-4 pt-4" : "px-6 pt-6",
        "bg-gradient-to-b from-transparent",
        isMobile 
          ? "via-purple-50/40 to-purple-50/60 pb-6" 
          : "via-purple-50/20 to-purple-50/40 pb-8"
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
