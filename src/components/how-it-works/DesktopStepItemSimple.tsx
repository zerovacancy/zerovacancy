
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
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
  // Get the border color by extracting from gradient (for non-active state)
  const getBorderColor = () => {
    // Extract the primary color from gradient for border
    const color = step.gradientFrom || '#8B5CF6';
    return isActive ? color : color + '33'; // Full opacity for active, 20% for inactive
  };

  // Get the subtle background tint based on the step's theme color
  const getBackgroundTint = () => {
    // Extract the primary color and make it extremely subtle (3% opacity)
    const color = step.gradientFrom || '#8B5CF6';
    return color + (isActive ? '12' : '08'); // 7% opacity for active, 3% for inactive
  };

  const Icon = step.icon;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative h-full min-h-[190px] px-6 py-7 rounded-xl",
        "transition-all duration-300 group cursor-pointer",
        "border hover:border-opacity-100 active:scale-[0.98]",
        "touch-manipulation",
        "flex flex-col items-center justify-start",
        isActive && "ring-1 ring-offset-2",
        isActive ? `ring-${step.gradientFrom?.replace('#', '')}` : "",
        "bg-white"
      )}
      style={{
        // Dynamic styling for each card with 3D effect
        borderColor: getBorderColor(),
        borderWidth: isActive ? '2px' : '1px',
        borderLeftWidth: isActive ? '3px' : '1px',
        borderRadius: '12px',
        boxShadow: isActive 
          ? '0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        transform: isActive ? 'translateY(-5px)' : 'translateY(0)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else {
          e.currentTarget.style.boxShadow = '0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.transform = 'translateY(-5px)';
        }
      }}
      aria-label={`Step ${index + 1}: ${step.title}`}
    >
      
      {/* Step Number badge with gradient */}
      <div className={cn("absolute -top-3 left-5", "z-10")}>
        <span 
          className={cn(
            "inline-flex items-center justify-center",
            "w-8 h-8 rounded-full text-xs font-bold",
            "ring-2 ring-white shadow-sm animate-scale-in",
            `animation-delay-${index * 200 + 300}`,
            step.gradientClass || step.numberClass
          )}
        >
          {step.number}
          
          {/* Completed checkmark */}
          {isCompleted && (
            <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-sm">
              <Check className="w-2.5 h-2.5 text-green-500" />
            </div>
          )}
        </span>
      </div>
      
      {/* Icon with gradient background */}
      <div 
        className={cn(
          "mb-5 rounded-lg p-4 transition-all duration-300",
          "group-hover:scale-105 shadow-sm",
          isActive ? "animate-pulse-subtle" : "",
          step.gradientClass || step.iconClass
        )}
        style={step.gradientStyle}
      >
        <Icon className="w-7 h-7" />
      </div>
      
      {/* Title */}
      <h4 
        className={cn(
          "text-base sm:text-lg font-bold text-gray-900 mb-3 text-center",
          "animate-fade-in",
          `animation-delay-${index * 100 + 500}`
        )}
      >
        {step.title}
      </h4>
      
      {/* Description */}
      <p 
        className={cn(
          "text-xs sm:text-sm text-gray-600 leading-relaxed text-center",
          "animate-fade-in",
          `animation-delay-${index * 100 + 700}`
        )}
      >
        {step.description}
      </p>
      
      {/* Learn More indicator */}
      <div className={cn(
        "mt-auto pt-3 text-xs font-medium",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        "text-blue-600 flex items-center gap-1"
      )}>
        <span>Learn more</span>
        <ArrowRight className="w-3 h-3" />
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 rounded-full animate-pulse" style={{
          background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
        }}></div>
      )}
    </div>
  );
};

export default DesktopStepItemSimple;
