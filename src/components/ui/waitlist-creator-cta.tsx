
import React from 'react';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react'; // Added user-plus icon for creator signup
import { Button3DPhysical } from './button-3d-physical';
import { WaitlistCreatorButton } from './waitlist/waitlist-creator-button';
import { SocialProof } from './waitlist/social-proof';
import { buttonColors } from '@/styles/button-style-guide';

interface WaitlistCreatorCTAProps {
  className?: string;
  source?: string;
  buttonText?: string;
  showSocialProof?: boolean;
  showEmailInputDirectly?: boolean;
  style?: {
    button?: React.CSSProperties;
    icon?: React.CSSProperties;
    iconContainer?: React.CSSProperties;
  };
}

export const WaitlistCreatorCTA: React.FC<WaitlistCreatorCTAProps> = ({ 
  className,
  source = "creator_waitlist", 
  buttonText = "JOIN AS CREATOR",
  showSocialProof = false,
  showEmailInputDirectly = false,
  style
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
        <Button3DPhysical
          variant="secondaryCta" // Using the new secondary CTA variant
          size="lg"
          icon={<UserPlus 
            className="w-[20px] h-[20px]"
            style={{
              color: buttonColors.secondaryCta.text,
              stroke: buttonColors.secondaryCta.text,
              ...style?.icon
            }}
            data-container-style={JSON.stringify({
              background: buttonColors.secondaryCta.iconBackground,
              ...style?.iconContainer
            })}
          />}
          iconPosition="left"
          className="w-full min-w-[320px] font-medium"
          style={{
            // Apply the new styling for the secondary CTA button
            height: '56px',
            background: buttonColors.secondaryCta.buttonBackground,
            border: `1px solid ${buttonColors.secondaryCta.border}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04)',
            color: buttonColors.secondaryCta.text,
            // Applied on hover:
            // background: `${buttonColors.secondaryCta.hoverGradient}, linear-gradient(180deg, ${buttonColors.secondaryCta.light} 0%, ${buttonColors.secondaryCta.dark} 100%)`,
            // Apply any custom styles passed from parent
            ...style?.button
          }}
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
