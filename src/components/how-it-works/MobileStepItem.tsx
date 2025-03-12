
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Step } from './stepsUtils';

interface MobileStepItemProps {
  step: Step;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const MobileStepItem: React.FC<MobileStepItemProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}) => {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          duration: 0.6,
          delay: index * 0.15
        }
      }} 
      animate={{
        scale: isActive ? 1.03 : 1,
        boxShadow: isActive 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" 
          : "0 2px 4px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.05)",
        borderColor: isActive ? "rgb(124, 58, 237)" : "",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      whileTap={{
        scale: 1.02,
        transition: {
          duration: 0.2
        }
      }} 
      viewport={{
        once: true,
        margin: "-30px"
      }} 
      onClick={onClick}
      className={cn(
        // Apply gradients instead of white background
        "relative",
        index % 2 === 0 
          ? "bg-gradient-to-r from-purple-50 to-indigo-50/50" 
          : "bg-gradient-to-r from-indigo-50/50 to-purple-50/30",
        "w-full max-w-[327px] min-h-[100px]",
        "p-4",
        "rounded-lg", 
        "shadow-md", 
        "border border-purple-100/60", 
        (step.iconText ? "" : "border-l-[3px]"),
        "touch-manipulation", 
        "mx-auto", 
        "transition-all duration-200", 
        isActive 
          ? "border-violet-500 bg-gradient-to-br from-violet-100/70 to-indigo-100/70 shadow-lg" 
          : "",
        "cursor-pointer"
      )}
    >
      <div className="flex items-start">
        {/* Left side: Number circle with integrated icon */}
        <div className="relative mr-3">
          <div className={cn(
            "w-8 h-8",
            // Fixed styling: Use the correct color based on step index
            index === 0 ? "bg-violet-600" : 
            index === 1 ? "bg-blue-500" : 
            index === 2 ? "bg-amber-600" : 
            index === 3 ? "bg-emerald-600" : 
            "bg-gray-500", 
            "text-white", 
            "rounded-full", 
            "flex items-center justify-center", 
            "text-sm font-medium", 
            "shadow-sm", 
            "relative", 
            "mt-[2px]" // Align with first line of title
          )}>
            <span className="flex items-center justify-center w-full h-full">
              {index + 1}
            </span>
            
            {/* Completed checkmark */}
            {isCompleted && (
              <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-sm">
                <Check className="w-3 h-3 text-green-500" />
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Title with icon next to it */}
          <div className="flex items-center">
            <h4 className="text-[16px] font-semibold text-gray-900">
              {step.title}
            </h4>
            <div className={cn(
              "ml-2",
              step.iconText || "text-gray-500"
            )}>
              {step.icon}
            </div>
          </div>
          
          {/* Description with reduced spacing */}
          <p className="text-[14px] text-gray-600 leading-[1.4] mt-1">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
