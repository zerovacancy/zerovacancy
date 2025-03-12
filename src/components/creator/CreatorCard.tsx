
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { ArrowRight, Instagram, Linkedin, Share2, Globe, ExternalLink } from 'lucide-react';
import { Dialog } from "../ui/dialog";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorRating } from './CreatorRating';
import { GlowDialog } from '../ui/glow-dialog';
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

  return (
    <article className="group select-text h-full">
      <div className="relative h-full">
        {/* Mobile-optimized card with enhanced styling */}
        {isMobile ? (
          <Card className={cn(
            "overflow-hidden h-full flex flex-col",
            "bg-white border-2 border-purple-200 shadow-md",
            "rounded-xl relative"
          )}>
            {/* Mobile-optimized gradient border effect */}
            <div className="absolute inset-0 rounded-xl border border-purple-300/70"></div>
            
            {/* Price tag - Simplified for mobile */}
            <div className="absolute top-3 right-3 z-20">
              <span className="px-2 py-1 text-xs font-semibold bg-white shadow-sm border border-gray-100 text-gray-900 rounded-full">
                From ${creator.price}
              </span>
            </div>

            {/* Media container - Simplified aspect ratio */}
            <div className="aspect-[16/9] relative w-full overflow-hidden flex-shrink-0">
              <CreatorMedia 
                creator={creator}
                onImageLoad={onImageLoad}
                onVideoLoad={() => onImageLoad?.(creator.image)}
              />
            </div>

            {/* Enhanced content section with improved typography and spacing */}
            <div className="px-3.5 py-4 flex flex-col flex-grow">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">{creator.name}</h3>
                    <p className="text-sm text-gray-500 font-light mt-0.5">{creator.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {creator.socialLinks?.instagram && (
                      <a 
                        href={creator.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${creator.name}'s Instagram`}
                        className="rounded-full p-1 hover:bg-purple-50 transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5 text-gray-600" />
                      </a>
                    )}
                    {creator.socialLinks?.linkedin && (
                      <a 
                        href={creator.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${creator.name}'s LinkedIn`}
                        className="rounded-full p-1 hover:bg-purple-50 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-gray-600" />
                      </a>
                    )}
                    {creator.socialLinks?.website && (
                      <a 
                        href={creator.socialLinks.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${creator.name}'s Website`}
                        className="rounded-full p-1 hover:bg-purple-50 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-gray-600" />
                      </a>
                    )}
                    {!creator.socialLinks?.instagram && !creator.socialLinks?.linkedin && !creator.socialLinks?.website && (
                      <div className="flex items-center">
                        <span className="text-[10px] text-gray-400 italic">Social soon</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1.5">{creator.services.join(" • ")}</p>
              </div>

              {/* Portfolio preview - Enhanced spacing for mobile */}
              <div className="mb-4">
                <PortfolioPreview 
                  workExamples={creator.workExamples}
                  creatorName={creator.name}
                />
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>

              {/* Enhanced CTA Button with better contrast */}
              <div className="mt-1">
                <button 
                  onClick={handleCTAClick}
                  aria-label={`Book with ${creator.name}`}
                  className="w-full flex items-center justify-center text-sm px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {stage === 'initial' ? (
                    <>
                      <span>Book Now</span>
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </>
                  ) : stage === 'input' ? (
                    <span>Secure Spot</span>
                  ) : (
                    <span>Confirmed!</span>
                  )}
                </button>
              </div>
            </div>
          </Card>
        ) : (
          // Enhanced desktop version with improved visual hierarchy
          <>
            <div className="absolute -inset-0.5 sm:-inset-0.5 rounded-xl bg-gradient-to-r from-purple-800/30 via-indigo-700/30 to-purple-900/30 opacity-60 sm:opacity-75 blur-[2px] sm:blur-sm group-hover:opacity-100 transition duration-500"></div>
            <Card className={cn(
              "overflow-hidden h-full flex flex-col",
              "will-change-transform transition-all duration-300",
              "hover:translate-y-[-2px]",
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
                  duration={20}
                  borderWidth={1}
                />
              </div>

              {/* Price tag with enhanced styling */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <span className="px-3 py-1.5 text-sm font-semibold bg-white/90 shadow-md border border-white/40 text-[#212121] rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
                  From ${creator.price}
                </span>
              </div>

              {/* Media container */}
              <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0">
                <CreatorMedia 
                  creator={creator}
                  onImageLoad={onImageLoad}
                  onVideoLoad={() => onImageLoad?.(creator.image)}
                />
              </div>

              {/* Enhanced content section with improved typography and spacing */}
              <div className="px-5 pt-5 pb-6 flex flex-col flex-grow">
                <div className="mb-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{creator.name}</h3>
                      <p className="text-sm text-gray-500 font-light mt-0.5">{creator.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {creator.socialLinks?.instagram && (
                        <a 
                          href={creator.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${creator.name}'s Instagram`}
                          className="rounded-full p-1.5 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <Instagram size={16} className="text-gray-600 hover:text-[#E1306C] transition-colors" />
                        </a>
                      )}
                      {creator.socialLinks?.linkedin && (
                        <a 
                          href={creator.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${creator.name}'s LinkedIn`}
                          className="rounded-full p-1.5 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <Linkedin size={16} className="text-gray-600 hover:text-[#0A66C2] transition-colors" />
                        </a>
                      )}
                      {creator.socialLinks?.website && (
                        <a 
                          href={creator.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${creator.name}'s Website`}
                          className="rounded-full p-1.5 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <Globe size={16} className="text-gray-600 hover:text-gray-900 transition-colors" />
                        </a>
                      )}
                      {!creator.socialLinks?.instagram && !creator.socialLinks?.linkedin && !creator.socialLinks?.website && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 italic">Social links coming soon</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 tracking-wide">{creator.services.join(" • ")}</p>
                </div>

                {/* Rating and availability row with enhanced styling */}
                <div className="flex justify-between items-center mb-4">
                  <CreatorRating 
                    rating={creator.rating} 
                    reviews={creator.reviews} 
                    name={creator.name} 
                    availabilityStatus={creator.availabilityStatus}
                  />
                </div>

                {/* Enhanced portfolio preview with better spacing */}
                <div className="mb-4">
                  <PortfolioPreview 
                    workExamples={creator.workExamples}
                    creatorName={creator.name}
                  />
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>

                {/* Enhanced CTA Button with gradient and shadow */}
                <div className="mt-1">
                  <button 
                    onClick={handleCTAClick}
                    aria-label={`Book with ${creator.name}`}
                    className={cn(
                      "w-full h-11 text-sm px-5 py-3",
                      "bg-gradient-to-r from-indigo-600 to-purple-600",
                      "text-white font-medium rounded-lg",
                      "border border-indigo-400/30 shadow-lg shadow-indigo-500/20",
                      "flex items-center justify-center transition-all duration-200",
                      "hover:shadow-xl hover:shadow-indigo-500/30"
                    )}
                  >
                    {stage === 'initial' ? (
                      <>
                        <span>Book with {firstName}</span>
                        <ArrowRight className="w-4 h-4 ml-2 inline-flex" aria-hidden="true" />
                      </>
                    ) : stage === 'input' ? (
                      <span>Secure Your Spot</span>
                    ) : (
                      <span>Access Confirmed - Launching Soon!</span>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </>
        )}
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
