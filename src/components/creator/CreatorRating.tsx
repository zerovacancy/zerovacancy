
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
      icon: <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />,
      className: 'border-green-100/50 availability-indicator'
    },
    'available-tomorrow': {
      text: 'Available Tomorrow',
      icon: <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />,
      className: 'border-amber-100/50 tomorrow-status'
    },
    'premium-only': {
      text: 'Premium Only',
      icon: <Crown className="w-3.5 h-3.5 mr-1.5 text-purple-500" />,
      className: 'border-purple-100/50 premium-status'
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        {/* Single star rating - enlarged for better touch */}
        <div className="flex mr-2.5">
          <Star
            className={cn(
              isMobile ? "w-5.5 h-5.5" : "w-4 h-4",
              "text-yellow-400 fill-yellow-400"
            )}
          />
        </div>
        
        {/* Rating text - larger on mobile */}
        <span className={cn(
          "font-medium text-gray-800",
          isMobile ? "text-base" : "text-sm"
        )}>
          {rating.toFixed(1)}
        </span>
        
        {/* Review count - larger on mobile */}
        {reviews > 0 && (
          <span className={cn(
            "text-gray-500 ml-2",
            isMobile ? "text-sm" : "text-sm"
          )}>
            ({reviews})
          </span>
        )}
      </div>
      
      {/* Availability Indicator - more visible on mobile */}
      {availabilityStatus && availabilityConfig[availabilityStatus] && (
        <div className={cn(
          "flex items-center justify-center",
          "bg-[rgba(245,247,250,0.95)] backdrop-blur-[4px]",
          "px-3.5 py-2",
          "rounded-full",
          isMobile ? "text-sm font-medium" : "text-xs font-medium",
          "text-gray-600",
          "shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
          availabilityConfig[availabilityStatus].className
        )}>
          {availabilityConfig[availabilityStatus].icon}
          <span>{availabilityConfig[availabilityStatus].text}</span>
        </div>
      )}
    </div>
  );
};
