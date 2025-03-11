
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface SwipeInstructionProps {
  visible: boolean;
}

export const SwipeInstruction: React.FC<SwipeInstructionProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm rounded-2xl"
    >
      <div className="bg-white px-6 py-5 rounded-xl shadow-xl text-center max-w-[250px]">
        <div className="flex justify-center mb-4">
          <ArrowLeftRight className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
        <p className="text-gray-800 font-medium">Swipe left or right to navigate between steps</p>
        <p className="text-gray-500 text-sm mt-1">Tap anywhere to dismiss</p>
      </div>
    </motion.div>
  );
};

export default SwipeInstruction;
