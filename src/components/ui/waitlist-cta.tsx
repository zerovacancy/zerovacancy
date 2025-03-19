
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react'; // Changed to shield/lock icon for security
import { Button3DPhysical } from './button-3d-physical';
import { WaitlistButton } from './waitlist/waitlist-button';
import { SocialProof } from './waitlist/social-proof';
import { buttonColors } from '@/styles/button-style-guide';

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
          variant="primaryCta" // Using the new primary CTA variant
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
          className="w-full min-w-[320px] font-medium"
          style={{
            // Apply the new styling for the primary CTA button
            height: '56px',
            background: `${buttonColors.primaryCta.gradient}, linear-gradient(180deg, ${buttonColors.primaryCta.light} 0%, ${buttonColors.primaryCta.dark} 100%)`,
            border: `1px solid ${buttonColors.primaryCta.border}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.05)',
            color: buttonColors.primaryCta.text,
            // Applied on hover:
            // background: `${buttonColors.primaryCta.hoverGradient}, linear-gradient(180deg, ${buttonColors.primaryCta.light} 0%, ${buttonColors.primaryCta.dark} 100%)`,
            // Apply any custom styles passed from parent
            ...style?.button
          }}
        >
          {buttonText}
        </Button3DPhysical>
      </WaitlistButton>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
    </div>
  );
};
