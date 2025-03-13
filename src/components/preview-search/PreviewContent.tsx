
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
      {/* Simplified structure for mobile */}
      <div className={cn(
        isMobile ? "bg-transparent" : "bg-gray-50/60 border border-gray-100 rounded-lg overflow-hidden shadow-sm p-6 px-6"
      )}>
        {/* Search bar component */}
        <div className={isMobile ? "mb-3" : "mb-4"}>
          <SearchBar 
            value={location}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Creator cards list - direct embedding */}
        <CreatorsList />
      </div>
    </div>
  );
};
