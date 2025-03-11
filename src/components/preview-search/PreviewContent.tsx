import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchBar } from '../search/SearchBar';
import { ContentTypeSelect } from '../search/ContentTypeSelect';
import { CreatorsList } from '../search/CreatorsList';
import { SearchFilters } from '../search/SearchFilters';
import { PreviewHeader } from './PreviewHeader';

export const PreviewContent: React.FC = () => {
  const isMobile = useIsMobile();

  // Sample creators count - in production, this would come from search results
  const creatorsCount = 3;

  return (
    <div className="w-full">
      {/* Heading and description moved outside the search container */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Find your creative collaborator
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Browse our curated network of professional content creators, photographers, and videographers.
        </p>
      </div>

      {/* Search container with updated styling */}
      <div className={cn(
        "bg-gray-50/60 border border-gray-100 rounded-lg overflow-hidden shadow-sm",
        isMobile ? "p-4" : "p-6"
      )}>
        {/* Search bar component */}
        <div className="mb-4">
          <SearchBar />
        </div>

        {/* Search filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <ContentTypeSelect />
            <SearchFilters />
          </div>
        </div>

        {/* Results count indicator */}
        <div className="bg-white/80 py-2 px-4 border-b border-gray-100">
          <span className="text-xs sm:text-sm font-medium text-gray-500">
            {creatorsCount} results found
          </span>
        </div>

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