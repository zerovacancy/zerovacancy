import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface ResultsHeaderProps {
  count: number;
  entityType?: string;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  count, 
  entityType = 'creators' 
}) => {
  return (
    <div 
      className="flex items-center justify-between w-full bg-white/80 backdrop-blur-sm py-2 px-4 border-b border-gray-100 sticky top-0 z-10"
      style={{
        // Fixed height to prevent CLS when sticky header activates
        height: '48px',
        minHeight: '48px',
        // Hardware acceleration to prevent rendering issues during scroll
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Prevent content from affecting layout
        contain: 'layout'
      }}
    >
      <div 
        className="text-sm font-medium text-gray-700"
        style={{
          // Prevent text from causing layout shifts
          minWidth: '100px',
          // Hardware acceleration
          transform: 'translateZ(0)'
        }}
      >
        {count} {entityType} found
      </div>

      <div 
        className="flex items-center gap-3"
        style={{
          // Fixed dimensions to prevent CLS
          height: '32px',
          // Hardware acceleration
          transform: 'translateZ(0)'
        }}
      >
        <button 
          className="flex items-center text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1 bg-white shadow-sm"
          style={{
            // Fixed height to prevent CLS during hover/focus
            height: '24px',
            minHeight: '24px',
            // Hardware acceleration
            transform: 'translateZ(0)',
            // Only transition properties that don't affect layout
            transitionProperty: 'background-color, color, border-color, box-shadow'
          }}
        >
          <span>Sort by: Relevance</span>
          <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
        </button>

        <button 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm"
          style={{
            // Fixed dimensions to prevent CLS
            width: '32px',
            height: '32px',
            // Hardware acceleration
            transform: 'translateZ(0)',
            // Only transition properties that don't affect layout
            transitionProperty: 'background-color, color, border-color, box-shadow'
          }}
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
