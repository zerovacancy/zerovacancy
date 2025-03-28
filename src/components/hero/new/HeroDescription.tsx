import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroDescriptionProps {
  mobileText: string;
  desktopText: string;
  className?: string;
}

export const HeroDescription: React.FC<HeroDescriptionProps> = ({
  mobileText,
  desktopText,
  className
}) => {
  const isMobile = useIsMobile();
  
  return (
    <p 
      className={cn(
        "text-gray-700 text-center font-inter",
        className
      )}
      style={{
        width: '100%',
        maxWidth: isMobile ? '95%' : '650px',
        margin: isMobile ? '0.5rem auto' : '0 auto 1.75rem', // Even smaller margin on mobile
        padding: '0 1rem', // 16px in rem
        lineHeight: isMobile ? '1.4' : '1.6', // Tighter line height on mobile
        fontSize: isMobile ? '0.9rem' : '1rem' // Slightly smaller text on mobile
      }}
    >
      {isMobile ? mobileText : desktopText}
    </p>
  );
};