import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './types';
import { Card } from "@/components/ui/card";

interface MobileStepItemSimpleProps {
  step: Step;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const MobileStepItemSimple: React.FC<MobileStepItemSimpleProps> = ({ 
  step, 
  index, 
  isCompleted,
  isActive,
  onClick
}) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6 flex flex-col gap-2 border shadow-none",
        "transition-all duration-200",
        isActive ? "border-l-4" : "",
      )}
      style={{ 
        borderLeftColor: isActive ? step.gradientFrom : undefined 
      }}
    >
      <div className="items-center gap-2 flex">
        {React.cloneElement(step.icon as React.ReactElement, {
          className: "h-5 w-5"
        })}
        <h3 className="font-heading font-semibold">{step.title}</h3>

        {isCompleted && (
          <span className="ml-auto bg-green-50 p-1 rounded-full">
            <Check className="w-3.5 h-3.5 text-green-500" />
          </span>
        )}
      </div>

      <p className="text-muted-foreground text-sm">{step.description}</p>

      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
        <span>Step {index + 1} of 4</span>
        {isActive && <span className="text-primary font-medium">Active</span>}
      </div>
    </Card>
  );
};

export default MobileStepItemSimple;
