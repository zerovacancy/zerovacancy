
import React from 'react';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SectionHeaderSimpleProps {
  title: string;
  subtitle: string;
}

const SectionHeaderSimple: React.FC<SectionHeaderSimpleProps> = ({
  title,
  subtitle
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center w-full">
      {/* Title Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="inline-block mb-3"
      >
        <div className={cn(
          "h-1.5 w-20 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-full mx-auto", 
          isMobile ? "mb-4" : "mb-6",
          "animate-pulse-subtle"
        )} />
      </motion.div>
      
      {/* Main Title */}
      <motion.h2 
        id="design-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900", 
          isMobile ? "mb-3" : "mb-4 sm:mb-5",
          "font-jakarta tracking-tight"
        )}
      >
        {title}
      </motion.h2>
      
      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className={cn(
          "max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 font-inter leading-relaxed",
          isMobile && "px-4"
        )}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionHeaderSimple;
