
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
  // Improved gradient accent with more vibrancy
  const getAccentColor = () => {
    return {
      background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
    };
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative p-4 transition-all duration-300 cursor-pointer", // Reduced padding from p-5 to p-4
        "bg-white rounded-2xl",
        "flex flex-col h-full min-h-[150px]", // Reduced min-height from 170px to 150px
        "border-2",
        "transform hover:translate-y-[-2px]",
        "active:scale-[0.99]",
        {
          "shadow-lg": isActive,
          "shadow-md": !isActive,
          "border-l-[6px]": isActive
        }
      )}
      style={{
        borderColor: isActive 
          ? step.gradientFrom 
          : 'rgba(226, 232, 240, 0.6)', // Tailwind's gray-200 with transparency
        borderLeftColor: isActive ? step.gradientFrom : undefined
      }}
    >
      {/* Enhanced header with larger, more prominent icon */}
      <div className="flex items-start gap-3 mb-3"> {/* Reduced gap and margin */}
        {/* Enhanced number badge */}
        <div 
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center", // Reduced size
            "text-base font-bold shadow-md text-white",
            "shrink-0 relative"
          )}
          style={getAccentColor()}
        >
          {index + 1}

          {/* Enhanced completed checkmark */}
          {isCompleted && (
            <div className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-sm">
              <Check className="w-3.5 h-3.5 text-green-500" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          {/* Enhanced title */}
          <h4 className="text-base font-bold text-gray-900 mb-1">
            {step.title}
          </h4>

          {/* Enhanced description with better readability */}
          <p className="text-sm leading-relaxed text-gray-600">
            {step.description}
          </p>
        </div>

        {/* Larger, more prominent icon */}
        <div 
          className={cn(
            "rounded-xl p-2 shadow-md shrink-0", // Reduced padding
            "border border-white/40"
          )}
          style={getAccentColor()}
        >
          {React.createElement(step.icon as any, {
            className: "w-4 h-4 text-white"  // Reduced icon size
          })}
        </div>
      </div>

      {/* New feature: Helpful tip section */}
      {step.tips && (
        <div className="mt-auto pt-2 border-t border-gray-100"> {/* Reduced padding */}
          <p className="text-xs italic text-gray-500">
            <span className="font-medium">Pro tip:</span> {step.tips}
          </p>
        </div>
      )}

      {/* Enhanced active indicator */}
      {isActive && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5"> {/* Adjusted position */}
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

export default MobileStepItemSimple;
