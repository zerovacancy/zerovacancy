
import React from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Creator } from '../creator/types';
import { MobileCreatorCarousel } from './MobileCreatorCarousel';

export const CreatorsList: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Sample creators data - this would be fetched from API or props in production
  const creators: Creator[] = [
    {
      name: "Emily Johnson",
      services: ["Photography", "Virtual Staging"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      image: "/newemilyprofile.jpg",
      workExamples: ["/1-d2e3f802.jpg"],
      availabilityStatus: "available-now"
    }, 
    {
      name: "Jane Cooper",
      services: ["Video Tours", "Drone Footage"],
      price: 200,
      rating: 4.8,
      reviews: 98,
      location: "Los Angeles, CA",
      image: "/janeprofile.png",
      workExamples: ["/janesub.jpg", "/janesub2.png", "/janesub3.webp"],
      availabilityStatus: "available-tomorrow"
    }, 
    {
      name: "Michael Brown",
      services: ["3D Tours", "Floor Plans"],
      price: 175,
      rating: 4.7,
      reviews: 82,
      location: "Chicago, IL",
      image: "/emily profile.jpeg",
      workExamples: ["/1-d2e3f802.jpg"],
      availabilityStatus: "premium-only"
    }
  ];

  // Create empty sets and refs for the required props
  const loadedImages = new Set<string>();
  const handleImageLoad = (imageSrc: string) => {};
  const imageRef = (el: HTMLImageElement | null) => {};

  return (
    <div className="relative">
      {/* Desktop creator grid */}
      {!isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard 
              key={creator.name} 
              creator={creator} 
              onImageLoad={handleImageLoad} 
              loadedImages={loadedImages} 
              imageRef={imageRef} 
            />
          ))}
        </div>
      )}

      {/* Mobile creator carousel */}
      {isMobile && (
        <MobileCreatorCarousel
          creators={creators}
          onImageLoad={handleImageLoad}
          loadedImages={loadedImages}
          imageRef={imageRef}
        />
      )}
    </div>
  );
};
