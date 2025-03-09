
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SectionHeaderSimple from './SectionHeaderSimple';
import MobileStepsGridSimple from './MobileStepsGridSimple';
import DesktopStepsGridSimple from './DesktopStepsGridSimple';
import BeamsBackground from '@/components/ui/beams-background';

const OptimizedHowItWorks: React.FC = () => {
  const isMobile = useIsMobile();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('howItWorksProgress');
    if (savedProgress) {
      setCompletedSteps(JSON.parse(savedProgress));
    }
  }, []);

  // Add intersection observer to trigger animations when section is visible
  useEffect(() => {
    // Skip complex observer setup on mobile for performance
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('how-it-works-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isMobile]);

  // Handle step interaction
  const handleStepInteraction = (index: number) => {
    setActiveStep(index);
  };

  return (
    <BeamsBackground 
      id="how-it-works-section"
      className={cn(
        "py-8 sm:py-16 lg:py-20",
        isMobile ? "mobile-simple-bg" : ""
      )}
      intensity={isMobile ? "subtle" : "medium"}
    >
      <div className={`max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-10 transition-all duration-700 ${isVisible || isMobile ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-6 sm:mb-12 lg:mb-16">
          <SectionHeaderSimple 
            title="THE EXPERIENCE" 
            subtitle="From concept to captivation in four moments:"
          />
        </div>
        
        {/* Mobile 2x2 Grid Layout */}
        <MobileStepsGridSimple 
          completedSteps={completedSteps} 
          activeStep={activeStep}
          onStepInteraction={handleStepInteraction}
        />
        
        {/* Desktop grid layout */}
        <DesktopStepsGridSimple 
          completedSteps={completedSteps} 
          activeStep={activeStep}
          onStepInteraction={handleStepInteraction}
        />
      </div>
    </BeamsBackground>
  );
};

export default OptimizedHowItWorks;
