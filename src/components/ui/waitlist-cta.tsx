
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShimmerButton } from './shimmer-button';
import { WaitlistButton } from './waitlist/waitlist-button';
import { SocialProof } from './waitlist/social-proof';

interface WaitlistCTAProps {
  className?: string;
  source?: string;
  buttonText?: string;
  showSocialProof?: boolean;
  onButtonClick?: () => void;
}

export const WaitlistCTA: React.FC<WaitlistCTAProps> = ({ 
  className,
  source = "landing_page", 
  buttonText = "JOIN WAITLIST",
  showSocialProof = false,
  onButtonClick
}) => {
  const handleClick = () => {
    console.log("WaitlistCTA button clicked, passing to onButtonClick handler");
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto", 
      className
    )}>
      <WaitlistButton 
        source={source}
        buttonText={buttonText}
        className="w-full py-4"
        onClick={handleClick}
      >
        <ShimmerButton 
          className={cn(
            "w-full text-white", 
            "shadow-md shadow-blue-500/20", 
            "h-12 sm:h-14 text-sm sm:text-base", 
            "transition-all duration-300",
          )}
        >
          {buttonText}
        </ShimmerButton>
      </WaitlistButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
