
import React from 'react';
import { DollarSign, Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  showMoreFilters: boolean;
  onToggleFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  showMoreFilters,
  onToggleFilters,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="flex items-center justify-between px-0.5 py-0.5"> {/* Added small vertical padding */}
        <button
          onClick={onToggleFilters}
          className={cn(
            "inline-flex items-center gap-1.5",
            isMobile ? "px-4 py-2.5" : "px-3 py-1.5", // Increased touch target for mobile
            "-ml-1",
            "text-sm font-medium",
            "text-gray-700 hover:text-gray-900",
            "hover:bg-gray-50 rounded-md",
            "transition-colors duration-200",
            "border border-transparent hover:border-gray-200/70",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          )}
          aria-expanded={showMoreFilters}
          aria-controls="advanced-filters"
        >
          Advanced Filters
          <ChevronDown className={cn(
            isMobile ? "w-4 h-4" : "w-3.5 h-3.5", // Slightly larger icon on mobile
            "text-gray-500",
            showMoreFilters ? "rotate-180" : ""
          )} 
          aria-hidden="true" />
        </button>
      </div>

      <div 
        id="advanced-filters"
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 mt-1",
          showMoreFilters ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
        )}
        aria-hidden={!showMoreFilters}
      >
        {/* Budget Filter */}
        <div className="relative group">
          <DollarSign className={cn(
            isMobile ? "w-5 h-5" : "w-4 h-4", // Larger icon for mobile
            "text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          )} aria-hidden="true" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <select
            className={cn(
              "w-full h-11 px-11 rounded-lg appearance-none", // Increased height
              isMobile && "h-12 text-base", // Even taller on mobile with larger text
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
            aria-label="Select budget range"
          >
            <option value="">Select your budget range</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-300">$100 - $300</option>
            <option value="300-500">$300 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="relative group">
          <Star className={cn(
            isMobile ? "w-5 h-5" : "w-4 h-4", // Larger icon for mobile
            "text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          )} aria-hidden="true" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <select
            className={cn(
              "w-full h-11 px-11 rounded-lg appearance-none", // Increased height
              isMobile && "h-12 text-base", // Even taller on mobile with larger text
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
            aria-label="Select minimum rating"
          >
            <option value="">Minimum Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
          </select>
        </div>
      </div>
    </>
  );
};
