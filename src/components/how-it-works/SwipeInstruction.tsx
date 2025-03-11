
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeInstructionProps {
  visible: boolean;
}

export const SwipeInstruction: React.FC<SwipeInstructionProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="text-center py-2 text-xs text-gray-500 flex items-center justify-center opacity-60">
      <span className="mr-1">Swipe</span>
      <ChevronLeft size={12} className="mx-1" />
      <span className="mx-1">or</span>
      <ChevronRight size={12} className="mx-1" />
      <span className="ml-1">to navigate steps</span>
    </div>
  );
};
