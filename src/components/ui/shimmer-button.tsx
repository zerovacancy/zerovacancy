
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
    return (
      <button
        className={cn(
          "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
          "text-white font-medium rounded-lg text-center relative overflow-hidden",
          "shadow-md active:shadow-inner transition-all duration-200",
          "active:scale-[0.98]",
          className
        )}
        {...props}
      >
        <div className="relative z-20 flex items-center justify-center">
          {children}
        </div>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex h-10 py-2 px-4 items-center justify-center rounded-md text-sm font-medium",
        "text-white",
        "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
        "overflow-hidden",
        "shadow-md hover:shadow-lg transition-shadow duration-200",
        "relative touch-none",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center w-full h-full transition-all",
          shimmerClassName
        )}
      >
        <div
          style={{
            backgroundImage: `conic-gradient(from 0deg at 50% 50%, ${
              mainColor ?? "#3b82f6"
            } 0%, transparent 60%, transparent 80%, transparent 100%)`,
          }}
          className={cn(
            "w-[300%] aspect-square absolute z-[2] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100",
            "group-hover:animate-[spin_4s_linear_infinite]"
          )}
        />
      </div>
      <span className="z-10 flex items-center justify-center opacity-100">
        {children}
      </span>
      <div
        style={{
          background: background ?? "transparent",
        }}
        className="absolute inset-[1px] rounded-md z-[1]"
      />
    </button>
  );
}
