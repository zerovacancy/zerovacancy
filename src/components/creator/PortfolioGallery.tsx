
import React from 'react';
import { Image } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cn } from '@/lib/utils';

interface PortfolioGalleryProps {
  images: string[];
  creatorName: string;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  isMobile: boolean;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  images,
  creatorName,
  loadedImages,
  imageRef,
  isMobile
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image, i) => (
        <Dialog key={i}>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg group will-change-transform">
            <img 
              ref={imageRef}
              src={loadedImages.has(image) ? image : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
              data-src={image}
              alt={`${creatorName}'s work ${i + 1}`} 
              className={cn(
                "object-cover w-full h-full transform transition-all duration-300",
                !loadedImages.has(image) && "opacity-0"
              )}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Image preview disabled */}
        </Dialog>
      ))}
    </div>
  );
};
