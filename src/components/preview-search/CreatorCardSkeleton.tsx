
import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const CreatorCardSkeleton = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn(
      "overflow-hidden w-full h-full", 
      "bg-white border border-gray-200", // Clean white card with light border
      "animate-pulse flex flex-col",
      "rounded-lg relative transition-all duration-200",
      isMobile 
        ? "shadow-[0_2px_4px_rgba(0,0,0,0.08)]" 
        : "shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    )}>
      {/* Media section */}
      <div className={cn(
        "relative w-full overflow-hidden flex-shrink-0",
        "bg-gray-100", // Light gray for loading state
        isMobile ? "aspect-[4/3]" : "aspect-[4/3]"
      )}></div>
      
      {/* Content section */}
      <div className={cn(
        "w-full px-4 pt-3 pb-3 flex flex-col relative z-10 flex-grow",
        isMobile ? "gap-3" : "gap-4"
      )}>
        {/* Creator name */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gray-200 mr-0.5"></div>
            ))}
          </div>
          <div className="h-3 w-12 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        
        {/* Recent works - with subtle divider */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="h-4 w-24 bg-gray-200 rounded-full mb-3"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="mt-4 h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </Card>
  );
};
