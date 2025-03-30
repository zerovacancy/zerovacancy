import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeroTitle } from './HeroTitle';
import { HeroDescription } from './HeroDescription';
import { HeroCTA } from './HeroCTA';
import '../hero-section.css'; // Import the dedicated CSS
import '../mobile-hero.css'; // Import mobile-first CSS directly

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
        "hero-section", // Use our dedicated class
        className
      )}
      aria-labelledby="hero-title"
    >
      {/* Added hero-wrapper to manage overall layout distribution */}
      <div className="hero-wrapper">
        <div 
          className={cn(
            "hero-content", // Use our dedicated class
            isVisible ? "hero-fade-in hero-delay-100" : "opacity-0"
          )}
        >
          <div className="hero-title-container">
            <HeroTitle 
              staticText={STATIC_TITLE} 
              rotatingTexts={ROTATING_TITLES}
            />
          </div>

          <div className="hero-description-container">
            <HeroDescription 
              mobileText={MOBILE_DESCRIPTION} 
              desktopText={DESKTOP_DESCRIPTION}
            />
          </div>
        </div>

        <div className={cn("hero-cta-container", isVisible ? "hero-fade-in hero-delay-200" : "opacity-0")}>
          <HeroCTA />
        </div>
      </div>
    </section>
  );
};