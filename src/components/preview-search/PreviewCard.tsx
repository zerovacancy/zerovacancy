
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewCardProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ isVisible, children }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: isMobile ? 0.3 : 0.7, // Faster animation on mobile
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        isMobile ? "relative" : "relative rounded-lg sm:rounded-lg overflow-hidden shadow-md sm:shadow-md border border-gray-200 bg-white will-change-transform"
      )}
    >
      {/* Simple clean background layout */}
      {isMobile ? (
        <>{children}</>
      ) : (
        <div className="min-h-0 w-full bg-white">
          {children}
        </div>
      )}
    </motion.div>
  );
};
