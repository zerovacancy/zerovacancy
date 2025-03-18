
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'high';
}

export const FloatingBackground: React.FC<FloatingBackgroundProps> = ({
  className = '',
  children,
  intensity = 'medium',
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Initialize component after mount to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Adjust animation intensity based on prop
  const getIntensityFactor = () => {
    switch(intensity) {
      case 'subtle': return 0.6;
      case 'high': return 1.4;
      default: return 1;
    }
  };
  
  const factor = getIntensityFactor();
  
  // Define floating element shapes with intensity adjustments
  const floatingElements = [
    // Larger shapes for desktop
    {
      className: 'hidden md:block absolute w-40 h-24 rounded-xl blur-md bg-gradient-to-br from-purple-200/20 to-indigo-300/20 -top-5 right-[20%] rotate-6',
      style: { animation: `float-slow ${20/factor}s infinite ease-in-out` }
    },
    {
      className: 'hidden md:block absolute w-32 h-32 rounded-lg blur-md bg-gradient-to-tr from-indigo-300/20 to-blue-200/20 bottom-20 left-[15%] -rotate-12',
      style: { animation: `float-medium ${22/factor}s infinite ease-in-out reverse` }
    },
    {
      className: 'hidden md:block absolute w-48 h-28 rounded-xl blur-md bg-gradient-to-br from-violet-300/20 to-indigo-200/15 top-1/3 -left-10 rotate-12',
      style: { animation: `float-slow ${25/factor}s infinite ease-in-out 2s` }
    },
    {
      className: 'hidden md:block absolute w-28 h-28 rounded-lg blur-md bg-gradient-to-bl from-blue-300/10 to-indigo-200/15 top-10 left-[35%] rotate-45',
      style: { animation: `float-medium ${28/factor}s infinite ease-in-out 5s` }
    },
    {
      className: 'hidden md:block absolute w-40 h-20 rounded-xl blur-md bg-gradient-to-tr from-indigo-400/15 to-violet-300/10 bottom-10 right-[10%] -rotate-3',
      style: { animation: `float-slow ${24/factor}s infinite ease-in-out 1s` }
    },
    
    // Mobile optimized smaller shapes
    {
      className: 'md:hidden absolute w-20 h-12 rounded-lg blur-md bg-gradient-to-br from-purple-200/20 to-indigo-300/20 -top-5 right-[10%] rotate-6',
      style: { animation: `float-slow ${15/factor}s infinite ease-in-out` }
    },
    {
      className: 'md:hidden absolute w-16 h-16 rounded-lg blur-md bg-gradient-to-tr from-indigo-300/15 to-blue-200/10 bottom-20 left-[5%] -rotate-12',
      style: { animation: `float-medium ${18/factor}s infinite ease-in-out reverse` }
    },
    {
      className: 'md:hidden absolute w-24 h-14 rounded-lg blur-md bg-gradient-to-br from-violet-300/15 to-indigo-200/10 top-1/4 -left-10 rotate-12',
      style: { animation: `float-slow ${20/factor}s infinite ease-in-out 2s` }
    }
  ];

  // Disable animations until mounted to prevent hydration issues
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {mounted && floatingElements.map((element, index) => (
          <div
            key={index}
            className={element.className}
            style={element.style}
          />
        ))}
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS animations */}
      <style>
        {`
          @keyframes float-slow {
            0%, 100% {
              transform: translate(0, 0) rotate(var(--rotation, 0deg));
            }
            50% {
              transform: translate(calc(var(--direction, 1) * ${20 * factor}px), -${15 * factor}px) rotate(calc(var(--rotation, 0deg) + ${2 * factor}deg));
            }
          }
          
          @keyframes float-medium {
            0%, 100% {
              transform: translate(0, 0) rotate(var(--rotation, 0deg));
            }
            50% {
              transform: translate(calc(var(--direction, 1) * ${30 * factor}px), -${20 * factor}px) rotate(calc(var(--rotation, 0deg) - ${3 * factor}deg));
            }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingBackground;
