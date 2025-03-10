
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';
import type { AvailabilityStatus } from '../creator/types';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

const PreviewSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showAllCreators, setShowAllCreators] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === containerRef.current) {
            setIsVisible(entry.isIntersecting);
            if (entry.isIntersecting) {
              entry.target.classList.add('content-visible');
            } else {
              entry.target.classList.remove('content-visible');
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '150px' }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleImageLoad = (imagePath: string) => {
    setLoadedImages(prev => new Set([...prev, imagePath]));
  };

  const handleLocationSelect = (location: string) => {
    console.log('Location selected in PreviewSearch:', location);
    setSelectedLocation(location);
  };

  const toggleShowAllCreators = () => {
    setShowAllCreators(prev => !prev);
  };

  const creatorData = [
    {
      name: "Emily Johnson",
      services: ["Photography", "Virtual Staging"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      image: "/newemilyprofile.jpg",
      workExamples: ["/1-d2e3f802.jpg"],
      availabilityStatus: 'available-now' as AvailabilityStatus
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
      availabilityStatus: 'available-tomorrow' as AvailabilityStatus
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
      availabilityStatus: 'premium-only' as AvailabilityStatus
    }
  ];

  // Only show the first creator initially, unless showAllCreators is true
  const visibleCreators = showAllCreators ? creatorData : creatorData.slice(0, 1);

  return (
    <div 
      className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 content-visibility-auto py-3 sm:py-6 md:py-8" 
      ref={containerRef}
    >
      <div className="mx-auto relative group max-w-7xl">
        <PreviewCard isVisible={isVisible}>
          <PreviewHeader 
            title="FIND YOUR CREATIVE COLLABORATOR"
            subtitle="Because extraordinary spaces deserve extraordinary storytellers"
          />
          <PreviewContent 
            isVisible={isVisible}
            loadedImages={loadedImages}
            handleImageLoad={handleImageLoad}
            creatorData={visibleCreators}
            locationValue={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
          
          {!showAllCreators && (
            <div className="w-full flex justify-center py-4 sm:py-6">
              <Button 
                onClick={toggleShowAllCreators}
                variant="outline"
                className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6"
              >
                Show 2 more creators
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </PreviewCard>
      </div>
    </div>
  );
};

export default PreviewSearch;
