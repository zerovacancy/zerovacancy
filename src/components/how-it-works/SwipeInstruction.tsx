
import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeInstructionProps {
  visible?: boolean;
}

const SwipeInstruction: React.FC<SwipeInstructionProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <div className={cn(
      "absolute inset-0 z-50 flex items-center justify-center",
      "bg-black/20 backdrop-blur-sm rounded-xl",
      "animate-in fade-in duration-500"
    )}>
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <ArrowLeftRight className="w-6 h-6 text-blue-500" />
        <span className="text-sm font-medium">Swipe to explore steps</span>
      </div>
    </div>
  );
};

export default SwipeInstruction;
