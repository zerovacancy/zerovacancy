
import React from 'react';
import DesktopStepItemSimple from './DesktopStepItemSimple';
import { steps } from './step-data';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DesktopStepsGridSimpleProps {
  completedSteps: number[];
  activeStep: number;
  onStepInteraction: (index: number) => void;
}

const DesktopStepsGridSimple: React.FC<DesktopStepsGridSimpleProps> = ({ 
  completedSteps,
  activeStep,
  onStepInteraction
}) => {
  // Move the hook call to the top level to ensure consistent hook calling
  const isMobile = useIsMobile();
  
  // Remove potential early return and use conditional rendering instead
  return (
    <div className={cn(
      "hidden md:block w-full mx-auto relative pt-8",
      isMobile ? "md:hidden" : "" // Ensure it's truly hidden on mobile
    )}>
      {/* Grid container */}
      <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8 relative">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`relative z-10 transition-all duration-500 ${
              index === activeStep ? 'scale-[1.02]' : 'scale-100'
            }`}
          >
            <DesktopStepItemSimple
              step={step}
              index={index}
              isCompleted={completedSteps.includes(index)}
              isActive={activeStep === index}
              onClick={() => onStepInteraction(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopStepsGridSimple;
