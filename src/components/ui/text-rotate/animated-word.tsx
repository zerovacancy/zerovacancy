
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedCharacter } from "./animated-character";
import { calculateStaggerDelay } from "./text-processing";
import { Transition } from "framer-motion";

interface AnimatedWordProps {
  wordObj: {
    characters: string[];
    needsSpace: boolean;
  };
  wordIndex: number;
  wordArray: {
    characters: string[];
    needsSpace: boolean;
  }[];
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
  staggerFrom: "first" | "last" | "center" | number | "random";
  staggerDuration: number;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export const AnimatedWord: React.FC<AnimatedWordProps> = ({
  wordObj,
  wordIndex,
  wordArray,
  initial,
  animate,
  exit,
  transition,
  staggerFrom,
  staggerDuration,
  splitLevelClassName,
  elementLevelClassName,
}) => {
  return (
    <span
      className={cn("inline-flex overflow-visible", splitLevelClassName)}
    >
      {wordObj.characters.map((char, charIndex) => (
        <AnimatedCharacter
          key={charIndex}
          character={char}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          className={elementLevelClassName}
          delayMs={calculateStaggerDelay(
            wordIndex,
            charIndex,
            wordArray,
            staggerFrom,
            staggerDuration
          )}
        />
      ))}
      {wordObj.needsSpace && (
        <span className="whitespace-pre"> </span>
      )}
    </span>
  );
};
