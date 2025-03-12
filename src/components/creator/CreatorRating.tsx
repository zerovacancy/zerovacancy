
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

  // Enhanced styling for availability badges with gradients
  const availabilityConfig = {
    'available-now': {
      text: 'Available',
      icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse-subtle"></div>,
      className: 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/70 text-emerald-700'
    },
    'available-tomorrow': {
      text: 'Tomorrow',
      icon: <Clock className="w-3 h-3 mr-1 text-amber-500" />,
      className: 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-700'
    },
    'premium-only': {
      text: 'Premium',
      icon: <Crown className="w-3 h-3 mr-1 text-purple-500" />,
      className: 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100/70 text-purple-700'
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        {/* Enhanced star rating with better styling */}
        <div className="flex mr-1.5">
          <Star
            className={cn(
              isMobile ? "w-3.5 h-3.5" : "w-4.5 h-4.5",
              "text-yellow-400 fill-yellow-400",
              "drop-shadow-sm"
            )}
          />
        </div>

        {/* Enhanced rating text */}
        <span className={cn(
          "font-medium text-gray-800",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {rating.toFixed(1)}
        </span>

        {/* Enhanced review count with subtle styling difference */}
        {reviews > 0 && (
          <span className={cn(
            "text-gray-500 ml-1.5",
            isMobile ? "text-[10px]" : "text-xs font-light"
          )}>
            ({reviews})
          </span>
        )}
      </div>

      {/* Enhanced availability badge with gradient and shadow */}
      {availabilityStatus && availabilityConfig[availabilityStatus] && (
        <div className={cn(
          "flex items-center justify-center",
          "bg-white border",
          "px-2 py-0.5",
          "rounded-full",
          "text-xs font-medium",
          "shadow-sm",
          "animate-fade-in",
          availabilityConfig[availabilityStatus].className
        )}>
          {availabilityConfig[availabilityStatus].icon}
          <span>{availabilityConfig[availabilityStatus].text}</span>
        </div>
      )}
    </div>
  );
};
