
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './types';

interface DesktopStepItemSimpleProps {
  step: Step;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const DesktopStepItemSimple: React.FC<DesktopStepItemSimpleProps> = ({
  step,
  index,
  isCompleted,
  isActive,
  onClick
}) => {
  // Enhanced styling for active state
  const isActiveClass = isActive 
    ? "border-l-[6px] border-l-primary shadow-lg" 
    : "shadow-md hover:shadow-lg";
  
  // Enhanced styling for completed state
  const isCompletedClass = isCompleted ? "border-green-200" : "";
  
  // Base classes for card container
  const cardBaseClasses = cn(
    "bg-white rounded-xl border-2 border-slate-100",
    "transition-all duration-300 transform",
    "flex flex-col py-5 px-5 h-full cursor-pointer",
    isActiveClass,
    isCompletedClass,
    "hover:translate-y-[-2px]",
    "active:scale-[0.99]"
  );
  
  // Get accent color for various elements
  const getAccentColor = () => {
    return {
      background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
    };
  };
  
  return (
    <div
      className={cardBaseClasses}
      onClick={onClick}
      style={{
        borderColor: isActive ? step.gradientFrom : undefined,
        borderLeftColor: isActive ? step.gradientFrom : undefined
      }}
    >
      <div className="flex items-start mb-3">
        {/* Step Number */}
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "text-base font-bold text-white shadow-md",
            "shrink-0 relative"
          )}
          style={getAccentColor()}
        >
          {index + 1}
          
          {/* Completed indicator */}
          {isCompleted && (
            <div className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-sm">
              <Check className="w-3.5 h-3.5 text-green-500" />
            </div>
          )}
        </div>
        
        {/* Title and Description */}
        <div className="ml-4 flex-grow">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>
        
        {/* Icon */}
        <div 
          className={cn(
            "rounded-xl p-2.5 shadow-md shrink-0",
            "border border-white/40"
          )}
          style={getAccentColor()}
        >
          {React.createElement(step.icon as any, {
            className: "w-5 h-5 text-white"
          })}
        </div>
      </div>
      
      {/* Tips section */}
      {step.tips && (
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-xs italic text-gray-500">
            <span className="font-medium">Pro tip:</span> {step.tips}
          </p>
        </div>
      )}
      
      {/* Active indicator pulses */}
      {isActive && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse delay-100"
            style={getAccentColor()}>
          </div>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse delay-200"
            style={getAccentColor()}>
          </div>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse delay-300"
            style={getAccentColor()}>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopStepItemSimple;
