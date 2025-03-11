
import React, { useEffect, useState } from 'react';
import { Star, Calendar, Clock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile, useViewportSize } from '@/hooks/use-mobile';
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
  const viewportSize = useViewportSize();
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    setIsNarrowScreen(viewportSize.width < 350);
  }, [viewportSize.width]);

  // Standardized color-coding system for availability status
  const availabilityConfig = {
    'available-now': {
      text: 'Available Now',
      icon: <Calendar className={cn("mr-1 text-emerald-500", isNarrowScreen ? "w-2.5 h-2.5" : "w-3 h-3")} />,
      className: 'border-green-100/50 text-emerald-700 bg-emerald-50/80 availability-indicator'
    },
    'available-tomorrow': {
      text: 'Available Tomorrow',
      icon: <Clock className={cn("mr-1 text-amber-500", isNarrowScreen ? "w-2.5 h-2.5" : "w-3 h-3")} />,
      className: 'border-amber-100/50 text-amber-700 bg-amber-50/80 tomorrow-status'
    },
    'premium-only': {
      text: 'Premium Only',
      icon: <Crown className={cn("mr-1 text-purple-500", isNarrowScreen ? "w-2.5 h-2.5" : "w-3 h-3")} />,
      className: 'border-purple-100/50 text-purple-700 bg-purple-50/80 premium-status'
    }
  };

  // Shorter text for mobile to prevent overflow
  const mobileText = {
    'available-now': 'Available',
    'available-tomorrow': 'Tomorrow',
    'premium-only': 'Premium'
  };

  return (
    <div className={cn(
      "flex items-center",
      isNarrowScreen ? "flex-col items-start gap-2" : "justify-between w-full"
    )}>
      <div className="flex items-center">
        {/* Single star rating with enhanced visibility */}
        <div className="flex mr-1.5">
          <Star
            className={cn(
              isNarrowScreen ? "w-3 h-3" : "w-4 h-4",
              "text-yellow-400 fill-yellow-400"
            )}
          />
        </div>

        {/* Rating text with increased contrast */}
        <span className={cn(
          "font-semibold text-gray-800", // Changed from medium to semibold for better emphasis
          isMobile ? "text-sm" : "text-sm" // Increased size on mobile from xs to sm
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

      {/* Availability Indicator with larger touch target */}
      {availabilityStatus && availabilityConfig[availabilityStatus] && (
        <div className={cn(
          "flex items-center justify-center",
          "bg-white backdrop-blur-[4px]",
          // Increased touch target size while maintaining visual style
          isNarrowScreen ? "px-2 py-1 min-h-[28px]" : "px-3 py-1.5 min-h-[32px]",
          !isNarrowScreen && "ml-1",
          "rounded-full whitespace-nowrap",
          isNarrowScreen ? "text-[11px]" : "text-xs", // Slightly larger text on narrow screens
          "font-medium",
          "border",
          "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
          availabilityConfig[availabilityStatus].className
        )}>
          {availabilityConfig[availabilityStatus].icon}
          <span className={cn(
            "truncate",
            isNarrowScreen ? "max-w-[60px]" : "max-w-[90px]"
          )}>
            {isNarrowScreen
              ? mobileText[availabilityStatus]
              : availabilityConfig[availabilityStatus].text}
          </span>
        </div>
      )}
    </div>
  );
};
