
import React from 'react';
import MobileStepItemSimple from './MobileStepItemSimple';
import { steps } from './step-data';

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
  return (
    <div className="md:hidden w-full mb-4">
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
