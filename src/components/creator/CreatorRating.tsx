
import React from 'react';
import { Star, Calendar, Clock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AvailabilityStatus } from './types';

interface CreatorRatingProps {
  rating: number;
  reviews?: number;
  name: string;
  availabilityStatus?: AvailabilityStatus;
}

export const CreatorRating: React.FC<CreatorRatingProps> = ({ 
  rating, 
  reviews = 0,
  name,
  availabilityStatus
}) => {
  const isMobile = useIsMobile();
  
  const availabilityConfig = {
    'available-now': {
      text: 'Available Now',
      icon: <Calendar className="w-3 h-3 mr-1 text-emerald-500" />,
      className: 'border-green-100/50 availability-indicator'
    },
    'available-tomorrow': {
      text: 'Available Tomorrow',
      icon: <Clock className="w-3 h-3 mr-1 text-amber-500" />,
      className: 'border-amber-100/50 tomorrow-status'
    },
    'premium-only': {
      text: 'Premium Only',
      icon: <Crown className="w-3 h-3 mr-1 text-purple-500" />,
      className: 'border-purple-100/50 premium-status'
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        {/* Single star rating */}
        <div className="flex mr-1.5">
          <Star
            className={cn(
              "w-4 h-4",
              "text-yellow-400 fill-yellow-400"
            )}
          />
        </div>
        
        {/* Rating text */}
        <span className={cn(
          "font-medium text-gray-800 font-inter",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {rating.toFixed(1)}
        </span>
        
        {/* Review count */}
        {reviews > 0 && (
          <span className={cn(
            "text-gray-500 ml-1.5 font-inter",
            isMobile ? "text-xs" : "text-sm"
          )}>
            ({reviews})
          </span>
        )}
      </div>
      
      {/* Availability Indicator */}
      {availabilityStatus && (
        <div className={cn(
          "flex items-center justify-center",
          "bg-[rgba(245,247,250,0.85)] backdrop-blur-[4px]",
          "px-2.5 py-1",
          "rounded-full",
          "text-xs font-medium",
          "text-gray-600",
          "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
          "flex-shrink-0", // Add this to prevent the badge from shrinking
          "min-w-fit", // Ensure minimum width based on content
          "z-10", // Ensure the badge stays on top
          "font-space", // Use Space Grotesk font
          availabilityConfig[availabilityStatus]?.className || ""
        )}>
          {availabilityConfig[availabilityStatus]?.icon}
          <span className="whitespace-nowrap">{availabilityConfig[availabilityStatus]?.text}</span>
        </div>
      )}
    </div>
  );
};
