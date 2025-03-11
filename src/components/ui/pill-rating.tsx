
import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PillRatingProps {
  rating: number;
  reviews?: number;
  showReviews?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PillRating: React.FC<PillRatingProps> = ({
  rating,
  reviews = 0,
  showReviews = true,
  className,
  size = 'md'
}) => {
  const isMobile = useIsMobile();
  
  // Size configurations
  const sizeConfig = {
    sm: {
      pill: "px-2 py-1 min-h-[24px]",
      text: "text-[10px]",
      icon: "w-3 h-3"
    },
    md: {
      pill: "px-3 py-1.5 min-h-[28px]",
      text: "text-xs",
      icon: "w-3.5 h-3.5"
    },
    lg: {
      pill: "px-4 py-2 min-h-[32px]",
      text: "text-sm",
      icon: "w-4 h-4"
    }
  };

  const sizeCfg = sizeConfig[size];
  
  return (
    <div className={cn(
      "inline-flex items-center",
      "bg-amber-50/80 border border-amber-100/50",
      "rounded-full",
      "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
      sizeCfg.pill,
      className
    )}>
      {/* Star icon */}
      <Star className={cn(
        "text-yellow-400 fill-yellow-400 mr-1",
        sizeCfg.icon
      )} />
      
      {/* Rating text */}
      <span className={cn(
        "font-semibold text-amber-700",
        sizeCfg.text
      )}>
        {rating.toFixed(1)}
      </span>
      
      {/* Review count if enabled and available */}
      {showReviews && reviews > 0 && (
        <span className={cn(
          "text-amber-600/80 ml-1",
          isMobile ? "text-[10px]" : sizeCfg.text
        )}>
          ({reviews})
        </span>
      )}
    </div>
  );
};
