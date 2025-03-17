
import React from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const ContentTypeSelect = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "w-full sm:w-[40%] relative group",
      isMobile && "border-b border-gray-100" // Lighter border
    )}>
      <Camera className={cn(
        "w-3.5 h-3.5 text-indigo-500/70 absolute left-3 top-1/2 -translate-y-1/2", // Smaller icon with adjusted position
        "transition-all duration-200",
        "group-hover:text-indigo-600"
      )} />
      <ChevronDown className={cn(
        "w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2", // Smaller icon with adjusted position
        "transition-all duration-300",
        "group-hover:text-gray-600 group-hover:transform group-hover:translate-y-[1px]",
        "animate-pulse-subtle" // Add subtle animation
      )} />
      <select
        className={cn(
          "w-full h-10 sm:h-12 pl-9 pr-8 appearance-none", // Reduced height and padding for mobile
          "bg-white text-xs sm:text-sm text-gray-700", // Smaller text on mobile
          "transition-colors duration-200",
          "focus:outline-none focus:ring-1 focus:ring-indigo-500/30", // Lighter focus ring
          "group-hover:bg-gray-50/80",
          "font-medium",
          isMobile ? "rounded-t-md rounded-b-none" : "rounded-l-lg", // Smaller radius on mobile
          "border-0",
          "placeholder:text-gray-500"
        )}
      >
        <option value="">{isMobile ? "Photography, Video, etc." : "Select content type"}</option>
        <option value="professional-photography">Professional Photography</option>
        <option value="virtual-tours">Virtual Tours (360° POV)</option>
        <option value="drone-video">Drone Video Tours</option>
        <option value="property-highlight">Property Highlight Videos</option>
        <option value="social-media">Social Media Content Package</option>
      </select>
    </div>
  );
};
