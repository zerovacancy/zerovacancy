
import React from 'react';
import { cn } from '@/lib/utils';
import { ShimmerButton } from './shimmer-button';
import { WaitlistCreatorButton } from './waitlist/waitlist-creator-button';
import { SocialProof } from './waitlist/social-proof';
import { Button } from './button';

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
        <Button
          variant="outline"
          className={cn(
            "w-full",
            "shadow-[0_2px_6px_rgba(88,41,217,0.08)]", 
            "h-12 sm:h-14 text-sm sm:text-base", 
            "transition-all duration-300 ease-in-out",
            "bg-gradient-to-r from-[#FCFAFF] to-[#F7F5FF]",
            "hover:bg-gradient-to-r hover:from-[#F8F4FF] hover:to-[#F2EFFF]",
            "hover:shadow-[0_2px_8px_rgba(88,41,217,0.12)]",
            "border-2 border-[#5829D9]",
            "text-[#5829D9] font-medium font-jakarta tracking-tight"
          )}
        >
          {buttonText}
        </Button>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
