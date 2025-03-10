
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const MobileSearchButton: React.FC = () => {
  return (
    <div className="sm:hidden mt-1 mb-1">
      <Button 
        className={cn(
          "w-full h-12",
          // Replace gradient with solid color on mobile
          "bg-indigo-600 sm:bg-gradient-to-r sm:from-indigo-600 sm:to-purple-600 hover:bg-indigo-700 sm:hover:from-indigo-700 sm:hover:to-purple-700 text-white",
          // Simplify shadow on mobile
          "shadow-sm sm:hover:shadow-md transition-all duration-200",
          "text-sm rounded-lg font-medium"
        )}
      >
        <div className="flex items-center justify-center w-full">
          <Search className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>Search Creators</span>
        </div>
      </Button>
    </div>
  );
};
