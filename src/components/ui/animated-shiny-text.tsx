
import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  const isMobile = useIsMobile();
  
  // Don't animate on mobile to improve performance
  if (isMobile) {
    return (
      <p
        className={cn(
          "text-neutral-600/70 dark:text-neutral-400/70",
          "text-left",
          className
        )}
      >
        Early access now available - Reserve your spot on the waitlist
      </p>
    );
  }
  
  return (
    <p
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "text-neutral-600/70 dark:text-neutral-400/70",
        "mx-auto",
        // Shine effect
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        // Shine gradient with fixed values instead of percentages
        "bg-gradient-to-r from-transparent via-black/80 to-transparent dark:via-white/80",
        className,
      )}
    >
      Early access now available - Reserve your spot on the waitlist
    </p>
  );
};

export { AnimatedShinyText };
