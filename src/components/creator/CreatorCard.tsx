import React, { useState, useCallback } from 'react';
import { Card } from '../ui/card';
import { ArrowRight, Star, X, Clock, Crown } from 'lucide-react';
import { Dialog, DialogContent } from "../ui/dialog";
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
              "bg-white",
              "border border-purple-200/70",
              "shadow-[0_4px_12px_rgba(138,79,255,0.15)]",
              "hover:shadow-[0_6px_16px_rgba(138,79,255,0.2)]",
              "rounded-xl relative transition-all duration-200",
              "h-full" // Fixed height to ensure consistent card sizing
            )}>
              {/* Very subtle pattern effect */}
              <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#8A4FFF_1px,transparent_1px)] bg-[length:16px_16px] z-0 pointer-events-none"></div>
              
              {/* Media section with properly positioned price tag */}
              <div className="relative">
                {/* Optimized media container with balanced aspect ratio */}
                <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 rounded-t-md">
                  <CreatorMedia 
                    creator={creator}
                    onImageLoad={onImageLoad}
                    onVideoLoad={() => onImageLoad?.(creator.image)}
                  />
                </div>
                
                {/* Price tag - repositioned for better visibility */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 shadow-sm border border-purple-200/60 text-purple-800 rounded-full transition-all duration-200 group-hover:bg-purple-100/80">
                    ${creator.price}/session
                  </span>
                </div>
              </div>

              {/* Content sections with proper organization */}
              <div className="w-full px-3.5 py-3 flex flex-col relative z-10 flex-grow flex-shrink-0 h-full">
                {/* Creator info section */}
                <div className="pb-2.5 mb-2.5 border-b border-purple-100/60">
                  {/* Creator name and location with proper styling */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[15px] leading-tight font-semibold text-gray-800">{creator.name}</h3>
                    <p className="text-gray-500 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {creator.location}
                    </p>
                  </div>
                  
                  {/* Ratings and availability grouped together */}
                  <div className="flex justify-between items-center mb-2.5 py-1.5 px-2 bg-gray-50/80 rounded-md border border-gray-100/80">
                    <div className="flex items-center">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium font-space text-gray-700">{creator.rating.toFixed(1)}</span>
                      {creator.reviews > 0 && (
                        <span className="text-xs text-gray-500 ml-1 font-inter">
                          ({creator.reviews})
                        </span>
                      )}
                    </div>
                    
                    {/* Availability indicator with improved styling */}
                    {creator.availabilityStatus && (
                      <div className="flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                        {creator.availabilityStatus === 'available-now' && (
                          <span className="flex items-center text-emerald-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.6)]"></div>
                            Available Now
                          </span>
                        )}
                        {creator.availabilityStatus === 'available-tomorrow' && (
                          <span className="flex items-center text-amber-700">
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
                            Available Soon
                          </span>
                        )}
                        {creator.availabilityStatus === 'premium-only' && (
                          <span className="flex items-center text-purple-700">
                            <Crown className="w-3.5 h-3.5 mr-1 text-purple-500" />
                            Premium Only
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Services with organized tag styling */}
                  <div className="flex flex-wrap gap-1.5 mt-1 max-w-full">
                    {creator.services.map((service, index) => {
                      const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                      const isHashtag = service.startsWith('#');
                      const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                      const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                      
                      let bgColor = "bg-purple-100/50 border-purple-200/80 text-purple-800";
                      if (isPlatform) bgColor = "bg-blue-50 border-blue-200/80 text-blue-700";
                      if (isHashtag) bgColor = "bg-indigo-50 border-indigo-200/80 text-indigo-700";
                      if (isVisualStyle) bgColor = "bg-violet-50 border-violet-200/80 text-violet-700";
                      if (isSpecialty) bgColor = "bg-teal-50 border-teal-200/80 text-teal-700";
                      
                      // Only show the first 4 services to save space
                      if (index < 4) {
                        return (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border whitespace-nowrap touch-manipulation ${bgColor}`}
                          >
                            <span>{service}</span>
                          </span>
                        );
                      } else if (index === 4) {
                        return (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] text-gray-500 border border-gray-200 bg-gray-50"
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
                <div className="mb-3">
                  {/* Section header */}
                  <div className="mb-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-0.5 h-3 bg-gradient-to-b from-indigo-400/80 to-purple-400/80 rounded-full mr-1.5"></div>
                      <div className="text-[11px] text-gray-600 font-medium font-space uppercase tracking-wide">Recent Work</div>
                    </div>
                    <div className="text-[10px] text-purple-500 font-medium">View All →</div>
                  </div>
                  
                  {/* Improved portfolio thumbnails with touch-optimized targets */}
                  <div className="grid grid-cols-3 gap-2">
                    {creator.workExamples.slice(0, 3).map((example, index) => (
                      <div 
                        key={index}
                        className="relative h-[70px] touch-manipulation rounded-md overflow-hidden border border-purple-100/80 shadow-sm transition-transform duration-150 active:scale-95"
                        onClick={() => setSelectedImage(example)}
                      >
                        <img 
                          src={example}
                          alt={`${creator.name}'s work ${index + 1}`}
                          className="object-cover h-full w-full"
                        />
                        {/* Label overlay with gradient background */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-black/10 py-1 text-center">
                          <span className="text-[9px] text-white font-medium uppercase tracking-wide font-space">
                            {index === 0 ? 'Interior' : index === 1 ? 'Exterior' : 'Detail'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spacer to push CTA to bottom */}
                <div className="flex-grow min-h-[5px]"></div>
                
                {/* CTA button with fixed positioning for alignment across cards */}
                <div className="mt-auto pt-2">
                  <button 
                    onClick={handleCTAClick}
                    aria-label={`Join as creator with ${creator.name}`}
                    className="w-full flex items-center justify-center text-sm px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md font-medium font-jakarta shadow-md h-[44px]"
                  >
                    {stage === 'initial' ? (
                      <>
                        <span>JOIN AS CREATOR</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2" aria-hidden="true" />
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
              {/* Subtle glow effect behind card */}
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-800/20 via-indigo-700/20 to-purple-900/20 opacity-50 blur-[2px] sm:blur-sm group-hover:opacity-80 transition duration-500"></div>
              
              {/* Desktop CTA with reduced spacing */}
              <div className="absolute bottom-3 left-0 right-0 z-50 px-5">
                {/* Subtle visual indicator with reduced spacing */}
                <div className="mb-2 mt-1 mx-auto w-8 h-0.5 rounded-full bg-gradient-to-r from-purple-200/50 via-purple-300/50 to-purple-200/50"></div>
                
                <button 
                  onClick={handleCTAClick}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium font-jakarta rounded-lg py-3 px-5 flex items-center justify-center shadow-md border border-indigo-400/30"
                >
                  <span className="text-base">JOIN AS CREATOR</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              
              <Card className={cn(
                "overflow-hidden flex flex-col w-full",
                "will-change-transform transition-all duration-300",
                "hover:translate-y-[-2px]",
                "bg-white border border-purple-200/50",
                "shadow-[0_6px_16px_rgba(138,79,255,0.1)]",
                "hover:shadow-[0_14px_28px_rgba(138,79,255,0.15)]",
                "rounded-xl",
                "h-full", // Ensure consistent height for desktop
                "block", // Force block display
                "pb-16" // Moderate padding for CTA spacing
              )}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#8A4FFF_1px,transparent_1px)] bg-[length:20px_20px] z-0 pointer-events-none"></div>
                
                {/* Subtle border effect - more minimal */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl border border-purple-100/50">
                </div>

                {/* Optimized price tag - compact and visually distinct */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <div className="px-3 py-1 text-sm font-semibold bg-purple-50 shadow-sm border border-purple-200/60 text-purple-800 rounded-full transition-all duration-200 group-hover:bg-purple-100/80">
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
                  <div className="mb-3 pb-3 border-b border-purple-100/40">
                    <div className="py-2 px-3 -mx-2 mb-2 bg-purple-50/60 border-l-2 border-purple-400 rounded-r-md">
                      <h3 className="text-title leading-tight font-semibold text-purple-800">{creator.name}</h3>
                    </div>
                    
                    {/* Location with enhanced icon */}
                    <p className="text-caption flex items-center mt-1 ml-0.5">
                      <svg className="w-4 h-4 mr-1.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {creator.location}
                    </p>
                    
                    {/* Services with color-coded tag styling */}
                    <div className="flex flex-wrap gap-1.5 mt-2 bg-purple-50/30 p-1.5 rounded-md -mx-1">
                      {creator.services.map((service, index) => {
                        // Determine tag color based on service type
                        const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                        const isHashtag = service.startsWith('#');
                        const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                        const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                        
                        let bgColor = "bg-purple-100/50 hover:bg-purple-100 border-purple-200/80 text-purple-800";
                        if (isPlatform) bgColor = "bg-blue-50 hover:bg-blue-100 border-blue-200/80 text-blue-700";
                        if (isHashtag) bgColor = "bg-indigo-50 hover:bg-indigo-100 border-indigo-200/80 text-indigo-700";
                        if (isVisualStyle) bgColor = "bg-violet-50 hover:bg-violet-100 border-violet-200/80 text-violet-700";
                        if (isSpecialty) bgColor = "bg-teal-50 hover:bg-teal-100 border-teal-200/80 text-teal-700";
                        
                        return (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-small border transition-colors duration-200 ${bgColor}`}
                          >
                            {isHashtag ? (
                              <span className="font-medium">{service}</span>
                            ) : isPlatform ? (
                              <span className="font-medium">{service}</span>
                            ) : (
                              <span>{service}</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refined rating section with reduced spacing */}
                  <div className="mb-2 p-2 rounded-md bg-white border border-purple-100/40 shadow-sm">
                    <div className="mb-1.5 pb-1 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-0.5 h-3.5 bg-gradient-to-b from-indigo-400/80 to-purple-400/80 rounded-full mr-1.5"></div>
                        <div className="text-[11px] text-gray-500 font-medium font-space uppercase tracking-wide">Ratings</div>
                      </div>
                      <div className="text-[11px] text-purple-400/80 font-medium font-space">Availability →</div>
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
                  <div className="mb-1 rounded-md overflow-hidden">
                    <PortfolioPreview 
                      workExamples={creator.workExamples}
                      creatorName={creator.name}
                    />
                  </div>

                  {/* Minimal visual spacing before CTA */}
                  <div className="mt-1 mb-1 pt-1"></div>
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
      
      {/* Image preview dialog */}
      {selectedImage && (
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