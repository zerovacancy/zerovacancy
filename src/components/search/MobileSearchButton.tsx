
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sm:hidden w-full">
      <Button 
        className={cn(
          "w-full h-12", // Standardized height 
          "bg-gradient-to-r from-indigo-600 to-brand-purple hover:from-indigo-700 hover:to-brand-purple text-white",
          "shadow-sm", // Lighter shadow
          "text-sm font-medium font-inter",
          "active:scale-[0.98] transition-all duration-200",
          "rounded-b-md rounded-t-none", // Remove borders completely
          "border-0", // Explicitly remove borders
          "flex items-center justify-center"
        )}
        onClick={() => navigate('/search')}
      >
        <Search className="w-4 h-4 mr-2 flex-shrink-0" /> {/* Adjusted icon size */}
        <span>DISCOVER</span>
      </Button>
    </div>
  );
};
