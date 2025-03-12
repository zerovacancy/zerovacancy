
import React from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';

interface DesktopCreatorGridProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
}

export const DesktopCreatorGrid: React.FC<DesktopCreatorGridProps> = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.name}
          creator={creator}
          onImageLoad={onImageLoad}
          loadedImages={loadedImages}
          imageRef={imageRef}
        />
      ))}
    </div>
  );
};
