
import React from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const ContentTypeSelect = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "w-full relative group",
      isMobile && "border-b border-gray-100" // Lighter border
    )}>
      <Camera className={cn(
        "w-4 h-4 text-indigo-500/70 absolute left-3 top-1/2 -translate-y-1/2", // Adjusted icon size
        "transition-all duration-200",
        "group-hover:text-indigo-600"
      )} />
      <ChevronDown className={cn(
        "w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2", // Smaller icon with adjusted position
        "transition-all duration-300",
        "group-hover:text-gray-600 group-hover:transform group-hover:translate-y-[1px]"
      )} />
      <select
        className={cn(
          "w-full h-12 pl-10 pr-8 appearance-none", // Standardized height and padding
          "bg-white text-sm text-gray-700", // Standardized text size
          "transition-colors duration-200",
          "focus:outline-none focus:ring-1 focus:ring-indigo-500/30", // Lighter focus ring
          "group-hover:bg-gray-50/80",
          "font-medium",
          isMobile ? "rounded-t-md rounded-b-none" : "rounded-l-lg", // Correct rounding
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
