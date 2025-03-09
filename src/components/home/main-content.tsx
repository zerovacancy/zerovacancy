
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BannerSection } from './banner-section';
import { SectionsContainer } from './sections-container';
import Footer from '@/components/Footer';
import CallToActionSection from '@/components/CallToActionSection';

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
      {showBanner && !isMobile && (
        <BannerSection 
          showBanner={showBanner} 
          setShowBanner={setShowBanner} 
          handleTryNowClick={handleTryNowClick} 
        />
      )}

      <SectionsContainer
        showGlowDialog={showGlowDialog}
        setShowGlowDialog={setShowGlowDialog}
      />
      
      <Footer />
    </main>
  );
};
