import React from 'react';
import { cn } from '@/lib/utils';
import { BorderBeam } from '../ui/border-beam';
import { GlowingEffect } from '../ui/glowing-effect';
import { AnimatedGrid } from '../ui/animated-grid';
import { GradientBlobBackground } from '@/components/ui/gradient-blob-background';
import { WavyBackground } from '@/components/ui/wavy-background';

interface PreviewCardProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ isVisible, children }) => {
  return (
    <div 
      className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-zinc-200/70 bg-white/95 will-change-transform backdrop-blur-sm mobile-no-backdrop-blur"
    >
      {/* Effects only visible on desktop - hidden on mobile via CSS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-lg sm:rounded-xl desktop-only-effects">
        <BorderBeam 
          colorFrom="#9370DB" 
          colorTo="#C19EF9" 
          duration={18}
          borderWidth={1.5}
        />
        <GlowingEffect 
          variant="default" 
          blur={8} 
          glow={true} 
          inactiveZone={0.55}
          spread={18}
          borderWidth={1.2}
          className="opacity-30"
        />
        <AnimatedGrid className="opacity-8" />
        
        <WavyBackground 
          colors={["#9370DB10", "#C19EF908", "#8A2BE210"]}
          waveWidth={50}
          backgroundFill="transparent" 
          blur={8}
          speed="slow"
          waveOpacity={0.25}
          className="h-full w-full"
          containerClassName="h-full w-full absolute inset-0"
        />
      </div>

      {/* Keep content always visible but use simpler styling on mobile */}
      <div className="relative z-10 min-h-0 w-full bg-white mobile-card-content">
        {children}
      </div>
    </div>
  );
};
