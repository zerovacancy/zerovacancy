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

export const HeroCTA: React.FC<HeroCTAProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  return (
    <section className={cn("w-full max-w-[680px] mx-auto", className)}>
      {/* Main CTA Section */}
      <div className={cn(
        isMobile ? "flex justify-center" : "grid sm:grid-cols-2 gap-6 sm:gap-x-12 mb-3"
      )}>
        {isMobile ? (
          <MobileHeroCTA />
        ) : (
          <>
            <WaitlistCTA 
              buttonText="RESERVE YOUR SPOT" 
              showSocialProof={false}
              aria-label="Reserve your spot"
              className="w-full max-w-[260px] mx-auto"
            />
            
            <WaitlistCreatorCTA 
              buttonText="JOIN AS CREATOR" 
              showSocialProof={false}
              aria-label="Join as a content creator"
              className="w-full max-w-[260px] mx-auto"
            />
          </>
        )}
      </div>
      
      {/* Social proof and scroll indicator - unified but with responsive styling */}
      <SocialProof 
        className={cn(
          "mx-auto", 
          isMobile ? "mt-1 mb-2 py-[6px] px-[10px] rounded-[10px] text-[11px]" : "mt-3"
        )}
      />
      
      {/* Mobile-only scroll indicator */}
      {isMobile && (
        <div className="flex flex-col items-center opacity-60 mt-2">
          <span className="text-[10px] text-purple-600 mb-0.5 font-medium">Scroll to explore</span>
          <svg width="14" height="7" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L10 9L19 1" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </section>
  );
};