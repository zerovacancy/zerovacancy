
import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react'; // Changed to shield/lock icon for security
import { Button3DPhysical } from './button-3d-physical';
import { WaitlistButton } from './waitlist/waitlist-button';
import { SocialProof } from './waitlist/social-proof';

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
          variant="white" // Primary button with purple tint gradient
          size="lg"
          icon={<ShieldCheck 
            className="w-[20px] h-[20px]" 
            style={{
              color: '#7633DC', // Updated to match primary button text color
              stroke: '#7633DC',
              ...style?.icon
            }}
            data-container-style={JSON.stringify(style?.iconContainer)}
          />} // Purple shield icon
          iconPosition="left"
          className="w-full min-w-[320px] font-medium" // Text color set in button component
          style={{
            // Default styling for the button - button-3d-physical now handles the new styling
            height: '56px',
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
