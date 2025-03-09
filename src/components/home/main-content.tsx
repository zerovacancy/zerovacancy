
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BannerSection } from './banner-section';
import { SectionsContainer } from './sections-container';
import Footer from '@/components/Footer';

interface MainContentProps {
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  showGlowDialog: boolean;
  setShowGlowDialog: (show: boolean) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  showBanner, 
  setShowBanner, 
  showGlowDialog, 
  setShowGlowDialog 
}) => {
  const isMobile = useIsMobile();
  
  const handleTryNowClick = () => {
    setShowGlowDialog(true);
  };
  
  return (
    <main className="flex-1 pb-16 sm:pb-0 w-full">
      {/* Use conditional rendering inside the component */}
      <BannerSection 
        showBanner={showBanner && !isMobile}
        setShowBanner={setShowBanner}
        handleTryNowClick={handleTryNowClick}
      />

      <SectionsContainer
        showGlowDialog={showGlowDialog}
        setShowGlowDialog={setShowGlowDialog}
      />
      
      <Footer />
    </main>
  );
};
