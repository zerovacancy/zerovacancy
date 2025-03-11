
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const SearchButton = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="hidden sm:block sm:w-[20%]">
      <button 
        className={cn(
          "w-full h-12 sm:h-13", // Consistent height
          // Proper brand colors
          "bg-indigo-600 sm:bg-gradient-to-r sm:from-indigo-600 sm:to-brand-purple hover:bg-indigo-700 sm:hover:from-indigo-700 sm:hover:to-brand-purple text-white",
          // Simplified shadow on mobile
          "shadow-md sm:hover:shadow-lg transition-all duration-300",
          "text-sm rounded-r-lg font-medium font-inter",
          "flex items-center justify-center gap-2.5",
          // Conditional animations
          "sm:relative sm:overflow-hidden overflow-hidden",
          !isMobile && "sm:group sm:hover:scale-[1.01]", // Disable hover scale on mobile
          // Better touch handling
          "touch-manipulation"
        )}
      >
        {/* Animated background only on desktop */}
        {!isMobile && (
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] opacity-0 sm:group-hover:opacity-100 sm:group-hover:[transform:translateX(100%)] hidden sm:block transition-all duration-1000 ease-in-out"></div>
        )}
        
        <Search className={cn(
          "w-5 h-5", 
          !isMobile && "sm:group-hover:scale-110 sm:transition-transform sm:duration-200"
        )} />
        <span className={cn(
          !isMobile && "sm:group-hover:translate-x-1 sm:transition-all sm:duration-200"
        )}>Search</span>
      </button>
    </div>
  );
};
