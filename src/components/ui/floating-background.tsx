import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const FloatingBackground: React.FC<FloatingBackgroundProps> = ({
  className = '',
  children,
}) => {
  // Define floating element shapes
  const floatingElements = [
    // Larger shapes for desktop
    {
      className: 'hidden md:block absolute w-40 h-24 rounded-xl blur-md bg-gradient-to-br from-purple-200/20 to-indigo-300/20 -top-5 right-[20%] rotate-6',
      style: { animation: 'float-slow 15s infinite ease-in-out' }
    },
    {
      className: 'hidden md:block absolute w-32 h-32 rounded-lg blur-md bg-gradient-to-tr from-indigo-300/20 to-blue-200/20 bottom-20 left-[15%] -rotate-12',
      style: { animation: 'float-medium 18s infinite ease-in-out reverse' }
    },
    {
      className: 'hidden md:block absolute w-48 h-28 rounded-xl blur-md bg-gradient-to-br from-violet-300/20 to-indigo-200/15 top-1/3 -left-10 rotate-12',
      style: { animation: 'float-slow 20s infinite ease-in-out 2s' }
    },
    {
      className: 'hidden md:block absolute w-28 h-28 rounded-lg blur-md bg-gradient-to-bl from-blue-300/10 to-indigo-200/15 top-10 left-[35%] rotate-45',
      style: { animation: 'float-medium 25s infinite ease-in-out 5s' }
    },
    {
      className: 'hidden md:block absolute w-40 h-20 rounded-xl blur-md bg-gradient-to-tr from-indigo-400/15 to-violet-300/10 bottom-10 right-[10%] -rotate-3',
      style: { animation: 'float-slow 22s infinite ease-in-out 1s' }
    },
    
    // Mobile optimized smaller shapes
    {
      className: 'md:hidden absolute w-20 h-12 rounded-lg blur-md bg-gradient-to-br from-purple-200/20 to-indigo-300/20 -top-5 right-[10%] rotate-6',
      style: { animation: 'float-slow 15s infinite ease-in-out' }
    },
    {
      className: 'md:hidden absolute w-16 h-16 rounded-lg blur-md bg-gradient-to-tr from-indigo-300/15 to-blue-200/10 bottom-20 left-[5%] -rotate-12',
      style: { animation: 'float-medium 18s infinite ease-in-out reverse' }
    },
    {
      className: 'md:hidden absolute w-24 h-14 rounded-lg blur-md bg-gradient-to-br from-violet-300/15 to-indigo-200/10 top-1/4 -left-10 rotate-12',
      style: { animation: 'float-slow 20s infinite ease-in-out 2s' }
    }
  ];

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {floatingElements.map((element, index) => (
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
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translate(calc(var(--direction, 1) * 20px), -15px) rotate(calc(var(--rotation, 0deg) + 2deg));
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translate(0, 0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translate(calc(var(--direction, 1) * 30px), -20px) rotate(calc(var(--rotation, 0deg) - 3deg));
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingBackground;