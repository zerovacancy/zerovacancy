
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ContentTypeSelect } from './ContentTypeSelect';
import { LocationInput } from './LocationInput';
import { SearchButton } from './SearchButton';
import { SearchFilters } from './SearchFilters';
import { MobileSearchButton } from './MobileSearchButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  value?: string;
  onLocationSelect: (location: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value = '', 
  onLocationSelect 
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="w-full px-0"> {/* Ensure full width */}
      <div className="flex flex-col gap-0 sm:gap-3">
        {/* Desktop & Mobile search container with different styling */}
        <div className={cn(
          "relative flex flex-col sm:flex-row w-full",
          // Desktop styling
          "sm:rounded-xl sm:overflow-hidden sm:shadow-[0_3px_16px_rgba(0,0,0,0.08)] sm:border sm:border-gray-200",
          // Mobile styling - cleaner with subtle shadow and consistent borders
          isMobile ? "shadow-sm rounded-md overflow-hidden border border-gray-100" : "",
          "bg-white sm:divide-y-0 sm:divide-x divide-gray-200",
          "transition-all duration-300",
          "hover:sm:shadow-[0_5px_20px_rgba(0,0,0,0.1)]",
          "sm:pr-0"
        )}>
          {/* Content type select */}
          <ContentTypeSelect />
          
          {/* Location input */}
          <LocationInput value={value} onLocationSelect={onLocationSelect} />
          
          {/* Desktop search button */}
          <SearchButton />
        </div>

        {/* Mobile Search Button - now attached to the search container */}
        <MobileSearchButton />

        {/* Advanced filter section with improved transitions */}
        <div className="w-full pt-1 mt-1"> {/* Ensure full width with consistent spacing */}
          <SearchFilters
            showMoreFilters={showMoreFilters}
            onToggleFilters={() => setShowMoreFilters(!showMoreFilters)}
          />
        </div>
      </div>
    </div>
  );
};
