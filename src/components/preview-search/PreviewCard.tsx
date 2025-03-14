
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { BorderBeam } from '../ui/effects/border-beam';
import { GlowingEffect } from '../ui/effects/glowing-effect';
import { AnimatedGrid } from '../ui/effects/animated-grid';
import { GradientBlobBackground } from '@/components/ui/backgrounds/gradient-blob-background';

interface PreviewCardProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ isVisible, children }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: isMobile ? 0.3 : 0.7, // Faster animation on mobile
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        isMobile ? "relative" : "relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-zinc-200/70 bg-white/95 will-change-transform backdrop-blur-sm"
      )}
    >
      {/* Only render effects on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-lg sm:rounded-xl">
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
        </div>
      )}

      {/* Simple transparent background on mobile, gradient blob on desktop */}
      {isMobile ? (
        <>{children}</>
      ) : (
        <GradientBlobBackground 
          className="min-h-0 w-full" 
          baseColor="bg-white/95"
          pattern="none"
          blobColors={{
            first: "bg-purple-200",
            second: "bg-indigo-200",
            third: "bg-blue-200"
          }}
          blobOpacity={0.3}
          withSpotlight={true}
          spotlightClassName="from-purple-500/15 via-indigo-500/15 to-blue-500/15"
        >
          {children}
        </GradientBlobBackground>
      )}
    </motion.div>
  );
};
