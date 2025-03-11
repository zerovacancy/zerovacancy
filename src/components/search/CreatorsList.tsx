import React from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { getDefaultCreators } from './creators-data'; // Assuming you have this or similar

export const CreatorsList: React.FC = () => {
  const isMobile = useIsMobile();
  const creators = getDefaultCreators(); // Replace with your actual creators data source

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {creators.map((creator, index) => (
        <CreatorCard 
          key={index}
          creator={creator}
          onImageLoad={() => {}}
          loadedImages={new Set()}
          imageRef={() => {}}
        />
      ))}
    </div>
  );
};