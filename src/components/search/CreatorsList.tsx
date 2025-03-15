
import React from 'react';
import { CreatorCard } from '../creator/CreatorCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Creator } from '../creator/types';
import { MobileCreatorCarousel } from './MobileCreatorCarousel';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../ErrorFallback';

export const CreatorsList: React.FC = () => {
  const isMobile = useIsMobile();
  
  const creators: Creator[] = [
    {
      name: "Emily Johnson",
      services: ["TikTok", "POV", "#TourWithMe"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "Chicago, IL",
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
      services: ["Photography", "Interior Design", "Staging"],
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
      location: "New York, NY",
      image: "/emily profile.jpeg",
      workExamples: [
        "/creatorcontent/michael-brown/work-1.jpg",
        "/creatorcontent/michael-brown/work-2.jpg",
        "/creatorcontent/michael-brown/work-3.jpg"
      ],
      availabilityStatus: "premium-only"
    }
  ];

  const loadedImages = new Set<string>();
  const handleImageLoad = (imageSrc: string) => {};
  const imageRef = (el: HTMLImageElement | null) => {};

  const { improvedShadowMobile, coloredBorderMobile } = mobileOptimizationClasses;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {!isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6">
          {creators.map((creator) => (
            <div key={creator.name} className="h-full flex min-h-[500px]" style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <CreatorCard 
                creator={creator} 
                onImageLoad={handleImageLoad} 
                loadedImages={loadedImages} 
                imageRef={imageRef} 
              />
              {/* Fallback button in case the card's button is hidden by CSS */}
              <div className="hidden md:hidden">
                <button className="bg-purple-600 text-white p-2 rounded w-full">
                  Get Priority Access (Fallback)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <MobileCreatorCarousel
          creators={creators}
          onImageLoad={handleImageLoad}
          loadedImages={loadedImages}
          imageRef={imageRef}
        />
      )}
    </ErrorBoundary>
  );
};
