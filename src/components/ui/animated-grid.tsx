
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGridProps {
  className?: string;
}

export const AnimatedGrid = memo(({
  className,
}: AnimatedGridProps) => {
  return (
    <div className={cn(
      "relative will-change-transform promote-layer", 
      className
    )}>
      <div
        style={{
          "--gradient": `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
            radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
            radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
            radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              #dd7bbb 0%,
              #d79f1e calc(25% / 5),
              #5a922c calc(50% / 5), 
              #4c7894 calc(75% / 5),
              #dd7bbb calc(100% / 5)
            )`,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        } as React.CSSProperties}
        className={cn(
          "pointer-events-auto absolute inset-0 rounded-[inherit] promote-layer opacity-0"
        )}
      >
        <div
          className={cn(
            "glow",
            "rounded-[inherit]",
            "promote-layer opacity-0"
          )}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  );
});

AnimatedGrid.displayName = "AnimatedGrid";
