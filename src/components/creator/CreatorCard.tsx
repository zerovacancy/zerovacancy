
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
import { GlowingEffect } from '../ui/glowing-effect';

export const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onImageLoad, 
  loadedImages, 
  imageRef 
}) => {
  const isMobile = useIsMobile();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const tags = creator.tags || getDefaultTags(creator.name, creator.services);
  
  return (
    <article 
      className="group select-text h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full">
        <div className="absolute -inset-0.5 sm:-inset-0.5 rounded-xl bg-gradient-to-r from-purple-800/30 via-indigo-700/30 to-purple-900/30 opacity-60 sm:opacity-75 blur-[2px] sm:blur-sm group-hover:opacity-100 transition duration-500"></div>
        <Card className={cn(
          "overflow-hidden h-full",
          "will-change-transform transition-all duration-300",
          "hover:translate-y-[-4px] hover:scale-[1.02]",
          "bg-white border border-gray-200/80",
          "shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]",
          "rounded-xl relative"
        )}>
          {/* Card content - Border beam and glowing effect */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
            <BorderBeam 
              colorFrom="#9370DB" 
              colorTo="#C19EF9" 
              duration={isMobile ? 30 : 20}
              borderWidth={isMobile ? 0.5 : 1}
            />
            <GlowingEffect 
              variant="default" 
              blur={isMobile ? 3 : 6} 
              glow={isHovered}
              spread={isMobile ? 10 : 18}
              borderWidth={isMobile ? 0.5 : 1}
              movementDuration={1.5}
              className={cn(
                "transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          {/* Price tag - Fixed for mobile */}
          <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-20">
            <span className={cn(
              isMobile ? "px-2 py-1 text-xs" : "px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
              "font-semibold",
              "bg-white/90 shadow-md border border-white/40",
              "text-[#212121] rounded-full",
              "shadow-[0_3px_8px_rgba(0,0,0,0.12)]",
              "transition-all duration-200",
              "group-hover:scale-105 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
            )}>
              From ${creator.price}
            </span>
          </div>

          <div className="relative">
            {/* Media container with proper aspect ratio for mobile */}
            <div className="relative">
              <div className={cn(
                isMobile ? "aspect-[5/3] overflow-hidden" : "aspect-[4/3]",
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
            
            {/* Tags and rating section - More compact for mobile */}
            <div className={cn(
              isMobile ? "p-4" : "p-4 sm:p-5",
              "flex flex-col"
            )}>
              {/* Tags section - Reduced margin for mobile */}
              <div className={cn(
                isMobile ? "mb-2" : "mb-4",
              )}>
                <CreatorTags tags={tags} />
              </div>
              
              {/* Rating section with more compact layout for mobile */}
              <div className="bg-gray-50/80 rounded-lg px-3 py-2 shadow-sm relative">
                <CreatorRating 
                  rating={creator.rating} 
                  reviews={creator.reviews} 
                  name={creator.name} 
                  availabilityStatus={creator.availabilityStatus}
                />
              </div>
              
              {/* CTA button section with adjusted spacing for mobile */}
              <div className={cn(
                isMobile ? "mt-3" : "mt-5",
              )}>
                <ShimmerButton 
                  onClick={() => setShowEmailDialog(true)}
                  aria-label={`Join The Collective to work with ${creator.name}`}
                  className={cn(
                    "w-full text-sm px-4 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 group-hover:animate-pulse-subtle",
                    isMobile ? "h-10" : "h-10 sm:h-11", // Adjusted height for mobile
                  )}
                >
                  <span>Join The Collective</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
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
