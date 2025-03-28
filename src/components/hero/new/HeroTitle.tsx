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
        "tracking-tight font-bold font-jakarta text-center w-full flex flex-col items-center",
        className
      )}
      style={{
        margin: isMobile ? '0 0 16px 0' : '0 0 1.25rem 0', // Increased to 16px on mobile
        padding: 0,
        width: '100%'
      }}
    >
      {/* Static part of the title */}
      <span 
        className={cn(
          isMobile ? "text-[1.75rem]" : "text-4xl sm:text-5xl lg:text-6xl", // Reduced from 2rem to 1.75rem on mobile
          "tracking-[-0.02em]",
          "font-jakarta mb-2",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
          "font-bold",
          "w-full mx-auto text-center"
        )}
        style={{ 
          letterSpacing: "-0.02em",
          lineHeight: "1.3",
          margin: '0 0 0.5rem 0' // 8px in rem
        }}
      >
        {staticText}
      </span>

      {/* Rotating text container */}
      <div 
        className="flex justify-center w-full text-center"
        style={{ 
          width: "100%",
          height: isMobile ? "3rem" : "4.375rem", // Reduced from 3.75rem (60px) to 3rem (48px) on mobile
          margin: 0,
          padding: 0
        }}
      >
        <TextRotate
          texts={rotatingTexts}
          mainClassName="flex justify-center items-center h-auto"
          staggerFrom="last"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          staggerDuration={0}
          rotationInterval={3000}
          splitLevelClassName="overflow-visible"
          elementLevelClassName={cn(
            isMobile ? "text-[2.4rem]" : "text-4xl sm:text-5xl lg:text-6xl",
            "font-bold font-jakarta tracking-[-0.03em]",
            "bg-clip-text text-transparent", 
            "bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1]",
            "animate-shimmer-slide bg-size-200",
            "drop-shadow-[0_1px_2px_rgba(74,45,217,0.2)]",
            "filter brightness-110",
            "leading-[1.3]"
          )}
          // Simpler tween animation for mobile
          transition={{ 
            type: "tween", 
            duration: 0.3,
            ease: "easeInOut"
          }}
          auto={true}
        />
      </div>
    </h1>
  );
};