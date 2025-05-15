import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { ArrowRight, Star, X, Clock, Crown, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from "../ui/dialog";
import './creator-card.css'; // Import CSS for custom animations
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorRating } from './CreatorRating';
import { GlowDialog } from '../ui/glow-dialog';
import { BorderBeam } from '../ui/border-beam';
import { CreatorMedia } from './CreatorMedia';
import { PortfolioPreview } from './PortfolioPreview';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";
import type { CreatorCardProps } from './types';

export const CreatorCard: React.FC<CreatorCardProps> = ({ 
  creator, 
  onImageLoad, 
  loadedImages, 
  imageRef,
  onPreviewClick,
  isSelected
}) => {
  const isMobile = useIsMobile();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stage, setStage] = useState<'initial' | 'input' | 'confirmed'>('initial');
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = creator.name.split(' ')[0];

  // Validate email as user types
  useEffect(() => {
    if (showInlineForm) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(email.length > 0 && emailRegex.test(email));
    }
  }, [email, showInlineForm]);
  
  // Focus input after showing form
  useEffect(() => {
    if (showInlineForm && inputRef.current) {
      // Add small delay to ensure element is mounted and renderable
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showInlineForm]);

  // Simplified click handler for better mobile compatibility
  const handleCTAClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile) {
      // On mobile, show inline form
      setShowInlineForm(true);
    } else {
      // On desktop, show dialog
      setShowEmailDialog(true);
      
      // Set stage after a short delay to ensure dialog is ready
      setTimeout(() => {
        setStage('input');
      }, 100);
    }
  }, [isMobile]);

  // Handle inline form submission
  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Include metadata for tracking
      const metadata = {
        source: "creator_card",
        creator: creator.name,
        referrer: document.referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      
      // Submit to waitlist API
      const { data, error } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source: "creator_card", 
          marketingConsent: true,
          metadata
        }
      });
      
      if (error) {
        console.error("Error submitting email:", error);
        toast.error("Failed to join waitlist. Please try again.");
        return;
      }
      
      // Store the email for the confirmation message
      setSubmittedEmail(email);
      
      // Check if already subscribed
      setAlreadySubscribed(data?.status === 'already_subscribed');
      
      // Clear form
      setEmail("");
      setShowInlineForm(false);
      
      // Show inline success message
      setShowInlineSuccess(true);
      
      // Trigger confetti
      try {
        if (typeof window !== 'undefined' && window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 }
          });
        } else {
          // Use imported confetti as fallback
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 }
          });
        }
      } catch (err) {
        // Silent error handling for confetti
      }
      
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      {isMobile ? (
        <div className="relative w-full h-full flex creator-card-container">
          {/* Main container with standardized border radius and enhanced hardware acceleration */}
          <Card className={cn(
            "overflow-hidden flex flex-col w-full",
            "bg-transparent",
            "border-0",
            "relative hover:translate-y-[-2px] active:scale-[0.99]",
            isSelected && "ring-1 ring-[rgba(118,51,220,0.25)] ring-opacity-100",
            "hardware-accelerated" // New class for debugging
          )}
            style={{
              // Advanced hardware acceleration techniques
              transform: 'translate3d(0, 0, 0)', // More effective hardware acceleration than translateZ
              willChange: 'transform, opacity', // Optimization hint for transitions - only animate these properties
              // Only transition transform and opacity properties to prevent layout shifts
              transitionProperty: 'transform, opacity, box-shadow',
              transitionDuration: '300ms',
              transitionTimingFunction: 'cubic-bezier(0.2, 0, 0.15, 1)', // Improved easing curve for smoother motion
              
              // Improve rendering performance
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              
              // Stable, pre-rendered gradient backgrounds with hardware acceleration
              background: isSelected 
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(245, 245, 247, 0.9) 100%)' // Slightly brighter when selected
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 245, 250, 0.85) 100%)', // Subtle vertical gradient
              
              // Glass effect with explicit hints to browser
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)', // Safari support
              
              // Fixed dimensions with explicit radius and overflow control
              borderRadius: '16px', 
              overflow: 'hidden',
              maxHeight: '85vh',
              height: 'auto',
              
              // Simplified, consistent border that won't change dimensions
              border: '1px solid rgba(0, 0, 0, 0.06)',
              
              // Simplified shadow system pre-computed for better performance
              boxShadow: `
                0 2px 8px rgba(118, 51, 220, 0.06),
                0 4px 12px rgba(0, 0, 0, 0.03),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)
              `,
              
              // Reduce layout calculations and painting operations
              contain: 'layout paint style',

              // Enhanced 3D effect - pre-rendered on GPU
              transformStyle: 'preserve-3d',
              
              // Prevent any margin-based CLS
              margin: 0,
              
              // Force compositing layer for animation
              zIndex: 1,
              
              // Box sizing to prevent dimension changes
              boxSizing: 'border-box',
              
              // Prevent interaction causing reflows
              touchAction: 'manipulation',
              
              // Prevent tap highlight
              WebkitTapHighlightColor: 'transparent',
              
              // Prevent forced repaints during scrolling
              overscrollBehavior: 'none'
            }}
            data-selected={isSelected ? 'true' : 'false'}>
            
            {/* Simplified glass effect with single element and gradient background - now matching CTA styling */}
            {/* Simplified inner light effect */}
            <div className="absolute inset-0 pointer-events-none" 
                 style={{
                   borderRadius: '16px', // Consistent radius
                   transform: 'translateZ(0)',
                   zIndex: 2,
                   overflow: 'hidden'
                 }}>
                 
              {/* Simplified top edge highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30 pointer-events-none"></div>
              
              {/* Simplified left edge highlight */}
              <div className="absolute left-0 inset-y-0 w-[1px] bg-white/30 pointer-events-none"></div>
            </div>
            
            {/* Subtle pulsing highlight effect for selected cards */}
            {isSelected && (
              <div 
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                  boxShadow: '0 0 0 1px rgba(118, 51, 220, 0.25)', // Precise 1px border matching main border color
                  borderRadius: '16px', // Consistent radius
                  animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  transform: 'translateZ(0)'
                }}
              ></div>
            )}
            
            {/* Media section with consistent border radius */}
            <div className="relative">
              {/* Fixed aspect ratio with standard corner radius */}
              <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 transition-transform duration-300"
                   style={{
                     borderTopLeftRadius: '16px',
                     borderTopRightRadius: '16px',
                     // Ensure proper image container
                     contain: 'layout size'
                   }}>
                {/* Simplified overlay with consistent corner radius */}
                <div className="absolute inset-0 w-full h-full z-10 overflow-hidden"
                  style={{
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    transform: 'translateZ(0)'
                  }}>
                </div>
                
                <CreatorMedia 
                  creator={creator}
                  onImageLoad={onImageLoad}
                  onVideoLoad={() => onImageLoad?.(creator.image)}
                />
              </div>
              
              {/* Price tag with simplified glass effect */}
              <div className="absolute top-3 right-3 z-20">
                <span 
                  className="px-3 py-1 text-xs font-semibold text-purple-800 rounded-full transition-all duration-200"
                  style={{
                    background: 'rgba(245, 245, 247, 0.92)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    // Simplified shadow and border style for cleaner rendering
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(118, 51, 220, 0.18)',
                    // Hardware acceleration
                    transform: 'translateZ(0)'
                  }}
                >
                  ${creator.price}/session
                </span>
              </div>
            </div>

            {/* Content sections with improved padding for mobile */}
            <div className="w-full px-4 pt-3 pb-2 flex flex-col relative z-10 flex-grow flex-1" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Creator info section with minimized spacing */}
              <div className="pb-0 mb-1">
                {/* Creator name and location - vertical stack for mobile */}
                <div 
                  className="flex flex-col mb-1 py-0.5 px-0"
                  style={{
                    transform: 'translateZ(0)', // Hardware acceleration
                    borderBottom: '1px solid rgba(220, 215, 240, 0.3)'
                  }}
                >
                  <h3 className="text-lg leading-tight font-bold text-gray-800 tracking-tight flex items-center">
                    {creator.name}
                    <span className="absolute -top-0.5 -right-0.5 w-12 h-6 bg-gradient-to-br from-purple-100/40 to-transparent blur-sm rounded-full"></span>
                  </h3>
                  <p className="text-gray-600 text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="truncate line-clamp-1">{creator.location}</span>
                  </p>
                </div>
                
                {/* Services tags with tighter spacing */}
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-0.5 px-0 py-0.5 mb-1 max-w-full"
                  style={{
                    position: 'relative',
                    transform: 'translateZ(0)', // Hardware acceleration
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {creator.services.map((service, index) => {
                    // Force specific line wrapping for Emily Johnson on mobile
                    const forceWrap = isMobile && 
                                    creator.name === "Emily Johnson" && 
                                    (index === 2 || index === creator.services.length - 1);
                    
                    const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                    const isHashtag = service.startsWith('#');
                    const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                    const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                    
                    let bgColor = "bg-[rgba(239,240,236,0.8)] border-[rgba(239,240,236,0.9)] text-gray-700";
                    if (isPlatform) bgColor = "bg-[rgba(239,240,236,0.8)] border-[rgba(239,240,236,0.9)] text-gray-700"; // Changed from purple
                    if (isHashtag) bgColor = "bg-[rgba(239,240,236,0.8)] border-[rgba(239,240,236,0.9)] text-gray-700"; // Changed from indigo
                    if (isVisualStyle) bgColor = "bg-[rgba(239,240,236,0.8)] border-[rgba(239,240,236,0.9)] text-gray-700"; // Changed from violet
                    if (isSpecialty) bgColor = "bg-[rgba(239,240,236,0.8)] border-[rgba(239,240,236,0.9)] text-gray-700"; // Changed from teal
                    
                    // Precompute service tag dimensions to prevent CLS
                    // This ensures a stable layout with fixed dimensions for tags
                    const tagHeight = 24; // Fixed height in pixels
                    const tagMinWidth = 40; // Minimum width
                    
                    // Pre-compute width based on text content to prevent layout shifts
                    // These are estimates based on character counts to reserve space
                    const charWidth = 7; // Approximate width of a character in pixels
                    const iconWidth = service.includes('TikTok') || service.includes('Instagram') ? 20 : 0; // Add space for potential icons
                    const estimatedWidth = Math.min(120, Math.max(tagMinWidth, service.length * charWidth + iconWidth));
                    
                    // Only show the first 3 services to save more space on mobile
                    if (index < 3) {
                      return (
                        <span 
                          key={index} 
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs whitespace-nowrap touch-manipulation max-w-[120px] font-medium ${bgColor} ${forceWrap ? 'w-auto flex-shrink-0' : ''}`}
                          style={{
                            // Standardized glass effect matching card and CTA
                            background: 'rgba(245, 245, 247, 0.92)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            // Consistent border treatment
                            border: '1px solid rgba(118, 51, 220, 0.15)',
                            // Standardized shadow with top/left highlights
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.04)',
                            // Explicit sizing with fixed height to prevent CLS
                            height: `${tagHeight}px`,
                            minHeight: `${tagHeight}px`,
                            maxHeight: `${tagHeight}px`,
                            minWidth: `${tagMinWidth}px`,
                            width: forceWrap ? `${estimatedWidth}px` : 'auto', // Fixed width for wrapped items
                            // Hardware acceleration
                            transform: 'translateZ(0)',
                            // Improved spacing with exact pixel values
                            margin: '1px',
                            // Prevent any transitions affecting size
                            transition: 'opacity 0.2s ease',
                            // Contain sizing to prevent text from affecting dimensions
                            contain: 'layout paint',
                            // Set explicit line height
                            lineHeight: '1',
                            // Fix text overflow
                            textOverflow: 'ellipsis',
                            // Box sizing
                            boxSizing: 'border-box',
                            // Prevent pointer events from causing layout
                            pointerEvents: 'none'
                          }}
                          data-service={service}
                          data-service-type={isPlatform ? 'platform' : isHashtag ? 'hashtag' : isVisualStyle ? 'visual' : isSpecialty ? 'specialty' : 'general'}
                        >
                          <span className="truncate flex items-center">{service}</span>
                        </span>
                      );
                    } else if (index === 3) {
                      // The "more" indicator with fixed dimensions
                      const moreText = `+${creator.services.length - 3} more`;
                      const moreWidth = Math.max(tagMinWidth, moreText.length * charWidth + 8);
                      
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-gray-600 font-medium"
                          style={{
                            // Standardized glass effect matching service tags
                            background: 'rgba(239, 240, 236, 0.85)',
                            backdropFilter: 'blur(7px)',
                            WebkitBackdropFilter: 'blur(7px)',
                            // Consistent border treatment
                            border: '1px solid rgba(118, 51, 220, 0.15)',
                            // Standardized shadow with top/left highlights
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.04)',
                            // Explicit sizing with fixed height and estimated width
                            height: `${tagHeight}px`,
                            minHeight: `${tagHeight}px`,
                            maxHeight: `${tagHeight}px`,
                            width: `${moreWidth}px`,
                            minWidth: `${moreWidth}px`,
                            // Hardware acceleration
                            transform: 'translateZ(0)',
                            // Improved spacing with exact pixel values
                            margin: '1px',
                            // Prevent any transitions affecting size
                            transition: 'opacity 0.2s ease',
                            // Contain sizing to prevent text from affecting dimensions
                            contain: 'layout paint',
                            // Set explicit line height
                            lineHeight: '1',
                            // Prevent pointer events from causing layout
                            pointerEvents: 'none'
                          }}
                          data-more-count={creator.services.length - 3}
                        >
                          <span className="flex items-center">{moreText}</span>
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Ratings and availability without the shared container */}
                <div className="flex justify-between items-center mb-1.5 px-0 py-0.5" 
                  style={{
                    transform: 'translateZ(0)', // Hardware acceleration
                    position: 'relative', // For pseudo-elements
                    zIndex: 5, // Ensure components appear above other elements
                    willChange: 'transform', // Optimization hint
                    gap: '4px' // Reduced gap between components
                  }}>
                  {/* Star rating with review count - fixed dimensions for CLS prevention */}
                  <div 
                    className="flex items-center py-1 px-3 rounded-full rating-badge"
                    style={{
                      // Standardized glass effect matching card and CTA
                      background: 'rgba(245, 245, 247, 0.92)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      // Consistent border treatment
                      border: '1px solid rgba(118, 51, 220, 0.15)',
                      // Standardized shadow with top/left highlights
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.05)',
                      
                      // Hardware acceleration
                      transform: 'translateZ(0)', 
                      // Only transition opacity to prevent layout shifts
                      transition: 'opacity 0.2s ease',
                      
                      // Fixed dimensions to prevent CLS - critical for preventing layout shifts
                      minHeight: '28px',
                      height: '28px',
                      // Pre-calculate width based on content to prevent shifts
                      // Ratings typically follow a pattern like "4.9 (127)" - ~70px accommodates this
                      minWidth: '70px',
                      width: '70px',
                      
                      // Guarantee space for review count
                      maxWidth: '70px',
                      
                      // Ensure content doesn't affect layout
                      contain: 'layout paint',
                      
                      // Mobile interaction optimizations
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      
                      // Flex layout for internal content
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      
                      // Box sizing to ensure border doesn't change dimensions
                      boxSizing: 'border-box',
                      
                      // Overflow handling
                      overflow: 'hidden',
                      
                      // Prevent margin-induced shifts
                      margin: 0,
                      
                      // Disable pointer events - ratings badge is not interactive
                      pointerEvents: 'none'
                    }}
                    data-rating={creator.rating.toFixed(1)}
                    data-reviews={creator.reviews}
                  >
                    {/* Add subtle inner glow to star icon with fixed dimensions */}
                    <div className="relative" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1 relative z-10" 
                        style={{
                          filter: 'drop-shadow(0 0 1px rgba(252, 211, 77, 0.4))',
                          transform: 'translateZ(1px)', // Subtle 3D lift
                          width: '16px',
                          height: '16px',
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }} 
                      />
                      {/* Subtle glow behind star with fixed position/size */}
                      <div className="absolute -inset-1 bg-yellow-100/30 rounded-full blur-sm -z-0"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-800 whitespace-nowrap"
                      style={{
                        letterSpacing: '0.01em', // Slightly improved letter spacing
                        // Prevent text from causing layout shifts
                        lineHeight: 1,
                        // Fixed width for text content
                        width: '50px',
                        // Flex layout for consistent alignment
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {creator.rating.toFixed(1)} <span className="text-gray-600 ml-1 whitespace-nowrap">({creator.reviews})</span>
                    </span>
                  </div>
                  
                  {/* Availability indicator with fixed dimensions */}
                  {creator.availabilityStatus && (
                    <div 
                      className="flex items-center py-1 px-3 rounded-full availability-badge"
                      style={{
                        // Standardized glass effect
                        background: 'rgba(239, 240, 236, 0.85)',
                        backdropFilter: 'blur(7px)',
                        WebkitBackdropFilter: 'blur(7px)',
                        // Consistent border treatment
                        border: '1px solid rgba(118, 51, 220, 0.15)',
                        // Standardized shadow with top/left highlights
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.05)',
                        
                        // Hardware acceleration
                        transform: 'translateZ(0)',
                        
                        // Only transition opacity for CLS prevention
                        transition: 'opacity 0.2s ease',
                        
                        // Fixed dimensions based on the status text to prevent CLS
                        minHeight: '28px',
                        height: '28px',
                        // Dynamic width based on status - careful pre-computation of space
                        minWidth: creator.availabilityStatus === 'available-now' ? '110px' :
                                 creator.availabilityStatus === 'available-tomorrow' ? '115px' : 
                                 '110px', // premium-only
                        width: creator.availabilityStatus === 'available-now' ? '110px' :
                              creator.availabilityStatus === 'available-tomorrow' ? '115px' : 
                              '110px', // premium-only
                        
                        // Limiting max width to prevent unexpected shifts
                        maxWidth: '115px',
                        
                        // Ensure content doesn't affect layout
                        contain: 'layout paint',
                        
                        // Mobile interaction optimizations
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                        
                        // Flex layout for internal content
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                        // Box sizing to ensure border doesn't change dimensions
                        boxSizing: 'border-box',
                        
                        // Overflow handling
                        overflow: 'hidden',
                        
                        // Prevent margin-induced shifts
                        margin: 0,
                        
                        // Disable pointer events - availability is not interactive
                        pointerEvents: 'none'
                      }}
                      data-availability={creator.availabilityStatus}
                    >
                      {creator.availabilityStatus === 'available-now' && (
                        <span className="flex items-center text-emerald-700 whitespace-nowrap text-xs font-medium"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            width: '100%', 
                            justifyContent: 'center'
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.6)]"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              flexShrink: 0,
                              margin: '0 6px 0 0'
                            }}
                          ></div>
                          <span className="flex items-center">Available Now</span>
                        </span>
                      )}
                      {creator.availabilityStatus === 'available-tomorrow' && (
                        <span className="flex items-center text-amber-700 whitespace-nowrap text-xs font-medium"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            width: '100%', 
                            justifyContent: 'center'
                          }}
                        >
                          <Clock className="w-4 h-4 mr-1.5 text-amber-500" 
                            style={{ 
                              width: '16px', 
                              height: '16px', 
                              flexShrink: 0,
                              margin: '0 6px 0 0'
                            }}
                          />
                          <span className="flex items-center">Available Soon</span>
                        </span>
                      )}
                      {creator.availabilityStatus === 'premium-only' && (
                        <span className="flex items-center text-gray-700 whitespace-nowrap text-xs font-medium"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            width: '100%', 
                            justifyContent: 'center'
                          }}
                        >
                          <Crown className="w-4 h-4 mr-1.5 text-gray-500" 
                            style={{ 
                              width: '16px', 
                              height: '16px', 
                              flexShrink: 0,
                              margin: '0 6px 0 0'
                            }}
                          />
                          <span className="flex items-center">Premium Only</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Work section with reduced spacing */}
              <div className="mb-0 w-full mt-0.5">
                {/* Thin divider line - removed for more compact layout */}
                {/* Enhanced section header with better prominence */}
                <div className="mb-1 flex items-center justify-between py-0.5 px-0"
                  style={{
                    minHeight: '20px',
                    borderBottom: '1px solid rgba(220, 215, 240, 0.3)'
                }}>
                  <div className="flex items-center">
                    <div className="w-1 h-3.5 bg-gradient-to-b from-[#EFEFEC] to-[rgba(239,240,236,0.7)] rounded-full mr-1.5 shadow-sm"></div>
                    <div className="text-xs text-gray-800 font-medium font-space uppercase tracking-wide">Recent Work</div>
                  </div>
                  <div 
                    className="text-[10px] text-gray-600 font-medium flex items-center cursor-pointer"
                    onClick={() => onPreviewClick && onPreviewClick(creator.workExamples[0])}
                  >
                    View All
                    <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Thumbnails with optimized spacing and cleaner styling */}
                <div className="grid grid-cols-3 gap-2 w-full px-0 pb-0 pt-2">
                  {creator.workExamples.slice(0, 3).map((example, index) => (
                    <div 
                      key={index}
                      onClick={() => onPreviewClick && onPreviewClick(example)}
                      className="relative touch-manipulation overflow-hidden transition-all duration-150 focus:outline-none flex-grow"
                      style={{
                        borderRadius: '12px', // Appropriate for thumbnail elements
                        aspectRatio: '1/1', // Square aspect ratio for consistent layout
                        // Enhanced glass effect perfectly matching card and CTA
                        background: 'rgba(245, 245, 247, 0.92)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        // Enhanced border matching main CTA button
                        border: '1px solid rgba(118, 51, 220, 0.18)', 
                        // Inner highlight without bottom shadow
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8)',
                        // Hardware acceleration
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        transition: 'all 0.15s ease-out',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
                        // Ensure smooth animation
                        WebkitTransform: 'translateZ(0)'
                      }}
                      onTouchStart={(e) => {
                        // Add subtle touch highlight effect - simplified for better performance
                        const el = e.currentTarget as HTMLElement;
                        if (el && el.style) {
                          el.style.transform = 'translateZ(0) scale(0.97)';
                          el.style.opacity = '0.95';
                        }
                      }}
                      onTouchEnd={(e) => {
                        // Reset styles - simplified for better performance
                        const el = e.currentTarget as HTMLElement;
                        if (el && el.style) {
                          el.style.transform = 'translateZ(0) scale(1)';
                          el.style.opacity = '1';
                        }
                      }}
                      aria-label={`${index === 0 ? 'Primary' : 'Secondary'} portfolio image`}
                    >
                      {/* Image with improved rendering quality */}
                      <img 
                        src={example}
                        alt={`${creator.name}'s work ${index + 1}`}
                        className="w-full h-full"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '11px', // Slightly inset from container
                          objectFit: 'cover',
                          // Optimize rendering
                          transform: 'translateZ(0)',
                          imageRendering: 'auto',
                          WebkitImageRendering: 'auto'
                        }}
                        loading="eager" // Prioritize loading these images
                      />
                      
                      {/* Simplified hover/touch state overlay with matching border radius */}
                      <div className="absolute inset-0 bg-gray-600/10 opacity-0 hover:opacity-100 active:opacity-100 transition-opacity duration-150 flex items-center justify-center rounded-[11px]">
                        <div className="w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H21V9" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 3L9 15" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Optimized spacer for mobile UI/UX - reduced whitespace */}
              <div className="flex-grow relative" style={{ 
                minHeight: '8px', // Minimal height for proper spacing
                marginTop: '12px', // Moderate top margin
                marginBottom: '0' // No bottom margin needed
              }}>
                {/* Bottom corner highlights */}
                <div 
                  className="absolute bottom-0 left-0 w-[20px] h-[20px]" 
                  style={{
                    background: 'radial-gradient(circle at bottom left, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    borderBottomLeftRadius: '16px',
                    zIndex: 5
                  }}
                ></div>
                <div 
                  className="absolute bottom-0 right-0 w-[20px] h-[20px]" 
                  style={{
                    background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    borderBottomRightRadius: '16px',
                    zIndex: 5
                  }}
                ></div>
              </div>
              
              {/* CTA section positioned at bottom of card with clean, cohesive design */}
              <div className="flex items-center justify-center py-2 pb-2" style={{
                position: 'relative',
                marginTop: '0' // No additional margin needed with the spacer above
              }}>
                {/* Success state */}
                {showInlineSuccess ? (
                  <div className="w-full py-4 px-4 font-medium rounded-[12px] text-white relative flex flex-col items-center justify-center animate-fade-in"
                    style={{
                      background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: 
                        /* Layered shadow system */
                        '0 2px 4px rgba(118,51,220,0.08),' +
                        '0 4px 8px rgba(118,51,220,0.08),' +
                        '0 8px 16px rgba(0,0,0,0.05),' + 
                        '0 16px 32px rgba(0,0,0,0.04),' +
                        /* Inner highlights */
                        'inset 0 1px 0 rgba(255,255,255,0.25),' +
                        'inset 1px 0 0 rgba(255,255,255,0.2),' +
                        /* Inner shadows */
                        'inset 0 -1px 0 rgba(0,0,0,0.15),' +
                        'inset -1px 0 0 rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="h-12 w-12 bg-purple-50/20 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {alreadySubscribed ? "Already Subscribed" : "Success!"}
                    </h3>
                    <p className="text-white/90 text-center text-sm max-w-[24rem] mb-1">
                      {alreadySubscribed 
                        ? `${submittedEmail} is already on our waitlist.`
                        : `We've added ${submittedEmail} to our waitlist.`
                      }
                    </p>
                    <p className="text-white/80 text-xs">
                      We'll notify you as soon as we launch.
                    </p>
                  </div>
                ) : showInlineForm ? (
                  /* Form state */
                  <form 
                    onSubmit={handleInlineSubmit}
                    className="w-full relative animate-fade-in"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="relative">
                        {/* Email input */}
                        <input
                          ref={inputRef}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full h-[48px] px-4 py-3 rounded-t-[12px] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                          style={{
                            fontSize: '16px', // Prevent iOS zoom on focus
                            backgroundColor: 'white'
                          }}
                          disabled={isLoading}
                          required
                        />
                        
                        {/* Check mark for valid email */}
                        {isValid && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      
                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[48px] bg-gradient-to-b from-purple-600 to-purple-700 text-white font-medium rounded-t-none rounded-b-[12px] flex items-center justify-center transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            <span>JOIN WAITLIST</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Initial button state with enhanced styling */
                  <button 
                    onClick={handleCTAClick}
                    aria-label={`Join as creator with ${creator.name}`}
                    className="w-full flex items-center justify-center rounded-[14px] font-semibold h-[46px] transition-all duration-300 relative hover:scale-[1.02] active:scale-[0.97] bg-creator-cta"
                    style={{
                      background: 'rgba(245, 245, 247, 0.92)', // Neutral light gray that matches card design
                      backdropFilter: 'blur(10px)', // Enhanced glass-like blur matching thumbnails
                      WebkitBackdropFilter: 'blur(10px)', // For Safari support
                      color: '#555555', // Neutral dark gray text for better contrast
                      border: '1px solid rgba(118, 51, 220, 0.18)', // Match thumbnail border exactly
                      borderTop: '1px solid rgba(255, 255, 255, 0.9)', // Subtle top highlight
                      borderLeft: '1px solid rgba(255, 255, 255, 0.8)', // Subtle left highlight
                      borderRight: '1px solid rgba(200, 200, 200, 0.2)', // Neutral right edge
                      borderBottom: '1px solid rgba(200, 200, 200, 0.25)', // Neutral bottom edge
                      // Consistent shadow matching the thumbnails
                      boxShadow: 
                        /* Matching thumbnail shadows for visual continuity */
                        '0 4px 8px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04),' +
                        
                        /* Standardized inner highlight pattern matching thumbnails */
                        'inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 1px 0 0 rgba(255, 255, 255, 0.8)', // Right inner shadow
                      
                      fontSize: '14px',
                      fontWeight: 600, // Medium weight
                      fontFamily: 'var(--font-sans)', // Use website's standard font
                      transform: 'translateY(-2px) translateZ(0)', // Lifted appearance with hardware acceleration
                      willChange: 'transform, box-shadow', // Optimization hint
                      transformStyle: 'preserve-3d', // Enhance 3D appearance
                      transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', // Custom bezier for smoother motion
                      position: 'relative', // For pseudo-elements
                      overflow: 'hidden', // For glass effect containment
                    }}
                  >
                    {/* Subtle reflective glow effect for top-left corner */}
                    <div className="absolute top-0 left-0 w-[80px] h-[26px] rounded-tl-[14px] pointer-events-none overflow-hidden">
                      <div 
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '-20px',
                          width: '100px',
                          height: '60px',
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 80%)',
                          opacity: 0.6,
                          transform: 'rotate(-5deg)',
                          pointerEvents: 'none'
                        }}
                      ></div>
                    </div>
                    
                    {/* Enhanced icon container with matching lighting effects */}
                    <div className="flex items-center justify-center h-full z-10 relative">
                      <div 
                        className="flex items-center justify-center mr-3"
                        style={{
                          width: '34px',
                          height: '34px',
                          background: 'rgba(245, 245, 247, 0.85)', // Match the neutral button background
                          border: '1px solid rgba(118,51,220,0.18)', // Match button border
                          borderTop: '1px solid rgba(255,255,255,0.9)', // Match button's top highlight
                          borderLeft: '1px solid rgba(255,255,255,0.8)', // Match button's left highlight
                          borderRadius: '12px',
                          // Standardized shadow pattern matching button 
                          boxShadow: 
                            '0 2px 4px rgba(0,0,0,0.04), ' + 
                            'inset 0 1px 0 rgba(255,255,255,0.9), ' +
                            'inset 1px 0 0 rgba(255,255,255,0.8)',
                            
                          transform: 'translateZ(5px)', // Subtle 3D lift above button surface
                          position: 'relative' // For light refraction effect
                        }}
                      >
                        {creator.name === "Emily Johnson" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 10A0.5 0.5 0 1 1 15 9.5A0.5 0.5 0 0 1 14.5 10Z"></path>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <path d="M9 3L9 21"></path>
                          </svg>
                        ) : creator.name === "Jane Cooper" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        ) : creator.name === "Michael Brown" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12A10 10 0 1 0 12 2m-9.87 4.5a14 14 0 0 0-0.13 1.8c0 7.5 5.5 14.4 13 14.7a10.8 10.8 0 0 0 2 .1"></path>
                            <path d="M3.3 7.7A13.4 13.4 0 0 0 2.5 10a15 15 0 0 0 6 11.1A11 11 0 0 0 12 22"></path>
                            <path d="M5 2.3A10 10 0 0 1 17.55 5"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" x2="19" y1="8" y2="14"></line>
                            <line x1="22" x2="16" y1="11" y2="11"></line>
                          </svg>
                        )}
                      </div>
                      <span className="text-center font-medium text-base text-gray-700 flex items-center">
                        <span className="leading-none">JOIN AS CREATOR</span>
                        <ArrowRight className="w-4 h-4 ml-2 text-gray-500" />
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
            </Card>
          </div>
      ) : (
          <article className="group select-text h-full w-full desktop-creator-card-container">
            <div className="relative h-full w-full rounded-xl overflow-hidden hardware-accelerated">
              {/* Desktop CTA with proper positioning and enhanced hardware acceleration */}
              <div className="absolute bottom-4 left-0 right-0 z-10 px-6 desktop-cta-container" style={{
                // Force hardware acceleration on container
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                // Prevent layout shifts from button hover/tap
                contain: 'layout paint'
              }}>
                {/* Subtle visual indicator with reduced spacing */}
                <div className="mb-1 mx-auto w-6 h-0.5 rounded-full bg-gradient-to-r from-purple-200/30 via-purple-300/30 to-purple-200/30"></div>
                
                <button 
                  onClick={handleCTAClick}
                  aria-label={`Join as creator with ${creator.name}`}
                  className="w-full flex items-center justify-center rounded-[12px] font-semibold relative desktop-cta-button hardware-accelerated"
                  style={{
                    // Enhanced glass effect
                    background: 'rgba(245, 245, 247, 0.92)', // Neutral light gray that matches card design
                    backdropFilter: 'blur(10px)', // Enhanced glass-like blur matching thumbnails
                    WebkitBackdropFilter: 'blur(10px)', // For Safari support
                    color: '#555555', // Neutral dark gray text for better contrast
                    // Consistent border
                    border: '1px solid rgba(118, 51, 220, 0.18)', // Match thumbnail border exactly
                    borderTop: '1px solid rgba(255, 255, 255, 0.9)', // Subtle top highlight
                    borderLeft: '1px solid rgba(255, 255, 255, 0.8)', // Subtle left highlight
                    borderRight: '1px solid rgba(200, 200, 200, 0.2)', // Neutral right edge
                    borderBottom: '1px solid rgba(200, 200, 200, 0.25)', // Neutral bottom edge
                    // Simplified shadow
                    boxShadow: 
                      /* Matching thumbnail shadows for visual continuity */
                      '0 2px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03),' +
                      
                      /* Standardized inner highlight pattern matching thumbnails */
                      'inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 1px 0 0 rgba(255, 255, 255, 0.8)', // Right inner shadow
                    
                    // Typography 
                    fontSize: '13px',
                    fontWeight: 600, // Medium weight
                    fontFamily: 'var(--font-sans)', // Use website's standard font
                    
                    // Advanced hardware acceleration
                    transform: 'translateY(-2px) translate3d(0, 0, 0)', // Lifted appearance with hardware acceleration
                    willChange: 'transform, opacity', // Only hint properties that will change - better for performance
                    // Transition only properties that won't cause layout shifts
                    transitionProperty: 'transform, opacity, box-shadow',
                    transitionDuration: '300ms',
                    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0.15, 1)', // Improved timing function
                    
                    // Additional rendering optimizations
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d', // Enhance 3D appearance
                    
                    // Positioning and layout
                    position: 'relative', // For pseudo-elements
                    overflow: 'hidden', // For glass effect containment
                    paddingLeft: '54px', // Reduced space for icon
                    paddingRight: '12px', // Reduced padding
                    height: '44px', // Reduced height from 60px to 44px
                    
                    // Box model optimizations
                    boxSizing: 'border-box',
                    
                    // Mobile interaction optimizations
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    
                    // Scale transforms for hover/active states - applied via classes
                    '&:hover': {
                      transform: 'translateY(-2px) translate3d(0, 0, 0) scale(1.02)'
                    },
                    '&:active': {
                      transform: 'translateY(-2px) translate3d(0, 0, 0) scale(0.97)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    // Apply scale transform via direct style manipulation for better performance
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = 'translateY(-2px) translate3d(0, 0, 0) scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Reset transform
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = 'translateY(-2px) translate3d(0, 0, 0)';
                    }
                  }}
                  onMouseDown={(e) => {
                    // Apply active transform
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = 'translateY(-2px) translate3d(0, 0, 0) scale(0.97)';
                    }
                  }}
                  onMouseUp={(e) => {
                    // Reapply hover transform
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = 'translateY(-2px) translate3d(0, 0, 0) scale(1.02)';
                    }
                  }}
                >
                  {/* Subtle reflective glow effect for top-left corner */}
                  <div className="absolute top-0 left-0 w-[80px] h-[26px] rounded-tl-[14px] pointer-events-none overflow-hidden">
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                        width: '100px',
                        height: '60px',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 80%)',
                        opacity: 0.6,
                        transform: 'rotate(-5deg)',
                        pointerEvents: 'none'
                      }}
                    ></div>
                  </div>
                  
                  {/* Enhanced icon container with matching lighting effects */}
                  <div 
                    className="absolute top-0 bottom-0 left-[20px] flex items-center justify-center"
                    style={{
                      margin: 'auto 0', // Center vertically
                      width: '28px',
                      height: '28px',
                      background: 'rgba(245, 245, 247, 0.85)', // Match the neutral button background
                      border: '1px solid rgba(118,51,220,0.18)', // Match button border
                      borderTop: '1px solid rgba(255,255,255,0.9)', // Match button's top highlight
                      borderLeft: '1px solid rgba(255,255,255,0.8)', // Match button's left highlight
                      borderRadius: '8px',
                      // Reduced shadow
                      boxShadow: 
                        '0 1px 2px rgba(0,0,0,0.03), ' + 
                        'inset 0 1px 0 rgba(255,255,255,0.9), ' +
                        'inset 1px 0 0 rgba(255,255,255,0.8)',
                        
                      transform: 'translateZ(3px)', // Reduced 3D lift
                      zIndex: 10 // Ensure it sits above other elements
                    }}
                  >
                    {creator.name === "Emily Johnson" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 10A0.5 0.5 0 1 1 15 9.5A0.5 0.5 0 0 1 14.5 10Z"></path>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <path d="M9 3L9 21"></path>
                      </svg>
                    ) : creator.name === "Jane Cooper" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    ) : creator.name === "Michael Brown" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12A10 10 0 1 0 12 2m-9.87 4.5a14 14 0 0 0-0.13 1.8c0 7.5 5.5 14.4 13 14.7a10.8 10.8 0 0 0 2 .1"></path>
                        <path d="M3.3 7.7A13.4 13.4 0 0 0 2.5 10a15 15 0 0 0 6 11.1A11 11 0 0 0 12 22"></path>
                        <path d="M5 2.3A10 10 0 0 1 17.55 5"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" x2="19" y1="8" y2="14"></line>
                        <line x1="22" x2="16" y1="11" y2="11"></line>
                      </svg>
                    )}
                  </div>
                  <span className="text-center font-semibold text-sm text-gray-700 flex items-center">
                    <span className="leading-none tracking-normal">JOIN AS CREATOR</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-purple-500" />
                  </span>
                </button>
              </div>
              
              <Card className={cn(
                "overflow-hidden flex flex-col h-full",
                "bg-transparent", // Transparent background for glass effect
                "border-0 relative", // Remove default border for custom styling
                "block", // Force block display
                "pb-18", // Increased padding to ensure CTA is not cut off
                "max-w-[380px]", // Add maximum width constraint
                "mx-auto", // Center the card in its container
                "desktop-creator-card hardware-accelerated" // For debugging and targeting
              )}
              style={{
                // Flex layout with explicit direction for better rendering
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                
                // Advanced hardware acceleration
                transform: 'translate3d(0, 0, 0)', // More effective hardware acceleration than translateZ
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                
                // Only animate properties that don't cause layout shifts
                transitionProperty: 'transform, opacity, box-shadow',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0.15, 1)', // Custom easing for smoother transforms
                
                // Only mark properties that will actually change
                willChange: 'transform, opacity',
                
                // Stable, pre-rendered gradient background
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(245, 245, 250, 0.92) 100%)', // Slightly higher opacity gradient for better contrast
                
                // Glass effects with improved rendering
                backdropFilter: 'blur(8px)', 
                WebkitBackdropFilter: 'blur(8px)', // Safari support
                
                // Fixed dimensions that won't cause layout shifts
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%', 
                minHeight: '580px',
                maxHeight: '620px',
                
                // Simplified border with consistent styling
                border: '1px solid rgba(0, 0, 0, 0.06)',
                
                // Pre-calculated box shadow
                boxShadow: `
                  0 4px 12px rgba(118, 51, 220, 0.06),
                  0 8px 24px rgba(0, 0, 0, 0.04),
                  0 1px 3px rgba(0, 0, 0, 0.02)
                `,
                
                // Enhanced 3D effect for desktop
                transformStyle: 'preserve-3d',
                
                // Ensure box-sizing doesn't change layout
                boxSizing: 'border-box'

                // Removed: contain: 'layout paint style' - was restricting proper layout
                // Removed: margin: 0 - allows container to control margin
              }}
              // Apply hover/active effects via inline handlers for better performance
              onMouseEnter={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.transform = 'translate3d(0, -3px, 0) scale(1.01)';
                  e.currentTarget.style.boxShadow = `
                    0 8px 20px rgba(118, 51, 220, 0.08),
                    0 12px 28px rgba(0, 0, 0, 0.06),
                    0 2px 4px rgba(0, 0, 0, 0.03)
                  `;
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
                  e.currentTarget.style.boxShadow = `
                    0 4px 12px rgba(118, 51, 220, 0.06),
                    0 8px 24px rgba(0, 0, 0, 0.04),
                    0 1px 3px rgba(0, 0, 0, 0.02)
                  `;
                }
              }}>
                {/* Simplified inner highlight */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{
                       borderRadius: '16px', // Match the card border radius
                       transform: 'translateZ(0)',
                       zIndex: 2,
                       overflow: 'hidden'
                     }}>
                     
                  {/* Top edge highlight */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30 pointer-events-none"></div>
                  
                  {/* Left edge highlight */}
                  <div className="absolute left-0 inset-y-0 w-[1px] bg-white/30 pointer-events-none"></div>
                </div>

                {/* Price tag with standardized glass effect */}
                <div className="absolute top-3 right-3 z-20">
                  <span 
                    className="px-3 py-1 text-xs font-semibold text-purple-800 rounded-full transition-all duration-200"
                    style={{
                      background: 'rgba(245, 245, 247, 0.92)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      // Simplified shadow and border style for cleaner rendering
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(118, 51, 220, 0.18)',
                      // Hardware acceleration
                      transform: 'translateZ(0)'
                    }}
                  >
                    ${creator.price}/session
                  </span>
                </div>

                {/* Media container with refined styling */}
                <div className="aspect-[16/10] relative w-full overflow-hidden flex-shrink-0 group-hover:scale-[1.01] transition-transform duration-300">
                  {/* Simplified image container */}
                  <div className="absolute inset-0 w-full h-full rounded-t-[16px] overflow-hidden z-10"
                    style={{
                      transition: 'all 0.3s ease'
                    }}>
                  </div>
                  <CreatorMedia 
                    creator={creator}
                    onImageLoad={onImageLoad}
                    onVideoLoad={() => onImageLoad?.(creator.image)}
                  />
                </div>

                {/* Content section integrated with section background */}
                <div className="px-4 pt-3 pb-2 flex flex-col relative z-10 flex-grow rounded-b-xl overflow-hidden">
                  {/* Enhanced creator info section with improved visual hierarchy */}
                  <div className="mb-2 pb-2 border-b border-purple-100/40">
                    <div className="py-1.5 px-2.5 -mx-1.5 mb-1.5 bg-purple-50/30 border-l-2 border-purple-400 rounded-r-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)]">
                      <h3 className="text-base leading-tight font-semibold text-purple-800">{creator.name}</h3>
                    </div>
                    
                    {/* Location with enhanced icon */}
                    <p className="text-xs flex items-center mt-0.5 ml-0.5">
                      <svg className="w-4 h-4 mr-1.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {creator.location}
                    </p>
                    
                    {/* Services with standardized glass effect tags */}
                    <div className="flex flex-wrap items-center gap-1 mt-1.5 bg-purple-50/30 p-1 rounded-md -mx-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]" style={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '32px' // Reduced height for better vertical centering
                    }}>
                      {creator.services.map((service, index) => {
                        // Simplified service type checks - matching mobile
                        const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                        const isHashtag = service.startsWith('#');
                        const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                        const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                        
                        // Using consistent text coloring
                        let textColor = "text-gray-700";
                        
                        return (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs whitespace-nowrap touch-manipulation font-medium ${textColor}`}
                            style={{
                              // Standardized glass effect matching mobile
                              background: 'rgba(245, 245, 247, 0.92)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              // Consistent border treatment
                              border: '1px solid rgba(118, 51, 220, 0.15)',
                              // Standardized shadow with top/left highlights
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.04)',
                              // Better sizing
                              minHeight: '20px',
                              minWidth: '36px',
                              // Hardware acceleration
                              transform: 'translateZ(0)',
                              // Improved spacing
                              margin: '1px',
                              transition: 'all 0.2s ease',
                              // Better vertical alignment
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <span className="truncate flex items-center">{service}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ratings section with mobile-matching styling */}
                  <div className="mb-1.5 p-2 rounded-md">
                    <div className="mb-1 pb-0.5 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-0.5 h-3.5 bg-gradient-to-b from-indigo-400/80 to-purple-400/80 rounded-full mr-1.5"></div>
                        <div className="text-[11px] text-gray-500 font-medium font-space uppercase tracking-wide">Ratings</div>
                      </div>
                      <div className="text-[11px] text-purple-400/80 font-medium font-space">Availability →</div>
                    </div>
                    <div className="flex justify-between items-center py-0.5 gap-3" 
                      style={{
                        transform: 'translateZ(0)', // Hardware acceleration
                        position: 'relative', // For pseudo-elements
                        zIndex: 5, // Ensure components appear above other elements
                        willChange: 'transform', // Optimization hint
                      }}>
                      {/* Star rating with review count, enhanced glass effect */}
                      <div 
                        className="flex items-center py-1 px-3 rounded-full"
                        style={{
                          // Standardized glass effect matching card and CTA
                          background: 'rgba(245, 245, 247, 0.92)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          // Consistent border treatment
                          border: '1px solid rgba(118, 51, 220, 0.15)',
                          // Standardized shadow with top/left highlights
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.05)',
                          
                          // Hardware acceleration and interaction improvements
                          transform: 'translateZ(0)', 
                          transition: 'all 0.2s ease',
                          minHeight: '28px',
                          touchAction: 'manipulation',
                          WebkitTapHighlightColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {/* Add subtle inner glow to star icon */}
                        <div className="relative">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1 relative z-10" 
                            style={{
                              filter: 'drop-shadow(0 0 1px rgba(252, 211, 77, 0.4))',
                              transform: 'translateZ(1px)' // Subtle 3D lift
                            }} 
                          />
                          {/* Subtle glow behind star */}
                          <div className="absolute -inset-1 bg-yellow-100/30 rounded-full blur-sm -z-0"></div>
                        </div>
                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap"
                          style={{
                            letterSpacing: '0.01em' // Slightly improved letter spacing
                          }}
                        >
                          {creator.rating.toFixed(1)} <span className="text-gray-600">({creator.reviews})</span>
                        </span>
                      </div>
                      
                      {/* Availability indicator with enhanced glass effect */}
                      {creator.availabilityStatus && (
                        <div 
                          className="flex items-center py-1 px-3 rounded-full"
                          style={{
                            // Standardized glass effect
                            background: 'rgba(239, 240, 236, 0.85)',
                            backdropFilter: 'blur(7px)',
                            WebkitBackdropFilter: 'blur(7px)',
                            // Consistent border treatment
                            border: '1px solid rgba(118, 51, 220, 0.15)',
                            // Standardized shadow with top/left highlights
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.05)',
                            
                            // Hardware acceleration and interaction improvements  
                            transform: 'translateZ(0)',
                            transition: 'all 0.2s ease',
                            minHeight: '28px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {creator.availabilityStatus === 'available-now' && (
                            <span className="flex items-center text-emerald-700 whitespace-nowrap text-xs font-medium">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.6)]"></div>
                              <span className="flex items-center">Available Now</span>
                            </span>
                          )}
                          {creator.availabilityStatus === 'available-tomorrow' && (
                            <span className="flex items-center text-amber-700 whitespace-nowrap text-xs font-medium">
                              <Clock className="w-4 h-4 mr-1.5 text-amber-500" />
                              <span className="flex items-center">Available Soon</span>
                            </span>
                          )}
                          {creator.availabilityStatus === 'premium-only' && (
                            <span className="flex items-center text-gray-700 whitespace-nowrap text-xs font-medium">
                              <Crown className="w-4 h-4 mr-1.5 text-gray-500" />
                              <span className="flex items-center">Premium Only</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Work section with mobile-matching styling */}
                  <div className="mb-1.5 w-full">
                    {/* Enhanced section header with better prominence */}
                    <div className="mb-1.5 pb-1 border-b border-gray-100 flex justify-between items-center py-0.5"
                      style={{
                        minHeight: '20px'
                    }}>
                      <div className="flex items-center">
                        <div className="w-1 h-3.5 bg-gradient-to-b from-[#EFEFEC] to-[rgba(239,240,236,0.7)] rounded-full mr-1.5 shadow-sm"></div>
                        <div className="text-xs text-gray-800 font-medium font-space uppercase tracking-wide">Recent Work</div>
                      </div>
                      <div 
                        className="text-[11px] text-gray-600 font-medium flex items-center cursor-pointer"
                        onClick={() => onPreviewClick && onPreviewClick(creator.workExamples[0])}
                      >
                        View All
                        <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Thumbnails with glass effect styling */}
                    <div className="grid grid-cols-3 gap-1.5 w-full pt-1.5">
                      {creator.workExamples.slice(0, 3).map((example, index) => (
                        <div 
                          key={index}
                          onClick={() => onPreviewClick && onPreviewClick(example)}
                          className="relative touch-manipulation overflow-hidden transition-all duration-150 focus:outline-none flex-grow"
                          style={{
                            borderRadius: '12px', // Appropriate for thumbnail elements
                            aspectRatio: '1/1', // Square aspect ratio for consistent layout
                            // Enhanced glass effect perfectly matching card and CTA
                            background: 'rgba(245, 245, 247, 0.92)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            // Enhanced border matching main CTA button
                            border: '1px solid rgba(118, 51, 220, 0.18)', 
                            // Inner highlight without bottom shadow
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.8)',
                            // Hardware acceleration
                            transform: 'translateZ(0)',
                            willChange: 'transform',
                            transition: 'all 0.15s ease-out',
                            cursor: 'pointer',
                            WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
                            // Ensure smooth animation
                            WebkitTransform: 'translateZ(0)'
                          }}
                          aria-label={`${index === 0 ? 'Primary' : 'Secondary'} portfolio image`}
                        >
                          {/* Image with improved rendering quality */}
                          <img 
                            src={example}
                            alt={`${creator.name}'s work ${index + 1}`}
                            className="object-cover w-full h-full"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '11px', // Slightly inset from container
                              objectFit: 'cover',
                              // Optimize rendering
                              transform: 'translateZ(0)',
                              imageRendering: 'auto',
                              WebkitImageRendering: 'auto'
                            }}
                            loading="eager" // Prioritize loading these images
                          />
                          
                          {/* Hover overlay with matching border radius */}
                          <div className="absolute inset-0 bg-gray-600/10 opacity-0 hover:opacity-100 active:opacity-100 transition-opacity duration-150 flex items-center justify-center rounded-[11px]">
                            <div className="w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3H21V9" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 3L9 15" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adding proper spacing for bottom padding without a duplicate CTA */}
                  <div className="mt-3 mb-0 pt-2 pb-16 relative"></div>
                </div>
              </Card>
            </div>
          </article>
      )}
      
      {/* Always render dialog but control visibility with open prop */}
      <GlowDialog 
        open={showEmailDialog} 
        onOpenChange={handleDialogOpenChange}
        forceOpen={false} // Ensure it only opens via our explicit controls
      />
      
      {/* Confetti container - absolute position to ensure visibility without layout issues */}
      {showInlineSuccess && (
        <div className="absolute inset-0 pointer-events-none z-[5000]">
          {/* This div is just a placeholder for confetti */}
        </div>
      )}
      
      {/* Image preview disabled */}
    </>
  );
};
