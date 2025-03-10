
import React from 'react';
  import { Button } from '@/components/ui/button';
  import { useIsMobile } from '@/hooks/use-mobile';
  import { cn } from '@/lib/utils';
  import { Border } from '@/components/ui/border-trail';
  import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
  import { motion } from 'framer-motion';

  export const Hero = () => {
    const isMobile = useIsMobile();

    return (
      <div className="relative overflow-hidden">
        {/* Enhanced mobile spacing with more generous padding */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text content section with improved spacing and sizing */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Larger headline text on mobile */}
                <h1 className={cn(
                  "font-bold leading-tight tracking-tight text-gray-900",
                  isMobile ? "text-4xl mb-6" : "text-4xl sm:text-5xl lg:text-6xl mb-4"
                )}>
                  Find <span className="text-indigo-600">talented creators</span> for your real estate content
                </h1>

                {/* Enhanced subtitle with better spacing and size */}
                <p className={cn(
                  "text-gray-600 mx-auto lg:mx-0 max-w-2xl",
                  isMobile ? "text-xl mb-8 leading-relaxed" : "text-lg sm:text-xl mb-6 leading-relaxed"
                )}>
                  Connect with photographers, videographers, and content creators who specialize in showcasing
  properties at their best.
                </p>

                {/* Improved CTA section with larger buttons on mobile */}
                <div className={cn(
                  "flex gap-4",
                  isMobile ? "flex-col mb-10" : "flex-row flex-wrap mb-6"
                )}>
                  <Button 
                    size={isMobile ? "xl" : "lg"}
                    className={cn(
                      "bg-indigo-600 hover:bg-indigo-700 text-white font-medium",
                      "shadow-lg hover:shadow-indigo-500/30 transition-all",
                      isMobile ? "w-full py-6 text-lg" : "px-6"
                    )}
                  >
                    Find Creators
                  </Button>
                  <Button 
                    variant="outline"
                    size={isMobile ? "xl" : "lg"}
                    className={cn(
                      "border-indigo-200 hover:border-indigo-300 text-indigo-700 font-medium",
                      isMobile ? "w-full py-6 text-lg" : "px-6"
                    )}
                  >
                    Learn More
                  </Button>
                </div>

                {/* Enhanced trust indicators with better spacing */}
                <div className={cn(
                  "flex flex-col gap-3",
                  isMobile ? "mt-8" : "mt-6"
                )}>
                  <p className="text-sm font-medium text-gray-500">Trusted by real estate professionals across
  the country</p>
                  <div className="flex justify-center lg:justify-start items-center gap-6">
                    {/* Logos would go here - made more prominent on mobile */}
                    <div className="h-7 sm:h-8 opacity-70 hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced image section */}
            <div className={cn(
              "flex-1 relative",
              isMobile ? "w-full max-w-full mt-4" : "w-full max-w-xl"
            )}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Larger image on mobile with enhanced border effect */}
                <div className={cn(
                  "rounded-2xl overflow-hidden shadow-2xl",
                  isMobile ? "mx-auto" : ""
                )}>
                  <Border className="p-1 rounded-2xl">
                    <img 
                      src="/public/1-d2e3f802.jpg" 
                      alt="Real estate photography" 
                      className="w-full h-auto rounded-xl object-cover"
                    />
                  </Border>
                </div>

                {/* Enhanced decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full blur-2xl 
  opacity-80"></div>
                <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full blur-2xl 
  opacity-80"></div>
              </motion.div>

              {/* Mobile-optimized floating elements with better positioning */}
              {!isMobile && (
                <>
                  <div className="absolute top-10 -right-8 bg-white p-3 rounded-lg shadow-lg">
                    <AnimatedShinyText className="text-sm font-medium">Premium quality
  content</AnimatedShinyText>
                  </div>
                  <div className="absolute -bottom-4 -left-8 bg-white p-3 rounded-lg shadow-lg">
                    <AnimatedShinyText className="text-sm font-medium">Fast turnaround times</AnimatedShinyText>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Hero;
