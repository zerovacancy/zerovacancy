
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const scrollTop = window.scrollY;
    const scrollDistance = documentHeight - windowHeight;
    
    if (scrollDistance > 0) {
      const percentage = Math.min(100, Math.round((scrollTop / scrollDistance) * 100));
      setScrollPercentage(percentage);
    } else {
      setScrollPercentage(0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
        style={{ width: `${scrollPercentage}%` }}
        role="progressbar"
        aria-valuenow={scrollPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};
