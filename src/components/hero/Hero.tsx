// src/components/hero/Hero.tsx
// Complete replacement file with mobile optimizations

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { GlowingEffects } from '@/components/ui/glowing-effects';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const Hero = () => {
  const isMobile = useIsMobile();
  
  // Simplified mobile version with minimal animations and effects
  if (isMobile) {
    return (
      <div className="px-4 pt-6 pb-10 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Transform Your Property Marketing
            </h1>
            
            <p className="text-base text-gray-600 max-w-md mx-auto">
              Connect with creative professionals who turn your spaces into visual stories that captivate and convert.
            </p>
            
            <div className="pt-4">
              <a 
                href="#find-creators" 
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-purple-600 text-white text-sm font-medium shadow-sm hover:bg-purple-700"
              >
                Find Your Creative Match
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <img 
              src="/hero-image-mobile.jpg" 
              alt="Property photography showcase" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Full desktop version with animations
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 overflow-hidden relative">
      <GlowingEffects 
        variant="hero" 
        strength="strong" 
        className="absolute inset-0 z-0" 
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            Transform Your Property Marketing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            Connect with creative professionals who turn your spaces into visual stories that captivate and convert.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-4 sm:pt-6"
          >
            <ShimmerButton 
              size="lg" 
              className={cn(
                "bg-purple-600 hover:bg-purple-700 text-white shadow-xl",
                "group transition-all duration-300",
                "py-3 px-8 text-base font-medium"
              )}
              as="a"
              href="#find-creators"
            >
              Find Your Creative Match
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </ShimmerButton>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 blur-lg rounded-xl"></div>
            <img 
              src="/hero-image.jpg" 
              alt="Property photography showcase" 
              className="w-full h-auto relative rounded-xl shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
