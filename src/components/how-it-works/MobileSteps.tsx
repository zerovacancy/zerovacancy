
import React from 'react';
import { MobileStepItem } from './MobileStepItem';
import { MobileStepsNavigation } from './MobileStepsNavigation';
import SwipeInstruction from './SwipeInstruction';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';
import { Step } from './stepsUtils';

interface MobileStepsProps {
  steps: Step[];
  completedSteps: number[];
  activeStep: number | null;
  onStepClick: (index: number) => void;
}

export const MobileSteps: React.FC<MobileStepsProps> = ({ 
  steps, 
  completedSteps, 
  activeStep,
  onStepClick 
}) => {
  // Handle navigation
  const handlePrevious = () => {
    if (activeStep !== null && activeStep > 0) {
      onStepClick(activeStep - 1);
    }
  };
  
  const handleNext = () => {
    if (activeStep !== null && activeStep < steps.length - 1) {
      onStepClick(activeStep + 1);
    }
  };
  
  // Set up swipe gesture
  const { handlers } = useSwipeGesture({
    onSwipeLeft: activeStep !== null && activeStep < steps.length - 1 ? handleNext : undefined,
    onSwipeRight: activeStep !== null && activeStep > 0 ? handlePrevious : undefined
  });
  
  return (
    <div 
      className="md:hidden space-y-[14px] relative"
      {...handlers}
    >
      {/* Navigation indicator when active step is selected */}
      <MobileStepsNavigation
        activeStep={activeStep}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      
      {/* Connecting gradient line */}
      <div className="absolute left-[8px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-500 via-blue-500 via-amber-500 to-emerald-500 opacity-60"></div>
      
      {steps.map((step, index) => (
        <MobileStepItem
          key={index}
          step={step}
          index={index}
          isActive={activeStep === index}
          isCompleted={completedSteps.includes(index)}
          onClick={() => onStepClick(index)}
        />
      ))}
      
      {/* Swipe instruction overlay */}
      <SwipeInstruction visible={activeStep !== null} />
    </div>
  );
};
