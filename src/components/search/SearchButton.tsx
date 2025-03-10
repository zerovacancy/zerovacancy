
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchButton = () => {
  return (
    <div className="hidden sm:block sm:w-[20%]">
      <button 
        className={cn(
          "w-full h-12 sm:h-13", // Slightly larger
          // Simple background on mobile, gradient on desktop
          "bg-indigo-600 sm:bg-gradient-to-r sm:from-indigo-600 sm:to-purple-600 hover:bg-indigo-700 sm:hover:from-indigo-700 sm:hover:to-purple-700 text-white",
          // Simplified shadow on mobile
          "shadow-md sm:hover:shadow-lg transition-all duration-300",
          "text-sm rounded-r-lg",
          "flex items-center justify-center gap-2.5", // Increased gap
          "font-medium",
          // Only show overflow effects on desktop
          "sm:relative sm:overflow-hidden overflow-hidden",
          // Disable scaling effect on mobile
          "sm:group sm:hover:scale-[1.01]" // Subtle scale on hover
        )}
      >
        {/* Animated background only on desktop */}
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] opacity-0 sm:group-hover:opacity-100 sm:group-hover:[transform:translateX(100%)] hidden sm:block transition-all duration-1000 ease-in-out"></div>
        
        <Search className="w-5 h-5 sm:group-hover:scale-110 sm:transition-transform sm:duration-200" />
        <span className="sm:group-hover:translate-x-1 sm:transition-all sm:duration-200">Search</span>
      </button>
    </div>
  );
};
