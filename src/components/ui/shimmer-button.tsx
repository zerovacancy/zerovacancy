
"use client";

import React, { ButtonHTMLAttributes, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  background?: string;
  className?: string;
  shimmerClassName?: string;
  mainColor?: string;
  disableOnMobile?: boolean;
}

export function ShimmerButton({
  children,
  background,
  className,
  shimmerClassName,
  mainColor,
  disableOnMobile = false,
  ...props
}: ShimmerButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Use simplified button on mobile if disableOnMobile is true
  if (isMobile && disableOnMobile) {
    // Extract onClick from props to handle it separately
    const { onClick, ...restProps } = props;
    
    const handleMobileButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Mobile ShimmerButton clicked");
      // Call the original onClick if it exists
      if (onClick) {
        onClick(e);
      }
    };
    
    return (
      <button
        className={cn(
          "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
          "text-white font-medium rounded-lg text-center relative overflow-hidden",
          "shadow-md active:shadow-inner transition-all duration-200",
          "active:scale-[0.98] cursor-pointer",
          className
        )}
        type="button"
        onClick={handleMobileButtonClick}
        {...restProps}
      >
        <div className="relative z-20 flex items-center justify-center">
          {children}
        </div>
      </button>
    );
  }

  // Extract onClick from props to handle it separately
  const { onClick, ...restProps } = props;
  
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("ShimmerButton clicked");
    // Call the original onClick if it exists
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 py-2 px-4 items-center justify-center rounded-md text-sm font-medium",
        "text-white",
        "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
        "overflow-hidden",
        "shadow-md hover:shadow-lg transition-shadow duration-200",
        "relative cursor-pointer",
        className
      )}
      type="button"
      onClick={handleButtonClick}
      {...restProps}
    >
      <span className="z-50 flex items-center justify-center opacity-100 relative pointer-events-auto">
        {children}
      </span>
      <div
        style={{
          background: background ?? "transparent",
        }}
        className="absolute inset-[1px] rounded-md z-[1] pointer-events-none"
      />
    </button>
  );
}
