
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchButton = () => {
  return (
    <div className="hidden sm:block w-auto relative">
      <button
        className={cn(
          "h-12 px-6 sm:px-8 py-3 font-semibold text-white rounded-r-lg",
          "bg-gradient-to-r from-violet-600 to-indigo-600",
          "transition-all duration-300",
          "hover:from-violet-700 hover:to-indigo-700",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
          "shadow-md hover:shadow-lg",
          "flex items-center justify-center text-sm"
        )}
        type="button"
        aria-label="Search creators"
      >
        <Search className="w-4 h-4 mr-2" />
        <span>DISCOVER</span>
      </button>
    </div>
  );
};
