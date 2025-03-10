
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Image, BadgeCheck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Creator {
  name: string;
  services: string[];
  location: string;
}

interface CreatorInfoProps {
  creator: Creator;
}

export const CreatorInfo: React.FC<CreatorInfoProps> = ({ creator }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      isMobile 
        ? "creator-info-mobile" // Use the mobile-specific class from mobile.css
        : "absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4.5 text-white select-text z-10"
    )}>
      {/* Enhanced darker semi-transparent gradient overlay for better text visibility on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      )}
      
      <div className={cn(
        "relative z-10",
        isMobile ? "pl-1 text-gray-800" : "" // Text color for mobile
      )}>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <h3 className={cn(
            "font-bold font-space",
            isMobile ? "text-lg text-gray-800" : "text-white text-lg sm:text-xl" 
          )}>
            {creator.name}
          </h3>
          {/* Properly sized verification badge */}
          <BadgeCheck 
            className={cn(
              isMobile ? "w-5 h-5" : "w-4.5 h-4.5 sm:w-5 sm:h-5",
              isMobile ? "text-indigo-600" : "text-white/90",
              "transition-all duration-300",
              isMobile 
                ? "bg-indigo-100 rounded-full p-0.5" // More subtle on mobile
                : "bg-indigo-500/30 rounded-full p-0.5",
              "group-hover:bg-indigo-500/50" // Subtle hover effect
            )}
            aria-label="Verified Creator"
          />
        </div>
        
        {/* Combined location and services for mobile */}
        {isMobile ? (
          <div className="flex items-center gap-2 mt-2">
            <MapPin 
              className="w-4 h-4 text-gray-600 flex-shrink-0" 
              aria-hidden="true"
            />
            <span className="text-base text-gray-700 truncate max-w-[calc(100%-20px)] font-anek">
              {creator.location} • {creator.services.join(", ")}
            </span>
          </div>
        ) : (
          <>
            {/* Location display for desktop */}
            <div className="flex items-center gap-1.5 mt-2.5 sm:mt-3">
              <MapPin 
                className="w-3.5 h-3.5 text-white/90 flex-shrink-0" 
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm text-white/90 font-medium font-anek">{creator.location}</span>
            </div>
            
            {/* Services display for desktop */}
            <div className="flex items-center gap-1.5 mt-2 sm:mt-2.5">
              <Image
                className="w-3.5 h-3.5 text-white/85 flex-shrink-0"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-white/85 font-anek">
                {creator.services.join(" • ")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
