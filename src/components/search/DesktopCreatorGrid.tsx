
import React, { useRef, useEffect, useState } from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import type { Creator } from '../creator/types';
import { cn } from '@/lib/utils';
import { useStableViewportHeight } from '@/utils/web-vitals';

interface DesktopCreatorGridProps {
  creators: Creator[];
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
}

export const DesktopCreatorGrid: React.FC<DesktopCreatorGridProps> = ({
  creators,
  onImageLoad,
  loadedImages,
  imageRef,
  onPreviewClick
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { isStabilized } = useStableViewportHeight();
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [itemsPerRow, setItemsPerRow] = useState<number>(3);
  
  // Determine optimal items per row based on container width
  useEffect(() => {
    if (!gridRef.current) return;
    
    const calculateLayout = () => {
      const gridWidth = gridRef.current?.clientWidth || 0;
      const cardWidth = 340; // Standard card width
      const minGap = 32; // Minimum gap between cards
      
      // Calculate how many cards can fit per row with minimum gap
      const maxCards = Math.floor((gridWidth + minGap) / (cardWidth + minGap));
      const optimalItems = Math.max(1, Math.min(maxCards, 3)); // Between 1-3 cards
      
      setItemsPerRow(optimalItems);
      
      // Calculate grid dimensions for pre-allocation
      const rows = Math.ceil(creators.length / optimalItems);
      const gridHeight = rows * 650; // Based on maxHeight of cards
      
      setGridDimensions({
        width: gridWidth,
        height: gridHeight
      });
    };
    
    // Calculate initial layout
    calculateLayout();
    
    // Create ResizeObserver to recalculate on resize
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === gridRef.current) {
          // Use requestAnimationFrame to limit updates
          requestAnimationFrame(calculateLayout);
        }
      }
    });
    
    resizeObserver.observe(gridRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [creators.length]);
  
  return (
    <div
      ref={gridRef}
      className={cn(
        "desktop-creator-grid",
        isStabilized ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300 ease-in-out",
        "grid gap-12"
      )}
      style={{
        // Use CSS Grid with auto-fill for responsive layout
        display: 'grid',
        // Use minmax with auto-fill to create responsive columns
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        // Gap is now set via Tailwind className="gap-12"
        // More generous padding for better visual spacing
        padding: '24px',
        width: '100%',
        // Pre-allocate height if known
        ...(gridDimensions.height > 0 && {
          minHeight: `${gridDimensions.height}px`,
        }),
        // Hardware acceleration
        transform: 'translateZ(0)',
        // Prevent scrollbar CLS
        overflowX: 'hidden',
        // Force grid to maintain dimensions during load
        gridAutoRows: 'minmax(580px, auto)'
        // Removed: backfaceVisibility, WebkitBackfaceVisibility - not needed for layout
        // Removed: contain: 'layout paint style' - was preventing proper grid layout
      }}
      data-stabilized={isStabilized ? 'true' : 'false'}
    >
      {creators.map((creator) => (
        <div
          key={creator.name}
          className="flex-shrink-0 creator-card-container flex items-center justify-center"
          style={{
            // Center within grid cell
            margin: '0 auto',
            // Fixed height constraints
            minHeight: '580px',
            maxHeight: '650px',
            // Maintain consistent aspect ratio
            aspectRatio: '5/7',
            // Allow card to take up to 380px but not more
            maxWidth: '380px',
            // Hardware acceleration
            transform: 'translateZ(0)',
            // Box model consistency
            boxSizing: 'border-box'
            // Removed: width: '100%' - was forcing full width and overriding grid
            // Removed: height: 'auto' - redundant with min/max heights
            // Removed: contain: 'layout size' - was preventing proper grid control
            // Removed: display, alignItems, justifyContent - moved to className
          }}
          data-creator-name={creator.name}
        >
          <CreatorCard
            creator={creator}
            onImageLoad={onImageLoad}
            loadedImages={loadedImages}
            imageRef={imageRef}
            onPreviewClick={onPreviewClick}
          />
        </div>
      ))}
    </div>
  );
};
