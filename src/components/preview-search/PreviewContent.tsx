
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchBar } from '../search/SearchBar';
import { ContentTypeSelect } from '../search/ContentTypeSelect';
import { CreatorsList } from '../search/CreatorsList';
import { SearchFilters } from '../search/SearchFilters';

// Define the component's props interface - it doesn't accept any props now
export const PreviewContent: React.FC = () => {
  const isMobile = useIsMobile();
  
  // State for SearchBar and SearchFilters
  const [location, setLocation] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };

  // Sample creators count - in production, this would come from search results
  const creatorsCount = 3;

  return (
    <div className="w-full">
      {/* Search container with updated styling */}
      <div className={cn(
        "bg-gray-50/60 border border-gray-100 rounded-lg overflow-hidden shadow-sm",
        isMobile ? "p-4" : "p-6"
      )}>
        {/* Search bar component */}
        <div className="mb-4">
          <SearchBar 
            value={location}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Show filters only on desktop */}
        {!isMobile && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <ContentTypeSelect />
              <SearchFilters 
                showMoreFilters={showMoreFilters}
                onToggleFilters={() => setShowMoreFilters(!showMoreFilters)}
              />
            </div>
          </div>
        )}

        {/* Creator cards list */}
        <div className="pt-3">
          <CreatorsList />
        </div>

        {/* Pagination indicator for mobile */}
        {isMobile && (
          <div className="flex justify-center items-center pt-2 pb-1 mt-2">
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
