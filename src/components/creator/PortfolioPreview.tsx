
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
        </div>

        {isMobile ? (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {ensuredExamples.map((example, index) => (
              <div 
                key={index}
                className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer group", // Increased border-radius to 8px
                  "border border-purple-100/80",
                  "shadow-sm active:shadow-md", // Enhanced shadow on active state for tactile feedback
                  "aspect-square", // Fixed aspect ratio for consistency
                  "bg-gray-50",
                  "transition-shadow duration-200" // Added transition for shadow change
                )}
                onClick={() => onPreviewClick ? onPreviewClick(example) : setSelectedImage(example)}
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
                {/* Glass morphism hover overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
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
                  "relative rounded-lg overflow-hidden cursor-pointer group", // Increased border-radius to 8px
                  "border border-purple-100/80",
                  "shadow-sm hover:shadow-md transition-all duration-300", // Added transition for shadow
                  "aspect-square", 
                  "bg-gray-50"
                )}
                onClick={() => onPreviewClick ? onPreviewClick(example) : setSelectedImage(example)}
              >
                <img 
                  src={example}
                  alt={`${creatorName}'s property photography - portfolio example ${index + 1}${index === 0 ? ' featuring real estate interior' : index === 1 ? ' showcasing property exterior' : ' highlighting architectural details'}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.04]" // Added scale transform on hover
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
                {/* Enhanced glass morphism hover overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced dialog with glass morphism for image preview */}
      {!onPreviewClick && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="sm:max-w-[80vw] p-0 bg-transparent border-0">
            <DialogTitle className="sr-only">{`${creatorName}'s Portfolio Image`}</DialogTitle>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            {selectedImage && (
              <div className="backdrop-blur-md bg-black/30 p-1 rounded-lg">
                <img
                  src={selectedImage}
                  alt={`${creatorName}'s property photography - enlarged portfolio view showing detailed real estate photography`}
                  className="w-full h-full object-contain rounded-lg"
                  style={{ maxHeight: '80vh' }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
