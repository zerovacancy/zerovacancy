
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
      services: ["TikTok", "POV", "#TourWithMe"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      image: "/newemilyprofile.jpg",
      workExamples: [
        "/creatorcontent/emily-johnson/work-1.webp",
        "/creatorcontent/emily-johnson/work-2.jpg",
        "/creatorcontent/emily-johnson/work-3.jpg"
      ],
      availabilityStatus: "available-now"
    }, 
    {
      name: "Jane Cooper",
      services: ["Professional Photography", "Interior Design", "Staging"],
      price: 200,
      rating: 4.8,
      reviews: 98,
      location: "Los Angeles, CA",
      image: "/janeprofile.png",
      workExamples: [
        "/creatorcontent/jane-cooper/work-1.jpg",
        "/creatorcontent/jane-cooper/work-2.jpg",
        "/creatorcontent/jane-cooper/work-3.jpg"
      ],
      availabilityStatus: "available-tomorrow"
    }, 
    {
      name: "Michael Brown",
      services: ["Drone Pilot", "Virtual Tours", "Videography"],
      price: 175,
      rating: 4.7,
      reviews: 82,
      location: "Chicago, IL",
      image: "/emily profile.jpeg",
      workExamples: [
        "/creatorcontent/michael-brown/work-1.jpg",
        "/creatorcontent/michael-brown/work-2.jpg",
        "/creatorcontent/michael-brown/work-3.jpg"
      ],
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
