
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

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
        <div className="flex items-center mb-1.5">
          <div className="w-0.5 h-3 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-1.5"></div>
          <span className="text-xs text-gray-500 font-medium">RECENT WORK</span>
        </div>

        <div className="flex space-x-1.5">
          {ensuredExamples.map((example, index) => (
            <div 
              key={index}
              className={cn(
                "relative rounded-md overflow-hidden cursor-pointer",
                "border border-gray-100",
                "shadow-sm hover:shadow-md transition-shadow duration-200",
                isMobile 
                  ? "h-[120px] w-[120px]" // Fixed square dimensions for mobile
                  : "h-[160px] w-[160px]", // Fixed square dimensions for desktop
                "bg-gray-50"
              )}
              onClick={() => setSelectedImage(example)}
            >
              <img 
                src={example}
                alt={`${creatorName}'s work example ${index + 1}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                style={{
                  aspectRatio: '1 / 1', // Force square aspect ratio
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-1">
          <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium">
            <span>View Portfolio</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[80vw] p-0 bg-transparent border-0">
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
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              style={{ maxHeight: '80vh' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

