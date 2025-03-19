
"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { shadowStyles } from "@/styles/button-style-guide";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SocialProofProps {
  className?: string;
  style?: React.CSSProperties;
}

// Avatar data for desktop animation and mobile static display
// Desktop: 3 avatars per set with animation between sets
const desktopAvatarSets = [
  [
    { initials: "JT", color: "#8A42F5" },
    { initials: "MI", color: "#9953FF" },
    { initials: "AS", color: "#7837DB" },
  ],
  [
    { initials: "RK", color: "#7633DC" }, 
    { initials: "LM", color: "#9042F0" },
    { initials: "ZP", color: "#8345E6" },
  ],
  [
    { initials: "TW", color: "#7C38E2" },
    { initials: "CM", color: "#8A42F5" },
    { initials: "DH", color: "#9249ED" },
  ]
];

// Mobile: Static set of 4 avatars - no animation
const mobileAvatars = [
  { initials: "JT", color: "#8A42F5" },
  { initials: "MI", color: "#9953FF" },
  { initials: "AS", color: "#7837DB" },
  { initials: "RK", color: "#7633DC" }
];

export function SocialProof({ className, style }: SocialProofProps) {
  const isMobile = useIsMobile();
  const [activeAvatarSet, setActiveAvatarSet] = useState(0);
  
  // Animated carousel transition for desktop only
  useEffect(() => {
    // Skip animation on mobile - using static avatars instead
    if (isMobile) return;
    
    const interval = setInterval(() => {
      setActiveAvatarSet((current) => (current + 1) % desktopAvatarSets.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMobile]);
  
  // Enhanced 3D Button styling for the social proof container with deeper shadows
  const socialProof3DStyle = {
    // Keep the light background but with slightly higher contrast
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8FA 100%)',
    borderRadius: isMobile ? '12px' : '15px',
    // Enhanced border with subtle gradient shine
    border: '1px solid rgba(0,0,0,0.1)',
    // Use more sophisticated shadow matching the button shadow system
    boxShadow: `${shadowStyles.standard}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.07)`,
    // Reduced horizontal padding on mobile for tighter spacing between avatars and text
    padding: isMobile ? '7px 8px 7px 12px' : '8px 16px',
    // Add subtle animation on hover to match 3D button behavior
    transition: 'all 0.2s ease-out',
    // Allow custom style overrides from props
    ...(style || {})
  };
  
  // Enhanced 3D styling for avatar circles with improved depth
  const avatarCircle3DStyle: React.CSSProperties = {
    // Increased size by 10-15% as requested
    width: isMobile ? '21px' : '25px',
    height: isMobile ? '21px' : '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    // Enhanced gradient with more distinct top highlight
    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
    // Stronger white border to make avatars pop
    border: '2px solid rgba(255,255,255,0.95)',
    // Enhanced 3D Button icon container shadow effect
    boxShadow: `${shadowStyles.light}, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.18)`,
    color: 'white',
    // Properly sized font for the larger avatars
    fontSize: isMobile ? '8px' : '10px',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    lineHeight: '1',
    userSelect: 'none'
  };
  
  // Enhanced hover handler for more sophisticated 3D effect
  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    const target = e.currentTarget;
    
    // Apply stronger lift effect like premium 3D buttons
    target.style.transform = 'translateX(-8px) translateY(-3px)';
    target.style.boxShadow = `${shadowStyles.deep}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.07)`;
  };
  
  // Enhanced reset on mouse leave
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    const target = e.currentTarget;
    
    target.style.transform = 'translateX(-8px)';
    target.style.boxShadow = `${shadowStyles.standard}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.07)`;
  };

  return (
    <div className={cn("flex items-center justify-center w-full", className)}> 
      {/* Enhanced social proof pill with sophisticated 3D styling */}
      <div 
        className={cn(
          "flex items-center",
          "animate-fade-in",
          "w-fit",
          "backdrop-blur-sm",
          "relative",
          "cursor-default",
          "mx-auto",
          isMobile ? "mobile-center" : ""
        )}
        style={{
          ...socialProof3DStyle,
          transform: 'translateX(-8px)'
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {/* Avatar display - static on mobile with no right margin, animated on desktop */}
        <div className={cn(
          "flex items-center relative",
          isMobile ? "mr-0" : "mr-0.5" // No right margin on mobile
        )}> 
          {isMobile ? (
            // Static row of 4 avatars for mobile - no animation
            <div className="flex items-center">
              {/* First avatar */}
              <div
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 4,
                  transform: 'translateX(0px)',
                  width: '19px', // Slightly smaller for 4 avatars
                  height: '19px', // Slightly smaller for 4 avatars
                  fontSize: '7.5px', // Adjusted font size
                  background: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${mobileAvatars[0].color} 0%, #7837DB 100%)`
                } as React.CSSProperties}
              >{mobileAvatars[0].initials}</div>
              
              {/* Second avatar */}
              <div
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 3,
                  transform: 'translateX(-6px)',
                  width: '19px', // Slightly smaller for 4 avatars
                  height: '19px', // Slightly smaller for 4 avatars
                  fontSize: '7.5px', // Adjusted font size
                  background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${mobileAvatars[1].color} 10%, #7837DB 100%)`
                } as React.CSSProperties}
              >{mobileAvatars[1].initials}</div>
              
              {/* Third avatar */}
              <div
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 2,
                  transform: 'translateX(-12px)',
                  width: '19px', // Slightly smaller for 4 avatars
                  height: '19px', // Slightly smaller for 4 avatars
                  fontSize: '7.5px', // Adjusted font size
                  background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${mobileAvatars[2].color} 0%, #6C31C3 100%)`
                } as React.CSSProperties}
              >{mobileAvatars[2].initials}</div>
              
              {/* Fourth avatar */}
              <div
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 1,
                  transform: 'translateX(-18px)',
                  width: '19px', // Slightly smaller for 4 avatars
                  height: '19px', // Slightly smaller for 4 avatars
                  fontSize: '7.5px', // Adjusted font size
                  background: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${mobileAvatars[3].color} 0%, #6C31C3 100%)`
                } as React.CSSProperties}
              >{mobileAvatars[3].initials}</div>
            </div>
          ) : (
            // Animated avatar set for desktop
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeAvatarSet}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="flex items-center"
              >
                {/* First avatar */}
                <motion.div 
                  style={{
                    ...avatarCircle3DStyle,
                    zIndex: 3,
                    transform: 'translateX(0px)',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%), 
                                 linear-gradient(180deg, ${desktopAvatarSets[activeAvatarSet][0].color} 0%, #7837DB 100%)`
                  } as React.CSSProperties}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0 }}
                >{desktopAvatarSets[activeAvatarSet][0].initials}</motion.div>
                
                {/* Second avatar */}
                <motion.div 
                  style={{
                    ...avatarCircle3DStyle,
                    zIndex: 2,
                    transform: 'translateX(-10px)',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%), 
                                 linear-gradient(180deg, ${desktopAvatarSets[activeAvatarSet][1].color} 10%, #7837DB 100%)`
                  } as React.CSSProperties}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >{desktopAvatarSets[activeAvatarSet][1].initials}</motion.div>
                
                {/* Third avatar */}
                <motion.div 
                  style={{
                    ...avatarCircle3DStyle,
                    zIndex: 1,
                    transform: 'translateX(-20px)',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%), 
                                 linear-gradient(180deg, ${desktopAvatarSets[activeAvatarSet][2].color} 0%, #6C31C3 100%)`
                  } as React.CSSProperties}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >{desktopAvatarSets[activeAvatarSet][2].initials}</motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        
        {/* Enhanced counter and text - with minimal spacing on mobile */}
        <div className={cn(
          "flex items-center", 
          isMobile ? "ml-[-4px]" : "ml-0.5" // Further reduced spacing on mobile
        )}>
          {isMobile ? (
            // Static version for mobile (no animation)
            <span 
              className={cn(
                "font-jakarta font-bold text-purple-700",
                "text-[14px] mr-1" // Reduced right margin on mobile
              )}
            >
              2,165+
            </span>
          ) : (
            // Animated version for desktop
            <motion.span 
              className={cn(
                "font-jakarta font-bold text-purple-700 mr-1.5",
                "text-[15px]"
              )}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
            >
              2,165+
            </motion.span>
          )}
          <span className={cn(
            "font-inter text-gray-700 whitespace-nowrap font-medium leading-tight",
            isMobile ? "text-[12px]" : "text-[13px]"
          )}>
            members joined
          </span>
        </div>
      </div>
    </div>
  );
}
