 import React from 'react';
  import { cn } from '@/lib/utils';
  import { useIsMobile } from '@/hooks/use-mobile';
  import { ArrowRight } from 'lucide-react';

  interface PortfolioPreviewProps {
    workExamples: string[];
    creatorName: string;
  }

  export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ 
    workExamples,
    creatorName
  }) => {
    const isMobile = useIsMobile();
    const displayExamples = workExamples.slice(0, 3);

    return (
      <div className="mt-1 mb-3">
        <div className="flex items-center mb-1.5">
          <div className="w-0.5 h-3 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-1.5"></div>
          <span className="text-xs text-gray-500 font-medium">RECENT WORK</span>
        </div>

        <div className="flex space-x-1.5">
          {displayExamples.map((example, index) => (
            <div 
              key={index}
              className={cn(
                "relative rounded-md overflow-hidden",
                "border border-gray-100",
                "shadow-sm hover:shadow-md transition-shadow duration-200",
                isMobile ? "h-12 w-[calc(33.333%-4px)]" : "h-14 w-[calc(33.333%-4px)]",
                "bg-gray-50"
              )}
            >
              <img 
                src={example} 
                alt={`${creatorName}'s work example ${index + 1}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-1">
          <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors 
  duration-200 font-medium">
            <span>View Portfolio</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };
