
import React from 'react';
import DesktopStepItemSimple from './DesktopStepItemSimple';
import { steps } from './step-data';

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
  return (
    <div className="hidden md:block w-full mx-auto relative pt-8">
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
      
      {/* Removed the connecting lines section */}
    </div>
  );
};

export default DesktopStepsGridSimple;
