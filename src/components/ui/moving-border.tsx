
"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  rx = "30%",
  ry = "30%",
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
  [key: string]: any;
}) => {
  // Normalize rx and ry
  const normalizedRx = typeof rx === 'string' ? rx : `${rx}px`;
  const normalizedRy = typeof ry === 'string' ? ry : `${ry}px`;

  // Create the path string (no animation)
  const pathString = `M ${normalizedRx},0 H calc(100% - ${normalizedRx}) C 100%,0 100%,0 100%,${normalizedRy} V calc(100% - ${normalizedRy}) C 100%,100% 100%,100% calc(100% - ${normalizedRx}),100% H ${normalizedRx} C 0,100% 0,100% 0,calc(100% - ${normalizedRy}) V ${normalizedRy} C 0,0 0,0 ${normalizedRx},0`;

  return (
    <div className={cn("absolute inset-0", className)} style={{ overflow: "hidden" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <path
          d={pathString}
          fill="none"
          stroke="transparent"
          strokeWidth="1"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          display: "inline-block",
          transform: "translate(-50%, -50%)"
        }}
      >
        {children}
      </div>
    </div>
  );
};
