import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeroTitle } from './HeroTitle';
import { HeroDescription } from './HeroDescription';
import { HeroCTA } from './HeroCTA';

// Define text constants
const STATIC_TITLE = 'PROPERTY CONTENT THAT';
const ROTATING_TITLES = ['CONVERTS', 'CAPTIVATES', 'CLOSES'];
const MOBILE_DESCRIPTION = "Connect with top creators who transform your spaces with professional photography, video, and 3D tours that showcase your property's potential.";
const DESKTOP_DESCRIPTION = "Connect with elite content creators who transform your spaces into compelling visual stories. Access the most in-demand creators for content that doesn't just show your property—it showcases its potential.";

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Set up intersection observer to detect when hero section is visible
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '100px'
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-hero-section="true"
      className={cn(
        "flex flex-col items-center w-full bg-[#F9F6EC] relative",
        isMobile && "justify-center", // Center content vertically on mobile
        className
      )}
      style={{
        height: isMobile ? 'auto' : 'auto', // Let content determine height for mobile
        maxHeight: isMobile ? '400px' : 'none', // Reduced maximum height for mobile
        minHeight: isMobile ? 'auto' : 'auto', // Let content determine height
        paddingTop: isMobile ? '24px' : '2.5rem', // Increased top padding on mobile
        paddingBottom: isMobile ? '32px' : '2.5rem', // Increased bottom padding on mobile
        margin: 0,
        overflow: isMobile ? 'hidden' : 'visible', // Prevent overflow on mobile
        position: 'relative',
        zIndex: 70
      }}
      aria-labelledby="hero-title"
    >
      <div 
        className={cn(
          "flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          isVisible ? "animate-fade-in delay-100" : "opacity-0"
        )}
        style={{
          width: '100%',
          maxWidth: '1200px', // Constrained max width for better control
          margin: '0 auto',
          padding: '0 1rem' // 16px padding on left and right
        }}
      >
        <div 
          className="flex flex-col items-center w-full" 
          style={{
            width: '100%',
            maxWidth: '920px',
            margin: '0 auto 1.25rem', // 20px in rem
            textAlign: 'center'
          }}
        >
          <HeroTitle 
            staticText={STATIC_TITLE} 
            rotatingTexts={ROTATING_TITLES} 
          />
        </div>

        <HeroDescription 
          mobileText={MOBILE_DESCRIPTION} 
          desktopText={DESKTOP_DESCRIPTION} 
        />
      </div>

      <HeroCTA className={isVisible ? "animate-fade-in delay-100" : "opacity-0"} />
    </section>
  );
};