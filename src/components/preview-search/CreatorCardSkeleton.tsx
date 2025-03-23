
import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const CreatorCardSkeleton = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn(
      "overflow-hidden w-full h-full", 
      "bg-white",
      "animate-pulse flex flex-col",
      "rounded-xl relative",
      isMobile 
        ? "border-slate-200/40 shadow-sm" 
        : "border-2 border-[#8860E6]/40 shadow-[0_10px_15px_-3px_rgba(138,79,255,0.1),_0_4px_6px_-4px_rgba(138,79,255,0.15)]"
    )}>
      {/* Media section */}
      <div className={cn(
        "w-full flex-shrink-0",
        isMobile ? "bg-gray-100/60" : "bg-gradient-to-r from-purple-100/80 to-indigo-100/80",
        isMobile ? "aspect-[4/3]" : "aspect-[4/3]"
      )}></div>
      
      {/* Content section */}
      <div className={cn(
        "w-full px-4 pt-3 pb-3 flex flex-col relative z-10 flex-grow",
        isMobile ? "gap-3" : "gap-4"
      )}>
        {/* Creator name */}
        <div className="flex justify-between items-center">
          <div className={`h-5 w-32 ${isMobile ? 'bg-gray-200/70' : 'bg-purple-200/60'} rounded-lg`}></div>
          <div className="h-4 w-20 bg-gray-200/70 rounded-full"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gray-200/70 mr-0.5"></div>
            ))}
          </div>
          <div className="h-3 w-12 bg-gray-200/70 rounded-full"></div>
        </div>
        
        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-6 w-20 ${isMobile ? 'bg-gray-200/70' : 'bg-purple-200/60'} rounded-full`}></div>
          ))}
        </div>
        
        {/* Recent works */}
        <div className="mt-3">
          <div className="h-4 w-24 bg-gray-200/70 rounded-full mb-3"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`aspect-square ${isMobile ? 'bg-gray-100/60' : 'bg-purple-100/70'} rounded-lg`}></div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className={`mt-4 h-10 ${isMobile ? 'bg-gray-200/70' : 'bg-gradient-to-r from-indigo-300/80 to-purple-300/80'} rounded-lg`}></div>
      </div>
    </Card>
  );
};
