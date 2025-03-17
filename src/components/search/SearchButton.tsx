
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchButton: React.FC = () => {
  return (
    <div className="relative hidden sm:flex">
      <button
        className={cn(
          "flex items-center justify-center",
          "bg-gradient-to-r from-indigo-600 to-brand-purple",
          "text-white font-medium",
          "px-5 py-2 rounded-r-lg",
          "h-full min-h-[48px] min-w-[120px]",
          "hover:from-indigo-700 hover:to-brand-purple/90",
          "transition-all duration-300",
          "border-0" // Explicitly remove borders
        )}
      >
        <Search className="w-4 h-4 mr-2" />
        <span>DISCOVER</span>
      </button>
    </div>
  );
};
