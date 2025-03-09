
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { BottomNav } from '../components/navigation/BottomNav';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { MainContent } from '@/components/home/main-content';

/**
 * Main landing page component with performance optimizations
 */
const Index = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  
  // Initialize local storage and dialog state
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    setShowGlowDialog(!hasVisited);
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      
      <MainContent 
        showBanner={showBanner}
        setShowBanner={setShowBanner}
        showGlowDialog={showGlowDialog}
        setShowGlowDialog={setShowGlowDialog}
      />
      
      <BottomNav />
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </div>
  );
};

export default Index;
