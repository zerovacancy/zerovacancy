
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './types';

interface VerticalTimelineStepProps {
  step: Step;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const VerticalTimelineStep: React.FC<VerticalTimelineStepProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  onClick
}) => {
  const IconComponent = step.icon;
  
  // Get accent color for various elements
  const getAccentColor = () => {
    return {
      background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
    };
  };

  return (
    <div 
      className={cn(
        "relative mb-2 transition-all duration-300",
        isActive ? "z-10" : "z-0"
      )}
    >
      {/* Timeline connector line */}
      {index < 3 && (
        <div 
          className={cn(
            "absolute left-[18px] top-[40px] w-[2px] h-[calc(100%_+_16px)] transition-all duration-700",
            isActive || isCompleted ? "bg-gradient-to-b" : "bg-gray-200"
          )}
          style={
            isActive || isCompleted 
              ? {
                  backgroundImage: `linear-gradient(to bottom, ${step.gradientFrom}, ${step.gradientTo})`
                }
              : {}
          }
        />
      )}
      
      {/* Main card content */}
      <div 
        className={cn(
          "flex items-start gap-4 p-4 rounded-xl transition-all duration-300",
          "bg-white shadow-sm hover:shadow-md ml-8",
          isActive ? "transform-gpu -translate-y-1 shadow-md border-l-4" : "border border-gray-100",
          "cursor-pointer"
        )}
        onClick={onClick}
        style={{
          borderLeftColor: isActive ? step.gradientFrom : undefined
        }}
      >
        {/* Step circle indicator */}
        <div 
          className={cn(
            "absolute left-0 top-4 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-md z-20",
            "transform transition-all duration-500"
          )}
          style={getAccentColor()}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
          
          {/* Pulse effect for active step */}
          {isActive && !isCompleted && (
            <span 
              className="absolute w-full h-full rounded-full animate-ping opacity-30"
              style={{ backgroundColor: step.gradientFrom }}
            />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Header with icon */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {step.title}
            </h3>
            <div 
              className="flex items-center justify-center p-2 rounded-lg"
              style={getAccentColor()}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.description}
          </p>
          
          {/* Tips section if available */}
          {step.tips && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs italic text-gray-500">
                <span className="font-medium">Pro tip:</span> {step.tips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalTimelineStep;
