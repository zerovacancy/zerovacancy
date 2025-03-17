
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sm:hidden mt-0">
      <Button 
        className={cn(
          "w-full h-10", // Reduced height for better proportions
          "bg-gradient-to-r from-indigo-600 to-brand-purple hover:from-indigo-700 hover:to-brand-purple text-white",
          "shadow-sm", // Lighter shadow
          "text-sm font-medium font-inter",
          "active:scale-[0.98] transition-all duration-200",
          "rounded-b-md rounded-t-none border-0", // Bottom rounded corners only (reduced radius)
          "flex items-center justify-center"
        )}
        onClick={() => navigate('/search')}
      >
        <Search className="w-4 h-4 mr-2 flex-shrink-0" /> {/* Reduced icon size */}
        <span className="text-sm">DISCOVER</span> {/* Reduced text size */}
      </Button>
    </div>
  );
};
