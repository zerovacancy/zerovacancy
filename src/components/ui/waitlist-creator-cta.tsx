
import React from 'react';
import { cn } from '@/lib/utils';
import { ShimmerButton } from './shimmer-button';
import { WaitlistCreatorButton } from './waitlist/waitlist-creator-button';
import { SocialProof } from './waitlist/social-proof';

interface WaitlistCreatorCTAProps {
  className?: string;
  source?: string;
  buttonText?: string;
  showSocialProof?: boolean;
  showEmailInputDirectly?: boolean;
}

export const WaitlistCreatorCTA: React.FC<WaitlistCreatorCTAProps> = ({ 
  className,
  source = "creator_waitlist", 
  buttonText = "JOIN AS CREATOR",
  showSocialProof = false,
  showEmailInputDirectly = false
}) => {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto", 
      className
    )}>
      <WaitlistCreatorButton 
        source={source}
        buttonText={buttonText}
        className="w-full py-4"
        showEmailInputDirectly={showEmailInputDirectly}
      >
        <ShimmerButton 
          className={cn(
            "w-full text-white", 
            "shadow-md shadow-purple-500/20", 
            "h-12 sm:h-14 text-sm sm:text-base", 
            "transition-all duration-300",
            "bg-gradient-to-r from-purple-600 to-blue-600"
          )}
        >
          {buttonText}
        </ShimmerButton>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
