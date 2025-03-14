
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OptimizedAnimatedGridProps {
  className?: string;
  colors?: string[];
  delay?: number;
}

export const OptimizedAnimatedGrid: React.FC<OptimizedAnimatedGridProps> = ({
  className,
  colors = ["#dd7bbb", "#d79f1e", "#5a922c", "#4c7894"],
  delay = 30000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after the specified delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-grid-pattern animate-grid-rotate",
          "opacity-0 transition-opacity duration-1000",
          isVisible && "opacity-100"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle, ${colors[0]} 10%, ${colors[0]}00 20%),
            radial-gradient(circle at 40% 40%, ${colors[1]} 5%, ${colors[1]}00 15%),
            radial-gradient(circle at 60% 60%, ${colors[2]} 10%, ${colors[2]}00 20%), 
            radial-gradient(circle at 40% 60%, ${colors[3]} 10%, ${colors[3]}00 20%),
            conic-gradient(
              from 0deg at 50% 50%,
              ${colors[0]} 0%,
              ${colors[1]} 25%,
              ${colors[2]} 50%, 
              ${colors[3]} 75%,
              ${colors[0]} 100%
            )
          `,
        }}
      />
    </div>
  );
};

// Add to index.css:
// @keyframes grid-rotate {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
// 
// .animate-grid-rotate {
//   animation: grid-rotate 15s linear infinite;
// }
// 
// .bg-grid-pattern {
//   background-size: 200% 200%;
//   background-position: center;
// }
