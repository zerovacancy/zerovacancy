
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowRight, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

interface PortfolioPreviewProps {
  workExamples: string[];
  creatorName: string;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ 
  workExamples,
  creatorName
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
        </div>

        {isMobile ? (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {ensuredExamples.map((example, index) => (
              <div 
                key={index}
                className={cn(
                  "relative rounded-md overflow-hidden cursor-pointer group",
                  "border border-gray-100",
                  "shadow-sm aspect-square",
                  "bg-gray-50"
                )}
                onClick={() => setSelectedImage(example)}
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
                {/* Hover overlay for work examples */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 mt-2">
            {ensuredExamples.map((example, index) => (
              <div 
                key={index}
                className={cn(
                  "relative rounded-md overflow-hidden cursor-pointer group",
                  "border border-gray-100",
                  "shadow-sm hover:shadow-md transition-shadow duration-200",
                  "aspect-square", 
                  "bg-gray-50"
                )}
                onClick={() => setSelectedImage(example)}
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
                {/* Enhanced hover overlay with view icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced dialog for image preview */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[80vw] p-0 bg-transparent border-0">
          <DialogTitle className="sr-only">{`${creatorName}'s Portfolio Image`}</DialogTitle>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={`${creatorName}'s property photography - enlarged portfolio view showing detailed real estate photography`}
              className="w-full h-full object-contain rounded-lg"
              style={{ maxHeight: '80vh' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
