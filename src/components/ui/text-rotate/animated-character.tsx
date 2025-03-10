
import React from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

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
