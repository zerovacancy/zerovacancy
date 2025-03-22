
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
  }, []);

  // Handle step interaction
  const handleStepInteraction = (index: number) => {
    setActiveStep(index);
  };

  return (
    <div 
      id="how-it-works-section"
      className="pt-16 pb-20 bg-white w-full" // Standardized desktop padding with plain white background
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`w-full relative transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`} 
             style={{ willChange: 'transform, opacity' }}>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
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
    </div>
  );
};

export default OptimizedHowItWorks;
