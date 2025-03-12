
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
      "rounded-xl overflow-hidden shadow-sm border border-purple-100/80",
      "bg-white/90 backdrop-blur-sm",
      !isMobile && "shadow-[0_4px_24px_rgba(138,79,255,0.08)]",
      className
    )}>
      <ResultsHeader count={count} entityType={entityType} />

      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
