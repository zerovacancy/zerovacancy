
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
  import { PortfolioPreview } from './PortfolioPreview';
  import { NotableClients } from './NotableClients';
  import type { CreatorCardProps, NotableClient } from './types';

  // Demo data for notable clients - using placeholder images until real logos are uploaded
  const getDemoNotableClients = (name: string): NotableClient[] => {
    if (name === 'John Smith') {
      return [
        {
          name: 'Apple',
          logo: '/placeholder.svg',
          projectType: 'Brand photography'
        },
        {
          name: 'SpaceX',
          logo: '/placeholder.svg',
          projectType: 'Product launch'
        }
      ];
    }
    if (name === 'Jane Cooper') {
      return [
        {
          name: 'OpenAI',
          logo: '/placeholder.svg',
          projectType: 'Office design'
        },
        {
          name: 'Tesla',
          logo: '/placeholder.svg',
          projectType: 'Showroom staging'
        }
      ];
    }
    return [];
  };

  export const CreatorCard: React.FC<CreatorCardProps> = ({ 
    creator, 
    onImageLoad, 
    loadedImages, 
    imageRef 
  }) => {
    const isMobile = useIsMobile();
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [stage, setStage] = useState<'initial' | 'input' | 'confirmed'>('initial');

    const tags = creator.tags || getDefaultTags(creator.name, creator.services);
    const notableClients = creator.notableClients || getDemoNotableClients(creator.name);
    const firstName = creator.name.split(' ')[0];

    const handleCTAClick = () => {
      setStage('input');
      setShowEmailDialog(true);
    };

    return (
      <article className="group select-text h-full">
        <div className="relative h-full">
          <div className="absolute -inset-0.5 sm:-inset-0.5 rounded-xl bg-gradient-to-r from-purple-800/30 
  via-indigo-700/30 to-purple-900/30 opacity-60 sm:opacity-75 blur-[2px] sm:blur-sm group-hover:opacity-100 transition 
  duration-500"></div>
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

              {/* Redesigned content section */}
              <div className={cn(
                isMobile ? "px-4 pt-4 pb-4" : "px-4 sm:px-5 pt-4 sm:pt-5 pb-4 sm:pb-5",
                "flex flex-col"
              )}>
                {/* Rating and availability row - moved to top */}
                <div className="flex justify-between items-center mb-3">
                  <CreatorRating 
                    rating={creator.rating} 
                    reviews={creator.reviews} 
                    name={creator.name} 
                    availabilityStatus={creator.availabilityStatus}
                  />
                </div>

                {/* Notable Clients Section - New */}
                {notableClients.length > 0 && (
                  <NotableClients clients={notableClients} />
                )}

                {/* Portfolio preview - New */}
                {creator.workExamples.length > 0 && (
                  <PortfolioPreview 
                    workExamples={creator.workExamples}
                    creatorName={creator.name}
                  />
                )}

                {/* Card within card design for tags */}
                <div className="bg-gray-50/80 rounded-lg p-3 mb-4 shadow-sm border border-gray-100/80">
                  <div className="flex items-center mb-2">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-1.5"></div>
                    <span className="text-xs text-gray-500 font-medium">SPECIALTIES</span>
                  </div>
                  <CreatorTags tags={tags} />
                </div>

                {/* Enhanced CTA Button */}
                <ShimmerButton 
                  onClick={handleCTAClick}
                  aria-label={`Unlock access to work with ${creator.name}`}
                  className={cn(
                    "w-full text-sm px-4 py-2.5 hover:scale-[1.03] active:scale-[0.98]",
                    "transition-all duration-300",
                    "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                    "border border-indigo-400/30 shadow-lg shadow-indigo-500/20",
                    "group-hover:shadow-indigo-500/30 group-hover:border-indigo-400/50",
                  )}
                >
                  {stage === 'initial' ? (
                    <>
                      <span>Unlock Creator Access</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" 
  aria-hidden="true" />
                    </>
                  ) : stage === 'input' ? (
                    <span>Secure Your Spot</span>
                  ) : (
                    <span>Access Confirmed - Launching Soon!</span>
                  )}
                </ShimmerButton>
              </div>
            </div>
          </Card>
        </div>
        <GlowDialog 
          open={showEmailDialog} 
          onOpenChange={(open) => {
            setShowEmailDialog(open);
            if (!open) setStage('initial');
          }}
        />
      </article>
    );
  };
