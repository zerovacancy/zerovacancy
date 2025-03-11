
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchBar } from '../search/SearchBar';
import { CreatorsList } from '../search/CreatorsList';

// Define the component's props interface - it doesn't accept any props now
export const PreviewContent: React.FC = () => {
  const isMobile = useIsMobile();
  
  // State for SearchBar
  const [location, setLocation] = useState('');

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };

  return (
    <div className="w-full">
      {/* Search container with updated styling and reduced bottom padding for mobile */}
      <div className={cn(
        "bg-gray-50/60 border border-gray-100 rounded-lg overflow-hidden shadow-sm",
        isMobile ? "p-4 pb-1" : "p-6"
      )}>
        {/* Search bar component */}
        <div className="mb-4">
          <SearchBar 
            value={location}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Creator cards list */}
        <div className="pt-3">
          <CreatorsList />
        </div>

        {/* Pagination indicator for mobile with reduced bottom spacing */}
        {isMobile && (
          <div className="flex justify-center items-center pt-1 pb-0 mt-1">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
