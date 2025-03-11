import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SwipeInstruction: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm rounded-2xl">
      <div className="bg-white px-6 py-5 rounded-xl shadow-xl text-center max-w-[250px] animate-fade-in">
        <div className="flex justify-center gap-6 mb-4">
          <ArrowLeft className="w-6 h-6 text-indigo-600 animate-bounce-x-reverse" />
          <ArrowRight className="w-6 h-6 text-indigo-600 animate-bounce-x" />
        </div>
        <p className="text-gray-800 font-medium">Swipe left or right to navigate between steps</p>
        <p className="text-gray-500 text-sm mt-1">Tap anywhere to dismiss</p>
      </div>
    </div>
  );
};

export default SwipeInstruction;
