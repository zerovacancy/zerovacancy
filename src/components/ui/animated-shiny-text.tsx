
import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <p
      style={{
        "--shiny-width": `${shimmerWidth}px`,
      } as CSSProperties}
      className={cn(
        "text-neutral-600/70 dark:text-neutral-400/70",
        "text-left",
        // For desktop only:
        "desktop-only-animation desktop-only-bg-clip-text desktop-only-bg-no-repeat desktop-only-bg-pos-0 desktop-only-bg-size-shiny",
        "desktop-only-bg-gradient-to-r desktop-only-from-transparent desktop-only-via-black/80 desktop-only-via-50% desktop-only-to-transparent dark:desktop-only-via-white/80",
        className,
      )}
    >
      {children}
    </p>
  );
};

export { AnimatedShinyText };
