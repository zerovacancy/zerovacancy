
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed z-50 flex items-center justify-center",
        "rounded-full shadow-lg transition-all duration-300",
        "bg-gradient-to-r from-purple-600 to-indigo-600",
        "text-white hover:scale-110 active:scale-95",
        isMobile 
          ? "bottom-20 right-4 h-10 w-10"
          : "bottom-8 right-8 h-12 w-12"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20"></span>
    </button>
  );
};
