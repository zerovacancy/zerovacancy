import React from 'react';
import { ShimmerButton } from './ui/shimmer-button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const CallToActionSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "w-full mx-auto max-w-4xl text-center relative z-10 will-change-transform",
      isMobile ? "px-4 py-8" : "px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20"
    )}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/40 to-white -z-10 opacity-80"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzNFRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS03LTJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptMi0yaDF2MWgtMXYtMXptMiAxMGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10 opacity-40 py-px"></div>
      
      {/* Heading with vertical layout on mobile */}
      <div className={cn(
        "flex items-center justify-center mb-4 sm:mb-6", 
        isMobile && "flex-col"
      )}>
        <TrendingUp className={cn(
          "text-brand-purple animate-float-subtle",
          isMobile ? "w-5 h-5 mb-2" : "w-6 h-6 mr-2"
        )} />
        
        {isMobile ? (
          // Mobile version: vertical stack layout
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta tracking-tight">
              ELEVATE YOUR REAL ESTATE MARKETING
            </h2>
            <span className="bg-gradient-to-r from-brand-purple-dark to-brand-purple bg-clip-text text-transparent font-extrabold text-2xl mt-1">
              TODAY
            </span>
          </div>
        ) : (
          // Desktop version: original inline-flex layout
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-jakarta tracking-tight">
              ELEVATE YOUR REAL ESTATE MARKETING
            </h2>
            <span className="bg-gradient-to-r from-brand-purple-dark to-brand-purple mt-2 bg-clip-text text-transparent font-extrabold text-2xl sm:text-3xl md:text-4xl">
              TODAY
            </span>
          </div>
        )}
      </div>
      
      {/* Decorative element under the heading */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 animate-pulse-subtle" />
      
      <p className={cn(
        "max-w-2xl mx-auto text-gray-600 font-inter mb-8 leading-relaxed",
        isMobile ? "text-sm mb-6" : "text-sm sm:text-base md:text-lg sm:mb-9"
      )}>
        Join thousands of property managers and content creators who trust Luxe Content Connect for their marketing needs
      </p>
      
      <div className={cn(
        "flex gap-5 justify-center items-center mt-2",
        isMobile ? "flex-col" : "flex-col sm:flex-row sm:gap-6"
      )}>
        <ShimmerButton 
          variant="primary" 
          className={cn(
            "touch-manipulation transition-all duration-300 hover:scale-105 font-semibold",
            isMobile ? "w-full h-12 text-sm" : "w-full sm:w-auto min-w-[200px] h-[52px] text-base"
          )}
        >
          <span>Join Waitlist</span>
          <ArrowRight className={cn(
            "text-white/90",
            isMobile ? "w-4 h-4 ml-1.5" : "w-5 h-5 sm:w-6 sm:h-6 ml-2"
          )} />
        </ShimmerButton>
        
        <ShimmerButton 
          variant="secondary" 
          className={cn(
            "touch-manipulation font-semibold bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 transition-all duration-300",
            isMobile ? "w-full h-11 text-sm" : "w-full sm:w-auto min-w-[180px] h-[52px] text-base"
          )}
        >
          <span>Learn More</span>
        </ShimmerButton>
      </div>
      
      {/* Added extra bottom padding on mobile */}
      <div className={`${isMobile ? 'h-8' : 'h-0'}`}></div>
    </div>
  );
};

export default CallToActionSection;
