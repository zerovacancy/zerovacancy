
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileSearchButton = () => {
  const isMobile = useIsMobile();
  
  // Only display on mobile devices
  if (!isMobile) return null;
  
  return (
    <button
      className={cn(
        "w-full h-12 sm:h-12 px-6 py-3 font-semibold text-white rounded-lg",
        "bg-gradient-to-r from-violet-600 to-indigo-600",
        "transition-all duration-300",
        "hover:from-violet-700 hover:to-indigo-700",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
        "shadow-md hover:shadow-lg",
        "flex items-center justify-center text-sm sm:text-base",
        "mt-3"
      )}
      type="button"
      aria-label="Search creators"
    >
      <Search className="w-4 h-4 mr-2" />
      <span>DISCOVER</span>
    </button>
  );
};
