import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewHeaderProps {
  title: string;
  subtitle: string;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({ title, subtitle }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "text-left",
      isMobile 
        ? "pb-space-xs px-space-md pt-space-sm" 
        : "pb-2 sm:pb-6 px-4 sm:px-8 lg:px-10 pt-6 sm:pt-9 md:pt-10"
    )}>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "font-bold text-gray-900 tracking-tight",
          isMobile 
            ? "mobile-text-xl mobile-heading mb-space-xs" 
            : "text-2xl sm:text-3xl md:text-4xl font-jakarta mb-2 sm:mb-4"
        )}
      >
        {title}
      </motion.h2>
      
      {/* Animated underline */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isMobile ? "2.5rem" : "4rem", opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={cn(
          "bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-full",
          isMobile ? "h-0.5 mb-space-xs" : "h-1 sm:h-1.5 mb-2 sm:mb-3"
        )}
      ></motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={cn(
          "max-w-xl",
          isMobile 
            ? "mobile-text-xs mobile-body mt-1" 
            : "text-gray-600 font-inter text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2"
        )}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};
