
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react'; // Changed to shield/lock icon for security
import { Button3DPhysical } from './button-3d-physical';
import { WaitlistButton } from './waitlist/waitlist-button';
import { SocialProof } from './waitlist/social-proof';
import { buttonColors, shadowStyles } from '@/styles/button-style-guide';

interface WaitlistCTAProps {
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

export const WaitlistCTA: React.FC<WaitlistCTAProps> = ({ 
  className,
  source = "landing_page", 
  buttonText = "JOIN WAITLIST",
  showSocialProof = false,
  showEmailInputDirectly = false,
  style
}) => {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto", 
      className
    )}>
      <WaitlistButton 
        source={source}
        buttonText={buttonText}
        className="w-full py-4"
        showEmailInputDirectly={showEmailInputDirectly}
      >
        <Button3DPhysical 
          variant="primaryCta" // Using the enhanced primary CTA variant
          size="lg"
          icon={<ShieldCheck 
            className="w-[20px] h-[20px]"
            style={{
              color: buttonColors.primaryCta.text,
              stroke: buttonColors.primaryCta.text,
              ...style?.icon
            }}
            data-container-style={JSON.stringify(style?.iconContainer)}
          />}
          iconPosition="left"
          className="w-full min-w-[320px] font-semibold tracking-[0.02em]"
          style={{
            // Apply the enhanced styling for the primary CTA button
            height: '56px',
            background: buttonColors.primaryCta.gradient,
            border: `1.5px solid ${buttonColors.primaryCta.border}`,
            boxShadow: `${shadowStyles.primaryCTA}, inset 0 1px 0 ${buttonColors.primaryCta.highlightTop}, inset 0 -1px 0 ${buttonColors.primaryCta.highlightBottom}`,
            color: buttonColors.primaryCta.text,
            transition: 'all 0.3s ease-out',
            // Interactive elements
            cursor: 'pointer',
            // Enhanced hover state will be applied via CSS class in the Button3DPhysical component
            transform: 'translate3d(0, 0, 0)', // Ensure hardware acceleration
            // Apply any custom styles passed from parent
            ...style?.button
          }}
          // Add additional properties that pass the enhanced shadows to the component
          data-hover-box-shadow={shadowStyles.primaryCTAHover}
          data-hover-transform="scale(1.02)" 
          data-hover-transition="all 0.3s ease-out"
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
