import React from 'react';
import { DollarSign, Star, ChevronDown, Users, Palette, Map, Compass, SlidersHorizontal } from 'lucide-react';
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
    <div className={isMobile ? "mt-2 mb-0" : ""}>
      <div className={cn(
        isMobile 
          ? "flex items-center justify-start px-0.5 py-0"
          : "flex items-center justify-between px-0.5 py-1"
      )}>
        {isMobile ? (
          <button
            onClick={onToggleFilters}
            className={cn(
              "inline-flex items-center gap-1",
              "justify-center px-2 py-0",
              "text-xs font-medium font-inter",
              "text-gray-600", 
              "bg-gray-50 hover:bg-gray-100",
              "rounded-md shadow-sm",
              "transition-all duration-200",
              "border border-gray-200",
              "hover:text-gray-800 active:bg-gray-100",
              "h-6",
              "ml-0.5"
            )}
          >
            <SlidersHorizontal className="w-2.5 h-2.5 mr-1 text-gray-500" />
            <span className="font-medium">Filters</span>
            <ChevronDown className={cn(
              "w-2.5 h-2.5 ml-0.5",
              "text-gray-500",
              "transition-transform duration-300",
              showMoreFilters ? "rotate-180" : ""
            )} />
          </button>
        ) : (
          <button
            onClick={onToggleFilters}
            className={cn(
              "inline-flex items-center gap-1.5", 
              "px-3 py-2 -ml-1",
              "text-sm font-medium",
              "text-gray-700 hover:text-gray-900", 
              "hover:bg-gray-50 rounded-md",
              "transition-colors duration-200",
              "border border-transparent hover:border-gray-200/70",
              "min-h-[40px]"
            )}
          >
            Advanced Filters
            <ChevronDown className={cn(
              "w-4 h-4",
              "text-gray-500",
              "transition-transform duration-300",
              showMoreFilters ? "rotate-180" : ""
            )} />
          </button>
        )}
      </div>

      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-300",
        showMoreFilters 
          ? "opacity-100 h-auto max-h-[450px] mt-1"
          : "opacity-0 h-0 max-h-0 mt-0 overflow-hidden"
      )}>
        <div className="relative group">
          <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Investment range</option>
            <option value="0-100">$0 - $299</option>
            <option value="100-300">$299 - $499</option>
            <option value="300-500">$499 - $799</option>
            <option value="500+">$799+</option>
          </select>
        </div>

        <div className="relative group">
          <Users className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Creative availability</option>
            <option value="immediate">Immediate</option>
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="custom">Custom dates</option>
          </select>
        </div>

        <div className="relative group">
          <Star className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Vision alignment</option>
            <option value="residential">Residential focused</option>
            <option value="commercial">Commercial focused</option>
            <option value="luxury">Luxury specialized</option>
            <option value="multi-use">Multi-use properties</option>
          </select>
        </div>

        <div className="relative group">
          <Map className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Spatial storytelling approach</option>
            <option value="room-by-room">Room-by-room narrative</option>
            <option value="lifestyle">Lifestyle-focused</option>
            <option value="architectural">Architectural emphasis</option>
            <option value="contextual">Contextual/neighborhood</option>
          </select>
        </div>

        <div className="relative group">
          <Palette className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Aesthetic direction</option>
            <option value="minimalist">Minimalist</option>
            <option value="warm">Warm & inviting</option>
            <option value="bold">Bold & dramatic</option>
            <option value="modern">Modern & sleek</option>
            <option value="traditional">Traditional & timeless</option>
          </select>
        </div>

        <div className="relative group">
          <Compass className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none",
              "border border-gray-200 bg-white",
              "text-sm text-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/10",
              "group-hover:bg-gray-50"
            )}
          >
            <option value="">Visual narrative style</option>
            <option value="documentary">Documentary/authentic</option>
            <option value="cinematic">Cinematic/dramatic</option>
            <option value="editorial">Editorial/magazine style</option>
            <option value="conceptual">Conceptual/artistic</option>
            <option value="commercial">Commercial/polished</option>
          </select>
        </div>
      </div>
    </div>
  );
};
