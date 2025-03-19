
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

// Avatar data with initials and animations
const avatarSets = [
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

export function SocialProof({ className, style }: SocialProofProps) {
  const isMobile = useIsMobile();
  const [activeAvatarSet, setActiveAvatarSet] = useState(0);
  
  // Animated carousel transition for avatars
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAvatarSet((current) => (current + 1) % avatarSets.length);
    }, 5000); // Change avatars every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Enhanced 3D Button styling for the social proof container with deeper shadows
  const socialProof3DStyle = {
    // Keep the light background but with slightly higher contrast
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8FA 100%)',
    borderRadius: isMobile ? '12px' : '15px',
    // Enhanced border with subtle gradient shine
    border: '1px solid rgba(0,0,0,0.1)',
    // Use more sophisticated shadow matching the button shadow system
    boxShadow: `${shadowStyles.standard}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.07)`,
    // Slightly increased padding for better visual impact
    padding: isMobile ? '7px 14px' : '8px 16px',
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
        {/* Animated avatar carousel with framer-motion transitions */}
        <div className="flex items-center mr-0.5 relative"> 
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
                               linear-gradient(180deg, ${avatarSets[activeAvatarSet][0].color} 0%, #7837DB 100%)`
                } as React.CSSProperties}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0 }}
              >{avatarSets[activeAvatarSet][0].initials}</motion.div>
              
              {/* Second avatar */}
              <motion.div 
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 2,
                  transform: isMobile ? 'translateX(-7px)' : 'translateX(-10px)',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${avatarSets[activeAvatarSet][1].color} 10%, #7837DB 100%)`
                } as React.CSSProperties}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >{avatarSets[activeAvatarSet][1].initials}</motion.div>
              
              {/* Third avatar */}
              <motion.div 
                style={{
                  ...avatarCircle3DStyle,
                  zIndex: 1,
                  transform: isMobile ? 'translateX(-14px)' : 'translateX(-20px)',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%), 
                               linear-gradient(180deg, ${avatarSets[activeAvatarSet][2].color} 0%, #6C31C3 100%)`
                } as React.CSSProperties}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >{avatarSets[activeAvatarSet][2].initials}</motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Enhanced counter and text with subtle animation */}
        <div className="flex items-center ml-0.5">
          <motion.span 
            className={cn(
              "font-jakarta font-bold text-purple-700 mr-1.5",
              isMobile ? "text-[14px]" : "text-[15px]"
            )}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          >
            2,165+
          </motion.span>
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
