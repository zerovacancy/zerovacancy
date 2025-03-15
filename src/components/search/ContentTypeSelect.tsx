
import React from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const ContentTypeSelect = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full sm:w-[40%] relative group">
      <Camera className={cn(
        "w-4 h-4 text-indigo-500/70 absolute left-4 top-1/2 -translate-y-1/2",
        "transition-all duration-200",
        "group-hover:text-indigo-600"
      )} />
      <ChevronDown className={cn(
        "w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2",
        "transition-all duration-300",
        "group-hover:text-gray-600 group-hover:transform group-hover:translate-y-[1px]",
        "animate-pulse-subtle" // Add subtle animation
      )} />
      <select
        className={cn(
          "w-full h-12 sm:h-12 pl-11 pr-10 appearance-none", // Increased height for mobile
          "bg-white text-sm text-gray-700",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
          "group-hover:bg-gray-50/80",
          "font-medium rounded-l-lg",
          "border-0",
          isMobile && "shadow-sm",
          "placeholder:text-gray-500" // Increased contrast for placeholder
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
