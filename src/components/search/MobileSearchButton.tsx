
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sm:hidden w-full px-0">
      <Button 
        className={cn(
          "w-full h-9", // Reduced height for better proportions
          "bg-gradient-to-r from-indigo-600 to-brand-purple hover:from-indigo-700 hover:to-brand-purple text-white",
          "shadow-sm", // Lighter shadow
          "text-sm font-medium font-inter",
          "active:scale-[0.98] transition-all duration-200",
          "rounded-b-md rounded-t-none border-0", // Remove borders completely
          "flex items-center justify-center"
        )}
        onClick={() => navigate('/search')}
      >
        <Search className="w-3.5 h-3.5 mr-2 flex-shrink-0" /> {/* Reduced icon size */}
        <span className="text-xs">DISCOVER</span> {/* Reduced text size */}
      </Button>
    </div>
  );
};
