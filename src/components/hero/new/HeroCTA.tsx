import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { WaitlistCTA } from '@/components/ui/waitlist-cta';
import { WaitlistCreatorCTA } from '@/components/ui/waitlist-creator-cta';
import { SocialProof } from '@/components/ui/waitlist/social-proof';
import { MobileHeroCTA } from './MobileHeroCTA';

interface HeroCTAProps {
  className?: string;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  className
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center w-full",
        className
      )}
      style={{
        width: '100%',
        margin: '0 auto',
        padding: 0
      }}
    >
      {/* Desktop CTA with two buttons side by side */}
      {!isMobile && (
        <div 
          className="flex flex-col items-center w-full" 
          id="hero-cta-section" 
          style={{
            width: '100%',
            maxWidth: '680px', 
            margin: '0 auto',
            padding: 0
          }}
        >
          {/* Container for both buttons in a row with fixed width and centering */}
          <div 
            className="grid sm:grid-cols-2 grid-cols-1 justify-center items-center w-full" 
            style={{
              gap: '1.5rem', // 24px for row gap (applies to both grid modes)
              columnGap: '3rem', // 48px specifically for column gap in grid
              rowGap: '1.5rem', // 24px for row gap
              marginBottom: '1rem', // Reduced from 1.5rem (24px) to 1rem (16px)
              maxWidth: '600px', // Explicit max width for the button container
              margin: '0 auto'
            }}
          >
            {/* Reserve Your Spot button - fixed width */}
            <div style={{ width: '100%', maxWidth: '260px', margin: '0 auto' }}>
              <WaitlistCTA 
                buttonText="RESERVE YOUR SPOT" 
                showSocialProof={false}
                aria-label="Reserve your spot"
                className="primary-cta w-full"
                style={{
                  button: {
                    width: '100%',
                    margin: '0 auto',
                    maxWidth: '260px'
                  }
                }}
              />
            </div>
            
            {/* Join as Creator button - fixed width */}
            <div style={{ width: '100%', maxWidth: '260px', margin: '0 auto' }}>
              <WaitlistCreatorCTA 
                buttonText="JOIN AS CREATOR" 
                showSocialProof={false}
                aria-label="Join as a content creator"
                className="secondary-cta w-full"
                style={{
                  button: {
                    width: '100%',
                    margin: '0 auto',
                    maxWidth: '260px'
                  }
                }}
              />
            </div>
          </div>
          
          {/* Social proof below both buttons */}
          <div 
            className="flex justify-center items-center w-full" 
            style={{
              marginTop: '0.75rem', // Reduced from 1.25rem (20px) to 0.75rem (12px)
              marginBottom: 0
            }}
          >
            <SocialProof className="mx-auto" />
          </div>
        </div>
      )}
      
      {/* Mobile CTA with inline form */}
      {isMobile && (
        <div 
          className="flex flex-col items-center w-full" 
          id="mobile-hero-cta-section"
          style={{ 
            width: '100%',
            maxWidth: '280px',
            margin: '0 auto',
            padding: 0
          }}
        >
          {/* Mobile CTA with inline email form expansion */}
          <div className="w-full flex justify-center items-center mb-2">
            <MobileHeroCTA />
          </div>
          
          {/* Centered social proof */}
          <div 
            className="flex justify-center items-center w-full"
            style={{ marginBottom: '0.5rem', marginTop: '0.25rem' }} // 8px bottom, 4px top
          >
            <SocialProof 
              className="mx-auto"
              style={{
                margin: '0 auto',
                width: 'auto',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '11px'
              }}
            />
          </div>
          
          {/* Scroll indicator */}
          <div className="flex flex-col items-center opacity-60 mt-2">
            <span className="text-[10px] text-purple-600 mb-0.5 font-medium">Scroll to explore</span>
            <svg width="14" height="7" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L10 9L19 1" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};