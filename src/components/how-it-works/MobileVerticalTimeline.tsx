
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { steps } from './step-data';
import VerticalTimelineStep from './VerticalTimelineStep';

interface MobileVerticalTimelineProps {
  completedSteps: number[];
  activeStep: number;
  onStepInteraction: (index: number) => void;
}

const MobileVerticalTimeline: React.FC<MobileVerticalTimelineProps> = ({
  completedSteps,
  activeStep,
  onStepInteraction
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineSteps = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollActive, setScrollActive] = useState(false);

  // Setup intersection observer to detect which step is in view
  useEffect(() => {
    if (!containerRef.current || timelineSteps.current.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (!scrollActive) return;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = timelineSteps.current.findIndex(el => el === entry.target);
            if (index >= 0 && index !== activeStep) {
              onStepInteraction(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when step is ~20% into view from top
        threshold: 0.1
      }
    );
    
    timelineSteps.current.forEach(step => {
      if (step) observer.observe(step);
    });
    
    return () => observer.disconnect();
  }, [activeStep, onStepInteraction, scrollActive]);
  
  // Detect user scroll to enable scroll-based activation
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollActive) setScrollActive(true);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollActive]);

  // Scroll to active step if activated by button/direct interaction
  useEffect(() => {
    if (!scrollActive && activeStep !== undefined && timelineSteps.current[activeStep]) {
      timelineSteps.current[activeStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeStep, scrollActive]);

  return (
    <div 
      ref={containerRef}
      className="md:hidden relative overflow-hidden px-4 py-6 bg-white/80 backdrop-blur-sm rounded-xl"
    >
      {/* Timeline progress indicator */}
      <div className="mb-6 px-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-500">Progress</h4>
          <div className="text-sm font-medium text-indigo-600">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              background: `linear-gradient(to right, ${steps[activeStep].gradientFrom}, ${steps[activeStep].gradientTo})`
            }}
          />
        </div>
        
        {/* Quick navigation dots */}
        <div className="flex justify-between mt-1">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className="w-6 h-6 flex items-center justify-center"
              onClick={() => {
                onStepInteraction(idx);
                setScrollActive(false);
              }}
              aria-label={`Go to step ${idx + 1}`}
            >
              <div 
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  idx <= activeStep 
                    ? "scale-100" 
                    : "scale-75 bg-gray-300"
                )}
                style={{
                  background: idx <= activeStep 
                    ? `linear-gradient(90deg, ${step.gradientFrom}, ${step.gradientTo})` 
                    : undefined
                }}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Scrollable timeline */}
      <div className="relative space-y-6 pb-4">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">
          Scroll to explore the journey
        </div>
        
        {steps.map((step, index) => (
          <div 
            key={index} 
            ref={el => timelineSteps.current[index] = el}
          >
            <VerticalTimelineStep
              step={step}
              index={index}
              isActive={index === activeStep}
              isCompleted={completedSteps.includes(index)}
              onClick={() => {
                onStepInteraction(index);
                setScrollActive(false);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileVerticalTimeline;
