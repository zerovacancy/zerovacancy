import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './types';

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
  // Simplified gradient accent
  const getAccentColor = () => {
    return {
      background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
    };
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative p-5 transition-all duration-200 cursor-pointer",
        "bg-white border border-gray-100 rounded-xl shadow-sm",
        "flex flex-col h-full min-h-[140px] mb-4",
        isActive ? "shadow-md border-l-4" : "",
        "active:scale-[0.99]"
      )}
      style={{
        borderLeftColor: isActive ? step.gradientFrom : '',
      }}
    >
      {/* Header with number and title */}
      <div className="flex items-center gap-3 mb-3">
        {/* Circle Number Badge */}
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center",
          "text-sm font-semibold shadow-sm text-white",
        )}
        style={getAccentColor()}>
          {index + 1}

          {/* Completed checkmark */}
          {isCompleted && (
            <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-sm">
              <Check className="w-3 h-3 text-green-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-gray-900 flex-grow">
          {step.title}
        </h4>

        {/* Icon */}
        <div className={cn(
          "rounded-full p-2 flex-shrink-0",
        )}
        style={getAccentColor()}>
          {React.cloneElement(step.icon as React.ReactElement, {
            className: "w-4 h-4 text-white"
          })}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-600">
        {step.description}
      </p>

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full animate-pulse"
          style={getAccentColor()}>
        </div>
      )}
    </div>
  );
};

export default MobileStepItemSimple;