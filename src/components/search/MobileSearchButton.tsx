
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const MobileSearchButton: React.FC = () => {
  return (
    <div className="sm:hidden mt-2 mb-4">
      <Button 
        className={cn(
          "w-full h-12 min-h-[48px]", // Larger touch target
          // Brand colors
          "bg-brand-purple hover:bg-brand-purple/90 text-white",
          // Simplified styling for mobile
          "shadow-sm transition-all duration-200",
          "text-sm rounded-lg font-medium font-inter",
          // Touch optimization
          "touch-manipulation"
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
