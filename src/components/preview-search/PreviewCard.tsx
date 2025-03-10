
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-zinc-200/70 bg-white/95 will-change-transform backdrop-blur-sm"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-lg sm:rounded-xl">
        <BorderBeam 
          colorFrom="#9370DB" 
          colorTo="#C19EF9" 
          duration={isMobile ? 25 : 18}
          borderWidth={isMobile ? 0.8 : 1.5}
        />
        <GlowingEffect 
          variant="default" 
          blur={isMobile ? 4 : 8} 
          glow={!isMobile} 
          inactiveZone={isMobile ? 0.65 : 0.55}
          spread={isMobile ? 10 : 18}
          borderWidth={isMobile ? 0.6 : 1.2}
          className={isMobile ? "opacity-20" : "opacity-30"}
        />
        <AnimatedGrid className={isMobile ? "opacity-4" : "opacity-8"} />
      </div>

      {/* Adding WavyBackground for subtle animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-lg sm:rounded-xl">
        <WavyBackground 
          colors={["#9370DB10", "#C19EF908", "#8A2BE210"]}
          waveWidth={isMobile ? 30 : 50}
          backgroundFill="transparent" 
          blur={isMobile ? 5 : 8}
          speed="slow"
          waveOpacity={isMobile ? 0.2 : 0.25}
          className="h-full w-full"
          containerClassName="h-full w-full absolute inset-0"
        />
      </div>

      <GradientBlobBackground 
        className="min-h-0 w-full" 
        baseColor="bg-white/95"
        pattern="none"
        blobColors={{
          first: "bg-purple-200",
          second: "bg-indigo-200",
          third: "bg-blue-200"
        }}
        blobOpacity={isMobile ? 0.2 : 0.3}
        withSpotlight={!isMobile}
        spotlightClassName="from-purple-500/15 via-indigo-500/15 to-blue-500/15"
      >
        {children}
      </GradientBlobBackground>
    </motion.div>
  );
};
