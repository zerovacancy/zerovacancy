import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ResultsHeader } from './ResultsHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultsContainerProps {
  children: ReactNode;
  count: number;
  entityType?: string;
  className?: string;
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({
  children,
  count,
  entityType,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "rounded-xl overflow-hidden shadow-sm border border-gray-100",
      "bg-gray-50/50",
      className
    )}>
      <ResultsHeader count={count} entityType={entityType} />

      <div className="p-3">
        {children}
      </div>

      {/* Pagination dots for mobile */}
      {isMobile && (
        <div className="flex justify-center items-center py-2 pb-3">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      )}
    </div>
  );
};
