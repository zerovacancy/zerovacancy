
import React from 'react';
import MobileStepItemSimple from './MobileStepItemSimple';
import { steps } from './step-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileStepsGridSimpleProps {
  completedSteps: number[];
  activeStep: number;
  onStepInteraction: (index: number) => void;
}

const MobileStepsGridSimple: React.FC<MobileStepsGridSimpleProps> = ({ 
  completedSteps, 
  activeStep,
  onStepInteraction 
}) => {
  // Always call hooks at the top level, even if we don't use the result
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "md:hidden w-full mb-4",
      !isMobile ? "hidden" : ""
    )}>
      <div className="grid grid-cols-2 gap-3 px-1">
        {steps.map((step, index) => (
          <MobileStepItemSimple
            key={index}
            step={step}
            index={index}
            isCompleted={completedSteps.includes(index)}
            isActive={activeStep === index}
            onClick={() => onStepInteraction(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileStepsGridSimple;
