import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileTestStyles: React.FC = () => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [pulseEffect, setPulseEffect] = useState(false);
  
  // Add pulsing effect to make it more noticeable
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Don't render if hidden or not mobile
  if (!visible || !isMobile) return null;
  
  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 z-[9999] p-space-md mobile-card-gradient ${pulseEffect ? 'shadow-lg border-2 border-purple-500' : 'shadow-md border border-purple-300'}`}
      style={{
        transition: 'all 0.5s ease',
        background: 'linear-gradient(to bottom right, #ffffff, #f5f3ff, #ede9fe)',
        boxShadow: pulseEffect ? '0 10px 25px rgba(139, 92, 246, 0.25)' : '0 5px 15px rgba(139, 92, 246, 0.1)'
      }}
    >
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-t-md"></div>
      
      <h3 className="mobile-text-xl mobile-heading text-center mb-2 text-purple-800">Mobile System Test</h3>
      <p className="mobile-text-base mobile-body">
        This card shows the new mobile spacing system in action.
      </p>
      
      <div className="grid grid-cols-2 gap-2 my-space-sm">
        <div className="p-space-xs bg-purple-50 rounded-md flex flex-col items-center justify-center">
          <div className="text-xs text-purple-700">XS Spacing</div>
          <div className="w-full h-2 bg-purple-200 my-1"></div>
        </div>
        <div className="p-space-sm bg-purple-50 rounded-md flex flex-col items-center justify-center">
          <div className="text-xs text-purple-700">SM Spacing</div>
          <div className="w-full h-2 bg-purple-300 my-1"></div>
        </div>
        <div className="p-space-md bg-purple-50 rounded-md flex flex-col items-center justify-center">
          <div className="text-xs text-purple-700">MD Spacing</div>
          <div className="w-full h-2 bg-purple-400 my-1"></div>
        </div>
        <div className="p-space-lg bg-purple-50 rounded-md flex flex-col items-center justify-center">
          <div className="text-xs text-purple-700">LG Spacing</div>
          <div className="w-full h-2 bg-purple-500 my-1"></div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button className="mobile-button mobile-button-primary">
          Primary Button
        </button>
        <button className="mobile-button mobile-button-secondary">
          Secondary
        </button>
      </div>
      
      <div className="my-space-md">
        <p className="mobile-text-sm mb-1 font-medium">Text Styles:</p>
        <div className="space-y-1">
          <div className="mobile-text-xs">Text XS - Size: var(--font-size-xs)</div>
          <div className="mobile-text-sm">Text SM - Size: var(--font-size-sm)</div>
          <div className="mobile-text-base">Text Base - Size: var(--font-size-base)</div>
          <div className="mobile-text-lg">Text LG - Size: var(--font-size-lg)</div>
          <div className="mobile-text-xl mobile-heading">Text XL - Heading</div>
        </div>
      </div>
      
      <div className="my-space-md">
        <p className="mobile-text-sm mb-1 font-medium">Text Truncation:</p>
        <div className="mobile-truncate-1 bg-white p-2 rounded-md mb-2 border border-purple-100">
          This is a very long text that should be truncated to a single line using our new mobile truncation system
        </div>
        <div className="mobile-truncate-2 bg-white p-2 rounded-md border border-purple-100">
          This is a longer paragraph that should be truncated to exactly two lines using our new mobile truncation system. It demonstrates how text wrapping and truncation work together.
        </div>
      </div>
      
      <div className="text-center mt-4">
        <button 
          className="px-4 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
          onClick={() => setVisible(false)}
        >
          Dismiss Test Card
        </button>
      </div>
    </div>
  );
};

export default MobileTestStyles;