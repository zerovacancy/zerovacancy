
import React from 'react';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react'; // Added user-plus icon for creator signup
import { Button3DPhysical } from './button-3d-physical';
import { WaitlistCreatorButton } from './waitlist/waitlist-creator-button';
import { SocialProof } from './waitlist/social-proof';
import { buttonColors, shadowStyles } from '@/styles/button-style-guide';

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
          variant="secondaryCta" // Using the enhanced secondary CTA variant
          size="lg"
          icon={<UserPlus 
            className="w-[20px] h-[20px]"
            style={{
              color: buttonColors.secondaryCta.text,
              stroke: buttonColors.secondaryCta.text,
              textShadow: '0 0 1px rgba(118,51,220,0.1)', // Very subtle text shadow for improved legibility
              ...style?.icon
            }}
            data-container-style={JSON.stringify({
              background: buttonColors.secondaryCta.iconBackground,
              border: '1px solid rgba(0,0,0,0.1)', // Matching social proof card border
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04)', // Enhanced highlight on top edge
              ...style?.iconContainer
            })}
          />}
          iconPosition="left"
          className="w-full min-w-[320px] font-medium"
          style={{
            // Apply styling that matches reference image exactly
            height: '56px',
            background: buttonColors.secondaryCta.buttonBackground,
            border: 'none', // No standard border - using outline in box-shadow
            boxShadow: shadowStyles.secondaryCTA, // Using precise shadow from reference
            color: buttonColors.secondaryCta.text,
            transition: 'all 0.25s ease-out',
            // Interactive elements
            cursor: 'pointer',
            // Enhanced hover state will be applied via CSS class in the Button3DPhysical component
            transform: 'translate3d(0, 0, 0)', // Ensure hardware acceleration
            // Apply any custom styles passed from parent
            ...style?.button
          }}
          // Add additional properties that pass the exact reference-matching hover effect
          data-hover-box-shadow={shadowStyles.secondaryCTAHover}
          data-hover-transform="translateY(-1px)" // Same hover motion as reference
          data-hover-transition="all 0.25s ease-out"
          data-hover-background={buttonColors.secondaryCta.buttonBackground}
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
