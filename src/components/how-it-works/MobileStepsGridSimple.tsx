import React from 'react';
import MobileStepItemSimple from './MobileStepItemSimple';
import { steps } from './step-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const handlePrevStep = () => {
    if (activeStep > 0) {
      onStepInteraction(activeStep - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      onStepInteraction(activeStep + 1);
    }
  };

  return (
    <div className="md:hidden w-full mb-4">
      {/* Navigation controls */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevStep}
          disabled={activeStep === 0}
          className={`flex items-center gap-1 text-sm ${activeStep === 0 ? 'text-gray-300' : 'text-indigo-600'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          {activeStep + 1} of {steps.length}
        </div>

        <button 
          onClick={handleNextStep}
          disabled={activeStep === steps.length - 1}
          className={`flex items-center gap-1 text-sm ${activeStep === steps.length - 1 ? 'text-gray-300' : 'text-indigo-600'}`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Single column layout */}
      <div className="px-1">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={index !== activeStep ? "hidden" : ""}
          >
            <MobileStepItemSimple
              step={step}
              index={index}
              isCompleted={completedSteps.includes(index)}
              isActive={true}
              onClick={() => onStepInteraction(index)}
            />
          </div>
        ))}
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepInteraction(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeStep
                ? 'bg-indigo-600 w-4'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileStepsGridSimple;