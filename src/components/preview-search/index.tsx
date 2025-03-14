import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewCard } from './PreviewCard';
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { GlowDialog } from '@/components/ui/glow-dialog';

const PreviewSearch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [showGlowDialog, setShowGlowDialog] = useState(false);
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
        isMobile && "relative mobile-section-gradient bg-[#F6F3FF]/80"
      )} 
      ref={containerRef}
    >
      <div className="text-center mb-6 relative z-20">
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
          className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-6"
        >
          Because extraordinary spaces deserve extraordinary storytellers
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-4 mb-4"
        >
          <button
            onClick={() => setShowGlowDialog(true)}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md text-white bg-gradient-to-r from-brand-purple to-brand-purple-medium hover:from-brand-purple-dark hover:to-brand-purple shadow-md"
          >
            Join as a Creator
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-white text-brand-purple-dark rounded">Soon</span>
          </button>
        </motion.div>
      </div>

      <div className="mx-auto relative group max-w-7xl">
        {!isMobile && (
          <div className={cn(
            "absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-800/25 via-indigo-700/30 to-purple-900/25 blur-[2px] sm:blur-sm transition-all duration-500",
            isVisible ? "opacity-70 sm:opacity-80" : "opacity-0",
            "group-hover:opacity-90 group-hover:blur-md"
          )}></div>
        )}

        <PreviewCard isVisible={isVisible}>
          <PreviewContent />
        </PreviewCard>
      </div>
      
      {isMobile && (
        <div className="mobile-section-divider mt-6"></div>
      )}
      
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default PreviewSearch;
