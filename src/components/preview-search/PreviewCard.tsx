
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
        "will-change-transform",
        isMobile 
          ? "relative" 
          : "relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border-2 border-[#8860E6]/60 bg-white"
      )}
    >
      {isMobile ? (
        <div className="bg-white">
          {children}
        </div>
      ) : (
        <div className="bg-white w-full">
          {children}
        </div>
      )}
    </motion.div>
  );
};
