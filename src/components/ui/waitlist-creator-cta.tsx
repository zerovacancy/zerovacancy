
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
          style={{borderWidth: '2px'}}
          className={cn(
            "w-full",
            "shadow-[0_2px_6px_rgba(88,41,217,0.12)]", 
            "h-12 sm:h-14 text-sm sm:text-base", 
            "transition-all duration-300 ease-in-out",
            "bg-gradient-to-r from-[#FCF7FF] via-[#F9F0FF] to-[#F5EAFF]",
            "hover:bg-gradient-to-r hover:from-[#F8F0FF] hover:via-[#F3E8FF] hover:to-[#F0E4FF]",
            "hover:shadow-[0_2px_10px_rgba(88,41,217,0.18)]",
            "border-0 border-2 sm:border-2 border-[#7B3DFF]",
            "text-[#5829D9] font-bold font-jakarta tracking-tight",
            "relative overflow-hidden",
            // Add subtle glimmer effect
            "after:absolute after:content-[''] after:top-0 after:left-[-100%] after:w-full after:h-full",
            "after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
            "after:transition-all after:duration-1000 after:ease-in-out",
            "hover:after:left-[100%]"
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
