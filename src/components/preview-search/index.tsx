
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';
import { useIsMobile } from '@/hooks/use-mobile';

const PreviewSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  
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
      availabilityStatus: "available-now" as const
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
      availabilityStatus: "available-tomorrow" as const
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
      availabilityStatus: "premium-only" as const
    }
  ];

  return (
    <div 
      className={cn(
        "w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 content-visibility-auto py-6 sm:py-6 md:py-8",
        isMobile && "bg-indigo-50/30 relative mobile-section-gradient" // Enhanced background with gradient edges
      )} 
      ref={containerRef}
    >
      <div className="mx-auto relative group max-w-7xl">
        {/* Enhanced gradient background with more vibrant effects on mobile */}
        <div className={cn(
          "absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-800/25 via-indigo-700/30 to-purple-900/25 blur-[2px] sm:blur-sm transition-all duration-500",
          isVisible ? "opacity-70 sm:opacity-80" : "opacity-0",
          "group-hover:opacity-90 group-hover:blur-md",
          isMobile && "opacity-90" // More visible gradient on mobile
        )}></div>

        <PreviewCard isVisible={isVisible}>
          <PreviewHeader 
            title="Find Your Perfect Creator"
            subtitle="Connect with professionals who showcase your property perfectly"
          />
          <PreviewContent 
            isVisible={isVisible}
            loadedImages={loadedImages}
            handleImageLoad={handleImageLoad}
            creatorData={creatorData}
          />
        </PreviewCard>
      </div>
      
      {/* Mobile section divider */}
      {isMobile && (
        <div className="mobile-section-divider mt-6"></div>
      )}
    </div>
  );
};

export default PreviewSearch;
