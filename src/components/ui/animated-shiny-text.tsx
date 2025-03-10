
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
  
  return (
    <p
      style={
        isMobile ? {} as CSSProperties : {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "text-neutral-600/70 dark:text-neutral-400/70",
        isMobile ? "text-left" : "mx-auto",
        // Shine effect - only on desktop
        !isMobile && "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        // Shine gradient - only on desktop
        !isMobile && "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
        className,
      )}
    >
      Get priority access to the creator marketplace!
    </p>
  );
};

export { AnimatedShinyText };
