
import React from 'react';
import { DollarSign, Star, ChevronDown, Users, Palette, Map, Compass } from 'lucide-react';
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
      <div className={cn(
        isMobile 
          ? "flex items-center justify-center px-0.5 py-2 mt-1" 
          : "flex items-center justify-between px-0.5 py-1"
      )}>
        <button
          onClick={onToggleFilters}
          className={cn(
            "inline-flex items-center gap-1.5", 
            isMobile ? (
              cn(
                "justify-center px-5 py-2",
                "text-sm font-medium",
                "text-white", 
                "bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md",
                "transition-all duration-200",
                "border border-purple-300/20",
                "shadow-sm",
                "hover:shadow-md active:scale-[0.98]"
              )
            ) : (
              cn(
                "px-3 py-2 -ml-1",
                "text-sm font-medium",
                "text-gray-700 hover:text-gray-900", 
                "hover:bg-gray-50 rounded-md",
                "transition-colors duration-200",
                "border border-transparent hover:border-gray-200/70"
              )
            ),
            "min-h-[40px]" // Minimum touch target height
          )}
        >
          Advanced Filters
          <ChevronDown className={cn(
            "w-4 h-4",
            isMobile ? "text-white/90" : "text-gray-500",
            "transition-transform duration-300", // Smoother transition
            showMoreFilters ? "rotate-180" : ""
          )} />
        </button>
      </div>

      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-300",
        showMoreFilters 
          ? "opacity-100 h-auto max-h-[450px] mt-2" // Added height for more filters
          : "opacity-0 h-0 max-h-0 mt-0 overflow-hidden"
      )}>
        {/* Investment Range Filter */}
        <div className="relative group">
          <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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

        {/* Creative Availability Filter */}
        <div className="relative group">
          <Users className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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

        {/* Vision Alignment Filter */}
        <div className="relative group">
          <Star className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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

        {/* Spatial Storytelling Approach */}
        <div className="relative group">
          <Map className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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

        {/* Aesthetic Direction */}
        <div className="relative group">
          <Palette className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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

        {/* Visual Narrative Style */}
        <div className="relative group">
          <Compass className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
          <select
            className={cn(
              "w-full h-12 px-11 rounded-lg appearance-none", // Increased height for better touch
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
    </>
  );
};
