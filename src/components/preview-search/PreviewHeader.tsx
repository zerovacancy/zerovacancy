
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
      "text-left pb-2 sm:pb-6 px-4 sm:px-8 lg:px-10",
      isMobile ? "pt-4" : "pt-6 sm:pt-9 md:pt-10"
    )}>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "font-bold text-gray-900 mb-2 sm:mb-4 font-jakarta tracking-tight",
          isMobile ? "text-xl" : "text-2xl sm:text-3xl md:text-4xl"
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
          isMobile ? "h-0.5 mb-1.5" : "h-1 sm:h-1.5 mb-2 sm:mb-3"
        )}
      ></motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={cn(
          "text-gray-600 font-inter max-w-xl mt-1.5 sm:mt-2",
          isMobile ? "text-xs" : "text-sm sm:text-base md:text-lg"
        )}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};
