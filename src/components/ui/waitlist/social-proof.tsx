
"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { shadowStyles } from "@/styles/button-style-guide.ts";

interface SocialProofProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SocialProof({ className, style }: SocialProofProps) {
  const isMobile = useIsMobile();
  
  // 3D Button styling for the social proof container with mobile adjustment
  const socialProof3DStyle = {
    // Main container styles
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8FA 100%)', // Same gradient as white 3D button
    borderRadius: isMobile ? '12px' : '15px', // Smaller radius on mobile
    border: '1px solid rgba(0,0,0,0.08)',
    // Apply the 5-layer exponential shadow from the 3D Button style
    boxShadow: `${shadowStyles.light}, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`,
    // Balanced padding - slightly more compact than original but not too tight
    padding: isMobile ? '6px 12px' : '7px 14px',
    // Add subtle animation on hover to match 3D button behavior
    transition: 'all 0.15s ease-out',
    // Allow custom style overrides from props
    ...(style || {})
  };
  
  // 3D Button styling for the avatar circles - matching icon container style from 3D Button
  const avatarCircle3DStyle = {
    // Proper avatar size that looks balanced with the text
    width: isMobile ? '18px' : '22px',
    height: isMobile ? '18px' : '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    // Keep the existing gradient background
    background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
    // Match the 3D Button icon container border style
    border: '1px solid rgba(255,255,255,0.2)',
    // Match the 3D Button icon container shadow effect
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
    color: 'white',
    // Proper font size for the initials
    fontSize: isMobile ? '7px' : '9px',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    lineHeight: '1',
    userSelect: 'none'
  };
  
  // Create a hover handler for subtle 3D effect that preserves horizontal position
  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip hover effects on mobile for better performance
    if (isMobile) return;
    
    const target = e.currentTarget;
    
    // Apply subtle lift effect like 3D buttons while maintaining horizontal position
    target.style.transform = 'translateX(-8px) translateY(-2px)';
    target.style.boxShadow = `${shadowStyles.standard}, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`;
  };
  
  // Reset on mouse leave while maintaining horizontal position
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip hover effects on mobile for better performance
    if (isMobile) return;
    
    const target = e.currentTarget;
    
    // Return to default state while preserving horizontal adjustment
    target.style.transform = 'translateX(-8px)';
    target.style.boxShadow = `${shadowStyles.light}, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`;
  };

  return (
    <div className={cn("flex items-center justify-center w-full", className)}> 
      {/* Enhanced social proof pill with 3D Button styling */}
      <div 
        className={cn(
          "flex items-center", // Horizontal layout without justify-center to allow manual positioning
          "animate-fade-in",
          "w-fit", // Fit content width
          "backdrop-blur-sm", // Subtle blur effect
          "relative", // For positioning the accent element
          "cursor-default", // Default cursor on hover
          "mx-auto", // Basic centering
          isMobile ? "mobile-center" : "" // Mobile specific centering
        )}
        style={{
          ...socialProof3DStyle,
          // Add position adjustment to perfectly center between CTAs
          // Slightly shift left by 8px to visually center
          transform: 'translateX(-8px)'
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {/* Avatar initials with 3D Button icon container styling */}
        <div className="flex items-center mr-0"> {/* No margin between avatars and text */}
          {/* Each avatar has individual 3D styling but maintains staggered effect */}
          <div 
            style={{
              ...avatarCircle3DStyle,
              zIndex: 3,
              transform: 'translateX(0px)',
              // Small shine reflection like 3D button icon container
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)'
            }}
          >JT</div>
          <div 
            style={{
              ...avatarCircle3DStyle,
              zIndex: 2,
              // Smaller offset on mobile for better spacing
              transform: isMobile ? 'translateX(-6px)' : 'translateX(-8px)',
              // Slightly different shade for visual interest
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #9953FF 10%, #7837DB 100%)'
            }}
          >MI</div>
          <div 
            style={{
              ...avatarCircle3DStyle,
              zIndex: 1,
              // Smaller offset on mobile for better spacing
              transform: isMobile ? 'translateX(-12px)' : 'translateX(-16px)',
              // Third slight variation
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #8A42F5 0%, #6C31C3 100%)'
            }}
          >AS</div>
        </div>
        
        {/* Counter and text with consistent styling */}
        <div className="flex items-center ml-0"> {/* No left margin for tighter spacing */}
          <span className={cn(
            "font-jakarta font-bold text-purple-700 mr-1.5",
            isMobile ? "text-[14px]" : "text-[15px]"
          )}>
            2,165+
          </span>
          <span className={cn(
            "font-inter text-gray-700 whitespace-nowrap font-medium leading-tight",
            isMobile ? "text-[12px]" : "text-[13px]"
          )}>
            {/* Closer text size to the counter for better visual sync */}
            members joined
          </span>
        </div>
      </div>
    </div>
  );
}
