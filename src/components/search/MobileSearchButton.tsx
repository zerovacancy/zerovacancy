
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sm:hidden mt-2 mb-4">
      <Button 
        className={cn(
          "w-full h-12 min-h-[48px]", // Larger touch target
          // Gradient background for better visual connection with search bar
          "bg-gradient-to-r from-indigo-600 to-brand-purple hover:from-indigo-700 hover:to-brand-purple text-white",
          // Enhanced shadow for better elevation
          "shadow-md shadow-indigo-200/40 hover:shadow-lg hover:shadow-indigo-300/30",
          "text-sm rounded-lg font-medium font-inter",
          // Better haptic feedback
          "active:scale-[0.98] transition-all duration-200"
        )}
        onClick={() => navigate('/search')}
      >
        <div className="flex items-center justify-center w-full">
          <Search className="w-5 h-5 mr-2.5 flex-shrink-0" />
          <span className="text-base">DISCOVER</span>
        </div>
      </Button>
    </div>
  );
};
