
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
          duration: isMobile ? 0.3 : 0.7,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "will-change-transform relative",
        !isMobile && "px-6 py-8" // Increased padding on desktop for better spacing
      )}
    >
      {children}
    </motion.div>
  );
};
