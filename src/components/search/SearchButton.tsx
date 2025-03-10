
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchButton = () => {
  return (
    <div className="hidden sm:block sm:w-[20%]">
      <button 
        className={cn(
          "w-full h-12 sm:h-13", // Slightly larger
          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
          "shadow-md hover:shadow-lg transition-all duration-300",
          "text-sm rounded-r-lg",
          "flex items-center justify-center gap-2.5", // Increased gap
          "font-medium",
          "relative overflow-hidden",
          "group hover:scale-[1.01]" // Subtle scale on hover
        )}
      >
        {/* Enhanced animated background glow effect on hover */}
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 group-hover:[transform:translateX(100%)] transition-all duration-1000 ease-in-out"></div>
        
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="group-hover:translate-x-1 transition-all duration-200">Search</span>
      </button>
    </div>
  );
};
