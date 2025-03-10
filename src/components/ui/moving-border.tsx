
"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
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
  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue<number>(0);

  // Ensure rx and ry have default values and are properly formatted
  const normalizedRx = typeof rx === 'string' ? rx : `${rx}px`;
  const normalizedRy = typeof ry === 'string' ? ry : `${ry}px`;

  // Create the path string
  const pathString = `M ${normalizedRx},0 H calc(100% - ${normalizedRx}) C 100%,0 100%,0 100%,${normalizedRy} V calc(100% - ${normalizedRy}) C 100%,100% 100%,100% calc(100% - ${normalizedRx}),100% H ${normalizedRx} C 0,100% 0,100% 0,calc(100% - ${normalizedRy}) V ${normalizedRy} C 0,0 0,0 ${normalizedRx},0`;

  useEffect(() => {
    // Ensure the path is properly set
    if (pathRef.current) {
      pathRef.current.setAttribute('d', pathString);
    }
  }, [pathString]);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        return pathRef.current.getPointAtLength(val || 0)?.x ?? 0;
      } catch {
        return 0;
      }
    }
  );

  const y = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        return pathRef.current.getPointAtLength(val || 0)?.y ?? 0;
      } catch {
        return 0;
      }
    }
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

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
          ref={pathRef}
          d={pathString}
          fill="none"
          stroke="transparent"
          strokeWidth="1"
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
