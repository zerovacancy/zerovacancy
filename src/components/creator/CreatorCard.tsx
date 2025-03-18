
import React, { useState, useCallback } from 'react';
import { Card } from '../ui/card';
import { ArrowRight, Star, X, Clock, Crown } from 'lucide-react';
import { Dialog, DialogContent } from "../ui/dialog";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorRating } from './CreatorRating';
import { GlowDialog } from '../ui/glow-dialog';
import { CreatorMedia } from './CreatorMedia';
import { PortfolioPreview } from './PortfolioPreview';
import type { CreatorCardProps } from './types';

export const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onImageLoad, 
  loadedImages, 
  imageRef,
  onPreviewClick
}) => {
  const isMobile = useIsMobile();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stage, setStage] = useState<'initial' | 'input' | 'confirmed'>('initial');

  const firstName = creator.name.split(' ')[0];

  // Use useCallback to memoize the click handler with a more direct approach
  const handleCTAClick = useCallback(() => {
    // First set the stage
    setStage('input');
    // Then show the dialog immediately
    setShowEmailDialog(true);
  }, []);

  // Use useCallback to memoize the dialog state change handler
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShowEmailDialog(open);
    if (!open) {
      // Reset stage only after dialog is fully closed
      setTimeout(() => {
        setStage('initial');
      }, 200);
    }
  }, []);

  return (
    <>
      <article className="group select-text h-full w-full">
        <div className="relative h-full w-full">
          {isMobile ? (
            <Card className={cn(
              "overflow-hidden flex flex-col w-full",
              "bg-white", // Clean white background
              "border border-gray-200", // Thin light gray border
              "shadow-[0_2px_4px_rgba(0,0,0,0.08)]", // Subtle shadow with proper opacity
              "rounded-lg relative transition-all duration-200",
              "h-full", // Allow card to adapt to content
              "translate-z-0 backface-visibility-hidden", // Hardware acceleration for mobile
              "will-change-transform" // Performance optimization
            )}>
              {/* Media section with properly positioned price tag */}
              <div className="relative">
                {/* Fixed aspect ratio for all cards */}
                <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 rounded-t-md">
                  <CreatorMedia 
                    creator={creator}
                    onImageLoad={onImageLoad}
                    onVideoLoad={() => onImageLoad?.(creator.image)}
                  />
                </div>
                
                {/* Price tag - repositioned for better visibility */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-white shadow-sm border border-gray-200 text-gray-800 rounded-full transition-all duration-200">
                    ${creator.price}/session
                  </span>
                </div>
              </div>

              {/* Content sections with proper organization */}
              <div className="w-full px-4 pt-3 pb-3 flex flex-col relative z-10 flex-grow flex-shrink-0">
                {/* Creator info section */}
                <div className="pb-3 mb-3 border-b border-gray-100">
                  {/* Creator name and location with proper styling */}
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-base leading-tight font-semibold text-gray-800 border-l-2 border-purple-600 pl-2">{creator.name}</h3>
                    <p className="text-gray-500 text-xs flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {creator.location}
                    </p>
                  </div>
                  
                  {/* Ratings and availability grouped together */}
                  <div className="flex justify-between items-center mb-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-purple-600 fill-purple-600 mr-1.5" />
                      <span className="text-sm font-semibold font-space text-gray-700">{creator.rating.toFixed(1)}</span>
                      {creator.reviews > 0 && (
                        <span className="text-xs text-gray-500 ml-1.5 font-inter">
                          ({creator.reviews})
                        </span>
                      )}
                    </div>
                    
                    {/* Availability indicator with improved styling */}
                    {creator.availabilityStatus && (
                      <div className="flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-white shadow-sm border border-gray-100">
                        {creator.availabilityStatus === 'available-now' && (
                          <span className="flex items-center text-emerald-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.6)]"></div>
                            Available Now
                          </span>
                        )}
                        {creator.availabilityStatus === 'available-tomorrow' && (
                          <span className="flex items-center text-amber-700">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                            Available Soon
                          </span>
                        )}
                        {creator.availabilityStatus === 'premium-only' && (
                          <span className="flex items-center text-purple-700">
                            <Crown className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                            Premium Only
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Services with organized tag styling */}
                  <div className="flex flex-wrap gap-x-1.5 gap-y-1 mt-2 px-2 py-2 bg-gray-50 rounded-lg border border-gray-100 max-w-full">
                    {creator.services.map((service, index) => {
                      // Force specific line wrapping for Emily Johnson on mobile
                      const forceWrap = isMobile && 
                                      creator.name === "Emily Johnson" && 
                                      (index === 2 || index === creator.services.length - 1);
                      
                      const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                      const isHashtag = service.startsWith('#');
                      const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                      const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                      
                      let bgColor = "bg-gray-100 border-gray-200 text-gray-700";
                      
                      // Only show the first 4 services to save space
                      if (index < 4) {
                        return (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border whitespace-nowrap touch-manipulation shadow-sm max-w-[120px] ${bgColor} ${forceWrap ? 'w-auto flex-shrink-0' : ''}`}
                          >
                            <span className="truncate">{service}</span>
                          </span>
                        );
                      } else if (index === 4) {
                        return (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-gray-600 border border-gray-200 bg-white shadow-sm"
                          >
                            +{creator.services.length - 4} more
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                
                {/* Recent Work section with proper header */}
                <div className="mb-16"> {/* Increased bottom margin to make room for the CTA */}
                  {/* Section header */}
                  <div className="mb-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-1 h-4 bg-gray-300 rounded-full mr-2"></div>
                      <div className="text-xs text-gray-700 font-medium font-space uppercase tracking-wide">Recent Work</div>
                    </div>
                    <button 
                      className="text-xs text-purple-600 font-medium px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => onPreviewClick ? onPreviewClick(creator.workExamples[0]) : setSelectedImage(creator.workExamples[0])}
                    >
                      View All →
                    </button>
                  </div>
                  
                  {/* Fixed height portfolio thumbnails */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {creator.workExamples.slice(0, 3).map((example, index) => (
                      <button 
                        key={index}
                        className="relative h-[70px] touch-manipulation rounded-lg overflow-hidden border border-gray-200 shadow-sm active:shadow-inner transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        onClick={() => onPreviewClick ? onPreviewClick(example) : setSelectedImage(example)}
                        aria-label={`View ${index === 0 ? 'interior' : index === 1 ? 'exterior' : 'detail'} image`}
                      >
                        <img 
                          src={example}
                          alt={`${creator.name}'s work ${index + 1}`}
                          className="object-cover h-full w-full"
                        />
                        {/* Enhanced label overlay with gradient background */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/5 py-1 text-center">
                          <span className="text-[10px] text-white font-medium uppercase tracking-wide font-space">
                            {index === 0 ? 'Interior' : index === 1 ? 'Exterior' : 'Detail'}
                          </span>
                        </div>
                        {/* Tap indicator with glass effect */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 3H21V9" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 3L9 15" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA button with fixed positioning at the bottom */}
                <div className="absolute bottom-3 left-0 right-0 px-4">
                  <button 
                    onClick={handleCTAClick}
                    aria-label={`Join as creator with ${creator.name}`}
                    className="w-full flex items-center justify-center text-sm px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold font-jakarta shadow-md h-[46px] hover:bg-purple-700 active:shadow-inner transition-all duration-200"
                  >
                    {stage === 'initial' ? (
                      <>
                        <span>JOIN AS CREATOR</span>
                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </>
                    ) : stage === 'input' ? (
                      <span>JOIN AS CREATOR</span>
                    ) : (
                      <span>Waitlist Joined!</span>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Desktop card design */}
              <Card className={cn(
                "overflow-hidden flex flex-col w-full",
                "will-change-transform transition-all duration-300",
                "hover:translate-y-[-2px]",
                "bg-white", // Clean white background
                "border border-gray-200", // Thin gray border
                "shadow-[0_2px_8px_rgba(0,0,0,0.08)]", // Subtle shadow
                "hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
                "rounded-lg",
                "h-full", // Ensure consistent height for desktop
                "block", // Force block display
                "pb-16" // Moderate padding for CTA spacing
              )}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                
                {/* Optimized price tag - compact and visually distinct */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <div className="px-3 py-1 text-sm font-semibold bg-white shadow-sm border border-gray-200 text-gray-800 rounded-full transition-all duration-200">
                    ${creator.price}/session
                  </div>
                </div>

                {/* Media container */}
                <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0">
                  <CreatorMedia 
                    creator={creator}
                    onImageLoad={onImageLoad}
                    onVideoLoad={() => onImageLoad?.(creator.image)}
                  />
                </div>

                {/* Content section with reduced spacing */}
                <div className="px-5 pt-4 pb-2 flex flex-col relative z-10 flex-grow" style={{ minHeight: "250px" }}>
                  {/* Enhanced creator info section with improved visual hierarchy */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <div className="py-2 px-3 -mx-2 mb-2 bg-gray-50 border-l-2 border-purple-600 rounded-r-md">
                      <h3 className="text-title leading-tight font-semibold text-gray-800">{creator.name}</h3>
                    </div>
                    
                    {/* Location with enhanced icon */}
                    <p className="text-caption flex items-center mt-1 ml-0.5">
                      <svg className="w-4 h-4 mr-1.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {creator.location}
                    </p>
                    
                    {/* Services with color-coded tag styling */}
                    <div className="flex flex-wrap gap-1.5 mt-2 bg-gray-50 p-1.5 rounded-md -mx-1">
                      {creator.services.map((service, index) => {
                        return (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-small border border-gray-200 bg-white text-gray-700 transition-colors duration-200"
                          >
                            <span>{service}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refined rating section with reduced spacing */}
                  <div className="mb-2 p-2 rounded-md bg-gray-50 border border-gray-100 shadow-sm">
                    <div className="mb-1.5 pb-1 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-0.5 h-3.5 bg-gray-300 rounded-full mr-1.5"></div>
                        <div className="text-[11px] text-gray-500 font-medium font-space uppercase tracking-wide">Ratings</div>
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium font-space">Availability →</div>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <CreatorRating 
                        rating={creator.rating} 
                        reviews={creator.reviews} 
                        name={creator.name} 
                        availabilityStatus={creator.availabilityStatus}
                      />
                    </div>
                  </div>

                  {/* Portfolio preview with reduced spacing */}
                  <div className="mb-14 rounded-md overflow-hidden"> {/* Increased bottom margin to make room for the fixed CTA button */}
                    <PortfolioPreview 
                      workExamples={creator.workExamples}
                      creatorName={creator.name}
                      onPreviewClick={onPreviewClick}
                    />
                  </div>

                  {/* Desktop CTA with fixed positioning at the bottom of the card */}
                  <div className="absolute bottom-3 left-0 right-0 z-50 px-5">
                    {/* Subtle visual indicator with reduced spacing */}
                    <div className="mb-2 mt-1 mx-auto w-8 h-0.5 rounded-full bg-gray-200"></div>
                    
                    <button 
                      onClick={handleCTAClick}
                      className="w-full bg-purple-600 text-white font-medium font-jakarta rounded-lg py-3 px-5 flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors"
                    >
                      <span className="text-base">JOIN AS CREATOR</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </article>
      
      {/* Email waitlist dialog with fixed positioning for mobile rendering */}
      {showEmailDialog && (
        <GlowDialog 
          open={showEmailDialog} 
          onOpenChange={handleDialogOpenChange}
        />
      )}
      
      {/* Image preview dialog - only shown if onPreviewClick is not provided */}
      {selectedImage && !onPreviewClick && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-0 bg-transparent border-0 max-w-[90vw] sm:max-w-[80vw]">
            <div className="relative">
              <img
                src={selectedImage}
                alt={`${creator.name}'s portfolio work`}
                className="w-full object-contain max-h-[80vh] rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 bg-black/50 rounded-full p-1.5 text-white"
                aria-label="Close image preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
