
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
import { CreatorMedia } from './CreatorMedia';
import { PortfolioPreview } from './PortfolioPreview';
import type { CreatorCardProps } from './types';

export const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onImageLoad, 
  loadedImages, 
  imageRef 
}) => {
  const isMobile = useIsMobile();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [stage, setStage] = useState<'initial' | 'input' | 'confirmed'>('initial');

  const firstName = creator.name.split(' ')[0];

  const handleCTAClick = () => {
    setStage('input');
    setShowEmailDialog(true);
  };

  // Mobile-optimized card design with fewer layers and effects
  if (isMobile) {
    return (
      <article className="group select-text h-full">
        <div className="relative h-full">
          {/* Simplified outer glow effect - just one layer */}
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-500/30 opacity-75 blur-[2px]"></div>

          <Card className={cn(
            "overflow-hidden h-full flex flex-col",
            "bg-white border-2 border-purple-200/60",
            "shadow-md rounded-xl relative"
          )}>
            {/* Simplified accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 z-10"></div>

            {/* Simplified price tag */}
            <div className="absolute top-3 right-3 z-20">
              <span className="px-2.5 py-1.5 text-xs font-semibold bg-white text-purple-900 rounded-full border border-purple-200/60 shadow-sm">
                From ${creator.price}
              </span>
            </div>

            {/* Media container - simplified */}
            <div className="aspect-[16/9] relative w-full overflow-hidden flex-shrink-0 border-b border-purple-100">
              <CreatorMedia 
                creator={creator}
                onImageLoad={onImageLoad}
                onVideoLoad={() => onImageLoad?.(creator.image)}
              />
            </div>

            {/* Content section - simplified */}
            <div className="px-3.5 py-3.5 flex flex-col flex-grow bg-white">
              {/* Creator info */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-base">{creator.name}</h3>
                <p className="text-sm text-gray-600">{creator.location}</p>
                <p className="text-xs text-gray-500 mt-1">{creator.services.join(" • ")}</p>
              </div>

              {/* Rating and availability row */}
              <div className="flex justify-between items-center mb-3">
                <CreatorRating 
                  rating={creator.rating} 
                  reviews={creator.reviews} 
                  name={creator.name} 
                  availabilityStatus={creator.availabilityStatus}
                />
              </div>

              {/* Portfolio preview - simplified */}
              <div className="mb-3.5 p-1 bg-gray-50 rounded-lg border border-gray-100">
                <PortfolioPreview 
                  workExamples={creator.workExamples}
                  creatorName={creator.name}
                />
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>

              {/* Simplified CTA Button */}
              <div>
                <ShimmerButton 
                  onClick={handleCTAClick}
                  aria-label={`Book with ${creator.name}`}
                  className="w-full text-sm px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/40 shadow-md"
                  disableOnMobile={true}
                >
                  {stage === 'initial' ? (
                    <>
                      <span>Book with {firstName}</span>
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
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
  }

  // Desktop version with full effects
  return (
    <article className="group select-text h-full">
      <div className="relative h-full">
        {/* Enhanced outer glow effect */}
        <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl bg-gradient-to-r from-purple-600/40 via-indigo-500/40 to-purple-700/40 opacity-75 sm:opacity-85 blur-[3px] sm:blur-md group-hover:opacity-100 transition duration-500"></div>

        <Card className={cn(
          "overflow-hidden h-full flex flex-col",
          "will-change-transform transition-all duration-300",
          "hover:translate-y-[-4px] hover:scale-[1.02]",
          "bg-white/95 backdrop-blur-sm", // Added backdrop blur for more distinction
          "border-2 border-purple-200/80", // Enhanced border
          "shadow-[0_4px_12px_rgba(0,0,0,0.12)]", // Stronger shadow
          "hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)]", // Enhanced hover shadow
          "rounded-xl relative"
        )}>
          {/* Colorful accent bar on top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 z-10"></div>

          {/* Card content - Enhanced Border beam and glowing effect */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
            <BorderBeam 
              colorFrom="#A370F7" // More vibrant color
              colorTo="#D19EFF" // More vibrant color
              duration={20} // Slightly faster on mobile
              borderWidth={1.5} // Thicker border
            />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LncgLy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODg4IiBzdHJva2Utb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0gTTAgMjBMMjAgMCIvPjxwYXRoIGQ9Ik0xMCAyMEwyMCAxMCIvPjxwYXRoIGQ9Ik0wIDEwTDEwIDAiLz48L2c+PC9zdmc+')] opacity-30"></div>
          </div>

          {/* Price tag */}
          <div className="absolute top-3.5 right-3.5 z-20">
            <span className={cn(
              "px-3 py-1.5 text-sm",
              "font-semibold",
              "bg-white/95 shadow-md border border-purple-200/60", // Enhanced border
              "text-purple-900 rounded-full", // Darker text
              "shadow-[0_4px_10px_rgba(147,112,219,0.2)]", // Colored shadow
              "transition-all duration-200",
              "group-hover:scale-105 group-hover:shadow-[0_5px_12px_rgba(147,112,219,0.3)]"
            )}>
              From ${creator.price}
            </span>
          </div>

          {/* Media container */}
          <div className={cn(
            "aspect-[4/3]",
            "relative w-full overflow-hidden flex-shrink-0",
            "border-b border-purple-100" // Subtle divider
          )}>
            <CreatorMedia 
              creator={creator}
              onImageLoad={onImageLoad}
              onVideoLoad={() => onImageLoad?.(creator.image)}
            />

            {/* Subtle overlay gradient at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/40 to-transparent"></div>
          </div>

          {/* Content section with gradient background */}
          <div className={cn(
            "px-5 pt-5 pb-5",
            "flex flex-col flex-grow",
            "bg-gradient-to-b from-white/40 to-white/95" // Subtle gradient background
          )}>
            {/* Creator info */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-lg">{creator.name}</h3>
              <p className="text-sm text-gray-600">{creator.location}</p>
              <p className="text-xs text-gray-500 mt-1">{creator.services.join(" • ")}</p>
            </div>

            {/* Rating and availability row */}
            <div className="flex justify-between items-center mb-3">
              <CreatorRating 
                rating={creator.rating} 
                reviews={creator.reviews} 
                name={creator.name} 
                availabilityStatus={creator.availabilityStatus}
              />
            </div>

            {/* Portfolio preview */}
            <div className="mb-3.5 p-1 bg-gray-50/80 rounded-lg border border-gray-100/80">
              <PortfolioPreview 
                workExamples={creator.workExamples}
                creatorName={creator.name}
              />
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>

            {/* Enhanced CTA Button at the bottom */}
            <div>
              <ShimmerButton 
                onClick={handleCTAClick}
                aria-label={`Book with ${creator.name}`}
                className={cn(
                  "w-full text-sm px-4 py-2.5 hover:scale-[1.03] active:scale-[0.98]",
                  "transition-all duration-300",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                  "border border-indigo-400/40 shadow-lg shadow-indigo-500/20",
                  "group-hover:shadow-indigo-500/30 group-hover:border-indigo-400/50"
                )}
              >
                {stage === 'initial' ? (
                  <>
                    <span>Book with {firstName}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true" />
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
