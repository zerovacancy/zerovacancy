
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
  onClick?: () => void;
}

export const WaitlistCTA: React.FC<WaitlistCTAProps> = ({ 
  className,
  source = "landing_page", 
  buttonText = "JOIN WAITLIST",
  showSocialProof = false,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto", 
      className
    )}>
      <div onClick={handleClick}>
        <WaitlistButton 
          source={source}
          buttonText={buttonText}
          className="w-full py-4"
        >
          <ShimmerButton 
            className={cn(
              "w-full text-white", 
              "shadow-md shadow-blue-500/20", 
              "h-12 sm:h-14 text-sm sm:text-base", 
              "transition-all duration-300", 
              "touch-manipulation",
            )}
          >
            {buttonText}
          </ShimmerButton>
        </WaitlistButton>
      </div>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
