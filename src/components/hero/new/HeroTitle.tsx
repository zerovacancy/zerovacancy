import React from 'react';
import { TextRotate } from '@/components/ui/text-rotate';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroTitleProps {
  staticText: string;
  rotatingTexts: string[];
  className?: string;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
  staticText,
  rotatingTexts,
  className
}) => {
  const isMobile = useIsMobile();
  
  return (
    <h1 
      className={cn(
        "tracking-tight font-bold font-jakarta text-center w-full flex flex-col items-center p-0",
        "mb-1 md:mb-2", // Minimal bottom margin
        className
      )}
      id="hero-title"
    >
      {/* Static part of the title */}
      <span 
        className={cn(
          isMobile ? "text-[1.75rem]" : "text-4xl sm:text-5xl lg:text-6xl",
          "tracking-[-0.02em] leading-[1.2]", // Tighter line height
          "font-jakarta mb-1", // Reduced margin
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
          "font-bold",
          "w-full mx-auto text-center"
        )}
      >
        {staticText}
      </span>

      {/* Rotating text container - fixed height ensures stable layout */}
      <div className={cn(
        "flex justify-center w-full text-center p-0 m-0 overflow-visible relative",
        isMobile 
          ? "h-[40px] min-h-[40px]" // Critical: Fixed height for mobile
          : "h-[3.2rem]" // Desktop height
      )}>
        <TextRotate
          texts={rotatingTexts}
          mainClassName={cn(
            "flex justify-center items-center",
            isMobile && "absolute inset-0" // Critical: Use absolute positioning on mobile
          )}
          staggerFrom="last"
          initial={isMobile ? { opacity: 0 } : { opacity: 1 }}  // Simpler animation for mobile
          animate={{ opacity: 1 }}
          exit={isMobile ? { opacity: 0 } : { opacity: 0 }}     // Simpler animation for mobile
          staggerDuration={isMobile ? 0 : 0}  // No stagger on mobile
          rotationInterval={3000}
          splitLevelClassName="overflow-visible"
          elementLevelClassName={cn(
            isMobile ? "text-[2.2rem]" : "text-4xl sm:text-5xl lg:text-5xl", // Reduced text sizes
            "font-bold font-jakarta tracking-[-0.03em]",
            "bg-clip-text text-transparent", 
            "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
            isMobile ? "" : "animate-shimmer-slide bg-size-200", // Remove animation on mobile
            "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
            "filter brightness-110",
            "leading-[1.2]" // Tighter line height
          )}
          // Simpler fade animation for mobile only
          transition={{ 
            type: "tween", 
            duration: isMobile ? 0.25 : 0.3, // Shorter for mobile
            ease: "easeInOut"
          }}
          auto={true}
        />
      </div>
    </h1>
  );
};