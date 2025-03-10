
import React from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedCharacterProps {
  character: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
  className?: string;
  delayMs?: number;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  character,
  initial,
  animate,
  exit,
  transition,
  className,
  delayMs = 0
}) => {
  const isMobile = useIsMobile();
  
  // On mobile, use simpler animation to avoid performance issues
  if (isMobile) {
    return (
      <span className={cn("inline-block", className)}>
        {character}
      </span>
    );
  }
  
  return (
    <motion.span
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{
        ...transition,
        delay: delayMs,
      }}
      className={cn("inline-block overflow-visible", className)}
    >
      {character}
    </motion.span>
  );
};
