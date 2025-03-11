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
      text: 'Available',
      icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>,
      className: 'border-emerald-200 text-emerald-700'
    },
    'available-tomorrow': {
      text: 'Tomorrow',
      icon: <Clock className="w-3 h-3 mr-1 text-amber-500" />,
      className: 'border-amber-200 text-amber-700'
    },
    'premium-only': {
      text: 'Premium',
      icon: <Crown className="w-3 h-3 mr-1 text-purple-500" />,
      className: 'border-purple-200 text-purple-700'
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
          "font-medium text-gray-800",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {rating.toFixed(1)}
        </span>

        {/* Review count */}
        {reviews > 0 && (
          <span className={cn(
            "text-gray-500 ml-1.5",
            isMobile ? "text-xs" : "text-sm"
          )}>
            ({reviews})
          </span>
        )}
      </div>

      {/* Availability Indicator - Redesigned to be more compact */}
      {availabilityStatus && availabilityConfig[availabilityStatus] && (
        <div className={cn(
          "flex items-center justify-center",
          "bg-white border",
          "px-2 py-0.5",
          "rounded-full",
          "text-xs font-medium",
          "shadow-sm",
          availabilityConfig[availabilityStatus].className
        )}>
          {availabilityConfig[availabilityStatus].icon}
          <span>{availabilityConfig[availabilityStatus].text}</span>
        </div>
      )}
    </div>
  );
};