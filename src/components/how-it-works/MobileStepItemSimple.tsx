
import React, { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './types';
import { Sparkles } from 'lucide-react';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Magnetic effect (lighter for mobile)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Limit the movement to a smaller range for mobile cards
    const maxDistance = 8; 
    const moveX = (distanceX / rect.width) * maxDistance;
    const moveY = (distanceY / rect.height) * maxDistance;
    
    setPosition({ x: moveX, y: moveY });
  };
  
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Get the border color by extracting from gradient (for non-active state)
  const getBorderColor = () => {
    // Extract the primary color from gradient for border
    const color = step.gradientFrom || '#8B5CF6';
    return color + '33'; // Add 33 for ~20% opacity
  };

  // Get the subtle background tint based on the step's theme color
  const getBackgroundTint = () => {
    // Extract the primary color and make it extremely subtle (3% opacity)
    const color = step.gradientFrom || '#8B5CF6';
    return color + '08'; // Add 08 for ~3% opacity
  };

  // Get glow shadow color based on the step's theme
  const getGlowColor = () => {
    const color = step.gradientFrom || '#8B5CF6';
    return color + '40'; // Add 40 for ~25% opacity
  };

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={cn(
        "relative p-2 sm:p-3.5 transition-all",
        "flex flex-col h-full min-h-[90px] sm:min-h-[120px] touch-manipulation",
        "duration-200 cursor-pointer animate-fade-in",
        `animation-delay-${index * 100}`,
        "active:scale-[0.98]"
      )}
      style={{
        // Dynamic styling for each card
        borderColor: isActive ? step.gradientFrom : getBorderColor(),
        borderWidth: isActive ? '2px' : '1px',
        borderLeftWidth: isActive ? '3px' : '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
        backgroundColor: getBackgroundTint(),
        boxShadow: isActive 
          ? `0 0 15px ${getGlowColor()}, 0 0 5px ${getGlowColor()}` 
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease-in-out',
        // Magnetic effect
        ...(isHovered && {
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
        })
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetPosition}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = isActive 
          ? `0 0 20px ${getGlowColor()}, 0 0 8px ${getGlowColor()}` 
          : '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseOut={(e) => {
        if (!isHovered) {
          e.currentTarget.style.boxShadow = isActive 
            ? `0 0 15px ${getGlowColor()}, 0 0 5px ${getGlowColor()}` 
            : '0 2px 8px rgba(0,0,0,0.05)';
        }
      }}
    >
      {/* Circle Number Badge with gradient */}
      <div className="absolute -top-2 -left-1">
        <div className={cn(
          "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center",
          "text-xs font-medium shadow-sm ring-1 ring-white",
          step.gradientClass || step.numberClass
        )}>
          {index + 1}
          
          {/* Completed checkmark */}
          {isCompleted && (
            <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-sm">
              <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      {/* Icon and Title in row */}
      <div className="flex items-center justify-between mt-1.5 mb-1.5">
        <h4 className="text-xs sm:text-sm font-bold text-gray-900 pr-1 line-clamp-2">
          {step.title}
        </h4>
        
        <div 
          ref={iconRef}
          className={cn(
            "rounded-full p-1 sm:p-1.5 ml-1 relative overflow-hidden",
            step.gradientClass || step.iconClass
          )}
          onMouseEnter={() => {
            if (iconRef.current) {
              // Create sparkle effect
              const sparklesEl = document.createElement('div');
              sparklesEl.className = 'absolute inset-0 z-10 flex items-center justify-center';
              
              const sparkle = document.createElement('div');
              sparkle.className = 'animate-ping-once absolute';
              sparkle.style.width = '4px';
              sparkle.style.height = '4px';
              sparkle.style.borderRadius = '50%';
              sparkle.style.backgroundColor = 'rgba(255,255,255,0.8)';
              
              sparklesEl.appendChild(sparkle);
              iconRef.current.appendChild(sparklesEl);
              
              // Remove after animation
              setTimeout(() => {
                if (iconRef.current && sparklesEl.parentNode === iconRef.current) {
                  iconRef.current.removeChild(sparklesEl);
                }
              }, 700);
            }
          }}
        >
          {React.cloneElement(step.icon as React.ReactElement, {
            className: "w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-20"
          })}
          
          {/* Mini sparkles on hover */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Sparkles className="w-5 h-5 text-white opacity-40 animate-pulse" />
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600 mt-auto line-clamp-3">
        {step.description}
      </p>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{
          background: `linear-gradient(${step.gradientDirection || '45deg'}, ${step.gradientFrom || '#8B5CF6'}, ${step.gradientTo || '#6366F1'})`
        }}></div>
      )}
    </div>
  );
};

export default MobileStepItemSimple;
