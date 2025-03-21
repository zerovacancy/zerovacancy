
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
            // Apply styling to match 3D reference precisely
            height: '64px',  // Taller button as specified
            background: buttonColors.secondaryCta.buttonBackground,
            border: 'none', // No standard border - using outline in box-shadow
            borderRadius: '32px', // Pill shape as specified (half of height)
            boxShadow: shadowStyles.secondaryCTA, // Using precise 3D shadow stack
            color: buttonColors.secondaryCta.text,
            fontWeight: '600', // Slightly bolder text
            transition: 'all 0.15s ease-out', // Quicker transition for better click feel
            // Interactive elements
            cursor: 'pointer',
            // Enhanced hover state will be applied via CSS class in the Button3DPhysical component
            transform: 'translate3d(0, 0, 0)', // Ensure hardware acceleration
            // Apply any custom styles passed from parent
            ...style?.button
          }}
          // Add additional properties that pass the exact 3D reference-matching hover effect
          data-hover-box-shadow={shadowStyles.secondaryCTAHover}
          data-hover-transform="translateY(-2px)" // Slightly more lift for 3D effect
          data-hover-transition="all 0.15s ease-out"
          data-hover-background={buttonColors.secondaryCta.buttonBackground}
          data-active-transform="translateY(2px)" // Click animation - push down
          data-active-box-shadow="0px 1px 0px rgba(0,0,0,0.08), 0px 2px 5px rgba(0,0,0,0.03), 0px 4px 8px rgba(118,51,220,0.05), 0px 0px 0px 2.5px rgba(118,51,220,0.3), inset 0px 1px 1px rgba(255,255,255,0.8), inset 0px -1px 0px rgba(0,0,0,0.03), inset 0px 0px 1px rgba(255,255,255,0.5)"
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
