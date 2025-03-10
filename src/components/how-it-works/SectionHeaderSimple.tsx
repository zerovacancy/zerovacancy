
import React from 'react';
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
    <div className={cn(
      "text-center w-full",
      isMobile && "px-2" // Add padding on mobile for better readability
    )}>
      <h2 className={cn(
        "font-bold text-gray-900 font-inter tracking-tight text-center uppercase",
        isMobile ? "text-xl mb-2" : "text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-6"
      )}>
        {title.toUpperCase()}
      </h2>
      
      {/* Decorative element - simplified on mobile */}
      {!isMobile ? (
        <div className="w-20 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 mx-auto mb-3 sm:mb-6 rounded-full"></div>
      ) : (
        <div className="w-16 h-1 bg-violet-500 mx-auto mb-2 rounded-full"></div>
      )}
      
      <p className={cn(
        "mx-auto text-gray-600 font-inter leading-relaxed text-center",
        isMobile ? "text-base max-w-full" : "text-sm sm:text-base md:text-lg max-w-2xl"
      )}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeaderSimple;
