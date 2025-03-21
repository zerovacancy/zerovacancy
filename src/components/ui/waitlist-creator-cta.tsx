
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
              ...style?.icon
            }}
            data-container-style={JSON.stringify({
              // Add same rounded rectangle border as primary button
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.03)',
              ...style?.iconContainer
            })}
          />}
          iconPosition="left"
          className="w-full min-w-[320px] font-medium"
          style={{
            // Apply styling precisely matching reference design button
            height: '68px',  // Increased height for perfect proportions
            background: buttonColors.secondaryCta.buttonBackground,
            border: 'none', // No standard border - using outline in box-shadow
            borderRadius: '34px', // Perfect pill shape (half of height)
            boxShadow: shadowStyles.secondaryCTA, // Using precise shadow structure from reference
            color: buttonColors.secondaryCta.text,
            fontWeight: '590', // Slightly heavier weight as specified
            letterSpacing: '-0.2px', // Adjusted letter spacing as specified
            transition: 'all 0.15s ease-out', // Responsive transition
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
          data-active-box-shadow="0px 2px 0px rgba(0,0,0,0.2), 0px 4px 10px rgba(0,0,0,0.05), inset 0px -2px 0px rgba(0,0,0,0.03), inset 0px 1px 2px rgba(0,0,0,0.02), inset 0 2px 1px -1px rgba(255,255,255,0.4)"
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistCreatorButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
