
import React from 'react';
import { motion } from 'framer-motion';
import SmallFeatureCard from './SmallFeatureCard';
import { steps } from './step-data';
import { cn } from '@/lib/utils';

interface MobileStepsGridSimpleProps {
  completedSteps?: number[];
  activeStep?: number;
  onStepInteraction?: (index: number) => void;
}

const MobileStepsGridSimple: React.FC<MobileStepsGridSimpleProps> = ({
  onStepInteraction
}) => {
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="md:hidden w-full px-4 pb-8">
      <motion.div
        className="grid grid-cols-1 gap-5" 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            onClick={() => onStepInteraction && onStepInteraction(index)}
            className="gpu-accelerated" // Hardware acceleration for smooth animations
          >
            <SmallFeatureCard
              icon={step.icon}
              title={step.title}
              description={step.description}
              gradientStyle={step.gradientStyle}
              index={index}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Mobile instruction */}
      <motion.div 
        className="text-center mt-4 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Tap a card to learn more</p>
      </motion.div>
    </div>
  );
};

export default MobileStepsGridSimple;
