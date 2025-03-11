
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SectionHeaderSimple from './SectionHeaderSimple';
import DesktopStepsGridSimple from './DesktopStepsGridSimple';
import MobileVerticalTimeline from './MobileVerticalTimeline';
import { cn } from '@/lib/utils';

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
      className={cn(
        "py-12 sm:py-16 lg:py-20 relative overflow-hidden",
        "bg-gradient-to-b from-indigo-50/60 via-purple-50/30 to-white"
      )}
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNmE3OGYxIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNMzAgMEMxMy40IDAgMCAxMy40IDAgMzBzMTMuNCAzMCAzMCAzMCAzMC0xMy40IDMwLTMwUzQ2LjYgMCAzMCAweiIvPjwvZz48L3N2Zz4=')] opacity-70"></div>

      <div className={cn(
        "max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-10 transition-all duration-700",
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
      )}>
        {/* Enhanced section header with better visibility */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <SectionHeaderSimple 
            title="THE EXPERIENCE" 
            subtitle="From concept to captivation in four moments:"
          />
        </div>

        {/* New Mobile Vertical Timeline */}
        <MobileVerticalTimeline 
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
  );
};

export default OptimizedHowItWorks;
