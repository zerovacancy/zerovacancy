
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import SectionHeaderSimple from './SectionHeaderSimple';
import MobileStepsGridSimple from './MobileStepsGridSimple';
import DesktopStepsGridSimple from './DesktopStepsGridSimple';
import BeamsBackground from '@/components/ui/beams-background';
import { howItWorksPatternDiagonal, generateBackgroundWithPattern } from '@/utils/background-patterns';

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('how-it-works');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Handle step interaction
  const handleStepInteraction = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section 
      id="how-it-works-section" 
      aria-labelledby="design-title"
      className={cn(
        "relative w-full overflow-hidden",
        isMobile ? "py-8" : "py-16 bg-[#EDF7F2]" // Match other sections' padding
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full relative">
          <div className={cn(
            "text-center",
            isMobile ? "mb-8" : "mb-12 sm:mb-14 lg:mb-16" // Match FeatureHeader spacing
          )}>
            <SectionHeaderSimple 
              title="SIMPLE BY DESIGN" 
              subtitle="From booking to delivery in four straightforward steps:"
            />
          </div>

          {/* Mobile grid layout */}
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
      </div>
    </section>
  );
};

export default OptimizedHowItWorks;
