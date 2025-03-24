import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { ArrowRight, Star, X, Clock, Crown, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from "../ui/dialog";
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
        <div className="relative w-full h-full">
          {/* Main container without border - to be replaced with custom border implementation */}
          <Card className={cn(
            "overflow-hidden flex flex-col w-full h-full",
            "bg-white", // Pure white background for better contrast with border
            "border-0", // Remove default border - we'll use custom border below
            "shadow-[0_2px_8px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.06)]", // Neutral shadow without purple tint
            "hover:scale-[1.01]", // Subtle scale transform on hover
            "rounded-xl relative transition-all duration-300",
            "transform-gpu", // Hardware acceleration for mobile
            "will-change-transform" // Performance optimization
          )}>
            
            {/* Custom border container - wraps the entire card including the button */}
            <div className="absolute inset-0 rounded-[14px] pointer-events-none" 
                 style={{
                   borderWidth: '2px',
                   borderStyle: 'solid',
                   borderColor: 'rgba(204, 204, 204, 0.6)', // Light gray border instead of purple
                   // Layered shadows for depth using standard format:
                   boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06), 0 6px 16px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)',
                   zIndex: 10
                 }}
            ></div>
            
            {/* Media section with properly positioned price tag */}
            <div className="relative">
              {/* Fixed aspect ratio for all cards with 3D styling */}
              <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 rounded-t-md group-hover:scale-[1.01] transition-transform duration-300">
                {/* Image container with shadow and subtle border */}
                <div className="absolute inset-0 w-full h-full 
                  shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_4px_6px_rgba(0,0,0,0.05),_0_10px_20px_rgba(0,0,0,0.04)] 
                  group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_6px_10px_rgba(0,0,0,0.05),_0_12px_24px_rgba(0,0,0,0.06)]
                  border border-[rgba(118,51,220,0.15)]
                  transition-shadow duration-300
                  z-10">
                </div>
                <CreatorMedia 
                  creator={creator}
                  onImageLoad={onImageLoad}
                  onVideoLoad={() => onImageLoad?.(creator.image)}
                />
              </div>
              
              {/* Price tag - repositioned for better visibility */}
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 shadow-sm border border-purple-200/70 text-purple-800 rounded-full transition-all duration-200 group-hover:bg-purple-100">
                  ${creator.price}/session
                </span>
              </div>
            </div>

            {/* Content sections with proper organization */}
            <div className="w-full px-4 pt-3 pb-6 flex flex-col relative z-10 flex-grow flex-shrink-0">
              {/* Creator info section */}
              <div className="pb-3 mb-3 border-b border-purple-200/30">
                {/* Creator name and location with proper styling */}
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-base leading-tight font-semibold text-gray-800">{creator.name}</h3>
                  <p className="text-gray-500 text-xs flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {creator.location}
                  </p>
                </div>
                
                {/* Ratings and availability grouped together */}
                <div className="flex justify-between items-center mb-3 py-2 px-3 bg-gray-50/70 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1.5" />
                    <span className="text-sm font-semibold font-space text-gray-700">{creator.rating.toFixed(1)}</span>
                    {creator.reviews > 0 && (
                      <span className="text-xs text-gray-500 ml-1.5 font-inter">
                        ({creator.reviews})
                      </span>
                    )}
                  </div>
                  
                  {/* Availability indicator with improved styling */}
                  {creator.availabilityStatus && (
                    <div className="flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-white/80 shadow-sm border border-gray-100/90">
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
                
                {/* Services with organized tag styling - optimized for mobile */}
                <div className="flex flex-wrap gap-x-1 gap-y-1 mt-2 px-2 py-1.5 bg-white/80 rounded-lg border border-gray-200/50 shadow-inner shadow-white/50 max-w-full">
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
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border whitespace-nowrap touch-manipulation shadow-sm max-w-[110px] ${bgColor} ${forceWrap ? 'w-auto flex-shrink-0' : ''}`}
                        >
                          <span className="truncate">{service}</span>
                        </span>
                      );
                    } else if (index === 3) {
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-gray-600 border border-gray-200 bg-white/90 shadow-sm"
                        >
                          +{creator.services.length - 3} more
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              
              {/* Recent Work section with proper header */}
              <div className="mb-3">
                {/* Section header with enhanced styling */}
                <div className="mb-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-2 shadow-sm"></div>
                    <div className="text-xs text-gray-800 font-semibold font-space uppercase tracking-wide">Recent Work</div>
                  </div>
                  <span className="text-xs text-purple-600 font-medium px-2 py-1 rounded-md bg-purple-50/80 transition-colors">
                    Recent Work
                  </span>
                </div>
                
                {/* Fixed height portfolio thumbnails - reduced height for mobile */}
                <div className="grid grid-cols-3 gap-2">
                  {creator.workExamples.slice(0, 3).map((example, index) => (
                    <div 
                      key={index}
                      className="relative h-[60px] touch-manipulation rounded-lg overflow-hidden border border-purple-100/80 shadow-sm transition-all duration-150 focus:outline-none"
                      aria-label={`${index === 0 ? 'Interior' : index === 1 ? 'Exterior' : 'Detail'} image`}
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
                      <div className="absolute inset-0 bg-purple-600/10 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H21V9" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 3L9 15" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Enhanced CTA button with more prominence for mobile */}
              <div className="mt-3 mb-4">
                {/* Success state */}
                {showInlineSuccess ? (
                  <div className="w-full py-4 px-4 font-medium rounded-[12px] text-white relative flex flex-col items-center justify-center animate-fade-in"
                    style={{
                      background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
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
                  /* Initial button state */
                  <button 
                    onClick={handleCTAClick}
                    aria-label={`Join as creator with ${creator.name}`}
                    className="w-full flex items-center justify-center rounded-[12px] font-medium font-sans h-[48px] transition-all duration-200 relative hover:scale-[1.02] bg-creator-cta"
                    style={{
                      background: 'linear-gradient(180deg, #F5F5F7 0%, #EEEEF2 100%)', // Subtle gradient for depth
                      color: '#7633DC', // Purple text color
                      border: '1px solid rgba(118,51,220,0.2)', // Purple-tinted border for emphasis
                      boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(118,51,220,0.05)', // Enhanced shadow with purple tint
                      fontSize: '14px',
                      fontWeight: 600, // Medium weight
                      paddingLeft: '42px', // Space for icon
                    }}
                  >
                    {/* Icon container */}
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 ml-5 flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(134,65,245,0.05)', // Slightly stronger purple tint
                        border: '1px solid rgba(118,51,220,0.15)', // Subtle purple border
                        borderRadius: '12px',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04)'
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
                    <span className="tracking-wide">JOIN AS CREATOR</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#7633DC] animate-pulse-subtle" aria-hidden="true" />
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
                    paddingLeft: '52px', // Make room for icon
                    fontSize: '14px',
                    fontWeight: 600, // Medium weight to match hero
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Icon container */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 ml-6 flex items-center justify-center"
                    style={{
                      width: '32px',
                      height: '32px',
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
                  <span className="text-base tracking-wide font-sans">JOIN AS CREATOR</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#7633DC]" />
                </button>
              </div>
              
              <Card className={cn(
                "overflow-hidden flex flex-col w-full h-full",
                "will-change-transform transition-all duration-300",
                "hover:translate-y-[-2px] hover:scale-[1.01]", // Added subtle scale transform
                "bg-white", // Pure white background for maximum contrast with pearl gray section
                "border-0 relative rounded-xl", // Remove default border for custom styling
                "shadow-[0_4px_12px_rgba(0,0,0,0.06),_0_2px_4px_rgba(118,51,220,0.04)]", // Add shadow for better contrast with pearl gray background
                "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),_0_4px_8px_rgba(118,51,220,0.06)]", // Enhanced shadow on hover
                "block", // Force block display
                "pb-16" // Reduced padding to ensure CTA is not cut off but not take too much space
              )}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)', // Pure white background
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: 'rgba(118,51,220,0.15)', // Consistent purple-tinted border 
                borderTopWidth: '2px',
                borderTopColor: 'rgba(255,255,255,0.8)', // Brighter top edge for highlight effect
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(118,51,220,0.08), inset 2px 0 3px rgba(255,255,255,0.5), inset -2px 0 3px rgba(255,255,255,0.5), 0 6px 16px rgba(0,0,0,0.04), 0 3px 6px rgba(118,51,220,0.03)'
              }}>
                {/* Subtle pearl texture overlay for material quality */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0.5px,transparent_1px)] bg-[length:10px_10px] opacity-[0.07] z-0 pointer-events-none"></div>
                
                {/* Enhanced 3D border effect with subtle gradients */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-white to-transparent opacity-80 z-[1] pointer-events-none rounded-t-xl"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-purple-100/20 to-transparent z-[1] pointer-events-none rounded-b-xl"></div>
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/50 to-transparent z-[1] pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-white/50 to-transparent z-[1] pointer-events-none"></div>

                {/* Optimized price tag - compact and visually distinct */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <div className="px-3 py-1 text-sm font-semibold bg-purple-50 shadow-sm border border-purple-200/60 text-purple-800 rounded-full transition-all duration-200 group-hover:bg-purple-100">
                    ${creator.price}/session
                  </div>
                </div>

                {/* Media container with 3D styling */}
                <div className="aspect-[4/3] relative w-full overflow-hidden flex-shrink-0 group-hover:scale-[1.01] transition-transform duration-300">
                  {/* Image container with shadow and subtle border */}
                  <div className="absolute inset-0 w-full h-full 
                    shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_4px_6px_rgba(0,0,0,0.05),_0_10px_20px_rgba(0,0,0,0.04)] 
                    group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_6px_10px_rgba(0,0,0,0.05),_0_12px_24px_rgba(0,0,0,0.06)]
                    border border-[rgba(118,51,220,0.15)]
                    transition-shadow duration-300
                    z-10">
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
                    <div className="py-2 px-3 -mx-2 mb-2 bg-white/90 border-l-2 border-purple-400 rounded-r-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)]">
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
                    <div className="flex flex-wrap gap-1.5 mt-2 bg-white/70 p-1.5 rounded-md -mx-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
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
                  <div className="mb-2 p-2.5 rounded-md bg-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.02)]">
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
