
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { ArrowRight } from 'lucide-react';
import { Dialog } from "../ui/dialog";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorRating } from './CreatorRating';
import { GlowDialog } from '../ui/glow-dialog';
import { ShimmerButton } from '../ui/shimmer-button';
import { BorderBeam } from '../ui/border-beam';
import { CreatorInfo } from './CreatorInfo';
import { CreatorMedia } from './CreatorMedia';
import { CreatorTags, getDefaultTags } from './CreatorTags';
import type { CreatorCardProps } from './types';

export const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onImageLoad, 
  loadedImages, 
  imageRef 
}) => {
  const isMobile = useIsMobile();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  const tags = creator.tags || getDefaultTags(creator.name, creator.services);
  
  return (
    <article className="group select-text h-full">
      <div className="relative h-full">
        {/* Disable gradient overlay on mobile for better performance */}
        {!isMobile && (
          <div className="absolute -inset-0.5 sm:-inset-0.5 rounded-xl bg-gradient-to-r from-purple-800/30 via-indigo-700/30 to-purple-900/30 opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
        )}
        
        <Card className={cn(
          "overflow-hidden h-full",
          // Only enable hover effects on desktop
          "sm:will-change-transform sm:transition-all sm:duration-300",
          "sm:hover:translate-y-[-4px] sm:hover:scale-[1.02]",
          "bg-white border border-gray-200/80",
          // Enhanced shadow for mobile with subtle color tint
          isMobile ? "shadow-md shadow-indigo-100/20" : "shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]",
          "rounded-xl relative"
        )}>
          {/* Card content - Border beam effect only on desktop */}
          {!isMobile && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
              <BorderBeam 
                colorFrom="#9370DB" 
                colorTo="#C19EF9" 
                duration={20}
                borderWidth={1}
              />
            </div>
          )}

          {/* Price tag - Enhanced for mobile */}
          <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-20">
            <span className={cn(
              isMobile ? "px-3.5 py-2 text-base" : "px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
              "font-semibold",
              // Enhanced background on mobile
              isMobile ? "bg-white shadow-lg border border-white/40" : "bg-white/90 shadow-md border border-white/40",
              "text-[#212121] rounded-full",
              "shadow-[0_3px_8px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
            )}>
              From ${creator.price}
            </span>
          </div>

          <div className="relative">
            {/* Media container with improved aspect ratio for mobile */}
            <div className="relative">
              <div className={cn(
                "aspect-[4/3] overflow-hidden",
                "overflow-hidden"
              )}>
                <CreatorMedia 
                  creator={creator}
                  onImageLoad={onImageLoad}
                  onVideoLoad={() => onImageLoad?.(creator.image)}
                />
              </div>
              
              <CreatorInfo creator={creator} />
            </div>
            
            {/* Tags and rating section - More spacious for mobile */}
            <div className={cn(
              isMobile ? "p-5" : "p-4 sm:p-5",
              "flex flex-col"
            )}>
              {/* Tags section with improved spacing */}
              <div className={cn(
                isMobile ? "mb-5" : "mb-4",
              )}>
                <CreatorTags tags={tags} />
              </div>
              
              {/* Visual separator for mobile only */}
              {isMobile && (
                <div className="h-px w-full bg-gray-100 mb-5"></div>
              )}
              
              {/* Rating section with more compact layout for mobile */}
              <div className="bg-gray-50/80 rounded-lg px-4 py-3.5 shadow-sm relative">
                <div className="flex justify-between items-center">
                  <CreatorRating 
                    rating={creator.rating} 
                    reviews={creator.reviews} 
                    name={creator.name} 
                    availabilityStatus={creator.availabilityStatus}
                  />
                </div>
              </div>
              
              {/* CTA button section with larger touch target for mobile */}
              <div className={cn(
                isMobile ? "mt-5" : "mt-5",
              )}>
                <ShimmerButton 
                  onClick={() => setShowEmailDialog(true)}
                  aria-label={`Join waitlist to work with ${creator.name}`}
                  className={cn(
                    "w-full text-base px-4 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200",
                    isMobile ? "h-14 text-lg" : "h-10 sm:h-11", // Larger height and text on mobile
                    // Disable pulse animation on mobile
                    !isMobile && "group-hover:animate-pulse-subtle"
                  )}
                  disableOnMobile={true}
                >
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-5 h-5 ml-2 sm:group-hover:translate-x-1 sm:transition-transform sm:duration-300" aria-hidden="true" />
                </ShimmerButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <GlowDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} />
    </article>
  );
};
