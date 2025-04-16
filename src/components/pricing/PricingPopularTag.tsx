import * as React from "react";
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PricingPopularTagProps {
  colorClass?: string;
  isMobile?: boolean;
  text?: string;
}

export const PricingPopularTag = ({
  colorClass = "from-brand-purple-medium to-brand-purple",
  isMobile = false,
  text = "POPULAR"
}: PricingPopularTagProps) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: isMobile ? '-12px' : '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}
    >
      <div className={cn(
        "px-4 py-1.5 rounded-full text-white shadow-sm flex items-center gap-1.5",
        isMobile ? "text-xs" : "text-sm",
        "font-semibold bg-gradient-to-r",
        colorClass
      )}>
        <Sparkles className={cn(
          "relative z-10",
          isMobile ? "w-3 h-3" : "w-3.5 h-3.5"
        )} />
        <span>{text}</span>
      </div>
    </div>
  );
};
