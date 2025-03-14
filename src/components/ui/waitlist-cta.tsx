
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShimmerButton } from './shimmer-button';
import { WaitlistButton } from './waitlist/waitlist-button';
import { SocialProof } from './waitlist/social-proof';
import { GlowDialog } from './glow-dialog';
import { createOptimizedTouchHandler } from '@/utils/mobile-optimization';

interface WaitlistCTAProps {
  className?: string;
  source?: string;
  buttonText?: string;
  showSocialProof?: boolean;
  onClick?: () => void;
}

export const WaitlistCTA: React.FC<WaitlistCTAProps> = ({ 
  className,
  source = "landing_page", 
  buttonText = "JOIN WAITLIST",
  showSocialProof = false,
  onClick
}) => {
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  
  const handleClick = () => {
    console.log('WaitlistCTA: handleClick triggered');
    if (onClick) {
      onClick();
      return;
    }
    
    // If no onClick provided, open the dialog directly
    setShowGlowDialog(true);
  };
  
  // Use optimized handler for mobile
  const touchHandlers = createOptimizedTouchHandler(handleClick);

  return (
    <div className={cn(
      "w-full max-w-md mx-auto", 
      className
    )}>
      <div 
        className="cursor-pointer touch-manipulation"
        role="button"
        aria-label={buttonText}
        tabIndex={0}
        {...touchHandlers}
      >
        <ShimmerButton 
          className={cn(
            "w-full text-white", 
            "shadow-md shadow-blue-500/20", 
            "h-12 sm:h-14 text-sm sm:text-base", 
            "transition-all duration-300", 
            "touch-manipulation",
          )}
          // Important: Remove onClick here since we're handling it in the parent div
        >
          {buttonText}
        </ShimmerButton>
      </div>
      
      {/* Only show social proof when explicitly requested */}
      {showSocialProof && <SocialProof className="mt-3" />}
      
      {/* Add GlowDialog directly to the component */}
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};
