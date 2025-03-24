
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowRight, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

interface PortfolioPreviewProps {
  workExamples: string[];
  creatorName: string;
  onPreviewClick?: (imageSrc: string) => void;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ 
  workExamples,
  creatorName,
  onPreviewClick
}) => {
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const displayExamples = workExamples.slice(0, 3);

  // Always show 3 examples, adding placeholders if needed
  const ensuredExamples = [
    displayExamples[0] || '/placeholder.svg',
    displayExamples[1] || '/placeholder.svg',
    displayExamples[2] || '/placeholder.svg'
  ];

  return (
    <>
      <div>
        {/* Enhanced section header with gradient accent */}
        <div className="flex items-center mb-2">
          <div className="w-0.5 h-3.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-1.5"></div>
          <span className="text-xs text-gray-600 font-medium tracking-wide">{isMobile ? 'RECENT WORK' : 'RECENT WORK'}</span>
          <span className="ml-auto text-[10px] text-purple-400/80 font-medium">View All →</span>
        </div>

        {isMobile ? (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {ensuredExamples.map((example, index) => (
              <div 
                key={index}
                className={cn(
                  "relative rounded-md overflow-hidden group",
                  "border border-[rgba(118,51,220,0.15)]",
                  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.03)] aspect-square", // Fixed aspect ratio with internal shadows
                  "bg-gray-50"
                )}
              >
                <img 
                  src={example}
                  alt={`${creatorName}'s property photography - portfolio example ${index + 1}${index === 0 ? ' featuring real estate interior' : index === 1 ? ' showcasing property exterior' : ' highlighting architectural details'}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
                {/* Simple hover overlay without expand icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 mt-2">
            {ensuredExamples.map((example, index) => (
              <div 
                key={index}
                className={cn(
                  "relative rounded-md overflow-hidden group",
                  "border border-[rgba(118,51,220,0.15)]",
                  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.03)]",
                  "aspect-square", 
                  "bg-gray-50"
                )}
              >
                <img 
                  src={example}
                  alt={`${creatorName}'s property photography - portfolio example ${index + 1}${index === 0 ? ' featuring real estate interior' : index === 1 ? ' showcasing property exterior' : ' highlighting architectural details'}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
                {/* Simple hover overlay without expand icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Dialog for image preview - currently disabled */}
      <Dialog open={false}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-5xl">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <button className="absolute top-2 right-2 z-50 p-2 bg-black/50 rounded-full">
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="object-contain w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
