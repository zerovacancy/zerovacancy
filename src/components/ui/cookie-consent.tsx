
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    
    // Only show banner if no consent has been given
    if (!hasConsented) {
      // Small delay for better UX, don't show immediately on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
  };
  
  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="cookie-consent-container">
      <div className="cookie-consent-content">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Cookie preferences</h3>
              <p className="text-sm text-gray-600 max-w-3xl">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All," you consent to our use of cookies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={acceptEssential}
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Essential Only
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={acceptAll}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white whitespace-nowrap text-xs sm:text-sm"
              >
                Accept All
              </Button>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)} 
              className="cookie-consent-close text-gray-400 hover:text-gray-600 sm:static"
              aria-label="Close cookie consent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
