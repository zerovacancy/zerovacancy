 // MobileStepsGridSimple.tsx
  import React from 'react';
  import { steps } from './step-data';
  import { Card } from "@/components/ui/card";
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
    return (
      <div className="md:hidden w-full mb-6">
        {/* Title centered above the cards */}
        <div className="text-center mb-4">
          <div className="inline-flex px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm 
  font-medium">
            How It Works
          </div>
        </div>

        {/* Grid of cards - stacked vertically on mobile */}
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="bg-card text-card-foreground rounded-2xl p-6 flex flex-col gap-2 border 
  shadow-none"
              onClick={() => onStepInteraction(index)}
            >
              <div className="items-center gap-2 flex">
                {React.cloneElement(step.icon as React.ReactElement, {
                  className: "h-5 w-5"
                })}
                <h3 className="font-heading font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  export default MobileStepsGridSimple;
