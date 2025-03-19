
import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreatorCard } from '../creator/CreatorCard';
import { MobileCreatorCarousel } from '../search/MobileCreatorCarousel';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from "../ui/dialog";
import { X } from 'lucide-react';
import { CreatorCardSkeleton } from './CreatorCardSkeleton';

export const PreviewContent = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isMobile = useIsMobile();
  
  // Simulate loading time for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (imagePath: string) => {
    setLoadedImages(prev => new Set([...prev, imagePath]));
  };

  // Updated creator data to ensure each creator has exactly 3 tags for consistency
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
      services: ["Interior", "Design", "Staging"],
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
      services: ["3D Tours", "Floor Plans", "Interactive"],
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
    <div className={cn(
      "relative w-full",
      isMobile && "pb-6"
    )}>
      {isMobile ? (
        isLoading ? (
          <div className="flex space-x-2 overflow-x-auto py-2 px-1 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div key={item} className="min-w-[90%] flex-shrink-0 px-1">
                <CreatorCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-2 rounded-xl shadow-[0_8px_12px_-3px_rgba(138,79,255,0.1),_0_4px_6px_-4px_rgba(138,79,255,0.15)]">
            <MobileCreatorCarousel 
              creators={creatorData}
              onImageLoad={handleImageLoad}
              loadedImages={loadedImages}
              imageRef={(node) => { imageRef.current = node; }}
              onPreviewClick={setSelectedImage}
            />
          </div>
        )
      ) : (
        <div className="bg-white p-4 rounded-xl border border-purple-100/30 shadow-[0_10px_15px_-3px_rgba(138,79,255,0.1),_0_4px_6px_-4px_rgba(138,79,255,0.15),_inset_0_1px_3px_rgba(255,255,255,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            {isLoading ? (
              <>
                {[1, 2, 3].map((item) => (
                  <CreatorCardSkeleton key={item} />
                ))}
              </>
            ) : (
              creatorData.map((creator, index) => (
                <CreatorCard 
                  key={index}
                  creator={creator}
                  onImageLoad={handleImageLoad}
                  loadedImages={loadedImages}
                  imageRef={(node) => { imageRef.current = node; }}
                  onPreviewClick={setSelectedImage}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Image preview dialog with glass morphism */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-0 bg-transparent border-0 max-w-[90vw] sm:max-w-[80vw]">
            <div className="relative bg-black/30 p-1 rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),_0_4px_6px_-4px_rgba(0,0,0,0.15)]">
              <img
                src={selectedImage}
                alt="Portfolio work"
                className="w-full object-contain max-h-[80vh] rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 bg-black/50 rounded-full p-1.5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
