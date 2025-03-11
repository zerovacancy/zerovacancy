import React, { useEffect, useRef, useState } from 'react';
import MobileStepItemSimple from './MobileStepItemSimple';
import { steps } from './step-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';

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
      <div className="relative bg-card/50 rounded-2xl p-5 border border-border/40">
        {/* Swipe instruction */}
        {showSwipeHint && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm rounded-2xl"
            onClick={() => setShowSwipeHint(false)}
          >
            <div className="bg-white px-6 py-5 rounded-xl shadow-sm text-center max-w-[220px]">
              <div className="flex justify-center gap-4 mb-3">
                <ChevronLeft className="w-5 h-5 text-primary animate-pulse" />
                <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="font-medium text-sm">Swipe to navigate steps</p>
              <p className="text-muted-foreground text-xs mt-1">Tap to dismiss</p>
            </div>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>

        {/* Step cards */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "transition-all duration-300 transform",
                index === activeStep 
                  ? "opacity-100 scale-100" 
                  : "hidden"
              )}
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

        {/* Progress bar */}
        <div className="mt-4 mb-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                background: `linear-gradient(to right, ${steps[activeStep].gradientFrom}, ${steps[activeStep].gradientTo})`
              }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            className={cn(
              "flex items-center gap-1 py-2 px-3 rounded-full transition-all",
              activeStep === 0 
                ? "bg-gray-100 text-gray-400" 
                : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <button 
            onClick={handleNextStep}
            disabled={activeStep === steps.length - 1}
            className={cn(
              "flex items-center gap-1 py-2 px-3 rounded-full transition-all",
              activeStep === steps.length - 1 
                ? "bg-gray-100 text-gray-400" 
                : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
            )}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileStepsGridSimple;
