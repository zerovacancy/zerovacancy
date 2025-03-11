
import React, { useEffect, useRef, useState } from 'react';
import MobileStepItemSimple from './MobileStepItemSimple';
import { steps } from './step-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';
import SwipeInstruction from './SwipeInstruction';

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
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevStep = () => {
    if (activeStep > 0) {
      onStepInteraction(activeStep - 1);
      setShowSwipeHint(false);
    }
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      onStepInteraction(activeStep + 1);
      setShowSwipeHint(false);
    }
  };

  // Integrate swipe gesture
  const { handlers } = useSwipeGesture({
    onSwipeLeft: handleNextStep,
    onSwipeRight: handlePrevStep
  });

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="md:hidden w-full mb-6" 
      ref={containerRef}
      {...handlers}
    >
      {/* Enhanced container with depth */}
      <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-lg border border-indigo-100/60">
        {/* Show swipe instruction on first load */}
        <SwipeInstruction visible={showSwipeHint} />

        {/* Enhanced navigation controls */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            className={cn(
              "flex items-center gap-1 py-2 px-3 rounded-full transition-all",
              activeStep === 0 
                ? "bg-gray-100 text-gray-400" 
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Prev</span>
          </button>

          <div className="text-sm font-medium py-1.5 px-3 bg-indigo-600 text-white rounded-full">
            {activeStep + 1} of {steps.length}
          </div>

          <button 
            onClick={handleNextStep}
            disabled={activeStep === steps.length - 1}
            className={cn(
              "flex items-center gap-1 py-2 px-3 rounded-full transition-all",
              activeStep === steps.length - 1 
                ? "bg-gray-100 text-gray-400" 
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95"
            )}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced step cards container */}
        <div className="px-1 transition-all">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "transition-all duration-300 transform",
                index === activeStep 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
              )}
              style={{
                zIndex: index === activeStep ? 1 : 0
              }}
            >
              <MobileStepItemSimple
                step={step}
                index={index}
                isCompleted={completedSteps.includes(index)}
                isActive={index === activeStep}
                onClick={() => {
                  onStepInteraction(index);
                  setShowSwipeHint(false);
                }}
              />
            </div>
          ))}
        </div>

        {/* Enhanced progress indicators */}
        <div className="mt-5">
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                background: `linear-gradient(to right, ${steps[activeStep].gradientFrom}, ${steps[activeStep].gradientTo})`
              }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-between px-1 mt-1">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  onStepInteraction(index);
                  setShowSwipeHint(false);
                }}
                className={cn(
                  "w-6 h-6 flex items-center justify-center transition-all rounded-full -mt-3",
                  index === activeStep
                    ? "bg-white shadow-md border border-indigo-200"
                    : "bg-transparent"
                )}
                aria-label={`Go to step ${index + 1}`}
              >
                <span 
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === activeStep 
                      ? "scale-100" 
                      : "scale-75",
                    index <= activeStep 
                      ? "" 
                      : "bg-gray-300"
                  )}
                  style={{
                    background: index <= activeStep 
                      ? `linear-gradient(90deg, ${step.gradientFrom}, ${step.gradientTo})` 
                      : undefined
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStepsGridSimple;
