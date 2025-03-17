
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sm:hidden mt-0 mb-0">
      <Button 
        className={cn(
          "w-full h-13 min-h-[52px]", // Increased height for better touch target
          "bg-gradient-to-r from-indigo-600 to-brand-purple hover:from-indigo-700 hover:to-brand-purple text-white",
          "shadow-md shadow-indigo-200/40 hover:shadow-lg hover:shadow-indigo-300/30",
          "text-sm font-medium font-inter",
          "active:scale-[0.98] transition-all duration-200",
          "rounded-b-lg rounded-t-none border-0", // Bottom rounded corners only
          "flex items-center justify-center"
        )}
        onClick={() => navigate('/search')}
      >
        <Search className="w-5 h-5 mr-2.5 flex-shrink-0" />
        <span className="text-base">DISCOVER</span>
      </Button>
    </div>
  );
};
