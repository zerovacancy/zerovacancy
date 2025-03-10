
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';
import type { AvailabilityStatus } from '../creator/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const PreviewSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const isMobile = useIsMobile();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
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

  const navigateSlider = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveCardIndex(prev => (prev > 0 ? prev - 1 : creatorData.length - 1));
    } else {
      setActiveCardIndex(prev => (prev < creatorData.length - 1 ? prev + 1 : 0));
    }
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
            creatorData={creatorData}
            locationValue={selectedLocation}
            onLocationSelect={handleLocationSelect}
            activeCardIndex={activeCardIndex}
          />
          
          {isMobile && (
            <div className="flex justify-between items-center w-full px-4 py-3">
              <Button 
                onClick={() => navigateSlider('prev')}
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-white shadow-sm border-indigo-100"
              >
                <ChevronLeft className="h-5 w-5 text-indigo-600" />
              </Button>
              
              <div className="flex space-x-1">
                {creatorData.map((_, index) => (
                  <span 
                    key={index}
                    className={cn(
                      "block w-2 h-2 rounded-full transition-all duration-300",
                      index === activeCardIndex 
                        ? "bg-indigo-500 scale-125" 
                        : "bg-indigo-200"
                    )}
                  />
                ))}
              </div>
              
              <Button 
                onClick={() => navigateSlider('next')}
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-white shadow-sm border-indigo-100"
              >
                <ChevronRight className="h-5 w-5 text-indigo-600" />
              </Button>
            </div>
          )}
        </PreviewCard>
      </div>
    </div>
  );
};

export default PreviewSearch;
