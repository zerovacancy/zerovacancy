
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

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
      services: ["TikTok", "POV Tour", "Content"],
      price: 150,
      rating: 4.9,
      reviews: 127,
      location: "Chicago, IL",
      image: "/newemilyprofile.jpg",
      workExamples: ["/creatorcontent/emily-johnson/work-1.webp", "/creatorcontent/emily-johnson/work-2.jpg", "/creatorcontent/emily-johnson/work-3.jpg"],
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
      workExamples: ["/creatorcontent/jane-cooper/work-1.jpg", "/creatorcontent/jane-cooper/work-2.jpg", "/creatorcontent/jane-cooper/work-3.jpg"],
      availabilityStatus: "available-tomorrow" as const
    }, 
    {
      name: "Michael Brown",
      services: ["3D Tours", "Floor Plans"],
      price: 175,
      rating: 4.7,
      reviews: 82,
      location: "Chicago, IL",
      image: "/michaelprofile.mov",
      workExamples: ["/creatorcontent/michael-brown/work-1.jpg", "/creatorcontent/michael-brown/work-2.jpg", "/creatorcontent/michael-brown/work-3.jpg"],
      availabilityStatus: "premium-only" as const
    }
  ];

  return (
    <div 
      className={cn(
        "w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 content-visibility-auto",
        isMobile ? "py-6 pb-4" : "py-6 sm:py-6 md:py-8", /* Reduced bottom padding on mobile */
        isMobile ? "relative mt-3 rounded-2xl border border-gray-200 bg-gray-50" : "bg-[#f9f9f9]"
      )} 
      ref={containerRef}
    >
      {/* Enhanced section header with improved design */}
      <div className={cn(
        "text-center relative z-20",
        "pb-4 mb-4",
        isMobile && "border-b border-gray-200"
      )}>
        {/* Section label for better organization */}
        {isMobile && (
          <div className="mb-3 flex items-center justify-center">
            <div className="h-px w-5 bg-gray-200 mr-2"></div>
            <span className="text-xs uppercase tracking-wider text-gray-700 font-semibold">Creator Network</span>
            <div className="h-px w-5 bg-gray-200 ml-2"></div>
          </div>
        )}
        
        <div className={cn(
          "flex",
          isMobile ? "flex-col" : "items-center justify-between"
        )}>
          <div className={cn(
            "flex-1",
            isMobile && "mb-3"
          )}>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2"
            >
              FIND YOUR CREATIVE COLLABORATOR
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm sm:text-base text-gray-600 max-w-md mx-auto"
            >
              Because extraordinary spaces deserve extraordinary storytellers
            </motion.p>
          </div>
        </div>

        {/* Visual separator for mobile */}
        {isMobile && (
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-4"></div>
        )}
      </div>

      <div className="mx-auto relative group max-w-7xl">
        <PreviewCard isVisible={isVisible}>
          <PreviewContent />
        </PreviewCard>
      </div>
      
      {isMobile && (
        <div className="h-px w-1/3 bg-gray-200 mx-auto mt-6 mb-1"></div>
      )}
    </div>
  );
};

export default PreviewSearch;
