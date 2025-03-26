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
  onPreviewClick
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
        console.error("Confetti error:", err);
      }
      
    } catch (error) {
      console.error("Error submitting email:", error);
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
        <div className="relative w-full h-full flex">
          {/* Main container with flex layout to distribute space properly */}
          <Card className={cn(
            "overflow-hidden flex flex-col w-full h-full",
            "bg-transparent",
            "border-0", 
            "rounded-xl relative transition-all duration-300 active:scale-[0.99]"
          )}
            style={{
              transform: 'translateZ(0)', // Hardware acceleration
              willChange: 'transform, box-shadow', // Optimization hint for transitions
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(248, 245, 255, 0.75)' // Light lavender with transparency
            }}>
            
            {/* Simplified border with premium shadow treatment */}
            <div className="absolute inset-0 rounded-[15px] pointer-events-none" 
                 style={{
                   // Single refined border with premium styling
                   boxShadow: 
                     /* Clean single border with subtle purple tint */
                     'inset 0 0 0 1.5px rgba(118, 51, 220, 0.12),' +
                     
                     /* Unified directional lighting effect */
                     'inset 0 1px 0 rgba(255, 255, 255, 0.95),' +
                     'inset 1px 0 0 rgba(255, 255, 255, 0.8),' +
                     
                     /* Optimized layered shadow system */
                     '0 2px 4px rgba(118, 51, 220, 0.04),' +
                     '0 6px 12px rgba(0, 0, 0, 0.05),' +
                     '0 8px 16px rgba(118, 51, 220, 0.02)',
                   zIndex: 10
                 }}
            ></div>
            
            {/* Single unified lighting effect overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-xl z-[2]" 
                 style={{
                   background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.02) 100%)',
                   opacity: 0.6
                 }}>
                 {/* Top-left corner highlight for subtle lighting */}
                 <div className="absolute top-0 left-0 w-16 h-16 rounded-tl-[16px]" 
                     style={{
                       background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.5) 40%, transparent 70%)'
                     }}>
                 </div>
            </div>
            
            {/* Media section with properly positioned price tag */}
            <div className="relative">
              {/* Fixed aspect ratio for all cards with 3D styling */}
              <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 rounded-t-md transition-transform duration-300">
                {/* Simplified image container with minimal border treatment */}
                <div className="absolute inset-0 w-full h-full z-10 overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease'
                  }}>
                </div>
                
                <CreatorMedia 
                  creator={creator}
                  onImageLoad={onImageLoad}
                  onVideoLoad={() => onImageLoad?.(creator.image)}
                />
              </div>
              
              {/* Price tag - enhanced with glass effect and directional lighting */}
              <div className="absolute top-3 right-3 z-20">
                <span 
                  className="px-2.5 py-1 text-xs font-semibold text-purple-800 rounded-full transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    boxShadow: 
                      'inset 0 0 0 1px rgba(255,255,255,0.4), ' +
                      'inset 1px 1px 1px rgba(255,255,255,0.8), ' +
                      '0 1px 2px rgba(0,0,0,0.05), ' +
                      '1px 1px 1px rgba(118,51,220,0.05)',
                    borderTop: '1px solid rgba(255,255,255,0.9)',
                    borderLeft: '1px solid rgba(255,255,255,0.7)',
                    borderRight: '1px solid rgba(124,58,237,0.1)',
                    borderBottom: '1px solid rgba(124,58,237,0.15)'
                  }}
                >
                  ${creator.price}/session
                </span>
              </div>
            </div>

            {/* Content sections with optimized spacing for mobile */}
            <div className="w-full px-3 pt-2 pb-4 flex flex-col relative z-10 flex-grow flex-1 h-full" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Creator info section - with optimized spacing */}
              <div className="pb-1 mb-1">
                {/* Subtle divider instead of full border */}
                <div className="w-12 h-0.5 mx-auto mb-2 bg-gradient-to-r from-transparent via-purple-200/40 to-transparent"></div>
                {/* Creator name and location with proper styling */}
                <div 
                  className="flex justify-between mb-1.5 py-1 px-1"
                  style={{
                    transform: 'translateZ(0)', // Hardware acceleration
                    display: 'flex', 
                    alignItems: 'center'
                  }}
                >
                  <h3 className="text-lg leading-tight font-bold text-gray-800 tracking-tight flex items-center">
                    {creator.name}
                    <span className="absolute -top-0.5 -right-0.5 w-12 h-6 bg-gradient-to-br from-purple-100/40 to-transparent blur-sm rounded-full"></span>
                  </h3>
                  <p className="text-gray-500 text-xs flex items-center max-w-[120px]">
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="truncate">{creator.location}</span>
                  </p>
                </div>
                
                {/* Services tags without container border - MOVED BEFORE RATINGS */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-1 px-1 py-1.5 mb-3 max-w-full"
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
                    
                    let bgColor = "bg-purple-100/80 border-purple-200/70 text-purple-800";
                    if (isPlatform) bgColor = "bg-purple-100/80 border-purple-200/70 text-purple-700"; // Changed from blue to purple
                    if (isHashtag) bgColor = "bg-indigo-100/80 border-indigo-200/70 text-indigo-700";
                    if (isVisualStyle) bgColor = "bg-violet-100/80 border-violet-200/70 text-violet-700";
                    if (isSpecialty) bgColor = "bg-teal-100/80 border-teal-200/70 text-teal-700";
                    
                    // Only show the first 3 services to save more space on mobile
                    if (index < 3) {
                      return (
                        <span 
                          key={index} 
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border whitespace-nowrap touch-manipulation shadow-sm max-w-[110px] font-medium ${bgColor} ${forceWrap ? 'w-auto flex-shrink-0' : ''}`}
                          style={{
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderTop: '1px solid rgba(255,255,255,0.9)',
                            borderLeft: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.8), 0 1px 1px rgba(118,51,220,0.04)',
                            minHeight: '24px',
                            minWidth: '44px'
                          }}
                        >
                          <span className="truncate flex items-center">{service}</span>
                        </span>
                      );
                    } else if (index === 3) {
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-gray-600 border border-gray-200 font-medium"
                          style={{
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderTop: '1px solid rgba(255,255,255,0.9)',
                            borderLeft: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.8), 0 1px 1px rgba(118,51,220,0.04)',
                            minHeight: '24px',
                            minWidth: '44px'
                          }}
                        >
                          <span className="flex items-center">+{creator.services.length - 3} more</span>
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Ratings and availability grouped together in a content section - MOVED AFTER TAGS */}
                <div className="flex justify-between mb-2 py-1.5 px-2 bg-purple-50/30 rounded-md"
                  style={{
                    transform: 'translateZ(0)', // Hardware acceleration
                    position: 'relative', // For pseudo-elements
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <div className="flex items-center">
                    <div className="flex items-center" style={{ alignItems: 'center' }}>
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-0.5" />
                      <span className="text-sm font-bold font-space text-gray-800">{creator.rating.toFixed(1)}</span>
                    </div>
                    {/* Number of reviews removed from mobile view */}
                  </div>
                  
                  {/* Availability indicator with optimized size and alignment */}
                  {creator.availabilityStatus && (
                    <div className="flex items-center py-0.5 px-2 rounded-full text-xs font-medium"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      {creator.availabilityStatus === 'available-now' && (
                        <span className="flex items-center text-emerald-700 whitespace-nowrap">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse shadow-[0_0_3px_rgba(16,185,129,0.6)]"></div>
                          <span className="flex items-center">Available Now</span>
                        </span>
                      )}
                      {creator.availabilityStatus === 'available-tomorrow' && (
                        <span className="flex items-center text-amber-700 whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1 text-amber-500" />
                          <span className="flex items-center">Available Soon</span>
                        </span>
                      )}
                      {creator.availabilityStatus === 'premium-only' && (
                        <span className="flex items-center text-purple-700 whitespace-nowrap">
                          <Crown className="w-3 h-3 mr-1 text-purple-500" />
                          <span className="flex items-center">Premium Only</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Work section - pushed up to create space at bottom */}
              <div className="mb-0 w-full mt-1">
                {/* Light divider instead of border */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-200/40 to-transparent mb-2"></div>
                {/* Section header with enhanced styling and optimized size */}
                <div className="mb-2 flex items-center py-0.5"
                  style={{
                    minHeight: '22px'
                }}>
                  <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-2 shadow-sm"></div>
                  <div className="text-xs text-gray-800 font-semibold font-space uppercase tracking-wide">Recent Work</div>
                </div>
                
                {/* Portfolio thumbnails with optimized spacing */}
                <div className="grid grid-cols-3 gap-1.5 w-full px-0.5 pb-0.5">
                  {creator.workExamples.slice(0, 3).map((example, index) => (
                    <div 
                      key={index}
                      className="relative touch-manipulation rounded-xl overflow-hidden transition-all duration-150 focus:outline-none flex-grow"
                      style={{
                        width: 'calc(33.33% - 7px)', // Ensure even division of space with gaps
                        minWidth: '80px', // Minimum width constraint
                        minHeight: '44px', // Minimum height for touch target
                        aspectRatio: '4/3', // Consistent aspect ratio that works well for property photos
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        border: '1px solid rgba(118, 51, 220, 0.12)',
                        borderTop: '2px solid rgba(255,255,255,0.95)',
                        borderLeft: '2px solid rgba(255,255,255,0.8)',
                        borderRight: '1px solid rgba(118,51,220,0.08)',
                        borderBottom: '1px solid rgba(118,51,220,0.15)',
                        boxShadow: 
                          'inset 1px 1px 2px rgba(255,255,255,0.8),' +
                          'inset -1px -1px 1px rgba(0,0,0,0.02),' +
                          '0 1px 3px rgba(118,51,220,0.04)',
                        transform: 'translateZ(0)', // Hardware acceleration
                        willChange: 'transform', // Optimization hint
                        position: 'relative'
                      }}
                      aria-label={`${index === 0 ? 'Interior' : index === 1 ? 'Exterior' : 'Detail'} image`}
                    >
                      <img 
                        src={example}
                        alt={`${creator.name}'s work ${index + 1}`}
                        className="object-cover w-full h-full"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          transform: 'translateZ(0)', // Hardware acceleration
                          contain: 'paint' // Optimization
                        }}
                      />
                      {/* Glass effect overlay matching card styling */}
                      <div className="absolute inset-0 pointer-events-none"
                           style={{
                             boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                             opacity: 0.5
                           }}>
                      </div>
                      
                      {/* Enhanced tap indicator with glass effect */}
                      <div className="absolute inset-0 bg-purple-600/10 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/85 shadow-sm flex items-center justify-center transform-gpu hover:scale-105 transition-transform">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H21V9" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 3L9 15" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Flexible spacer to push CTA to bottom */}
              <div className="flex-grow" style={{ minHeight: '30px' }}></div>
              
              {/* CTA section positioned at bottom of card */}
              <div className="flex items-center justify-center py-2" style={{
                position: 'relative'
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
                    className="w-full flex items-center justify-center rounded-[14px] font-bold font-sans h-[48px] transition-all duration-300 relative hover:scale-[1.02] active:scale-[0.97] bg-creator-cta"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque for better visibility
                      backdropFilter: 'blur(4px)', // Glass-like blur
                      WebkitBackdropFilter: 'blur(4px)', // For Safari support
                      boxShadow: '0 2px 8px rgba(118, 51, 220, 0.2), 0 4px 12px rgba(0, 0, 0, 0.05)', // Enhanced shadow for CTA focus
                      color: '#7633DC', // Purple text color
                      border: '1px solid rgba(118, 51, 220, 0.12)',
                      borderTop: '2px solid rgba(255, 255, 255, 0.95)', // Pronounced white highlight at top
                      borderLeft: '2px solid rgba(255, 255, 255, 0.8)', // Pronounced white highlight at left
                      borderRight: '1px solid rgba(118, 51, 220, 0.08)', // Subtle purple tint at right
                      borderBottom: '1px solid rgba(118, 51, 220, 0.15)', // Darker purple tint at bottom
                      boxShadow: 
                        /* Outer layered shadow system */
                        '0 2px 8px rgba(118, 51, 220, 0.15),' + // Main outer shadow with purple tint
                        '0 4px 12px rgba(0, 0, 0, 0.05),' + // Secondary distance shadow
                        
                        /* Inner highlight effects */
                        'inset 0 1px 0 rgba(255, 255, 255, 0.9),' + // Top inner highlight
                        'inset 1px 0 0 rgba(255, 255, 255, 0.7),' + // Left inner highlight
                        
                        /* Inner shadow for depth */
                        'inset 0 -1px 0 rgba(118, 51, 220, 0.1),' + // Bottom inner shadow
                        'inset -1px 0 0 rgba(118, 51, 220, 0.05)', // Right inner shadow
                      
                      fontSize: '14px',
                      fontWeight: 600, // Medium weight
                      transform: 'translateZ(0)', // Hardware acceleration
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
                          background: 'rgba(255,255,255,0.9)', // Brighter background for icon contrast
                          border: '1px solid rgba(118,51,220,0.12)',
                          borderTop: '1.5px solid rgba(255,255,255,0.95)', // Match button's top highlight
                          borderLeft: '1.5px solid rgba(255,255,255,0.8)', // Match button's left highlight
                          borderRadius: '12px',
                          boxShadow: 
                            /* Outer subtle shadow */
                            '0 1px 3px rgba(118,51,220,0.1),' + 
                            
                            /* Directional lighting with inset shadows */
                            'inset 1px 1px 2px rgba(255,255,255,0.9),' +
                            'inset -1px -1px 1px rgba(118,51,220,0.05)',
                            
                          transform: 'translateZ(5px)', // Subtle 3D lift above button surface
                          position: 'relative' // For light refraction effect
                        }}
                      >
                        {creator.name === "Emily Johnson" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 10A0.5 0.5 0 1 1 15 9.5A0.5 0.5 0 0 1 14.5 10Z"></path>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <path d="M9 3L9 21"></path>
                          </svg>
                        ) : creator.name === "Jane Cooper" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        ) : creator.name === "Michael Brown" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12A10 10 0 1 0 12 2m-9.87 4.5a14 14 0 0 0-0.13 1.8c0 7.5 5.5 14.4 13 14.7a10.8 10.8 0 0 0 2 .1"></path>
                            <path d="M3.3 7.7A13.4 13.4 0 0 0 2.5 10a15 15 0 0 0 6 11.1A11 11 0 0 0 12 22"></path>
                            <path d="M5 2.3A10 10 0 0 1 17.55 5"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" x2="19" y1="8" y2="14"></line>
                            <line x1="22" x2="16" y1="11" y2="11"></line>
                          </svg>
                        )}
                      </div>
                      <span className="tracking-wide font-bold text-base relative" style={{
                        textShadow: '0 1px 1px rgba(255,255,255,0.7)',
                        letterSpacing: '0.02em'
                      }}>JOIN AS CREATOR</span>
                      <ArrowRight 
                        className="w-4 h-4 ml-2 text-[#7633DC] relative" 
                        style={{
                          filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))',
                          transform: 'translateZ(1px)',
                          animation: 'pulse-arrow 2s infinite ease-in-out'
                        }}
                        aria-hidden="true" />
                    </div>
                  </button>
                )}
              </div>
            </div>
            </Card>
          </div>
      ) : (
          <article className="group select-text h-full w-full">
            <div className="relative h-full w-full rounded-xl overflow-hidden">
              {/* Completely removed glass morphism glow effect */}
              
              {/* Desktop CTA with reduced spacing */}
              <div className="absolute bottom-3 left-0 right-0 z-50 px-5">
                {/* Subtle visual indicator with reduced spacing */}
                <div className="mb-2 mt-1 mx-auto w-8 h-0.5 rounded-full bg-gradient-to-r from-purple-200/50 via-purple-300/50 to-purple-200/50"></div>
                
                <button 
                  onClick={handleCTAClick}
                  className="w-full flex items-center justify-center text-[#7633DC] font-semibold font-sans rounded-[12px] py-3 relative hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5FA 100%)', // Enhanced gradient
                    color: '#7633DC', // Purple text color
                    border: '1.5px solid rgba(118,51,220,0.15)', // Purple-tinted border
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(118,51,220,0.05)',
                    transform: 'translateY(-2px)', // Small lift above card but won't cause cutoff
                    height: '52px',
                    paddingLeft: '72px', // Make room for icon
                    paddingRight: '16px', // Balance the padding
                    fontSize: '14px',
                    fontWeight: 600, // Medium weight to match hero
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center', // Safari-specific fix for flex alignment
                    justifyContent: 'center'
                  }}
                >
                  {/* Icon container positioned with fixed left value instead of margin */}
                  <div 
                    className="absolute top-0 bottom-0 flex items-center justify-center"
                    style={{
                      left: '26px', // Fixed left positioning instead of margin
                      width: '32px',
                      height: '32px',
                      margin: 'auto 0', // Center vertically using margin auto
                      background: 'rgba(134,65,245,0.02)', // Very light purple tint to match hero
                      border: '1px solid rgba(0,0,0,0.1)', // Match button border
                      borderRadius: '12px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04)' // Match hero shadow
                    }}
                  >
                    {creator.name === "Emily Johnson" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 10A0.5 0.5 0 1 1 15 9.5A0.5 0.5 0 0 1 14.5 10Z"></path>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <path d="M9 3L9 21"></path>
                      </svg>
                    ) : creator.name === "Jane Cooper" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    ) : creator.name === "Michael Brown" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12A10 10 0 1 0 12 2m-9.87 4.5a14 14 0 0 0-0.13 1.8c0 7.5 5.5 14.4 13 14.7a10.8 10.8 0 0 0 2 .1"></path>
                        <path d="M3.3 7.7A13.4 13.4 0 0 0 2.5 10a15 15 0 0 0 6 11.1A11 11 0 0 0 12 22"></path>
                        <path d="M5 2.3A10 10 0 0 1 17.55 5"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7633DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" x2="19" y1="8" y2="14"></line>
                        <line x1="22" x2="16" y1="11" y2="11"></line>
                      </svg>
                    )}
                  </div>
                  <span className="text-base tracking-wide font-sans inline-flex items-center -ml-2">
                    JOIN AS CREATOR
                    <ArrowRight className="w-4 h-4 ml-2 text-[#7633DC]" />
                  </span>
                </button>
              </div>
              
              <Card className={cn(
                "overflow-hidden flex flex-col w-full h-full",
                "will-change-transform transition-all duration-300",
                "hover:translate-y-[-3px]", // Slightly more lift on hover
                "hover:scale-[1.01]", // Subtle scale on hover
                "bg-white", // Pure white background for maximum contrast
                "border-0 relative rounded-xl", // Remove default border for custom styling
                "shadow-[0_4px_12px_rgba(0,0,0,0.06),_0_2px_4px_rgba(118,51,220,0.04)]", // Default shadow
                "hover:shadow-[0_4px_8px_rgba(118,51,220,0.06),_4px_4px_10px_rgba(0,0,0,0.04),_0_16px_24px_rgba(0,0,0,0.06),_0_24px_48px_rgba(118,51,220,0.04),_0_0_20px_rgba(255,255,255,0.15)]", // Layered shadow system for hover
                "block", // Force block display
                "pb-16" // Reduced padding to ensure CTA is not cut off but not take too much space
              )}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderWidth: '0', // Remove standard border in favor of glass effect
                borderStyle: 'solid',
                background: 'rgba(255,255,255,0.6)', // Semi-transparent base for glass effect
                backdropFilter: 'blur(8px)', // Glass blur effect
                WebkitBackdropFilter: 'blur(8px)', // For Safari support
                boxShadow: 
                  /* Layer 1: Closest shadow - subtle purple tint */
                  '0 2px 4px rgba(118,51,220,0.04),' +
                  
                  /* Layer 2: Mid-distance shadow with directional bias */
                  '3px 3px 8px rgba(0,0,0,0.04),' +
                  
                  /* Layer 3: Distant shadow with more spread */
                  '0 8px 16px rgba(0,0,0,0.05),' +
                  
                  /* Layer 4: Wide ambient shadow with brand color influence */
                  '0 12px 24px rgba(118,51,220,0.03), 0 16px 32px rgba(0,0,0,0.03),' +
                  
                  /* Glass edge highlight - thin bright line along edges */
                  'inset 0 0 0 1px rgba(255,255,255,0.3),' +
                  
                  /* Inner shadow layers - directional from top-left */
                  'inset -2px -2px 4px rgba(0,0,0,0.02),' + 
                  'inset 2px 2px 3px rgba(255,255,255,0.9),' +
                  'inset 4px 4px 8px rgba(255,255,255,0.4),' +
                  
                  /* Bottom-right inner shadow - reinforcing lighting direction */
                  'inset -3px -3px 6px rgba(118,51,220,0.02),' +
                  
                  /* Inner border glow - subtle purple tint */
                  'inset 0 0 0 1px rgba(118,51,220,0.08)'
              }}>
                {/* Enhanced glass texture effect */}
                <div className="absolute inset-0 pointer-events-none z-[1]" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 100%)',
                  opacity: 0.5
                }}></div>
                
                {/* Subtle dot pattern for glass material */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:16px_16px] opacity-[0.1] z-0 pointer-events-none"></div>
                
                {/* Directional lighting model with top-left light source */}
                {/* Glass effect - Top edge highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] z-[3] pointer-events-none rounded-t-xl"
                     style={{
                       background: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)'
                     }}></div>
                
                {/* Glass effect - Left edge highlight */}
                <div className="absolute inset-y-0 left-0 w-[1px] z-[3] pointer-events-none rounded-l-xl"
                     style={{
                       background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)'
                     }}></div>
                
                {/* Glass effect - Bottom edge subtle glow */}
                <div className="absolute inset-x-0 bottom-0 h-[1px] z-[3] pointer-events-none rounded-b-xl"
                     style={{
                       background: 'linear-gradient(to right, rgba(118,51,220,0.05) 0%, rgba(118,51,220,0.1) 50%, rgba(118,51,220,0.05) 100%)'
                     }}></div>
                
                {/* Glass effect - Right edge subtle line */}
                <div className="absolute inset-y-0 right-0 w-[1px] z-[3] pointer-events-none rounded-r-xl"
                     style={{
                       background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.02) 100%)'
                     }}></div>
                
                {/* Original directional lighting - now underneath the glass effect */}
                <div className="absolute inset-x-0 top-0 h-[3px] z-[1] pointer-events-none rounded-t-xl"
                     style={{
                       background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)'
                     }}></div>
                
                <div className="absolute inset-y-0 left-0 w-[3px] z-[1] pointer-events-none rounded-l-xl"
                     style={{
                       background: 'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 70%, transparent 100%)'
                     }}></div>
                
                <div className="absolute inset-x-0 bottom-0 h-[3px] z-[1] pointer-events-none rounded-b-xl"
                     style={{
                       background: 'linear-gradient(to top, rgba(118,51,220,0.08) 0%, rgba(0,0,0,0.03) 60%, transparent 100%)'
                     }}></div>
                
                <div className="absolute inset-y-0 right-0 w-[3px] z-[1] pointer-events-none rounded-r-xl"
                     style={{
                       background: 'linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 70%, transparent 100%)'
                     }}></div>
                
                {/* Top-left corner - enhanced brightest point with glass effect */}
                <div className="absolute top-0 left-0 w-12 h-12 rounded-tl-xl pointer-events-none z-[2]" 
                    style={{
                      background: 'radial-gradient(circle at top left, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.3) 50%, transparent 85%)'
                    }}></div>
                
                {/* Bottom-right corner - subtle internal light reflection */}
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-br-xl pointer-events-none z-[2]" 
                    style={{
                      background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)'
                    }}></div>
                
                {/* Top-right corner - very subtle reflection */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-tr-xl pointer-events-none z-[2]" 
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)'
                    }}></div>

                {/* Optimized price tag - compact and visually distinct */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <div className="px-3 py-1 text-sm font-semibold text-purple-800 rounded-full transition-all duration-200 group-hover:bg-purple-100/70"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      boxShadow: 
                        'inset 0 0 0 1px rgba(255,255,255,0.4), ' +
                        'inset 1px 1px 1px rgba(255,255,255,0.8), ' +
                        '0 1px 2px rgba(0,0,0,0.05), ' +
                        '1px 1px 1px rgba(118,51,220,0.05)',
                      borderTop: '1px solid rgba(255,255,255,0.9)',
                      borderLeft: '1px solid rgba(255,255,255,0.7)',
                      borderRight: '1px solid rgba(124,58,237,0.1)',
                      borderBottom: '1px solid rgba(124,58,237,0.15)'
                    }}>
                    ${creator.price}/session
                  </div>
                </div>

                {/* Media container with 3D styling */}
                <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 group-hover:scale-[1.01] transition-transform duration-300">
                  {/* Image container with shadow and subtle border */}
                  <div className="absolute inset-0 w-full h-full rounded-t-lg overflow-hidden z-10"
                    style={{
                      boxShadow: 
                        /* Enhanced directional shadows matching updated card lighting model */
                        'inset 2px 2px 3px rgba(255,255,255,0.85), ' +
                        'inset -2px -2px 3px rgba(0,0,0,0.05), ' +
                        '0 4px 8px rgba(0,0,0,0.03)',
                      borderTop: '1px solid rgba(255,255,255,0.9)',
                      borderLeft: '1px solid rgba(255,255,255,0.7)',
                      borderRight: '1px solid rgba(0,0,0,0.04)',
                      borderBottom: '1px solid rgba(118,51,220,0.06)', // Subtle purple tint at bottom
                      transition: 'all 0.3s ease'
                    }}>
                    {/* Enhanced top edge highlight for media container */}
                    <div className="absolute inset-x-0 top-0 h-[2px] z-[1]" 
                         style={{
                           background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, transparent 100%)'
                         }}></div>
                  </div>
                  <CreatorMedia 
                    creator={creator}
                    onImageLoad={onImageLoad}
                    onVideoLoad={() => onImageLoad?.(creator.image)}
                  />
                </div>

                {/* Content section integrated with section background */}
                <div className="px-5 pt-4 pb-2 flex flex-col relative z-10 flex-grow rounded-b-xl overflow-hidden">
                  {/* Enhanced creator info section with improved visual hierarchy */}
                  <div className="mb-3 pb-3 border-b border-purple-100/40">
                    <div className="py-2 px-3 -mx-2 mb-2 bg-purple-50/30 border-l-2 border-purple-400 rounded-r-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)]">
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
                    <div className="flex flex-wrap gap-1.5 mt-2 bg-purple-50/30 p-1.5 rounded-md -mx-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                      {creator.services.map((service, index) => {
                        // Determine tag color based on service type
                        const isPlatform = service.includes('TikTok') || service.includes('Instagram') || service.includes('YouTube');
                        const isHashtag = service.startsWith('#');
                        const isVisualStyle = service.includes('Tour') || service.includes('POV') || service.includes('Photo') || service.includes('Video');
                        const isSpecialty = service.includes('Staging') || service.includes('Design') || service.includes('Plan');
                        
                        let bgColor = "bg-purple-100/50 hover:bg-purple-100 border-purple-200/80 text-purple-800";
                        if (isPlatform) bgColor = "bg-purple-50 hover:bg-purple-100 border-purple-200/80 text-purple-700"; // Changed from blue to purple
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
                  <div className="mb-2 p-2.5 rounded-md bg-purple-50/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.02)]">
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
                      onPreviewClick={onPreviewClick}
                    />
                  </div>

                  {/* Minimal visual spacing before CTA */}
                  <div className="mt-1 mb-1 pt-1"></div>
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
      
      {/* Confetti container - fixed position to ensure visibility */}
      {showInlineSuccess && (
        <div className="fixed inset-0 pointer-events-none z-[5000]">
          {/* This div is just a placeholder for confetti */}
        </div>
      )}
      
      {/* Image preview disabled */}
    </>
  );
};
